import React, { useEffect, useState } from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import Helper from '../../../Helper';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import { Context } from "../../../Store/Store";
import FlashMessage from '../FlashMessage/Index';
import { useHistory } from 'react-router-dom';

function Add()
{
    const history = useHistory();
    const [state,dispatch] = React.useContext(Context);
    const [roles,setRoles] = useState([]);

    useEffect( () => {
      let params = {
        limit: 100,
      }
      params = Helper.makeQueryStingFromJson(params);
      let admin_route = window.api.get_cms_role;
      let url = admin_route.url + params;
      HttpRequest.makeRequest(admin_route.method,url)
        .then( (response) => {
           setRoles(response.data.data)
        })

    },[])

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

    const addCmsUser = (e) => {
        e.preventDefault();
        removeFlashMessage()
        let form   = e.target;
        let params = new FormData(form);
        let admin_route = window.api.add_cms_user;
        HttpRequest.makeRequest(admin_route.method,admin_route.url,params)
          .then( (response) => {
              if( response.code != 200 ){
                showFlashMessage(response);
              } else {
                Helper.sweetAlert('success','Success',response.data.message)
                setTimeout( () => {
                  history.push( window.constants.base_path + 'admin/cms-users' )
                },3000)
              }
          })
    }

    return(
      <>
        <Header />
        <Sidebar />
        <Breadcrumb page_title='CMS User Management' />
        <section className="main-content">
          <div className="row">
              <div className="col-sm-12">
                <div className="card">
                    <div className="card-header card-default">
                        Add Cms User
                    </div>
                    <div className="card-body">
                        <FlashMessage />
                        <form method='post' onSubmit={ addCmsUser }>
                          <div className="row">
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Name</label>
                                      <input required='required' type="text" name="name" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Email</label>
                                      <input required='required' type="email" name="email" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Profile Picture</label>
                                      <input required='required' type="file" name="image_url" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Mobile No</label>
                                      <input required='required' type="text" name="mobile_no" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Password</label>
                                      <input required='required' type="password" name="password" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Confirm Password</label>
                                      <input required='required' type="password" name="confirm_password" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>CMS privilege</label>
                                      <select required='required' name="role" className="form-control">
                                          <option value="">-- Select Privilege --</option>
                                          {
                                              roles.length > 0 && roles.map( (role) => {
                                                 return <option key={ role.id } value={ role.id }>{ role.title }</option>
                                              })
                                          }
                                      </select>
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
export default React.memo(Add)
