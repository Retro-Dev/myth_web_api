import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from "./Auth/Login";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import Profile from "./Auth/Profile";
import ChangePassword from "./Auth/ChangePassword";
import Dashboard from "./Dashboard/Index";
import CmsRoles from "./CmsRole/Index";
import CmsRolesAdd from "./CmsRole/Add";
import CmsRolesEdit from './CmsRole/Edit';
import CmsUser from "./CmsUser/Index";
import CmsUserAdd from "./CmsUser/Add";
import CmsUserEdit from "./CmsUser/Edit";
import ApplicationSetting from "./ApplicationSetting/Index";
import FAQ from "./Faq/Index";
import FAQAdd from "./Faq/Add";
import FAQEdit from "./Faq/Edit";
import Content from "./Content/Index";
import ContentEdit from "./Content/Edit";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Helper from "../../Helper";

function AdminRoutes() {

  const Logout = () => {
    Helper.removeStorageData()
    return(<Redirect to={window.constants.admin_login_url} />)
  }

  const PageNotFound = () => {
    window.location.href = '/';
    return;
  }

  return (
    <Router>
      <Switch>
        <PublicRoute
          exact
          path={window.constants.base_path + "admin/login/zekkmdvhkm"}
        >
          <Login />
        </PublicRoute>
        <PublicRoute
          exact
          path={window.constants.base_path + "admin/forgot-password/zekkmdvhkm"}
        >
          <ForgotPassword />
        </PublicRoute>
        <PublicRoute
          exact
          path={window.constants.base_path + "admin/reset-password/:token"}
        >
          <ResetPassword />
        </PublicRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/profile"}>
          <Profile />
        </ProtectedRoute>
        <ProtectedRoute
          exact
          path={window.constants.base_path + "admin/change-password"}
        >
          <ChangePassword />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/dashboard"}>
          <Dashboard />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/cms-roles"}>
          <CmsRoles />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/cms-roles/add"}>
          <CmsRolesAdd />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/cms-roles/edit/:slug"}>
          <CmsRolesEdit />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/cms-users"}>
          <CmsUser />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/cms-users/add"}>
          <CmsUserAdd />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/cms-users/edit/:slug"}>
          <CmsUserEdit />
        </ProtectedRoute>
        <ProtectedRoute
          exact
          path={window.constants.base_path + "admin/application-setting"}
        >
          <ApplicationSetting />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/faq"}>
          <FAQ />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/faq/add"}>
          <FAQAdd />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/faq/edit/:slug"}>
          <FAQEdit />
        </ProtectedRoute>
        <ProtectedRoute exact path={window.constants.base_path + "admin/content"}>
          <Content />
        </ProtectedRoute>
        <ProtectedRoute
          exact
          path={window.constants.base_path + "admin/content/edit/:slug"}
        >
          <ContentEdit />
        </ProtectedRoute>
        <Route exact path={ window.constants.base_path + "admin/logout" } component={Logout} />
        <Route path="*" component={PageNotFound} />
      </Switch>
    </Router>
  );
}
export default React.memo(AdminRoutes)
