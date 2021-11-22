import React, {useContext, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import { addNotes } from '../redux/Actions';
import uuidv1 from "uuid";
import {UserContext} from "../Contexts";
function AddNoteButton(props) {
  const {user, setUser} = useContext(UserContext);
  const [title, setTitle] = useState("")
  return [
    <ListGroup.Item action onClick={props.toggleAddingNote} variant="primary">
      {props.addingNote ? 'Cancel' : 'New Note'}
    </ListGroup.Item>,
    <div>
      {props.addingNote ? (
        <div>
          <Form>
            <Form.Control
              placeholder="Enter note title"
              value={title}
              // onChange={e => props.setTitle(e.nativeEvent.target.value.trim())}
              onChange={ e => setTitle(e.nativeEvent.target.value.trim())}
            />
            <Button variant="primary" type="button" onClick={e => {
              console.log("title:" , e.nativeEvent.target.value.trim())
              props.dispatch(addNotes(user.id, user.email, uuidv1(), title))
              setTitle("");
              }}>
              Submit
            </Button>
          </Form>
        </div>
      ) : null}
    </div>,
  ];
}

function mapStateToProps(state) {
  return {
    originalNotes: state.originalNotes,
    myNotes: state.myNotes,
    selectedNote: state.selectedNote,
  };
}
export default connect(mapStateToProps)(AddNoteButton);
