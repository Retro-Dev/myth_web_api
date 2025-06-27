import React,{ useState, useEffect } from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import FlashMessage from '../FlashMessage/Index';
import { Context } from "../../../Store/Store";
import Helper from '../../../Helper';

function Index()
{
    const [state,dispatch] = React.useContext(Context);
    const [appSetting, setAppSetting] = useState([]);

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

    useEffect( async () => {
        let admin_route = window.api.get_application_setting;
        let response = await HttpRequest.makeRequest(admin_route.method,admin_route.url)
        if( response.code != 200 ){
          showFlashMessage(response);
        } else {
          removeFlashMessage();
          setAppSetting(response.data.data)
        }
    },[]);

    const saveApplicationSetting = async (e) => {
        e.preventDefault();
        removeFlashMessage()
        let form   = e.target;
        let params = new FormData(form);
        let admin_route = window.api.save_application_setting;
        let response = await HttpRequest.makeRequest(admin_route.method,admin_route.url,params)
        if( response.code != 200 ){
          showFlashMessage(response);
        } else {
          Helper.sweetAlert('success','Success',response.data.message);
          setAppSetting(response.data.data)
        }
    }
    return(
      <>
        <Header />
        <Sidebar />
        <Breadcrumb page_title='Application Setting' />
        <section className="main-content">
          <div className="row">
              <div className="col-sm-12">
                <div className="card">
                    <div className="card-header card-default">
                        Add Application Setting
                    </div>
                    <div className="card-body">
                        <FlashMessage />
                        <form method="POST" onSubmit={saveApplicationSetting}>
                          <div className="row">
                              <div className="col-md-12">
                                  <div className="form-group">
                                      <label>Application Name</label>
                                      <input required defaultValue={ appSetting && appSetting.app_name } type="text" name="app_name" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Logo</label>
                                      <input type="file" name="logo" className="form-control" />
                                      <div className='profile-img'>
                                          {
                                            appSetting && !window._.isEmpty(appSetting.logo) ? <img width='200' className='img-fluid mt-2' src={ appSetting.base_url + appSetting.logo } /> : ''
                                          }
                                      </div>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Favicon</label>
                                      <input type="file" name="favicon" className="form-control" />
                                      <div className='profile-img'>
                                          {
                                            appSetting && !window._.isEmpty(appSetting.favicon) ? <img width='80' className='img-fluid mt-2' src={ appSetting.base_url + appSetting.favicon } /> : ''
                                          }
                                      </div>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Meta Keyword</label>
                                      <textarea defaultValue={ appSetting && appSetting.meta_keyword } required name="meta_keyword" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Meta Description</label>
                                      <textarea defaultValue={ appSetting && appSetting.meta_description } required name="meta_description" className="form-control" />
                                  </div>
                              </div>
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
export default React.memo(Index)
