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
    const [faqs, setFaqs] = useState([]);

    useEffect( () => {
      getData()
    },[]);

    const getData = async () => {
      let params = {
        page: page_no,
        keyword: search_keyword
      }
      params = Helper.makeQueryStingFromJson(params);
      let admin_route = window.api.get_faq;
      let url = admin_route.url + params;
      let response = await HttpRequest.makeRequest(admin_route.method,url)
      setFaqs(response.data.data)
      setPaginationData(response.data.links);
    }

    const deleteRecord = (slug) => {
        Helper.sweetConfirmationModal('Are you sure you want to continue',function(res){
            bulkDelete([slug]);
        })
    }

    const bulkDelete = async (slugs) => {
        let admin_route = window.api.delete_faq;
        let response = await HttpRequest.makeRequest(admin_route.method,admin_route.url, {slug:slugs})
        if( response.code != 200 ){
          Helper.sweetAlert('error','Error',response.data.message)
        } else {
          let msg = slugs.length > 0 ? 'Records has been deleted successfully' : 'Record has been deleted successfully';
          Helper.sweetAlert('success','Success',msg)
          let updatedFaqs = faqs.filter( (faq) => {
              return slugs.indexOf(faq.slug) == -1
          })
          setFaqs(updatedFaqs);
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
            type: 'text',
            title: 'Question',
            key: 'question',
            sort: false,
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
                  <Link className='btn btn-xs btn-primary' to={ window.constants.base_path + `admin/faq/edit/${record.slug}` }><i className='fa fa-pencil'></i></Link>
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
        <Breadcrumb page_title="FAQ's" />
        <section className="main-content">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                      <div className="card-header card-default">
                          <div className="row">
                              <div className="col-md-6">
                                FAQ's Listing
                              </div>
                              <div className="col-md-6">
                                  <Link className="btn btn-info pull-right" to={window.constants.base_path + 'admin/faq/add'}>Add Faq</Link>
                              </div>
                          </div>
                      </div>
                      <div className="card-body">
                          <div className='row'>
                              <div className='col-md-12'>
                                  <DataTable columns={columns} config={config} data={ faqs } />
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
