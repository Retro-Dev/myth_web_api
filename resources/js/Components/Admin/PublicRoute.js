import React from "react";
import { Redirect, Route } from "react-router-dom";

function PublicRoute({ component: Component, ...restOfProps }) {

  const isAuthenticated = window._.isEmpty(localStorage.getItem("session")) ? false : true;
  if( isAuthenticated ){
      return(<Redirect to={ window.constants.base_path + 'admin/dashboard' } />)
  } else {
    return (
      <Route {...restOfProps} render={(props) => <Component {...props} />} />
    );
  }
}
export default React.memo(PublicRoute)

