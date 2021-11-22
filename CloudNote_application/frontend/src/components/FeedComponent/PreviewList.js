import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Col from "react-bootstrap/Col";
import SingleNotePreviewList from "./SingleNotePreviewList";

const useStyles = makeStyles(theme => ({}));

/*
Component to display list of note as preview that allow user to select link to view individual note
*/
export default function PreviewList(props) {
  const classes = useStyles();
  const { notes } = props;
  
  return (
    <div className={classes.root}>
      {/* <Container> */}
      <Col>
        {/* <p>User: {props.user.email}</p>
        <p>Time Stamp: {props.timeStamp}</p>
        <p>Notes: {JSON.stringify(notes)}</p> */}
        {notes
          ? notes.map(note_ => {
              return <SingleNotePreviewList note_={note_} />;
            })
          : null}
      </Col>
    </div>
  );
}




PreviewList.defaultProps = {
  user: {
    email: "thl1g15@soton.ac.uk"
  },
  timeStamp: "Now"
};
