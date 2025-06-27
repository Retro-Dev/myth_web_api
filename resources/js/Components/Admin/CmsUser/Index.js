import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import Helper from '../../../Helper';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import DataTable from '../Datatable/Index';
import Pagination from '../Pagination/Index';
let page_no = 1;
let search_keyword = '';

function Index()
{
    const [paginationData, setPaginationData] = useState({});
    const [cmsUsers, setCmsUsers] = useState([]);

    useEffect( () => {
      getData()
    },[]);

    const getData = async () => {
      let params = {
        page: page_no,
        keyword: search_keyword
      }
      params = Helper.makeQueryStingFromJson(params);
      let admin_route = window.api.get_cms_user;
      let url = admin_route.url + params;
      let response = await HttpRequest.makeRequest(admin_route.method,url)
      setCmsUsers(response.data.data)
      setPaginationData(response.data.links);
    }

    const deleteRecord = (slug) => {
        Helper.sweetConfirmationModal('Are you sure you want to continue',function(res){
            bulkDelete([slug]);
        })
    }

    const bulkDelete = async (slugs) => {
        let admin_route = window.api.delete_cms_user;
        let response = await HttpRequest.makeRequest(admin_route.method,admin_route.url, {slug:slugs})
        if( response.code != 200 ){
          Helper.sweetAlert('error','Error',response.data.message)
        } else {
          let msg = slugs.length > 0 ? 'Records has been deleted successfully' : 'Record has been deleted successfully';
          Helper.sweetAlert('success','Success',msg)
          let updatedCmsUsers = cmsUsers.filter( (cmsUser) => {
              return slugs.indexOf(cmsUser.slug) == -1
          })
          setCmsUsers(updatedCmsUsers);
        }
    }

    const filter = (keyword) => {
      search_keyword = keyword
      getData()
    }

    const pageChange = (page) => {
      page_no = page
      getData()
    }

    let columns = [
        {
          type: 'checkbox',
          title: '#',
          key: 'slug',
          sort: false,
        },
        {
            type: 'callback',
            title: 'CMS Privilege',
            key: 'role',
            sort: false,
            cb: (record) => {
              return(
                <>
                  { record.role.title }
                </>
              )
            }
        },
        {
            type: 'text',
            title: 'Name',
            key: 'name',
            sort: false,
        },
        {
            type: 'text',
            title: 'Email',
            key: 'email',
            sort: false,
        },
        {
            type: 'text',
            title: 'Mobile No',
            key: 'mobile_no',
            sort: false,
        },
        {
            type: 'callback',
            title: 'Status',
            key: 'status',
            sort: false,
            cb: (record) => {
              return(
                <>
                  <span className={ record.status == 1 && record.status == true ? 'btn btn-xs btn-success' : 'btn btn-xs btn-danger'  }>
                    { record.status == 1 && record.status == true ? 'Active' : 'Disabled'  }
                  </span>
                </>
              )
            }
        },
        {
            type: 'timestamp',
            title: 'Created At',
            key: 'created_at',
            sort: true,
        },
        {
          type: 'action',
          title: 'Action',
          action_cb: ( record ) => {
            return(
              <>
                  <Link className='btn btn-xs btn-primary' to={ window.constants.base_path + `admin/cms-users/edit/${record.slug}` }><i className='fa fa-pencil'></i></Link>
                  <Link onClick={ () => deleteRecord(record.slug) } className='btn btn-xs btn-danger' to='#'><i className='fa fa-trash'></i></Link>
              </>
            )
          }
      },
    ];

    let config = {
        bulk_delete: true,
        search: true,
        bulk_delete_cb: bulkDelete,
        filter_cb: filter
    }

    return(
      <>
        <Header />
        <Sidebar />
        <Breadcrumb page_title='CMS User Management' />
        <section className="main-content">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                      <div className="card-header card-default">
                          <div className="row">
                              <div className="col-md-6">
                                Cms User Listing
                              </div>
                              <div className="col-md-6">
                                  <Link className="btn btn-info pull-right" to={window.constants.base_path + 'admin/cms-users/add'}>Add Cms User</Link>
                              </div>
                          </div>
                      </div>
                      <div className="card-body">
                        <div className='row'>
                            <div className='col-md-12'>
                              <DataTable columns={columns} config={config} data={ cmsUsers } />
                            </div>
                            <div className='col-md-12'>
                                <nav className='pull-right'>
                                  <Pagination paginationData={paginationData} callback={pageChange} />
                                </nav>
                            </div>
                        </div>
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
