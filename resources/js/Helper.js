"use strict";

import Swal from "sweetalert2";

class Helper
{
    static getStorageData(key) {
        let data = window._.isEmpty(localStorage.getItem(key)) ? {} : (localStorage.getItem(key))
        // Decrypt
        if (data.length) {
            var bytes = window.cryptojs.AES.decrypt(data, window.constants.crypto_secret);
            var decryptedData = JSON.parse(bytes.toString(window.cryptojs.enc.Utf8));
            return window._.isEmpty(decryptedData) ? {} : decryptedData;
        }
    }

    static setStorageData(key, value)
    {
        var ciphertext = this.encryptCryptoString(JSON.stringify(value));
        localStorage.setItem(key, ciphertext);
    }

    static encryptCryptoString(data)
    {
        let secret     = window.constants.crypto_secret;
        let ciphertext = window.cryptojs.AES.encrypt(data,secret).toString()
        return ciphertext;
    }

    static removeStorageData()
    {
        localStorage.clear();
    }

    static overlay( is_show = false )
    {
        if (is_show == true) {
            if (document.getElementById("overlay"))
                document.getElementById("overlay").style.display = "block";
        } else {
            if (document.getElementById("overlay"))
                document.getElementById("overlay").style.display = "none";
        }
    }

    static dateTimeFormat(date)
    {
        return window.moment(date).format("YYYY-MM-DD hh:mm:ss");
    }

    static dateFormat(date)
    {
      return window.moment(date).format("YYYY-MM-DD")
    }

    static formatPhoneNumber(number)
    {
      let formatedNumber = number.split(' ');
      let joinedLastPart = formatedNumber.slice(1,).join('');
      let finalNumberToFormat = [formatedNumber[0],joinedLastPart].join('-');
      return finalNumberToFormat;
    }

    static randomString(length)
    {
        let result           = [];
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
      }
      return result.join('');
    }

    static makeQueryStingFromJson(json_object)
    {
      var str = [];
      for (var p in json_object){
        if (json_object.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json_object[p]));
        }
      }
      return  '?' + str.join("&");
    }

    static sweetAlert(type='success', title='Success', msg = 'success')
    {
        return Swal.fire({
          title: title,
          text: msg,
          icon: type,
          confirmButtonText: "OK"
        });
    }

    static sweetConfirmationModal(msg,cb)
    {
        Swal.fire({
          title: msg,
          showCancelButton: true,
          confirmButtonText: 'Continue',
        }).then((result) => {
            if( result.isConfirmed )
              cb(result)
        })
    }
}
export default Helper
