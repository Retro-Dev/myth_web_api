import React from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import FlashMessage from '../FlashMessage/Index';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import { Context } from "../../../Store/Store";
import Helper from '../../../Helper';

function Profile()
{
    const [state,dispatch] = React.useContext(Context);

    let authUser = Helper.getStorageData('session');

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

    const submitProfile = async (event) => {
        event.preventDefault();
        removeFlashMessage()
        let form   = event.target;
        let params = new FormData(form);
        let admin_route = window.api.admin_update_user;
        let profile_url = admin_route.url;
            profile_url = profile_url.replace(':user-slug',authUser.slug)
        let response = await HttpRequest.makeRequest(admin_route.method,profile_url,params)
        if( response.code != 200 ){
          showFlashMessage(response);
        } else {
          Helper.sweetAlert('success','Success',response.data.message);
          Helper.setStorageData('session',response.data.data);
        }
    }

    return(
      <>
        <Header />
        <Sidebar />
        <Breadcrumb page_title='Profile' />
        <section className="main-content">
          <div className="row">
              <div className="col-sm-12">
                <div className="card">
                      <div className="card-header card-default">
                          Profile
                      </div>
                      <div className="card-body">
                        <FlashMessage />
                        <form method='post' onSubmit={submitProfile}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" defaultValue={ authUser.name } name="name" className="form-control" required="required" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" defaultValue={ authUser.email } name="email" className="form-control" required="required" />
                            </div>
                            <div className="form-group">
                                <label>Mobile No</label>
                                <input type="text" defaultValue={ authUser.mobile_no } name="mobile_no" className="form-control" required="required" />
                            </div>
                            <div className="form-group">
                                <label>Profile Image</label>
                                <input type="file" name="image_url" className="form-control" />
                                {
                                    window._.isEmpty(authUser.image_url) ? ''
                                    : <div className='profile-image'>
                                        <img src={ authUser.image_url } width="150" height="100" className='img-fluid mt-2' />
                                      </div>
                                }
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
export default React.memo(Profile)
