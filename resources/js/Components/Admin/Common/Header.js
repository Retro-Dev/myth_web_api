import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "rsuite";
import { AiOutlineBell } from "react-icons/ai";
import Helper from "../../../Helper";

function Header() {

  let authUser = Helper.getStorageData('session');

  return (
    <>
      <div className="top-bar primary-top-bar">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <Link
                className="admin-logo"
                to={window.constants.base_path + "admin/dashboard"}
              >
                <h1>
                  <img
                    alt=""
                    width="150"
                    src="/images/logo.png"
                    className="toggle-none hidden-xs"
                  />
                </h1>
              </Link>
              <div className="left-nav-toggle">
                <Link to="#" className="nav-collapse">
                  <i className="fa fa-bars"></i>
                </Link>
              </div>
              <div className="left-nav-collapsed">
                <Link to="#" className="nav-collapsed">
                  <i className="fa fa-bars"></i>
                </Link>
              </div>
              <ul className="list-inline top-right-nav">
                <li>
                  <Dropdown placement="bottomEnd" className="notification" icon={<AiOutlineBell />}>
                    <div className="header-dropdown">
                      <p>Notifications</p>
                      <a href="#">View All</a>
                    </div>
                    <Dropdown.Item>
                      <div className="notification-list">
                        <div className="img">
                          <img src="/images/avtar-2.png" alt="" />
                        </div>
                        <div className="text-box">
                          <p className="notification-title">Upload Complete</p>
                          <p className="notification-description">Lorem Ipsum is simply dummy text of the printing.</p>
                          <p className="notification-time">15 minutes ago</p>
                        </div>
                      </div>

                    </Dropdown.Item>
                    <Dropdown.Item>
                      <div className="notification-list">
                        <div className="img">
                          <img src="/images/avtar-2.png" alt="" />
                        </div>
                        <div className="text-box">
                          <p className="notification-title">Upload Complete</p>
                          <p className="notification-description">Lorem Ipsum is simply dummy text of the printing.</p>
                          <p className="notification-time">15 minutes ago</p>
                        </div>
                      </div>
                    </Dropdown.Item>
                  </Dropdown>
                </li>
                <li>
                  <Dropdown
                    className="user-profile-img"
                    title={ authUser.name }
                    icon={
                      <img
                        width="30"
                        height="30"
                        className="rounded-circle"
                        src={ authUser.image_url }
                      />
                    }
                  >
                    <Dropdown.Item>
                      <Link to={window.constants.base_path + "admin/profile"}>
                        Profile
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        to={
                          window.constants.base_path + "admin/change-password"
                        }
                      >
                        Change Password
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to={
                        window.constants.base_path + "admin/logout"
                      }>Logout</Link>
                    </Dropdown.Item>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default React.memo(Header)
