import React from "react";
import ReactDOM from "react-dom";
import Store from "./Store/Store";
import AdminRoutes from "./Components/Admin/AdminRoutes";
import "rsuite/dist/rsuite.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Index() {
  return (
    <Store>
      <AdminRoutes />
    </Store>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById("root")
);
