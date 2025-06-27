import React from 'react';
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

    const addFaq = (e) => {
        e.preventDefault();
        removeFlashMessage()
        let form   = e.target;
        let params = new FormData(form);
        let admin_route = window.api.add_faq;
        HttpRequest.makeRequest(admin_route.method,admin_route.url,params)
          .then( (response) => {
              if( response.code != 200 ){
                showFlashMessage(response);
              } else {
                Helper.sweetAlert('success','Success',response.data.message)
                setTimeout( () => {
                  history.push( window.constants.base_path + 'admin/faq' )
                },1000)
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
                        Add FAQ
                    </div>
                    <div className="card-body">
                        <FlashMessage />
                        <form method='POST' onSubmit={ addFaq }>
                          <div className="row">
                              <div className="col-md-12">
                                  <div className="form-group">
                                      <label>Question</label>
                                      <textarea required name="question" className="form-control" />
                                  </div>
                              </div>
                              <div className="col-md-12">
                                  <div className="form-group">
                                      <label>Answer</label>
                                      <textarea required name="answer" className="form-control" />
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
export default React.memo(Add);
