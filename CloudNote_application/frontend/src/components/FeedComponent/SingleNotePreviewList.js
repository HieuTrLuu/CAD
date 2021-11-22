import React, { useEffect } from "react";
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import {connect} from 'react-redux';
import { setSelectedNote } from "../../redux/Actions";
import Divider from '@material-ui/core/Divider';
import Row from 'react-bootstrap/Row';
function SingleNotePreviewList(props) {
  let { note_ } = props;
  let noteLink = "/notes/" + note_.id;
  return (
    <div>
      {/* <Row> */}
      <Avatar>User</Avatar>
      <p>Owner: {note_.owner_email}</p>
      <p>Title: {note_.title}</p>  
      <Button variant="outlined" color="primary" onClick={e=>{
          console.log("change selected note");
          props.dispatch(setSelectedNote(note_.id))
      }}>
        <Link to={noteLink}>View Note</Link>
      
      </Button>
      {/* </Row> */}
      <Divider variant="middle" />
    </div>
  );
}

function mapStateToProps(state){
    return{
    //   originalNotes: state.originalNotes,
    //   myNotes: state.myNotes,
    //   selectedNote: state.selectedNote
    }
  }
export default connect(mapStateToProps)(SingleNotePreviewList);