import React from 'react';
import {useParams} from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

function ResetPassword()
{
    let { token } = useParams();

    return(
      <div className='row'>
        <div className="col-4 offset-4">
          <Header />
            <div className="misc-box">
              <form method="post" action="" role="form">
                  <input type='hidden' name="token" value={token} />
                  <div className="form-group">
                      <label  htmlFor="exampleuser1">New Password</label>
                      <div className="group-icon">
                          <input id="exampleuser1" type="password" name="new_password" placeholder="New Password" className="form-control" required="" />
                          <span className="icon-user text-muted icon-input"></span>
                      </div>
                  </div>
                  <div className="form-group">
                      <label  htmlFor="exampleuser1">Confirm Password</label>
                      <div className="group-icon">
                          <input id="exampleuser1" type="password" name="confirm_password" placeholder="Confirm Password" className="form-control" required="" />
                          <span className="icon-user text-muted icon-input"></span>
                      </div>
                  </div>
                  <div className="clearfix">
                      <div className="float-right">
                          <button type="submit" className="btn btn-block btn-primary btn-rounded box-shadow">Submit</button>
                      </div>
                  </div>
              </form>
            </div>
            <Footer />
        </div>
      </div>
    );
}
export default React.memo(ResetPassword)
