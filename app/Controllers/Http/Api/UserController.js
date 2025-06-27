"use strict";

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const User = use("App/Models/User");
const Contact = use("App/Models/Contact");
const _ = use("lodash");
const Antl = use("Antl");
const Hash = use("Hash");
const Env = use("Env");
const { fileValidation } = use("App/Helpers/Index.js");
const SMS = use("App/Libraries/Sms/Index.js");
const Request = use("Adonis/Src/Request");
const Encryption = use("Encryption");
const Database = use("Database");
const {
  strSlug,
  rand,
  sendMail,
  baseUrl,
  momentNow,
  randomString,
  getBlurHash,
} = use("App/Helpers/Index.js");
const util = use("util");
const Panic = use("App/Models/Panic");
const moment = require("moment");

class UserController extends RestController {
  constructor() {
    super("User");
    this.resource = "User";
    this.request; //adonis request obj
    this.response; //adonis response obj
    this.params = {}; // this is used for get parameters from url
  }

  async validation(action, id = 0) {
    let validator = [];
    let rules;
    let messages = {};

    switch (action) {
      case "store":
        rules = {
          name: [
            // rule('min', 3),
            rule("max", 30),
            rule("required"),
            rule("regex", /^(?!\s).*/),
          ],
          pseudo_name: "required|min:2|max:50",
          email: "required|email|unique:users,email",
          mobile_no: ["required", rule("regex", /^(\+?\d{1,3}[-])\d{9,11}$/)],
          mobile_no: "unique:users,mobile_no",
          password: [
            "required",
            rule(
              "regex",
              /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,150}$/
            ),
          ],
          device_type: "required|in:ios,android,web",
          device_token: "required",
          latitude: "required",
          longitude: "required",
          address: "min:2|max:200",
        };
        messages = {
          "name.regex": "Name is empty.",
          "password.regex":
            "Password must contain atleast one uppercase letter, special character, digit, lowercase letter, and minimum of 8 characters long.",
          "email.unique": "This email address is already taken!",
          "mobile_no.unique": "This phone number is already taken!",
        };

        validator = await validateAll(this.request.all(), rules, messages);
        break;
      case "update":
        rules = {
          name: [rule("min", 3), rule("max", 30), rule("regex", /^(?!\s).*/)],
          device_type: "in:ios,android,web",
          mobile_no: "unique:users,mobile_no",
        };
        messages = {
          "name.regex": "Name is empty.",
          "mobile_no.unique": "This phone number is already taken!",
        };

        validator = await validateAll(this.request.all(), rules, messages);

        break;
    }
    return validator;
  }

  async beforeIndexLoadModel() {
    this.resource = "PublicUser";
  }

  async afterIndexLoadModel() {}

  async beforeStoreLoadModel() {
    this.__success_store_message = "success_account_created_message";

    if (Env.get("OTP_VERIFICATION") == 1 && Env.get("OPT_SENDBOX") == 0) {
      let params = this.request.all();
      var response = await SMS.instance().sendOTP(params.mobile_no);
      if (response.code != 200) {
        this.__is_error = true;
        return this.sendError(
          Antl.formatMessage("messages.validation_msg"),
          { message: response.message },
          400
        );
      }
    }
  }

  async afterStoreLoadModel(record) {
    //send verification email
    if (Env.get("EMAIL_VERIFICATION") == 1) {
      let email = Encryption.encrypt(record.email);
      email = email.replace("/", "|");
      let mail_params = {
        name: record.name,
        link: baseUrl() + "user/verify-email/" + encodeURIComponent(email),
        app_name: Env.get("APP_NAME"),
      };

      sendMail(
        "emails.register",
        record.email,
        "Welcome to " + Env.get("APP_NAME"),
        mail_params
      ).then();
    }
  }

  async beforeShowLoadModel() {
    let user = this.request.user();
    if (user.slug != this.params.id) {
      this.resource = "PublicUser";
    }
  }

  async afterShowLoadModel(record) {}

  async beforeUpdateLoadModel() {
    //check the user is updating their own profile
    if (this.params.id != this.request.user().slug) {
      this.__is_error = true;
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.invalid_user_id") },
        400
      );
    }
    //image validation
    if (!_.isEmpty(this.request.file("image_url"))) {
      let fileValidate = fileValidation(
        this.request.file("image_url"),
        6000000
      );
      if (fileValidate.error) {
        this.__is_error = true;
        return this.sendError(
          Antl.formatMessage("messages.validation_msg"),
          { message: fileValidate.message },
          400
        );
      }
    }
  }

  async afterUpdateLoadModel(record) {}

  async beforeDestoryLoadModel() {}

  async afterDestoryLoadModel() {}

  async verifyCode({ request, response }) {
    this.request = request;
    this.response = response;

    let rules = {
      code: "required|number|max:5",
    };
    let validator = await validateAll(request.all(), rules);
    let validation_error = this.validateRequestParams(validator);
    if (this.__is_error) return validation_error;

    let params = request.all();
    let user = request.user();
    //check sendbox is disbale
    if (Env.get("OPT_SENDBOX") == 0) {
      var response = await SMS.instance().verifyOTP(user, params.code);
      if (response.code != 200) {
        return this.sendError(
          Antl.formatMessage("messages.validation_msg"),
          { message: response.message },
          400
        );
      }
    }
    let update_param = {
      mobile_otp: null,
      is_mobile_verify: true,
      mobile_verify_at: new Date(),
    };
    await User.updateUser({ slug: user.slug }, update_param);

    user.is_mobile_verify = update_param.is_mobile_verify;
    user.mobile_verify_at = update_param.mobile_verify_at;

    this.__is_paginate = false;
    this.sendResponse(
      200,
      Antl.formatMessage("messages.verified_2fa_code"),
      user
    );
    return;
  }

  async resendCode({ request, response }) {
    this.request = request;
    this.response = response;

    let user = request.user();
    if (user.is_mobile_verify) {
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.verified_2fa_account") },
        400
      );
    }
    if (Env.get("OPT_SENDBOX") == 0) {
      var response = await SMS.instance().sendOTP(user.mobile_no);
      if (response.code != 200) {
        return this.sendError(
          Antl.formatMessage("messages.validation_msg"),
          { message: response.message },
          400
        );
      }
      if (Env.get("SMS_GATEWAY") == "Telesign") {
        let mobile_otp = this.request.mobileOtp() + "|" + new Date();
        await User.updateUser({ slug: user.slug }, { mobile_otp: mobile_otp });
      }
    }
    this.__is_paginate = false;
    this.sendResponse(200, Antl.formatMessage("messages.send_2fa_code"), []);
    return;
  }

  async login({ request, response }) {
    this.request = request;
    this.response = response;

    let rules = {
      email: "required|email",
      password: "required",
      device_type: "required|in:web,ios,android",
      device_token: "required",
    };
    let validator = await validateAll(request.all(), rules);
    let validation_error = this.validateRequestParams(validator);
    if (this.__is_error) return validation_error;

    let params = this.request.all();
    let user = await User.getUserByEmail(params.email);

    // check user.trial_expiration_date null
    // if (user.trial_expiration_date == null) {
    // user.trial_expiration_date = moment(user.created_at).add(Env.get('TRIAL_PERIOD_DAYS'), 'days').format('YYYY-MM-DD HH:mm:ss');
    // await User.updateUser({ id: user.id }, { trial_expiration_date: user.trial_expiration_date });
    // }

    if (_.isEmpty(user))
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.invalid_user") },
        400
      );
    if (!(await Hash.verify(params.password, user.password)))
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.invalid_user") },
        400
      );
    if (user.status == "0")
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.account_disabled") },
        400
      );
    if (user.is_email_verify == "0" && Env.get("EMAIL_VERIFICATION") == 1)
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.unverified_email") },
        400
      );

    // delete tokens
    await User.deleteApiToken(user.id);
    let api_token = await User.updateApiToken(request, user.id);
    //merge api token in adonis request
    Request.macro("apiToken", function () {
      return api_token;
    });

    this.__is_paginate = false;
    await this.sendResponse(
      200,
      Antl.formatMessage("messages.login_success"),
      user
    );
    return;
  }

  async socialLogin({ request, response }) {
    this.request = request;
    this.response = response;

    let rules = {
      // "name": 'min:2|max:50',
      // "email": 'email|max:50',
      platform_id: "required|max:255",
      platform_type: "required|in:facebook,google,apple",
      device_type: "required|in:web,android,ios",
      device_token: "required",
      // "image_url": "url"
    };

    let validator = await validateAll(request.all(), rules);
    let validation_error = this.validateRequestParams(validator);
    if (this.__is_error) return validation_error;
    let user
    try {
      user = await User.socialLogin(request);
    } catch (error) {
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: error.message },
        400
      );
    }

    // if(user.trial_expiration_date == null) {
    user.trial_expiration_date = moment(user.created_at)
      .add(Env.get("TRIAL_PERIOD_DAYS"), "days")
      .format("YYYY-MM-DD HH:mm:ss");
    await User.updateUser(
      { id: user.id },
      { trial_expiration_date: user.trial_expiration_date }
    );
    // }

    this.__is_paginate = false;
    await this.sendResponse(
      200,
      Antl.formatMessage("messages.login_success"),
      user
    );
    return;
  }

  async forgotPassword({ request, response }) {
    this.request = request;
    this.response = response;

    let rules = {
      email: "required|email",
    };
    let validator = await validateAll(request.all(), rules);
    let validation_error = this.validateRequestParams(validator);
    if (this.__is_error) return validation_error;

    let params = request.all();
    //get user by email
    let user = await User.getUserByEmail(params.email);
    if (_.isEmpty(user))
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.email_not_exist") },
        400
      );

    User.forgotPassword(user).then(() => {});

    this.__is_paginate = false;
    this.sendResponse(200, Antl.formatMessage("messages.forgot_pass_msg"), []);
    return;
  }

  async changePassword({ request, response }) {
    this.request = request;
    this.response = response;
    //validation rules
    let rules = {
      current_password: "required",
      new_password: [
        "required",
        rule(
          "regex",
          /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,150}$/
        ),
      ],
      confirm_password: "required|same:new_password",
    };
    let messages = {
      "name.regex": "Name is empty.",
      "new_password.regex":
        "Password must contain atleast one uppercase letter, special character, digit, lowercase letter, and minimum of 8 characters long.",
    };

    let validator = await validateAll(request.all(), rules, messages);
    let validation_error = this.validateRequestParams(validator);
    if (this.__is_error) return validation_error;

    let user = this.request.user();
    let params = this.request.all();
    //check old password
    let checkCurrentPass = await Hash.verify(
      params.current_password,
      user.password
    );
    if (!checkCurrentPass)
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.invalid_current_password") },
        400
      );
    //check current and old password
    if (params.current_password == params.new_password)
      return this.sendError(
        Antl.formatMessage("messages.validation_msg"),
        { message: Antl.formatMessage("messages.password_same_error") },
        400
      );
    //update new password
    let update_params = {
      password: await Hash.make(params.new_password),
    };
    //update user
    await User.updateUser({ email: user.email }, update_params);
    //remove all api token except current api token
    await User.removeApiTokenExceptCurrentToken(
      user.id,
      this.request.authorization()
    );

    this.__is_paginate = false;
    this.sendResponse(
      200,
      Antl.formatMessage("messages.update_password_msg"),
      user
    );
    return;
  }

  async userLogout({ request, response }) {
    this.request = request;
    this.response = response;
    //validation rules
    let rules = {
      device_type: "required|in:ios,android,web",
      device_token: "required",
    };
    let validator = await validateAll(request.all(), rules);
    let validation_error = this.validateRequestParams(validator);
    if (this.__is_error) return validation_error;

    let params = this.request.all();
    await User.removeDeviceToken(this.request.user().id, params);

    // remove joined panic room
    User.updateUser(
      { id: this.request.user().id },
      { joined_panic_room: null }
    );

    // check if is_delete true
    if (params.is_delete == "1") {
      if (request.user().platform_type == "apple") {
        await User.updateUser(
          { slug: this.request.user().slug },
          { deleted_at: new Date() }
        );

        await Database.table("user_api_tokens")
          .where({ user_id: request.user().id })
          .delete();
        // delete from media table
        await Database.table("media")
          .where({ user_id: request.user().id })
          .delete();
        // delete from notifications table
        await Database.table("notifications")
          .where({ actor_id: request.user().id })
          .orWhere({ target_id: request.user().id })
          .delete();
        // delete from panic
        await Database.table("panics")
          .where({ user_id: request.user().id })
          .delete();
        // delete from witness table
        await Database.table("witnesses")
          .where({ user_id: request.user().id })
          .delete();
        // delete from post table
        await Database.table("posts")
          .where({ user_id: request.user().id })
          .delete();
        // delete from likes table
        await Database.table("likes")
          .where({ user_id: request.user().id })
          .delete();
        // delete from comments table
        await Database.table("comments")
          .where({ user_id: request.user().id })
          .delete();
        // delete from report table
        await Database.table("reports")
          .where({ user_id: request.user().id })
          .delete();
        // delete from contact table
        await Database.table("contacts")
          .where({ user_id_2: request.user().id })
          .orWhere({ user_id: request.user().id })
          .delete();
        // delete from review table
        await Database.table("reviews")
          .where({ user_id: request.user().id })
          .delete();
        // delete from subscription table
        await Database.table("subscriptions")
          .where({ user_id: request.user().id })
          .delete();
        // delete from chat message table
        await Database.table("chat_messages")
          .where({ user_id: request.user().id })
          .delete();
        // delete from chat message table
        await Database.table("chat_messages")
          .where({ user_id: request.user().id })
          .delete();
        // delete from chat room user
        await Database.table("chat_room_users")
          .where({ user_id: request.user().id })
          .delete();
        // delete from chat_message_statutus
        await Database.table("chat_message_status")
          .where({ user_id: request.user().id })
          .delete();
        // delete from witness_stream_view_times
        await Database.table("witness_stream_view_times")
          .where({ user_id: request.user().id })
          .delete();
      } else
        await Database.table("users")
          .where({ slug: this.request.user().slug })
          .delete();
      this.__is_paginate = false;
      this.sendResponse(200, Antl.formatMessage("messages.delete_user"), []);
      return;
    }

    this.__is_paginate = false;
    this.sendResponse(200, Antl.formatMessage("messages.logout_msg"), []);
    return;
  }

  async getContactUsers({ request, response }) {
    this.request = request;
    this.response = response;

    let params = request.all();
    let user = request.user();

    let condition = {
      mobile_no: params.mobile_no,
    };

    let users = await User.getUsers(condition, user);

    this.__collection = true;
    this.__is_paginate = false;
    this.resource = "UserShort";

    this.sendResponse(
      200,
      Antl.formatMessage("messages.success_listing_message"),
      users
    );
  }

  async truncateDB() {
    // await Database.table('users').where('user_type', '<>', "admin").delete()
    // await Database.table('witnesses').delete()
    // await Database.table('posts').delete()
    // await Database.table('panics').delete()
    // await Database.table('directories').delete()
    // await Database.table('directory_categories').delete()
    // await Database.table('events').delete()
    // await Database.table('notifications').delete()
    // await Database.table('subscriptions').delete()
    // await Database.table('media').delete()
    // await Database.table('likes').delete()
    // await Database.table('faqs').delete()
    // await Database.table('comments').delete()
    // await Database.table('reviews').delete()
    // await Database.table('chat_rooms').delete()
    // await Database.table('chat_messages').delete()
    // await Database.table('chat_room_users').delete()
    // await Database.table('chat_message_delete').delete()
    // await Database.table('chat_message_status').delete()
    // return "data truncated successfully"
  }
}
module.exports = UserController;
