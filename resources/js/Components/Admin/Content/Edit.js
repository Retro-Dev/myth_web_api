import React, {useEffect, useRef, useState} from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import JoditEditor from "jodit-react";
import Helper from '../../../Helper';
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';
import { Context } from "../../../Store/Store";
import FlashMessage from '../FlashMessage/Index';
import { useHistory, useParams} from 'react-router-dom';

function Edit()
{
    const {slug}  = useParams()

    const editor = useRef(null)
	  const [content, setContent] = useState('')

    const history = useHistory();
    const [state,dispatch] = React.useContext(Context);

    useEffect( () => {
        let content_route = window.api.get_content_by_slug
        let content_route_url = content_route.url.replace(':slug',slug);
        HttpRequest.makeRequest(content_route.method,content_route_url)
          .then( (response) => {
            setContent(response.data.data.content)
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

    const updateContent = (e) => {
        e.preventDefault();
        removeFlashMessage()
        let form   = e.target;
        let params = new FormData(form);
        let content_route = window.api.update_content;
        let url = content_route.url.replace(':slug',slug);
        HttpRequest.makeRequest(content_route.method,url,params)
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
        <Breadcrumb page_title="Content Management" />
        <section className="main-content">
          <div className="row">
              <div className="col-sm-12">
                <div className="card">
                    <div className="card-header card-default">
                        Edit Content
                    </div>
                    <div className="card-body">
                        <FlashMessage />
                        <form method='post' onSubmit={ updateContent }>
                          <div className="row">
                              <div className="col-md-12">
                                  <div className="form-group">
                                      <label>Content</label>
                                      <JoditEditor
                                          name="content"
                                          ref={editor}
                                          value={content}
                                          // config={config}
                                          tabIndex={1} // tabIndex of textarea
                                          onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                          onChange={newContent => {}}
                                      />
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
