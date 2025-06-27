const httpServer = use("Server");
const { Server } = use("socket.io");
const SocketMiddleware = use("App/Middleware/SocketAuthenticate");
const BaseController = use("App/Controllers/Http/Controller");
const AgoraController = use("App/Controllers/Http/Api/AgoraController");
const UserModel = use("App/Models/User");
const dayjs = use("dayjs");
const SubscriptionModel = use("App/Models/Subscription");
const ContactModel = use("App/Models/Contact");
const PanicModel = use("App/Models/Panic");
const WitnessModel = use("App/Models/Witness");
const { validateAll, rule } = use("Validator");
const util = use("util");
const Antl = use("Antl");
const sockets = new Map();
const Env = use("Env");
const axios = use("axios");
const { sendPushNotification, formatPhoneNumberToE164 } = use(
  "App/Helpers/Index.js"
);
const { baseUrl } = use("App/Helpers/Index.js");
const User = use("App/Models/User");
const client = require("twilio")(
  Env.get("TWILIO_ACCOUNT_SID"),
  Env.get("TWILIO_AUTH_TOKEN")
);
const _ = use("lodash");
const { strSlug, generateVideoThumb, videoDuration } = use(
  "App/Helpers/Index.js"
);
const moment = use("moment");
const WitnessStreamViewTime = use("App/Models/WitnessStreamViewTime");
const Database = use("Database");

const io = new Server(httpServer.getInstance(), {
  cors: {
    origin: Env.get("APP_URL"),
    // or with an array of origins
    // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Authorization", "token", "user-token"],
  },
});

