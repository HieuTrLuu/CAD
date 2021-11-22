import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { smallMargin, mediumMargin } from '../../util/cssVar';


import { Link } from "react-router-dom";

export default function UserSmallDisplay(props) {
    let userProfileLink = '/userProfile/' + props.userName
    return (
        <Container>
            <Card.Img variant="top" style={{ width: '2rem' }} src={props.imgURL} />
            <Card.Text style={{ leftPadding: '2rem' }}><Link to={userProfileLink}> {props.userName} </Link></Card.Text>
        </Container>
    )
}

UserSmallDisplay.defaultProps = {
    imgURL: 'https://comp3207studentweb.blob.core.windows.net/img/default-user-icon-4.jpg'
}