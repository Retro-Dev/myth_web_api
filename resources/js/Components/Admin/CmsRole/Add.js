import React, { useEffect, useState } from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import FlashMessage from '../FlashMessage/Index';
import { Context } from "../../../Store/Store";
import { useHistory } from 'react-router-dom';
import Helper from '../../../Helper';

function Add()
{
    const history = useHistory();

    const [state,dispatch] = React.useContext(Context);
    const [modules, setModules] = useState([]);
    const [isSuperAdmin,setIsSuperAdmin] = useState(false);

    useEffect( async () => {
      let admin_route = window.api.get_cms_modules;
      let response = await HttpRequest.makeRequest(admin_route.method,admin_route.url)
      setModules(response.data.data)
    },[])

    const superAdminFlag = (e) => {
      if( e.target.value == '0' )
        setIsSuperAdmin(false)
      else
        setIsSuperAdmin(true)
  }

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

    const addCmsRole = async (e) => {
        e.preventDefault();
        removeFlashMessage()
        let form   = e.target;
        let params = new FormData(form);
        let admin_route = window.api.add_cms_role;
        let response = await HttpRequest.makeRequest(admin_route.method,admin_route.url,params)
        if( response.code != 200 ){
          showFlashMessage(response);
        } else {
          Helper.sweetAlert('success','Success',response.data.message)
          setTimeout( () => {
            history.push( window.constants.base_path + 'admin/cms-roles' )
          },3000)
        }
    }

    return(
      <>
          <Header />
          <Sidebar />
          <Breadcrumb page_title='CMS Role Management' />
          <section className="main-content">
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                    <div className="card-header card-default">
                        Add Cms Role
                    </div>
                    <div className="card-body">
                        <FlashMessage />
                        <form onSubmit={ addCmsRole }>
                          <div className="row">
                              <div className="col-md-12">
                                  <div className="form-group">
                                      <label>Title</label>
                                      <input type="text" name="title" className="form-control" required='required' />
                                  </div>
                              </div>
                          </div>
                          <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Is Super Admin</label>
                                        <select onChange={ superAdminFlag } className="form-control" id="is_super_admin" name="is_super_admin" required='required'>
                                            <option value="0">No</option>
                                            <option value="1">Yes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={ isSuperAdmin ? 'd-none row' : 'row' } id="module_permission_section">
                                <div className="col-md-12">
                                    <h3 className="margin-tb-20">Module Permissions</h3>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>modules</th>
                                                <th className="text-center" width="10%">View</th>
                                                <th className="text-center" width="10%">Add</th>
                                                <th className="text-center" width="10%">Update</th>
                                                <th className="text-center" width="10%">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan="2"></td>
                                                <td className="text-center">
                                                    <input type="checkbox" className="check_all" name="view_all" value="view"/>
                                                </td>
                                                <td className="text-center">
                                                    <input type="checkbox" className="check_all" name="add_all" value="add"/>
                                                </td>
                                                <td className="text-center">
                                                    <input type="checkbox" className="check_all" name="update_all" value="update"/>
                                                </td>
                                                <td className="text-center">
                                                    <input type="checkbox" className="check_all" name="delete_all" value="delete"/>
                                                </td>
                                            </tr>
                                            {
                                                modules.length > 0 ?
                                                  modules.map( (module, index) => {
                                                    return <tr key={module.id}>
                                                              <td>
                                                                {index + 1}
                                                              </td>
                                                              <td>{ module.name }</td>
                                                              <td className="text-center">
                                                                <input type="checkbox" name={ `module_id[${module.id}][is_view]` } value="1" />
                                                              </td>
                                                              <td className="text-center">
                                                                <input type="checkbox" name={ `module_id[${module.id}][is_add]` } value="1" />
                                                              </td>
                                                              <td className="text-center">
                                                                <input type="checkbox" name={ `module_id[${module.id}][is_update]` } value="1" />
                                                              </td>
                                                              <td className="text-center">
                                                                <input type="checkbox" name={ `module_id[${module.id}][is_delete]` } value="1" />
                                                              </td>
                                                            </tr>
                                                  })
                                                : null
                                            }
                                            </tbody>
                                      </table>
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
export default React.memo(Add);
