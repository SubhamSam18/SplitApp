import { NavLink } from "react-router-dom";
import "../designs/navbar.css";
import { IoHome } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

function Navbar() {
  const navItems = [
    {
      name: "Home",
      path: "/",
      src: <IoHome />,
    },
    {
      name: "Groups",
      path: "/groups",
      src: <MdGroups />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      src: <IoAnalyticsSharp />,
    },
    {
      name: "Friends",
      path: "/friends",
      src: <FaUserFriends />,
    },
  ];
  return (
    <div className="main-div">
      <div className="navbar">
        <div className="nav-links">
          {navItems.map((items) => (
            <NavLink
              key={items.name}
              to={items.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {items.src}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
