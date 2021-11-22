import React, { useContext } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import DeleteIcon from "@material-ui/icons/Delete";
import {connect} from 'react-redux';
import { setSelectedNote, deleteNote } from "../redux/Actions";
import { UserContext} from "../Contexts";

function NoteListItem(props) {
  const {user, setUser} = useContext(UserContext);
  let deleteNote_ = (note) => {
    if(window.confirm(`Are you sure you want to delete: ${note.title}`)) {
      props.dispatch(deleteNote(note.id, user.id));
      // props.dispatch(setSelectedNote(props.myNotes[1].id));
    }
  }

  return (
    <ListGroup.Item
      action
      onClick={() => {
        // props.selectNote(props.note_, props.index_);
        props.dispatch(setSelectedNote(props.note_.id));
      }}
    >
      {props.note_.title}
      <DeleteIcon onClick={() => deleteNote_(props.note_)}></DeleteIcon>
    </ListGroup.Item>
    
    );
}

function mapStateToProps(state) {
  return {
    // originalNotes: state.originalNotes,
    myNotes: state.myNotes,
    selectedNote: state.selectedNote,
  };
}
export default connect(mapStateToProps)(NoteListItem);

