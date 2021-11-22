import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

function Footer() {
    return (
        <Navbar collapseOnSelect fixed="bottom" expand="lg" bg="dark" variant="dark">
            <Navbar.Brand className='mx-auto' href="#">Created with love for COMP3207</Navbar.Brand>
        </Navbar>
    )
}

export default Footer;
