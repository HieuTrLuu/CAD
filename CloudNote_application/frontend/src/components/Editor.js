import React, { useState, useEffect, useCallback, useContext } from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from '@material-ui/core/Button';
import { updateLocalTitle, updateTitleSQL} from '../redux/Actions';
import { UserContext} from "../Contexts";
import * as firebase from 'firebase';
import {SET_SELECTED_NOTE} from '../redux/reducers';

function Editor(props) {
  const { selectedNote, myNotes, originalNotes, note} = props;
  //  TODO: write function to handle add Tag and remove Tag
  const {user} = useContext(UserContext);
  let initialState = {
    body: '',
    title: '',
    tags: [],
    id: '',
    theme: 'snow',
  };

  const [editorState, setEditorState] = useState(initialState);

  useEffect(() => {
    // effect
    return () => {
      // cleanup
      props.dispatch({
        type: SET_SELECTED_NOTE,
        payload: null,
      });
    };
  }, []);

  useEffect(() => {
    // effect
    if(props.readOnly && note){
      setEditorState({
        ...note,
        theme: 'snow'
      })
      return;
    }
    if (selectedNote && !props.readOnly) {
      setEditorState({
        body: selectedNote.body,
        title: selectedNote.title,
        tags: selectedNote.tags,
        id: selectedNote.id,
        theme: 'snow',
      });

      firebase
        .database()
        .ref(`/notes/${selectedNote.id}`)
        .on('value', function(snapshot) {
          // updateStarCount(postElement, snapshot.val());
          //console.log('on update');
          //console.log(snapshot.val());
          if (snapshot.val()) {
            setEditorState(state => {
              return {
                ...state,
                body: snapshot.val().body,
                title: snapshot.val().title,
              };
            });
          }
        });
    }

    return () => {
      // cleanup
      if (selectedNote && !props.readOnly) {
        firebase
          .database()
          .ref(`/notes/${selectedNote.id}`)
          .off();
      }
    };
  }, [selectedNote]);

  useEffect(() => {
    // effect
    // props.dispatch({})
    //console.log("update to firebase", editorState);
    if(props.readOnly) return;
    if (selectedNote) {
      firebase
        .database()
        .ref(`/notes/${selectedNote.id}`)
        .update({
          title: editorState.title,
          body: editorState.body,
        });
    }
    return () => {
      // cleanup
      if (selectedNote) {
        firebase
          .database()
          .ref(`/notes/${selectedNote.id}`)
          .off();
      }
    };
  }, [editorState]);

  /**
   * helper functions
   */

  let handleSaveNote = () => {};

  let updateBody = val => {
    // //console.log("value", val);
    setEditorState(editorState => {
      return { ...editorState, body: val };
    });
  };

  let updateTitle = event => {
    
    let title = event.nativeEvent.target.value.trim();
    updateTitleSQL(user.id, editorState.id, title)
    try {
      setEditorState(state => {
        return {
          ...state,
          title: title,
        };
      });
      props.dispatch(updateLocalTitle(editorState.id, title));
    } catch (e) {
      console.log('error in update title');
    }
  };

  let updateTags = event => {
    try {
      let txt = event.nativeEvent.target.value.trim();
      let tags = txt.split(';');

      setEditorState(editorState => {
        return { ...editorState, tags: txt };
      });
    } catch (e) {
      //console.log('error in update title');
    }
  };

  //Debounce for update titles
  // let handleupdateTitle = useCallback(debounce(updateTitle, 2000), []);
  let handleupdateBody = useCallback(debounce(updateBody, 2000), []);

  /**
   * Render component
   */
  if (selectedNote || props.readOnly) {
    // //console.log("selected note id", selectedNote.id)
    return (
      <div className="editorContainer" style={{ height: '85vh' }}>
        <Form>
          <Row>
            <Col xs={6}>
              <Form.Control
                placeholder="Note title..."
                onChange={updateTitle}
                //TODO: fix debound on titles
                // onChange={handleupdateTitle}
                value={editorState.title ? editorState.title : ''}
                readOnly={props.readOnly}
              />
            </Col>
            <Col xs={6}>
              <Row>
                <Col>
                  <Form.Control
                    placeholder="Tags...?"
                    onChange={updateTags}
                    //TODO: fix debound on titles
                    // onChange={handleupdateTitle}
                    value={editorState.tags ? editorState.tags : ''}
                    readOnly={props.readOnly}
                  />
                </Col>
                <Col>
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveNote}
                  >
                    Save Note
                  </Button> */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <ReactQuill
          theme="snow"
          value={editorState.body}
          modules={
            props.readOnly
              ? {
                  toolbar: null,
                }
              : Editor.modules
          }
          formats={Editor.formats}
          bounds=".app"
          placeholder={props.placeholder}
          // onChange={val=>{
          //   setEditorState(editorState => {
          //     return { ...editorState, body: val };
          //   });
          // }}
          onChange={handleupdateBody}
          style={{
            height: '100%',
            boxSizing: 'border-box',
          }}
          readOnly={props.readOnly}
        ></ReactQuill>
      </div>
    );
  } else {
    // //console.log("selected note id", originalNotes);
    return null;
  }
}

Editor.propTypes = {
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
};

Editor.defaultProps = {
  placeholder: 'Write smt',
  readOnly: false,
};

/*
 * Decleare Quill editor formats
 * See https://quilljs.com/docs/formats/
 */

Editor.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],

  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

function mapStateToProps(state) {
  return {
    originalNotes: state.originalNotes,
    myNotes: state.myNotes,
    selectedNote: state.selectedNote,
  };
}
export default connect(mapStateToProps)(Editor);
