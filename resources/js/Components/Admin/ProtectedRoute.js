import React from "react";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {

  const isAuthenticated = window._.isEmpty(localStorage.getItem("session")) ? false : true;
  if( !isAuthenticated ){
      window.location.href = '/';
      return(<></>)
  } else {
    return (
      <Route {...restOfProps} render={(props) => <Component {...props} />} />
    );
  }
}
export default React.memo(ProtectedRoute)

