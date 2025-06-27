import React, { useEffect, useState } from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import Helper from '../../../Helper';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import { Context } from "../../../Store/Store";
import FlashMessage from '../FlashMessage/Index';
import { useHistory, useParams} from 'react-router-dom';

function Edit()
{
    const {slug}  = useParams()

    const history = useHistory();
    const [state,dispatch] = React.useContext(Context);
    const [faq, setFaq] = useState({});

    useEffect( () => {
        let faq_route     = window.api.get_faq_by_slug
        let faq_route_url = faq_route.url.replace(':slug',slug);
        HttpRequest.makeRequest(faq_route.method,faq_route_url)
          .then( (response) => {
            setFaq(response.data.data)
          });
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

    const updateFaq = (e) => {
        e.preventDefault();
        removeFlashMessage()
        let form   = e.target;
        let params = new FormData(form);
        let faq_route = window.api.update_faq;
        let url = faq_route.url.replace(':slug',slug);
        HttpRequest.makeRequest(faq_route.method,url,params)
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
        <Breadcrumb page_title="FAQ's" />
        <section className="main-content">
          <div className="row">
              <div className="col-sm-12">
                <div className="card">
                    <div className="card-header card-default">
                        Edit FAQ
                    </div>
                    <div className="card-body">
                        <FlashMessage />
                        <form method='POST' onSubmit={ updateFaq }>
                          <div className="row">
                              <div className="col-md-12">
                                  <div className="form-group">
                                      <label>Question</label>
                                      <textarea required name="question" defaultValue={ faq.question } className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-12">
                                  <div className="form-group">
                                      <label>Answer</label>
                                      <textarea required name="answer" defaultValue={ faq.answer } className="form-control" />
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
export default React.memo(Edit);
