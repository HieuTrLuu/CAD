import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Editor from "./Editor";
import NoteList from "./NoteList";
// import NoteDirectory from "./NoteDirectory";
import useNotes from "../customHooks/useNotes";

function PersonalNote(props) {
  /**
   * React hooks set up
   */
  let firebase = props.firebase;

  /**
   * return render
   */
  return (
      <Container fluid style={{ width: "100%" }}>
        <Row>
          <Col className="leftPanel" xs={2}>
            <NoteList
              firebase = {firebase}
            />
          </Col>
          <Col className="mainPanel" xs={10}>
            <Editor
                isEditable={true}
                firebase = {firebase}
                style={{ height: "100%" }}
            />
          </Col>
        </Row>
      </Container>
  );
}

export default PersonalNote;