io.use(async (socket, next) => {
  auth = await SocketMiddleware.handle(
    socket.handshake.query.authorization ||
      socket.handshake.query.Authorization ||
      socket.handshake.auth.Authorization ||
      socket.handshake.auth.authorization
  );

  //invalid auth
  if (_.isEmpty(auth)) {
    next(new Error("unauthorized error"));
  }

  socket.user = auth;

  //join socket
  socket.join(`user_${socket.user.id}`);

  next();
}).on("connection", function (socket) {
  console.log("All Rooms:", io.sockets.adapter.rooms);
  // debug
  socket.use(([event, ...args], next) => {
    console.log("<=======================================>");
    console.log("<--------EVENT-------->", event);
    console.log(
      "<--------...args-------->",
      util.inspect(...args, false, null, true /* enable colors */)
    );
    console.log("All Rooms:", io.sockets.adapter.rooms);
    console.log("<=======================================>");
    next();
  });

  socket.on("_join_room", async (params, callback) => {
    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "UserShort";

    let rules = {
      user_id: "required",
    };

    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_join_room", error);
      callback(error);
      return;
    }

    let response;

    // update user socket_id
    await UserModel.updateUser(
      { id: params.user_id },
      { socket: `user_${params.user_id}` }
    );
    let user = await UserModel.getUser({ id: params.user_id });

    //join socket
    socket.join(`user_${user.id}`);

    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_join_room"),
      user
    );

    socket.emit("_join_room", response);
    return callback(response);
  });

  socket.on("_start_panic", async (params, callback) => {
    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PanicShort";

    let rules = {
      latitude: "required",
      longitude: "required",
      channel_name: "required",
    };
    let error;
    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_start_panic", error);
      callback(error);
      return;
    }

    // get subscription user_id, expiry >= current date
    // get user
    let user = await UserModel.getUser({ id: socket.user.id });
    if (user) {
      let current_date = dayjs().format("YYYY-MM-DD");
      if (Env.get("BYPASS_SUBSCRIPTION") == 0) {
        if (
          current_date > user.subscription_expiry_date ||
          user.subscription_expiry_date == null ||
          user.is_subscribed == "0"
        ) {
          await UserModel.updateUser(
            { id: socket.user.id },
            { is_subscribed: "0", subscription_expiry_date: null }
          );

          // checking is trial expired or not
          let is_trial_expired =
            user.trial_expiration_date != null &&
            moment(current_date).isAfter(user.trial_expiration_date);
          if (is_trial_expired) {
            error = await BaseController.sendSocketError(
              "Validation Message",
              [{ field: "message", message: "You are not subscribed.." }],
              400
            );

            socket.emit("_start_panic", error);
            callback(error);
            return;
          }
        }
      }

      // to all clients in the current namespace except the sender
      socket.broadcast.emit("_panic_ack", {
        code: 200,
        message: "Users have started panic.",
        data: [],
      });
    }

    let response;
    let panic;

    // generate agora token
    let agora_token = await AgoraController.generateToken({
      channel_name: params.channel_name,
      uid: socket.user.id,
    });

    // creating panic record
    let record = {
      user_id: socket.user.id,
      latitude: params.latitude,
      longitude: params.longitude,
      slug: `${Math.floor(Math.random() * 100 + 1) + new Date().getTime()}`,
      agora_token: agora_token,
      channel_name: params.channel_name,
      start_panic_time_ms: moment().valueOf(),
      end_panic_time_ms: moment().valueOf(),
    };

    // insert panic record
    panic = await PanicModel.createPanic(record);

    // update user
    await UserModel.updateUser({ id: socket.user.id }, { is_panic: "1" });
    // join socket room
    socket.join(`panic_${panic.id}`);

    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_panic_start"),
      panic
    );

    socket.emit("_start_panic", response);
    if (_.isFunction(callback)) {
      callback(response);
    }

    let contacts = await ContactModel.getContactWToken({
      user_id_2: socket.user.id,
    });

    let targets = [];
    for (let index = 0; index < contacts.length; index++) {
      if (!_.isEmpty(contacts[index].user)) {
        targets.push(contacts[index].user);
      }
    }
    // get url
    let url = baseUrl(`/deep-link/${panic.slug}`);

    let whereNotIn = [];
    if (!_.isEmpty(targets)) {
      // send push
      let actor = socket.user;
      let target = targets;
      let reference_id = panic.id;
      let reference_module = "panic_started";
      let reference_slug = panic.slug;
      let identifier = "panic_started";
      let title = "Myth";
      let message =
        user.is_pseudo_name == "0"
          ? `${user.name} has triggered the panic button.`
          : `${user.pseudo_name} has triggered the panic button.`;
      let module = "panics";
      let record_panic = panic;
      let data = {
        agora_token: agora_token,
      };
      let in_app = true;

      // send push
      for (let index = 0; index < targets.length; index++) {
        whereNotIn.push(targets[index].id);

        // format mobile no
        let formatted_mobile_no = formatPhoneNumberToE164(
          targets[index].mobile_no
        );
        
          // send push notification
        if (socket.user.id != targets[index].id) {
          let is_push = targets[index].is_notification;
          await sendPushNotification(
            module,
            title,
            message,
            record_panic,
            reference_id,
            reference_module,
            reference_slug,
            identifier,
            actor,
            [targets[index]],
            data,
            in_app,
            is_push,
            "emergency"
          );
        }
      }
    }
    let contacts_2 = await ContactModel.getContactWToken({
      user_id: socket.user.id,
    });

    let targets_2 = [];
    for (let index = 0; index < contacts_2.length; index++) {
      if (!_.isEmpty(contacts_2[index].user_2)) {
        targets_2.push(contacts_2[index].user_2);
      }
    }

    // get url
    let url_2 = baseUrl(`/deep-link/${panic.slug}`);

    let whereNotIn_2 = [];
    if (!_.isEmpty(targets_2)) {
      // send push
      let actor = socket.user;
      let target = targets_2;
      let reference_id = panic.id;
      let reference_module = "panic_started";
      let reference_slug = panic.slug;
      let identifier = "panic_started";
      let title = "Myth";
      let message =
        user.is_pseudo_name == "0"
          ? `${user.name} has triggered the panic button.`
          : `${user.pseudo_name} has triggered the panic button.`;
      let module = "panics";
      let record_panic = panic;
      let data = {
        agora_token: agora_token,
      };
      let in_app = true;

      // send push
      for (let index = 0; index < targets_2.length; index++) {
        
        // format mobile no
        let formatted_mobile_no_2 = formatPhoneNumberToE164(
          targets_2[index].mobile_no
        );

        whereNotIn_2.push(targets_2[index].id);
        // send push
        if (socket.user.id != targets_2[index].id) {
          let is_push = targets_2[index].is_notification;
          await sendPushNotification(
            module,
            title,
            message,
            record_panic,
            reference_id,
            reference_module,
            reference_slug,
            identifier,
            actor,
            [targets_2[index]],
            data,
            in_app,
            is_push,
            "emergency"
          );
        }
      }
    }

    // push current user into array
    whereNotIn.push(user.id);

    // combine whereNotIn and whereNotIn_2
    whereNotIn = _.union(whereNotIn, whereNotIn_2);

    // send push to nearby 5 miles
    // get nearby records
    let nearby_targets = await User.getNearByWToken(user, whereNotIn);
    if (!_.isEmpty(nearby_targets)) {
      // send push
      let actor = socket.user;
      let reference_id = panic.id;
      let reference_module = "panic_started";
      let reference_slug = panic.slug;
      let identifier = "panic_started";
      let title = "Myth";
      let message =
        user.is_pseudo_name == "0"
          ? `${user.name} has triggered the panic button.`
          : `${user.pseudo_name} has triggered the panic button.`;
      let module = "panics";
      let record_panic = panic;
      let data = {
        agora_token: agora_token,
      };
      let in_app = true;

      for (let index = 0; index < nearby_targets.length; index++) {
        let is_push = nearby_targets[index].is_notification;
        await sendPushNotification(
          module,
          title,
          message,
          record_panic,
          reference_id,
          reference_module,
          reference_slug,
          identifier,
          actor,
          [nearby_targets[index]],
          data,
          in_app,
          is_push,
          "panic"
        );
      }
    }

    // configs
    // BaseController.__is_paginate = false;
    // BaseController.__collection = true;
    // BaseController.resource = 'PublicUser'

    // get all users with panic record
    // let users = await User.getUsersWPanic({ is_panic: '1' })

    // // creating response object
    // response = await BaseController.sendSocketResponse(200, Antl.formatMessage('messages._stream_ack'), users)

    // // to all clients in the current namespace except the sender
    // socket.broadcast.emit('_panic_ack', response);
  });

  socket.on("_start_recording", async (params, callback) => {
    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PanicShort";

    let rules = {
      panic_id: "required",
    };
    // should be call after video stream started
    let response;
    let error;
    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_start_panic", error);
      callback(error);
      return;
    }

    // get panic
    let panic = await PanicModel.getPanic({ id: params.panic_id, is_end: "0" });

    // acquire
    const appID = Env.get("APP_ID");
    const Authorization = `Basic ${Buffer.from(
      `${Env.get("CUSTOMER_ID_AGORA")}:${Env.get("CUSTOMER_SECRET")}`
    ).toString("base64")}`;
    const acquire = await axios.post(
      `${Env.get("AGORA_BASE_URL")}/${appID}/cloud_recording/acquire`,
      {
        cname: panic.channel_name,
        uid: `${Math.floor(1000 + Math.random() * 9000)}`,
        // uid: panic.user_id.toString(),
        clientRequest: {},
      },
      { headers: { Authorization } }
    );

    // start
    const resource = acquire.data.resourceId;

    const mode = "individual";

    const start = await axios.post(
      `${Env.get(
        "AGORA_BASE_URL"
      )}/${appID}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
      {
        cname: panic.channel_name,
        uid: acquire.data.uid,
        clientRequest: {
          token: "",
          recordingConfig: {
            channelType: 1, // live broadcast
            streamTypes: 2, // both audio and video
            videoStreamType: 0, // 0: high quality stream, 1: low quality stream
            streamMode: "standard", //remove before running or it won't work. Standard mode creates a MPD with WebM, removing steamMode creates M3U8 with TS
            maxIdleTime: 120,
            subscribeVideoUids: [
              // `${socket.user.id}`
              //socket.user.id
              panic.user_id.toString(),
            ],
            subscribeAudioUids: [
              // `${socket.user.id}`
              //socket.user.id
              panic.user_id.toString(),
            ],
            subscribeUidGroup: 0,
          },
          storageConfig: {
            vendor: Number(Env.get("STORAGE_VENDOR")),
            region: Number(Env.get("STORAGE_REGION")),
            bucket: `${Env.get("S3_BUCKET")}`,
            accessKey: `${Env.get("S3_KEY")}`,
            secretKey: `${Env.get("S3_SECRET")}`,
          },
        },
      },
      { headers: { Authorization } }
    );

    // creating response object
    if (start.status == "200") {
      // update sid in panic
      await PanicModel.updatePanic(
        { id: panic.id },
        {
          sid: start.data.sid,
          resource_id: start.data.resourceId,
          uid: start.data.uid,
        }
      );

      response = await BaseController.sendSocketResponse(
        200,
        Antl.formatMessage("messages.success_start_recording"),
        panic
      );

      socket.emit("_start_recording", response);
      if (_.isFunction(callback)) {
        callback(response);
      }
    } else {
      error = await BaseController.sendSocketError(
        "Validation Message",
        [
          {
            field: "error",
            message: Antl.formatMessage("messages.success_start_recording"),
          },
        ],
        400
      );
      socket.emit("_start_recording", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
    }
  });

  socket.on("_witness_join_panic", async (params, callback) => {
    User.updateUser(
      { id: socket.user.id },
      { joined_panic_room: `panic_${params.panic_id}` }
    );
    let panic = await PanicModel.increaseTotalLiveViewers(params.panic_id);

    // send emit total viewers
    BaseController.__is_paginate = false;
    BaseController.__collection = false;
    BaseController.sendSocketResponse(200, "Total live viewers updated", {
      total_live_viewers: panic.total_live_viewers,
    })
      .then((response) => {
        return response;
      })
      .then((response) => {
        socket
          .to(`panic_${params.panic_id}`)
          .emit("_total_live_viewers", response);
      });

    // configs
    BaseController.__collection = true;
    BaseController.resource = "PanicShort";

    let rules = {
      panic_id: "required",
      agora_token: "required",
    };

    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_witness_join_panic", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
      return;
    }

    // witness record
    let record = {
      user_id: socket.user.id,
      panic_id: params.panic_id,
      slug: `witness_${
        Math.floor(Math.random() * 100 + 1) + new Date().getTime()
      }`,
      agora_token: params.agora_token,
    };

    // get witness record
    let witness = await WitnessModel.getWitness({
      user_id: socket.user.id,
      panic_id: params.panic_id,
    });

    // check is witness empty
    if (_.isEmpty(witness)) {
      // insert witness record
      witness = await WitnessModel.createWitness(record);
    }

    // join room
    socket.join(`panic_${params.panic_id}`);
    let response;
    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_panic_join"),
      witness.panic
    );

    // generate agora token
    let agora_token = await AgoraController.generateTokenSubscriber({
      channel_name: witness.panic.channel_name,
      uid: Number(socket.user.id),
    });

    response.data.subscriber_token = agora_token;

    socket.emit("_witness_join_panic", response);
    if (_.isFunction(callback)) {
      return callback(response);
    }
  });

  socket.on("_witness_leave_panic", async (params, callback) => {
    let rules = {
      panic_id: "required",
      agora_token: "required",
    };

    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_witness_leave_panic", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
      return;
    }

    User.updateUser({ id: socket.user.id }, { joined_panic_room: null });
    let panic = await PanicModel.decreaseTotalLiveViewers(params.panic_id);

    // send emit total viewers
    BaseController.__is_paginate = false;
    BaseController.__collection = false;
    BaseController.sendSocketResponse(200, "Total live viewers updated", {
      total_live_viewers: panic.total_live_viewers,
    })
      .then((response) => {
        return response;
      })
      .then((response) => {
        socket
          .to(`panic_${params.panic_id}`)
          .emit("_total_live_viewers", response);
      });

    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PanicShort";

    // let witness = await WitnessModel.createWitness(record)
    let witness = await WitnessModel.getWitness({
      user_id: socket.user.id,
      agora_token: params.agora_token,
    });

    // join room
    socket.leave(`panic_${params.panic_id}`);

    let response;

    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_panic_leave"),
      witness.panic
    );

    socket.emit("_witness_leave_panic", response);
    if (_.isFunction(callback)) {
      return callback(response);
    }
  });

  socket.on("_witness_join_stream", async (params, callback) => {
    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PanicShort";

    let rules = {
      panic_id: "required",
    };

    let validators = await validateAll(params, rules);

    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_witness_join_stream", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
      return;
    }

    let witness = await WitnessModel.getWitness({
      user_id: socket.user.id,
      panic_id: params.panic_id,
    });

    if (_.isEmpty(witness)) {
      // send validation message
      error = await BaseController.sendSocketError(
        "Validation Message",
        [
          {
            field: "message",
            message: Antl.formatMessage("messages.witness_not_found"),
          },
        ],
        400
      );

      socket.emit("_witness_join_stream", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
      return;
    }

    let record = {
      user_id: socket.user.id,
      panic_id: params.panic_id,
      witness_id: witness.id,
      slug: `witness_${
        Math.floor(Math.random() * 100 + 1) + new Date().getTime()
      }`,
      watch_start_time_ms: moment().valueOf(),
      watch_end_time_ms: 0,
    };

    let stream_watch = await WitnessStreamViewTime.createWitnessStreamViewTime(
      record
    );

    let witness_stream_view =
      await WitnessStreamViewTime.getWitnessStreamViewTime({
        slug: stream_watch.slug,
      });

    let response;
    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_stream_join"),
      witness_stream_view.panic
    );

    socket.emit("_witness_join_stream", response);
    if (_.isFunction(callback)) {
      return callback(response);
    }
  });

  socket.on("_witness_leave_stream", async (params, callback) => {
    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PanicShort";

    let rules = {
      panic_id: "required",
    };

    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_witness_leave_stream", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
      return;
    }

    let witness = await WitnessModel.getWitness({
      user_id: socket.user.id,
      panic_id: params.panic_id,
    });

    if (_.isEmpty(witness)) {
      // send validation message
      error = await BaseController.sendSocketError(
        "Validation Message",
        [
          {
            field: "message",
            message: Antl.formatMessage("messages.witness_not_found"),
          },
        ],
        400
      );
      socket.emit("_witness_leave_stream", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
      return;
    }

    let witness_stream_view =
      await WitnessStreamViewTime.getWitnessStreamViewTime({
        witness_id: witness.id,
      });

    if (_.isEmpty(witness_stream_view)) {
      // send validation message
      error = await BaseController.sendSocketError(
        "Validation Message",
        [
          {
            field: "message",
            message: Antl.formatMessage("messages.witness_stream_not_found"),
          },
        ],
        400
      );
      socket.emit("_witness_leave_stream", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
      return;
    }
    let record = {
      is_watching: "0",
      watch_end_time_ms: moment().valueOf(),
      watch_duration_ms:
        moment().valueOf() - witness_stream_view.watch_start_time_ms,
      watch_duration_minutes: moment
        .duration(moment().valueOf() - witness_stream_view.watch_start_time_ms)
        .asMinutes(),
    };

    await WitnessStreamViewTime.updateWitnessStreamViewTime(
      { slug: witness_stream_view.slug },
      record
    );

    await WitnessStreamViewTime.sumWitnessStreamViewTime({
      witness_id: witness.id,
    });

    let response;
    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_stream_join"),
      witness_stream_view.panic
    );

    socket.emit("_witness_leave_stream", response);
    if (_.isFunction(callback)) {
      return callback(response);
    }
  });

  socket.on("_assistance", async (params, callback) => {
    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PanicShort";

    let rules = {
      panic_id: "required",
    };

    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_assistance", error);
      callback(error);
      return;
    }

    let response;
    let panic;

    // get panic
    panic = await PanicModel.getPanic({ id: params.panic_id });

    // check is panic end
    if (panic.is_end == "1") {
      error = await BaseController.sendSocketError(
        "Validation Message",
        [{ field: "message", message: "Panic has been already ended" }],
        400
      );

      socket.emit("_assistance", error);
      callback(error);
      return;
    }

    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_assistance_request"),
      panic
    );
    socket.emit("_assistance", response);
    if (_.isFunction(callback)) {
      callback(response);
    }
    // get contact
    let contacts = await ContactModel.getContactWToken({
      user_id: socket.user.id,
    });
    let targets = [];
    for (let index = 0; index < contacts.length; index++) {
      if (!_.isEmpty(contacts[index].user_2)) {
        targets.push(contacts[index].user_2);
      }
    }

    // get url
    let url = baseUrl(`/deep-link?slug=${panic.slug}`);
    let whereNotIn = [];
    // get user
    let user = await UserModel.getUser({ id: socket.user.id });

    if (!_.isEmpty(targets)) {
      // send push
      let actor = socket.user;
      let target = targets;
      let reference_id = panic.id;
      let reference_module = "panic_assistance";
      let reference_slug = panic.slug;
      let identifier = "panic_assistance";
      let title = "Myth";
      let message =
        user.is_pseudo_name == "0"
          ? `${user.name} has triggered the panic button.`
          : `${user.pseudo_name} has triggered the panic button.`;
      let module = "panics";
      let record_panic = panic;
      let data = {
        agora_token: panic.agora_token,
      };
      let in_app = true;

      // send push
      for (let index = 0; index < targets.length; index++) {
        // push into array
        whereNotIn.push(targets[index].id);
        if (socket.user.id != targets[index].id) {
          let is_push = targets[index].is_notification;
          await sendPushNotification(
            module,
            title,
            message,
            record_panic,
            reference_id,
            reference_module,
            reference_slug,
            identifier,
            actor,
            [targets[index]],
            data,
            in_app,
            is_push
          );
        }

        // format mobile no
        let formatted_mobile_no = formatPhoneNumberToE164(
          targets[index].mobile_no
        );
        // send msg
        client.messages
          .create({
            from: Env.get("MOBILE_NO"),
            body: `${user.name} requires immediate assistance.`,
            to: formatted_mobile_no,
          })
          .then((message) => console.log(message.sid))
          .catch((err) => console.log("<--------err-------->", err));
      }
    }

    // push current user into array
    whereNotIn.push(user.id);

    // send push to nearby 5 miles
    // get nearby records
    let nearby_targets = await User.getNearByWToken(user, whereNotIn);
    if (!_.isEmpty(nearby_targets)) {
      // send push
      let actor = socket.user;
      let reference_id = panic.id;
      let reference_module = "panic_assistance";
      let reference_slug = panic.slug;
      let identifier = "panic_assistance";
      let title = "Myth";
      let message =
        user.is_pseudo_name == "0"
          ? `${user.name} has triggered the panic button.`
          : `${user.pseudo_name} has triggered the panic button.`;
      let module = "panics";
      let record_panic = panic;
      let data = {
        agora_token: panic.agora_token,
      };
      let in_app = true;

      for (let index = 0; index < nearby_targets.length; index++) {
        let is_push = nearby_targets[index].is_notification;
        await sendPushNotification(
          module,
          title,
          message,
          record_panic,
          reference_id,
          reference_module,
          reference_slug,
          identifier,
          actor,
          [nearby_targets[index]],
          data,
          in_app,
          is_push
        );
      }
    }
  });

  socket.on("_end_panic", async (params, callback) => {
    // to all clients in the current namespace except the sender
    socket.broadcast.emit("_panic_ack", {
      code: 200,
      message: "Users have ended panic.",
      data: [],
    });

    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PanicShort";

    let rules = {
      panic_id: "required",
    };

    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_end_panic", error);
      callback(error);
      return;
    }

    await WitnessStreamViewTime.updateWitnessStreamViewTime(
      { panic_id: params.panic_id, watch_end_time_ms: 0 },
      { is_watching: "0", watch_end_time_ms: moment().valueOf() }
    );
    // Write raw query to update witness_stream_view_times record
    const affectedRows = await Database.raw(`
        UPDATE witness_stream_view_times 
        SET watch_duration_ms = watch_end_time_ms - watch_start_time_ms,
        watch_duration_minutes = (watch_end_time_ms - watch_start_time_ms) / 60000
        where panic_id = '${params.panic_id}' and watch_duration_ms = '0';
        `);

    // update user
    User.updateUser(
      { joined_panic_room: `panic_${params.panic_id}` },
      { joined_panic_room: null }
    );

    // get panic
    let panic = await PanicModel.getPanic({ id: params.panic_id });

    // calulcate panic duration
    let end_panic_time_ms = moment().valueOf();

    let panic_duration_ms = end_panic_time_ms - panic.start_panic_time_ms;

    // update panic
    await PanicModel.updatePanic(
      { id: params.panic_id },
      { is_end: "1", end_panic_time_ms, panic_duration_ms }
    );

    // update user
    await UserModel.updateUser(
      { id: socket.user.id },
      { socket: null, is_panic: "0" }
    );

    let user = await UserModel.getUser({ id: socket.user.id });

    let response;
    panic.end_panic_time_ms = end_panic_time_ms;
    panic.panic_duration_ms = panic_duration_ms;
    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_panic_end"),
      panic
    );
    socket.emit("_end_panic", response);
    if (_.isFunction(callback)) {
      callback(response);
    }
    // changing message
    response.message = `${user.name} has stopped the panic.`;
    socket.to(`panic_${params.panic_id}`).emit("_end_panic", response);
    // get contact
    let contacts = await ContactModel.getContactWToken({
      user_id: socket.user.id,
    });

    let targets = [];
    let whereNotIn = [];

    for (let index = 0; index < contacts.length; index++) {
      if (!_.isEmpty(contacts[index].user_2)) {
        targets.push(contacts[index].user_2);
      }
    }

    if (!_.isEmpty(targets)) {
      // send push to contacts
      let actor = socket.user;
      let target = targets;
      let reference_id = panic.id;
      let reference_module = "panic_end";
      let reference_slug = panic.slug;
      let identifier = "panic_end";
      let title = "Myth";
      let message =
        user.is_pseudo_name == "0"
          ? `${user.name} has stopped the panic.`
          : `${user.pseudo_name} has stopped the panic.`;
      let module = "panics";
      let record_panic = panic;
      let data = {};
      let in_app = true;

      // send push
      for (let index = 0; index < targets.length; index++) {
        whereNotIn.push(targets[index].id);
        if (socket.user.id != targets[index].id) {
          let is_push = targets[index].is_notification;
          await sendPushNotification(
            module,
            title,
            message,
            record_panic,
            reference_id,
            reference_module,
            reference_slug,
            identifier,
            actor,
            [targets[index]],
            data,
            in_app,
            is_push
          );
        }
        // format mobile no
        let formatted_mobile_no = formatPhoneNumberToE164(
          targets[index].mobile_no
        );

        // send message with checking is_psuedo_name = 0 or 1
        client.messages
          .create({
            from: Env.get("MOBILE_NO"),
            body:
              user.is_pseudo_name == "0"
                ? `${user.name} has stopped the panic.`
                : `${user.pseudo_name} has stopped the panic.`,
            to: formatted_mobile_no,
          })
          .then((message) => console.log(message.sid))
          .catch((err) => console.log("<--------err-------->", err));
      }
    }

    // push current user into array
    whereNotIn.push(user.id);

    // send push to nearby 5 miles
    // get nearby records
    let nearby_targets = await User.getNearByWToken(user, whereNotIn);
    if (!_.isEmpty(nearby_targets)) {
      // send push
      let actor = socket.user;
      let reference_id = panic.id;
      let reference_module = "panic_end";
      let reference_slug = panic.slug;
      let identifier = "panic_end";
      let title = "Myth";
      let message =
        user.is_pseudo_name == "0"
          ? `${user.name} has stopped the panic.`
          : `${user.pseudo_name} has stopped the panic.`;
      let module = "panics";
      let record_panic = panic;
      let data = {};
      let in_app = true;

      for (let index = 0; index < nearby_targets.length; index++) {
        let is_push = nearby_targets[index].is_notification;
        await sendPushNotification(
          module,
          title,
          message,
          record_panic,
          reference_id,
          reference_module,
          reference_slug,
          identifier,
          actor,
          [nearby_targets[index]],
          data,
          in_app,
          is_push
        );
      }
    }

    // remove all sockets from the room
    io.socketsLeave(`panic_${params.panic_id}`);

    // stop
    const appID = Env.get("APP_ID");
    const resource = panic.resource_id;
    const mode = "individual";
    const Authorization = `Basic ${Buffer.from(
      `${Env.get("CUSTOMER_ID_AGORA")}:${Env.get("CUSTOMER_SECRET")}`
    ).toString("base64")}`;

    if (resource) {
      const stop = await axios.post(
        `${Env.get(
          "AGORA_BASE_URL"
        )}/${appID}/cloud_recording/resourceid/${resource}/sid/${
          panic.sid
        }/mode/${mode}/stop`,
        {
          cname: panic.channel_name,
          uid: panic.uid,
          clientRequest: {},
        },
        { headers: { Authorization } }
      );

      if (stop.status == "200") {
        let file_url;
        if (stop.data.serverResponse.fileList.length == 3) {
          // recorded via mobile
          file_url = `https://myth-live.s3.amazonaws.com/${stop.data.serverResponse.fileList[2].fileName}`;
        } else {
          // recorded via computer camera
          file_url = `https://myth-live.s3.amazonaws.com/${stop.data.serverResponse.fileList[0].fileName}`;
        }
        let thumbnail = await generateVideoThumb(
          file_url,
          "uploads/video-screenshot"
        );
        // update file_url in panic
        await PanicModel.updatePanic(
          { id: panic.id },
          { file_url: file_url, thumbnail_url: thumbnail }
        );
      }
    }

    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PublicUser";

    // get all users with panic record
    let users = await User.getUsersWPanic({ is_panic: "1" });

    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages._stream_ack"),
      users
    );

    targets = await User.getUserWToken({ id: socket.user.id });

    let witness_count = await WitnessModel.getWitnessCount({
      panic_id: params.panic_id,
    });

    // send push to panic initiator
    let actor = socket.user;
    let reference_id = panic.id;
    let reference_module = "panic_witness_count";
    let reference_slug = panic.slug;
    let identifier = "panic_witness_count";
    let title = "Myth";
    let message = `${witness_count} people have become witnesses of this panic.`;
    let module = "panics";
    let record_panic = panic;
    let data = {
      agora_token: panic.agora_token,
    };
    let in_app = true;

    let is_push = targets[0].is_notification;

    await sendPushNotification(
      module,
      title,
      message,
      record_panic,
      reference_id,
      reference_module,
      reference_slug,
      identifier,
      actor,
      [targets[0]],
      data,
      in_app,
      is_push
    );
  });

  socket.on("_update_location", async (params, callback) => {
    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "Contact";

    let rules = {
      latitude: "required",
      longitude: "required",
    };

    let validators = await validateAll(params, rules);
    if (validators._errorMessages) {
      error = await BaseController.sendSocketError(
        "Validation Message",
        validators._errorMessages,
        400
      );

      socket.emit("_update_location", error);
      if (_.isFunction(callback)) {
        callback(error);
      }
      return;
    }

    // update user
    await UserModel.updateUser(
      { id: socket.user.id },
      { latitude: params.latitude, longitude: params.longitude }
    );

    // get emergency contacts
    let contacts = await ContactModel.getContacts({
      user_id_2: socket.user.id,
    });

    // send listener to each user who added me as contact
    for (let index = 0; index < contacts.length; index++) {
      // get target users emergency contact list
      let user_id_contacts = await ContactModel.getContacts({
        user_id: contacts[index].user.id,
      });
      response = await BaseController.sendSocketResponse(
        200,
        Antl.formatMessage("messages.success_location_update"),
        user_id_contacts
      );
      socket
        .to(`user_${contacts[index].user.id}`)
        .emit("_my_updated_contacts", response);
    }

    // get user
    let user = await UserModel.getUser({ id: socket.user.id });

    BaseController.resource = "PublicUser";

    // creating response object
    response = await BaseController.sendSocketResponse(
      200,
      Antl.formatMessage("messages.success_location_update"),
      user
    );

    socket.emit("_update_location", response);
    if (_.isFunction(callback)) {
      return callback(response);
    }
  });

  socket.on("disconnect", async () => {
    let response;

    // get user
    let user = await UserModel.getUser({ id: socket.user.id });

    if (_.isEmpty(user)) return;

    // check if user already watching someone's panic stream or not
    if (user.joined_panic_room) {
      User.updateUser({ id: socket.user.id }, { joined_panic_room: null });
      let panic = await PanicModel.decreaseTotalLiveViewers(
        user.joined_panic_room.split("_")[1]
      );
      let witness_stream_view =
        await WitnessStreamViewTime.getWitnessStreamViewTime({
          user_id: socket.user.id,
          watch_end_time_ms: 0,
        });

      if (!_.isEmpty(witness_stream_view)) {
        let record = {
          is_watching: "0",
          watch_end_time_ms: moment().valueOf(),
          watch_duration_ms:
            moment().valueOf() - witness_stream_view.watch_start_time_ms,
          watch_duration_minutes: moment
            .duration(
              moment().valueOf() - witness_stream_view.watch_start_time_ms
            )
            .asMinutes(),
        };

        await WitnessStreamViewTime.updateWitnessStreamViewTime(
          { slug: witness_stream_view.slug },
          record
        );
      }

      // send emit total viewers
      BaseController.__is_paginate = false;
      BaseController.__collection = false;
      BaseController.sendSocketResponse(200, "Total live viewers updated", {
        total_live_viewers: panic.total_live_viewers,
      })
        .then((response) => {
          return response;
        })
        .then((response) => {
          socket
            .to(user.joined_panic_room)
            .emit("_total_live_viewers", response);
        });
    }

    // validate if user exists
    if (user.is_panic == "1") {
      // get panic
      let panic = await PanicModel.getPanic({
        user_id: socket.user.id,
        is_end: "0",
      });

      await WitnessStreamViewTime.updateWitnessStreamViewTime(
        { panic_id: panic.id, watch_end_time_ms: 0 },
        { is_watching: "0", watch_end_time_ms: moment().valueOf() }
      );

      // Write raw query to update witness_stream_view_times record
      await Database.raw(`
        UPDATE witness_stream_view_times 
        SET watch_duration_ms = watch_end_time_ms - watch_start_time_ms,
        watch_duration_minutes = (watch_end_time_ms - watch_start_time_ms) / 60000
        where panic_id = '${panic.id}' and watch_duration_ms = '0';
        `);

      // calulcate panic duration
      let end_panic_time_ms = moment().valueOf();
      let panic_duration_ms = end_panic_time_ms - panic.start_panic_time_ms;

      // stop
      const appID = Env.get("APP_ID");
      const resource = panic.resource_id;
      const mode = "individual";
      const Authorization = `Basic ${Buffer.from(
        `${Env.get("CUSTOMER_ID_AGORA")}:${Env.get("CUSTOMER_SECRET")}`
      ).toString("base64")}`;

      if (!_.isEmpty(resource)) {
        let stop = await axios.post(
          `${Env.get(
            "AGORA_BASE_URL"
          )}/${appID}/cloud_recording/resourceid/${resource}/sid/${
            panic.sid
          }/mode/${mode}/stop`,
          {
            cname: panic.channel_name,
            uid: panic.uid,
            clientRequest: {},
          },
          { headers: { Authorization } }
        );
        if (stop.status == "200") {
          let file_url = `https://myth-live.s3.amazonaws.com/${stop.data.serverResponse.fileList[2].fileName}`;
          // update panic
          await PanicModel.updatePanic(
            { user_id: socket.user.id, is_end: "0" },
            {
              file_url: file_url,
              is_end: "1",
              end_panic_time_ms: end_panic_time_ms,
              panic_duration_ms: panic_duration_ms,
            }
          );
        }
      } else {
        // update panic
        await PanicModel.updatePanic(
          { user_id: socket.user.id, is_end: "0" },
          {
            is_end: "1",
            end_panic_time_ms: end_panic_time_ms,
            panic_duration_ms: panic_duration_ms,
          }
        );
      }

      // configs
      BaseController.__is_paginate = false;
      BaseController.__collection = true;
      BaseController.resource = "PanicShort";

      // creating response object
      response = await BaseController.sendSocketResponse(
        200,
        Antl.formatMessage("messages.success_panic_end"),
        panic
      );

      socket.to(user.socket).emit("_end_panic", response);

      // remove all sockets from the room
      io.socketsLeave(user.socket);
    }

    // update user socket_id
    await UserModel.updateUser(
      { id: socket.user.id },
      { is_panic: "0", socket: null }
    );

    // configs
    BaseController.__is_paginate = false;
    BaseController.__collection = true;
    BaseController.resource = "PublicUser";
  });
});
