'use strict'

const Env     = use('Env');
const Helpers = use('Helpers');
const _       = use('lodash');
const AWS     = use('aws-sdk');
const fs      = use('fs');
// const sharp   = use('sharp');
const Drive   = use('Drive');
const blurhash = use('blurhash');
const pixels   = use('image-pixels');
const ffmpeg   = use('fluent-ffmpeg');

class FileUpload
{
    static async doUpload(fileObject,destination_upload_path,resize=false)
    {
        let supportDrivers = ['local','s3'];
        if( supportDrivers.indexOf(Env.get('FILESYSTEM')) == -1 ){
          throw new Error('File upload driver '+ Env.get('FILESYSTEM') +' is not supported');
          return;
        }
        if( Env.get('FILESYSTEM') == 'local' ){
            return await this.uploadFileInLocal(fileObject,destination_upload_path,resize);
        } else {
            return await this.uploadFileInS3(fileObject,destination_upload_path,resize);
        }
    }

    static async uploadFileInLocal(fileObject,destination_upload_path,resize)
    {
        if( typeof fileObject._files == 'undifined' || _.isEmpty(fileObject._files) ){
          let filename = `${new Date().getTime()}.${fileObject.subtype}`;
          let fileContent = fs.readFileSync(fileObject.tmpPath);
          await Drive.put(destination_upload_path + filename, fileContent,{ACL: 'public-read'})
        //   if( resize ){
        //       await this.resizeImageLocal(
        //         destination_upload_path + filename,
        //         destination_upload_path,
        //         filename
        //       );
        //   }
          return destination_upload_path + filename;
        } else {
            let file_data = [];
            let files = fileObject._files;
            for( var i=0; i < files.length; i++ )
            {
                let filename = files[i].clientName + `${new Date().getTime()}.${files[i].subtype}`;
                let fileContent = fs.readFileSync(files[i].tmpPath);
                await Drive.put(destination_upload_path + filename, fileContent,{ACL: 'public-read'})
                // if( resize ){
                //     await this.resizeImageLocal(
                //       destination_upload_path + filename,
                //       destination_upload_path,
                //       filename
                //     );
                // }
                file_data.push(destination_upload_path + filename);
            }
            return file_data;
        }
    }

    static async uploadFileInS3(fileObject,destination_upload_path,resize)
    {
        //single file upload
        if( _.isEmpty(fileObject._files) ){
            let filename = `${new Date().getTime()}.${fileObject.subtype}`;
            let fileContent = fs.readFileSync(fileObject.tmpPath);
            let image_url = await Drive.put(destination_upload_path + filename, fileContent)
            // if( resize )
            //     await this.resizeImageS3(fileContent,destination_upload_path,filename);

            fs.unlinkSync(fileObject.tmpPath)
            return image_url;
        } else {
            //multiple file upload
            let file_data = [];
            let files = fileObject._files;
            for( var i=0; i < files.length; i++ )
            {
                let filename = `${new Date().getTime()}.${files[i].subtype}`;
                let fileContent = fs.readFileSync(files[i].tmpPath);
                let image_url = await Drive.put(destination_upload_path + filename, fileContent)
                fs.unlinkSync(files[i].tmpPath)
                file_data.push(image_url);
            }
            return file_data;
        }
    }

    static async resizeImageLocal(fileObject,destination_upload_path,filename)
    {
        let fileContent = await Drive.get(fileObject);
        let meta_data = await sharp(fileContent).metadata()
        //create thumbnail
        let thumbnail_content = await sharp(fileContent)
                                      .resize(Math.round(meta_data.width / 2))
                                      .toBuffer();
        //save thumbnail
        await Drive.put(destination_upload_path + 'thumb_' + filename, thumbnail_content,{ACL: 'public-read'})
        return destination_upload_path + 'thumb_' + filename;
    }

    static async resizeImageS3(fileContent,destination_upload_path,filename)
    {
        let meta_data = await sharp(fileContent).metadata()
        let width  = Math.round(meta_data.width / 2);
        let height = Math.round(meta_data.height / 2);
        let file   = await sharp(fileContent)
                                  .resize(width,height)
                                  .toBuffer();
        let image_url = await Drive.put(destination_upload_path + 'thumb_' + filename, file,{ACL: 'public-read'})
        return image_url;
    }

    static async blurHash(image_path)
    {
      let fileContent = await Drive.get(image_path);
      var {data, width, height} = await pixels(fileContent)
      let blurHashString = blurhash.encode(data,width,height,4,4);
      return blurHashString;
    }

    static generateVideoThumb(file_path, destination_path)
    {
      return new Promise( (resolve,reject) => {
          try{
              //create thumbnail tmp dir
              let dir = Helpers.publicPath('uploads/video-thumbnail');
              if (!fs.existsSync(dir)){
                  fs.mkdirSync(dir);
              }
              //set ffmpeg path
              ffmpeg.setFfmpegPath(Env.get('FFMPEG_BINARIES'))
              ffmpeg.setFfprobePath(Env.get('FFPROBE_BINARIES'))
              //thumbnail name
              let thumbnail_name = 'thumbnail-' + randomString(10) + '.jpg';
              ffmpeg(file_path)
              .on('end', async function() {
                  //save file to disk
                  let thumbnail_path = dir + '/' + thumbnail_name;
                  let contents    = fs.readFileSync(thumbnail_path)
                  await Drive.put(`${destination_path}/${thumbnail_name}`, contents)
                  fs.unlinkSync(`${dir}/${thumbnail_name}`);
                  resolve(`${destination_path}/${thumbnail_name}`);
              })
              .screenshots({
                count: 1,
                filename: thumbnail_name,
                folder: Helpers.publicPath('uploads/video-thumbnail')
              });
          } catch ( error ){
              reject(error.message);
          }
      })
    }

    static getDuration(file_path)
    {
        return new Promise( (resolve,reject) => {
            //set ffmpeg path
            ffmpeg.setFfmpegPath(Env.get('FFMPEG_BINARIES'))
            ffmpeg.setFfprobePath(Env.get('FFPROBE_BINARIES'))

            ffmpeg.ffprobe(file_path, function(err, metadata) {
                if( err ){
                  reject( err );
                } else {
                  resolve(metadata.format.duration);
                }
            });
        })
    }
}
module.exports = FileUpload
