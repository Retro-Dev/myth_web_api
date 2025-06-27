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
    const [contents, setContents] = useState([]);

    useEffect( () => {
      getData()
    },[]);

    const getData = async () => {
      let params = {
        page: page_no,
        keyword: search_keyword
      }
      params = Helper.makeQueryStingFromJson(params);
      let admin_route = window.api.get_content;
      let url = admin_route.url + params;
      let response = await HttpRequest.makeRequest(admin_route.method,url)
      setContents(response.data.data)
      setPaginationData(response.data.links);
    }

    const pageChange = (page) => {
      page_no = page
      getData()
    }

    let columns = [
        {
            type: 'text',
            title: 'Indentifier',
            key: 'slug',
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
                  <Link className='btn btn-xs btn-primary' to={ window.constants.base_path + `admin/content/edit/${record.slug}` }><i className='fa fa-pencil'></i></Link>
              </>
            )
          }
      },
    ];

    let config = {
        bulk_delete: false,
        search: false
    }

    return(
      <>
        <Header />
        <Sidebar />
        <Breadcrumb page_title="Content Management" />
        <section className="main-content">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                    <div className="card-header card-default">
                        <div className="row">
                            <div className="col-md-6">
                              Content Listing
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className='row'>
                            <div className='col-md-12'>
                                <DataTable columns={columns} config={config} data={ contents } />
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
