import React from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

const Header = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const check = Cookies.get("user");

  const logouting = () => {
    Cookies.remove("user");
    Cookies.remove("jwt_token");
    // You might also want to redirect to a login page or home page after logout
    window.location.href = "/"; // Redirect to home page
  }

  return (
    <div style={{ display: 'flex', height: '100vh', minHeight: '400px' }}>
      <Sidebar 
        image="https://i.pinimg.com/736x/8e/6c/06/8e6c064f57f94838263d7ba9ad80f353.jpg"
        collapsed={collapsed}
      >
        <main style={{ padding: 10 }}>
          <button 
            style={{
              height: "40px",
              width: "40px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
            }} 
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <GiHamburgerMenu size={20} /> : <IoIosArrowBack size={20} />}
          </button>
        </main>
        <Menu>
          <MenuItem>
            <Link to="/">Dashboard</Link>
          </MenuItem>
          {check === "Admin" && (
            <>
              <MenuItem>
                <Link to="/barCodeGenerator">Bar Code Generator</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/allProducts">All Products</Link>
              </MenuItem>
            </>
          )}
          {check === "User" && (
            <>
              <MenuItem>
                <Link to="/barCodeScanner">Bar Code Scanner</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/cart">Cart</Link>
              </MenuItem>
            </>
          )}
          <MenuItem onClick={logouting}>Logout</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default Header;
