import React, {useRef} from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import FlashMessage from '../FlashMessage/Index';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import { Context } from "../../../Store/Store";
import Helper from '../../../Helper';

function ChangePassword()
{
    const [state,dispatch] = React.useContext(Context);

    const formReset = useRef(null);

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

    const submitChangePassword = async (event) => {
        event.preventDefault();
        removeFlashMessage()
        let form   = event.target;
        let params = new FormData(form);
        let admin_route = window.api.admin_chanage_pass;
        let response = await HttpRequest.makeRequest(admin_route.method,admin_route.url,params)
        if( response.code != 200 ){
          showFlashMessage(response);
        } else {
          Helper.sweetAlert('success','Success',response.data.message);
          formReset.current.reset();
        }
    }

    return(
      <>
        <Header />
        <Sidebar />
        <Breadcrumb page_title='Change Password' />
        <section className="main-content">
          <div className="row">
              <div className="col-sm-12">
                <div className="card">
                      <div className="card-header card-default">
                          Change Password
                      </div>
                      <div className="card-body">
                        <FlashMessage />
                        <form ref={formReset} method='post' onSubmit={submitChangePassword}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" name="current_password" className="form-control" required="required" />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" name="new_password" className="form-control" required="required" />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" name="confirm_password" className="form-control" required="required" />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                      </div>
                  </div>
              </div>
          </div>
        <Footer />
        </section>
      </>
    )
}
export default React.memo(ChangePassword)
