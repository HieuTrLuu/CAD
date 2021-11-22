import React, { useEffect, useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { urlLinkPadding } from "../../utils/cssVar";
import UserDropDown from "./UserDropDown";
import { UserContext } from "../../Contexts";

function Header(props) {
  // useContext
  const {user, setUser} = useContext(UserContext);

  let userProfileLink;
  if (user){
    let userProfileLink = `/userProfile/${user.userName}`;
  }else{
    let userProfileLink =  `/userProfile/null`;
  }
  
  useEffect(() => {
    // props.dispatch(toggleAuthentication())
    return () => {
      // cleanup
    };
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand>
        <Link to="/">Cloud Note</Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>

        {/* After Login */}
        {/* if User show dropdown */}
        {user ? (
          <Nav>
            <UserDropDown/>
          </Nav>
        ) : (
          //  b4 Login
          <Nav>
            <Link to="/signin" style={urlLinkPadding}>
              Sign In{" "}
            </Link>
            <Link to="/signup" style={urlLinkPadding}>
              Sign Up{" "}
            </Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}


export default Header;
