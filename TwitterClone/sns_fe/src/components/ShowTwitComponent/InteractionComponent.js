import React, {useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {connect} from 'react-redux';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { smallMargin } from '../../util/cssVar'



function CustomToggle({ children, eventKey }) {
    const [likeNumber, setLikeNumber] = useState(0);
    const [comments, setComments] = useState([]);

    const decoratedOnClick = useAccordionToggle(eventKey, () =>
      console.log('totally custom!'),
    );
  
    return (
      <Button
        style={smallMargin}
        onClick={decoratedOnClick}
      >
        {children}
      </Button>
    );
}

function InteractionComponent(props){
    return(
        <Accordion>
            <Card border="light">
              <Card.Header>
              <Form.Group as={Row} >
                {props.isAuthenticated ? 
                    <ButtonGroup className="mr-2" aria-label="First group">
                    <CustomToggle eventKey="0">Comments</CustomToggle>
                    <Button style={smallMargin}>Like</Button>
                    </ButtonGroup>
                    :
                    null
                }
                
                <Form.Label column sm="2" style={smallMargin}>
                  Number of likes
            </Form.Label>
            </Form.Group>

              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
    )
}

function mapStateToProps(state){
    return{
      isAuthenticated: state.Authentication.isAuthenticated,
    }
}

export default connect(mapStateToProps)(InteractionComponent);

