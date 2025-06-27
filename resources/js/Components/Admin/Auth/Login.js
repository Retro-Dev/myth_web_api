import React from 'react';
import {Link,useHistory} from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import FlashMessage from '../FlashMessage/Index';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import { Context } from "../../../Store/Store";
import Helper from '../../../Helper';

function Login()
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

    const autentication = async (event) => {
      event.preventDefault();
      removeFlashMessage()
      let form   = event.target;
      let params = new FormData(form);
      let admin_route = window.api.admin_login;
      let response = await HttpRequest.makeRequest(admin_route.method,admin_route.url,params)
      if( response.code != 200 ){
        showFlashMessage(response);
      } else {
        Helper.setStorageData('session',response.data.data);
        history.push( window.constants.base_path + "admin/dashboard")
      }
    }

    return(
      <div className='row'>
        <div className="col-4 offset-4">
          <Header />
            <div className="misc-box">
              <FlashMessage />
              <form onSubmit={autentication}>
                  <div className="form-group">
                      <label  htmlFor="exampleuser1">Email</label>
                      <div className="group-icon">
                          <input id="exampleuser1" type="email" name="email" placeholder="Email" className="form-control" required="" />
                          <span className="icon-user text-muted icon-input"></span>
                      </div>
                  </div>
                  <div className="form-group">
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <div className="group-icon">
                          <input id="exampleInputPassword1" type="password" name="password" placeholder="Password" className="form-control" />
                          <span className="icon-lock text-muted icon-input"></span>
                      </div>
                  </div>
                  <div className="clearfix">
                      <div className="float-right">
                          <button className="btn btn-block btn-primary btn-rounded box-shadow">Login</button>
                      </div>
                  </div>
                  <hr/>
                  <p className="text-center">
                      <Link to="/admin/forgot-password/zekkmdvhkm">Forgot Password?</Link>
                  </p>
              </form>
            </div>
            <Footer />
        </div>
      </div>
    );
}
export default React.memo(Login)
