import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function AvatarComponent(props) {
    // console.log(`avatar component props = ${JSON.stringify(props.user)}`);
    // console.log(`avatar component props img URL = ${props.user.imgURL}`)
    return (
        <Card style={{ marginTop: '3%' }}>
            <Card.Header><Card.Img variant="top" style={{ width: '3rem', height: 'auto' }} src={props.user.imgURL} /></Card.Header>
            <Card.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item>{props.user.userName}</ListGroup.Item>
                    <ListGroup.Item>{props.user.email}</ListGroup.Item>
                </ListGroup>
                <Container>
                    {/* <Card.Img variant="top" style={{ height: '10rem', width: 'auto' }} src={props.imgURL} /> */}
                </Container>
            </Card.Body>
        </Card>
    )
}

AvatarComponent.defaultProps = {
    user: {
        userName: 'admin',
        email: 'admin@ecs.soton.ac.uk',
        imgURL: 'https://comp3207studentweb.blob.core.windows.net/img/default-user-icon-4.jpg'
    }
}

AvatarComponent.propTypes = {
    user: PropTypes.object
}
export default AvatarComponent;