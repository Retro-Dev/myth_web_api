import React from 'react';
import {Link, useHistory} from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import FlashMessage from '../FlashMessage/Index';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import { Context } from "../../../Store/Store";
import Helper from '../../../Helper';

function ForgotPassword()
{
    const [state,dispatch] = React.useContext(Context);

    let history = useHistory();

    const removeFlashMessage = () => {
      dispatch({
        type: "SET_STATE",
        response: [],
        flash_message_show: false,
      });
    }

    const showFlashMessage = (data) => {
        dispatch({
          type: "SET_STATE",
          response: data,
          flash_message_show: true,
      });
    }

    const forgotPassword = async (event) => {
      event.preventDefault();
      removeFlashMessage()
      let form   = event.target;
      let params = new FormData(form);
      let forgotRoute = window.api.admin_forgot_pass;
      let response = await HttpRequest.makeRequest(forgotRoute.method,forgotRoute.url,params)
      if( response.code != 200 ){
        showFlashMessage(response);
      } else {
        Helper.sweetAlert('success','Success',response.data.message);
        Helper.setStorageData('session',response.data.data);
        setTimeout( () => {
          history.push( window.constants.base_path + "admin/login/zekkmdvhkm");
        },3000)
      }
    }

    return(
      <div className='row'>
        <div className="col-4 offset-4">
          <Header />
            <div className="misc-box">
              <FlashMessage />
              <form onSubmit={forgotPassword}>
                  <div className="form-group">
                      <label  htmlFor="exampleuser1">Email</label>
                      <div className="group-icon">
                          <input id="exampleuser1" type="email" name="email" placeholder="Email" className="form-control" required="" />
                          <span className="icon-user text-muted icon-input"></span>
                      </div>
                  </div>
                  <div className="clearfix">
                      <div className="float-right">
                          <button type="submit" className="btn btn-block btn-primary btn-rounded box-shadow">Submit</button>
                      </div>
                  </div>
                  <hr/>
                  <p className="text-center">
                      <Link to="/admin/login/zekkmdvhkm">Back To Login?</Link>
                  </p>
              </form>
            </div>
            <Footer />
        </div>
      </div>
    );
}
export default React.memo(ForgotPassword)

