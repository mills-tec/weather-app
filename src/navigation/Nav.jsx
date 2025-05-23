import React from "react";
import { Link } from "react-router-dom";
import { TiWeatherStormy } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { WiDaySnowThunderstorm } from "react-icons/wi";
import { IoMdMenu } from "react-icons/io";
import { FaMap } from "react-icons/fa6";
import "./Nav.css";
import Switch from "react-switch";
import { useContext } from "react";
import { ThemeContext } from "../App";
import { useState } from "react";

const Nav = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNav, setShowNav] = useState(false);
  const navList = [
    // { name: "Home", path: "/" },
    { name: "Weather", path: "/", icon: <TiWeatherPartlySunny /> },
    { name: "Map", path: "/about", icon: <FaMap /> },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo">
          <WiDaySnowThunderstorm />
        </div>

        <div className="menu-div">
          <IoMdMenu className="menu" onClick={() => setShowNav(!showNav)} />

          {/* for screen size responsivness */}
          {showNav && (
            <div
              className="nav-list-mobile"
              onKeyDown={(e) => e.key === "" && setShowNav(false)}
            >
              <ul className="nav-list">
                {navList.map(({ name, path, icon }, index) => (
                  <li key={index}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        isActive ? "active-link" : "link"
                      }
                    >
                      <p className="iconnav">{icon}</p>
                      {name}
                    </NavLink>
                  </li>
                ))}

               <li>
                 <div className="themeSwith mobile-themeSwith">
                  <Switch
                    onChange={toggleTheme}
                    checked={theme === "dark"}
                    onHandleColor="#18212a"
                    onColor="#f0f0f0"
                    activeBoxShadow="0px 0px 1px 3px  #f0f0f0"
                    handleDiameter={20}
                    //
                    offHandleColor="#f0f0f0"
                    offColor="#18212a"
                    //  width={55}
                    // height={30}
                    className="react-switch"
                  ></Switch>
                </div>
               </li>
              </ul>
            </div>
          )}
        </div>

        {/* DESTOP SCREEN */}
        {
          <ul className="nav-list">
            {navList.map(({ name, path, icon }, index) => (
              <li key={index}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    isActive ? "active-link" : "link"
                  }
                >
                  <p className="iconnav">{icon}</p>
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        }

        {
          <div className="themeSwith">
            <Switch
              onChange={toggleTheme}
              checked={theme === "dark"}
              onHandleColor="#18212a"
              onColor="#f0f0f0"
              activeBoxShadow="0px 0px 1px 3px  #f0f0f0"
              handleDiameter={20}
              //
              offHandleColor="#f0f0f0"
              offColor="#18212a"
              //  width={55}
              // height={30}
              className="react-switch"
            ></Switch>
          </div>
        }
      </div>
    </div>
  );
};

export default Nav;
