import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sidenav, Nav, Dropdown } from "rsuite";
import {
  FaHome,
  FaUserCog,
  FaUserAlt,
  FaCog,
  FaQuestionCircle,
  FaRegEdit,
  FaRegListAlt,
} from "react-icons/fa";
import Helper from "../../../Helper";
import HttpRequest from '../../../Libraries/HttpRequest/HttpRequest';

function Sidebar() {

  let authUser = Helper.getStorageData('session');

  const [modules, setModules] = useState([]);

  useEffect( () => {
    if( window._.isEmpty( localStorage.getItem('modules') ) ){
      let cms_module_route = window.api.get_cms_modules;
      HttpRequest.makeRequest(cms_module_route.method,cms_module_route.url)
        .then( (response) => {
            Helper.setStorageData('modules',response.data.data);
            setModules(response.data.data);
        })
    } else {
        let getModules = Helper.getStorageData('modules');
        setModules(getModules);
    }

  },[])

  return (
    <>
      <div className="main-sidebar-nav default-navigation">
        <div className="nano">
          <div className="nano-content sidebar-nav">
            <div className="card-body border-bottom text-center nav-profile">
              <div className="notify setpos">
                <span className="heartbit"></span>
                <span className="point"></span>
              </div>
              <img
                alt="profile"
                className="margin-b-10"
                src={ authUser.image_url }
                width="80"
              />
              <p className="lead margin-b-0 toggle-none">{ authUser.name }</p>
              <p className="text-muted mv-0 toggle-none">Welcome</p>
            </div>
            <div className="mt-5" style={{ width: 240 }}>
              <Sidenav>
                <Sidenav.Body>
                  <Nav activeKey="1">
                    <Nav.Item as={Link} eventKey="0" to={window.constants.base_path + "admin/dashboard"} icon={<FaHome />}>
                        Dashboard
                    </Nav.Item>
                    {
                        modules.length > 0 ? modules.map( (module, index) => {
                            console.log('module',module);
                            return <Nav.Item as={Link} key={ module.id } eventKey={ index + 1 } to={ module.route_path } >
                                      { module.name }
                                   </Nav.Item>
                        })

                        : null
                    }

{/*
                    <Nav.Item as={Link} eventKey="3" to={window.constants.base_path + "admin/cms-users"} icon={<FaUserAlt />}>
                        CMS User Management
                    </Nav.Item>
                    <Nav.Item as={Link} eventKey="4" to={window.constants.base_path + "admin/application-setting"} icon={<FaCog />}>
                        Application Setting
                    </Nav.Item>
                    <Nav.Item as={Link} eventKey="5" to={window.constants.base_path + "admin/faq"} icon={<FaQuestionCircle />}>
                        FAQ's
                    </Nav.Item>
                    <Nav.Item as={Link} eventKey="6" to={window.constants.base_path + "admin/content"} icon={<FaRegEdit />}>
                        Content Management
                    </Nav.Item>
                    <Dropdown
                      eventKey="7"
                      title="Advanced"
                      icon={<FaRegListAlt />}
                    >
                      <Dropdown.Item eventKey="7-1">Geo</Dropdown.Item>
                      <Dropdown.Item eventKey="7-2">Devices</Dropdown.Item>
                      <Dropdown.Item eventKey="7-3">Loyalty</Dropdown.Item>
                      <Dropdown.Item eventKey="7-4">Visit Depth</Dropdown.Item>
                    </Dropdown> */}
                  </Nav>
                </Sidenav.Body>
              </Sidenav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default React.memo(Sidebar)
