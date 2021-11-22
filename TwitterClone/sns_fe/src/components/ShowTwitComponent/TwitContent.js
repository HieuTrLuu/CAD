import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import UserSmallDisplay from './UserSmallDisplay';
import PropTypes from 'prop-types';
//TODO: 4 MVP only display text
function TwitContent(props) {
  let bufferString; //conditional string for the style of the card
  props.imgURL == '' ? bufferString='auto' : bufferString='10rem';
  let time = new Date(parseInt(props.time)).toLocaleTimeString();
  let date = new Date(parseInt(props.time)).toLocaleDateString();

  return (
    <Container style ={{marginTop:'1%'}}>
      <Card>
        <Card.Header>
          <UserSmallDisplay userId={props.userId} userName={props.name}
          // TODO include image URL here imgURL={props.imgURL}
          />
        </Card.Header>
        <Card.Body>
          <Card.Title>
            {props.text}
          </Card.Title>
          <small className="text-muted">Posted at {time} {date}</small>
          <Container>
            <Card.Img variant="top" style={{ height: {bufferString}, width: 'auto' }} src={props.imgURL} />
          </Container>
        </Card.Body>
        {/* <Card.Footer className="text-muted">
          <InteractionComponent/>
        </Card.Footer> */}
      </Card>
    </Container>
  );
}

TwitContent.defaultProps = {
  text: `Some quick example text to build on the card title and make up the bulk of the card's content.`,
  imgURL: ``,
  time: ``,
}

TwitContent.propTypes = {

}


export default TwitContent;

// 25227