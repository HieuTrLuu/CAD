import React, {useEffect} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {updateUserSignOut,toggleAuthentication, toggleSignUp, toggleShowSignOutModal} from '../../redux/Actions'
import {Link} from "react-router-dom";
import { urlLinkPadding } from '../../util/cssVar';
import Form from 'react-bootstrap/Form'

function Header(props) {
  let userProfileLink = `/userProfile/${props.userName}`
  useEffect(() => {
    // props.dispatch(toggleAuthentication())
    return () => {
      // cleanup
    };
  }, [])

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand><Link to='/'>The real SNS</Link></Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Sort posts" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Date</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.2">Hash tag a-z</NavDropdown.Item>
          </NavDropdown>
          {/* <Form.Control style = {{height:'auto', width:'50%'}} type="search" placeholder="Search" /> */}
        </Nav>
        


        {/* After Login */}
        {props.isAuthenticated ? 
        <Nav>
            <Link to={userProfileLink} style={urlLinkPadding}>Profile</Link>
            <Link to='/'style={urlLinkPadding}>Feeds</Link>
            <Link to='/signOut'style={urlLinkPadding} onClick={e=>{props.dispatch(updateUserSignOut());props.dispatch(toggleShowSignOutModal())}}>
              Sign Out
              {/* {props.dispatch(toggleAuthentication())} */}
            </Link>

        </Nav>
          : 
        //  b4 Login 
        <Nav>
            <Link to='/signIn' style={urlLinkPadding}>Sign In </Link>
            <Link to='/signUp' style={urlLinkPadding}>Sign Up </Link>
        </Nav>
        }
      </Navbar.Collapse>
    </Navbar>
  )
}

Header.defaultProps = {
  isAuthenticated: false
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool
}

function mapStateToProps(state){
  return{
    isAuthenticated: state.Authentication.isAuthenticated,
    userId: state.User.userId,
    userName: state.User.userName,
  }
}
export default connect(mapStateToProps)(Header);
