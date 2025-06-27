import React, { useEffect, useState } from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import Helper from '../../../Helper';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import { Context } from "../../../Store/Store";
import FlashMessage from '../FlashMessage/Index';
import { useHistory, useParams } from 'react-router-dom';

function Edit()
{
    const {slug}  = useParams()

    const history = useHistory();
    const [state,dispatch] = React.useContext(Context);
    const [roles,setRoles] = useState([]);
    const [cmsUser, setCmsUser] = useState({});
    const [roleField, setRoleField] = useState('');

    useEffect( async () => {
      let params = {
        limit: 100,
      }
      params = Helper.makeQueryStingFromJson(params);
      let cms_role_route = window.api.get_cms_role;
      let cms_role_route_url = cms_role_route.url + params;
      let cms_user_route = window.api.get_cms_user_by_slug
      let cms_user_route_url = cms_user_route.url.replace(':slug',slug);
      let getRoles    = await HttpRequest.makeRequest(cms_role_route.method,cms_role_route_url);
      let getCmsUser  = await HttpRequest.makeRequest(cms_user_route.method,cms_user_route_url);
      let cmsUserData = getCmsUser.data.data;
      setRoles(getRoles.data.data)
      setCmsUser(cmsUserData);
      setRoleField(cmsUserData.role._id)
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

    const editCmsUser = (e) => {
        e.preventDefault();
        removeFlashMessage()
        let form   = e.target;
        let params = new FormData(form);
        let admin_route = window.api.update_cms_user;
        let url = admin_route.url.replace(':slug',slug);
        HttpRequest.makeRequest(admin_route.method,url,params)
          .then( (response) => {
              if( response.code != 200 ){
                showFlashMessage(response);
              } else {
                Helper.sweetAlert('success','Success',response.data.message)
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
                        Edit Cms User
                    </div>
                    <div className="card-body">
                        <FlashMessage />
                        <form method='post' onSubmit={ editCmsUser }>
                          <div className="row">
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Name</label>
                                      <input required='required' defaultValue={ cmsUser.name } type="text" name="name" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Email</label>
                                      <input required='required' type="email" defaultValue={ cmsUser.email } name="email" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Profile Picture</label>
                                      <input type="file" name="image_url" className="form-control" />
                                      <div className='profile-img'>
                                          {
                                            cmsUser && !window._.isEmpty(cmsUser.image_url) ? <img width='200' className='img-fluid mt-2' src={ cmsUser.image_url } /> : null
                                          }
                                      </div>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Mobile No</label>
                                      <input required='required' type="text" defaultValue={ cmsUser.mobile_no } name="mobile_no" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>Password</label>
                                      <input type="password" name="password" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="form-group">
                                      <label>CMS privilege</label>

                                      <select required='required' value={roleField} onChange={ (e) => setRoleField(e.target.value) } name="role" className="form-control">
                                          <option value="">-- Select Privilege --</option>
                                          {
                                              roles.length > 0 && roles.map( (role) => {
                                                 return <option  key={ role.id } value={ role.id }>{ role.title }</option>
                                              })
                                          }
                                      </select>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select name="status" className='form-control'>
                                            <option value="1">Active</option>
                                            <option value="0">Disbaled</option>
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
export default React.memo(Edit)
