import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/ListGroup";
import NoteListItem from "./NoteListItem";
import AddNoteButton from "./AddNoteButton";
import {connect} from 'react-redux';
import { UserContext } from "../Contexts";
import { setMyNotes } from "../redux/Actions";


function NoteList(props) {
  const {user} = useContext(UserContext);
  const {originalNotes,myNotes, selectedNote, dispatch} = props
  let location = useLocation();
  let history = useHistory();
  /**
   * React hooks
   */
  const initialState = {
    addingNote: false,
    title: ""
  };
  const [state_, setState_] = useState(initialState);

  useEffect(() => {
    // effect
    console.log(`myNotes`, myNotes);
    console.log("user", user);
    const notes = originalNotes.filter(note => note.owner_id == user.id);
    console.log(`myNotes: `, notes);
    props.dispatch(setMyNotes(notes));
    return () => {
      // cleanup
    };
  }, [])

  useEffect(() => {
    // effect

    return () => {
      // cleanup
    };
  }, [])

  /**
   * Helper functions
   */

  /**
   * Function to handle actions for the components
   */
  let toggleAddingNote = () => {
    // => to avoid stale state_
    setState_(state_ => {
      return { ...state_, addingNote: !state_.addingNote };
    });
  };
  // functions that handle interaction with Firebase
  // let deleteNote = note => deleteNote(note);
  // let selectNote = (n, i) => selectNote(n, i);
  let setTitle = str => {
    // => to avoid stale state_
    setState_(state_ => {
      return { ...state_, title: str };
    });
  };

  function checkNote(notes) {
    if (notes) {
      if (notes.length > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  let displayNoteList = notes => {
    // console.log("notes in notelist: ", notes);
    return notes.map((note_, index) => {
      return (
        <NoteListItem
          note_={note_}
        />
      );
    });
  };

  /**
   * Return to render
   */
  return (
    <ListGroup variant="flush">
      {props.management ? 
      <ListGroup.Item variant="primary">List of Note</ListGroup.Item>
      :
      <AddNoteButton 
        title = {state_.title}
        addingNote = {state_.addingNote}
        setTitle = {setTitle}
        toggleAddingNote = {toggleAddingNote}
      />
      }
      {checkNote(myNotes) ? displayNoteList(myNotes) : null}
    </ListGroup>
  );
}

NoteList.propTypes = {
  notes: PropTypes.array,
  management: PropTypes.bool
};

NoteList.defaultProps = {
  management: false
};
function mapStateToProps(state) {
  return {
    originalNotes: state.originalNotes,
    myNotes: state.myNotes,
    selectedNote: state.selectedNote,
  };
}
export default connect(mapStateToProps)(NoteList);
