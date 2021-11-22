import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Editor from './Editor';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import { getContributor } from './../utils/helper';
import { UserContext } from '../Contexts';
import { connect } from 'react-redux';
import axios from "axios";

function GuestEditor(props) {
  let location = useLocation();
  let history = useHistory();
  const { user } = useContext(UserContext);
  let noteId = location.pathname.split('/').slice(-1)[0];
  const [directEdit, setDirectEdit] = useState(false);
  let { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    // effect
    console.log("call useEffect in GuestEditor");
    console.log("props out : ? ", {props});

    // axios.get(`${backendURL}/api/contributors?page_id=${noteId}`)
    getContributor(noteId)
      .then(res => {
        console.log('data from Guest :', res);
        let isContributor;
        res.data.contributors.find(contributorId => contributorId == user.id)
          ? (isContributor = true)
          : (isContributor = false);
        let isOwner;
        
        console.log("props : ? ", {props});
        const selected = props.originalNotes.find(note => note.id == noteId)
        console.log("selected", selected);
        selected.owner_id == user.id
          ? (isOwner = true)
          : (isOwner = false);
        console.log("checking direct Edit", isOwner, isContributor);
        setDirectEdit(isContributor || isOwner);
      })
      .catch(err => {
        console.log('err in get contributors', err);
      });
    return () => {
      // cleanup
      axios.CancelToken.source().cancel('Guess editor component unmount')
    };
  }, []);

  return (
    <Container fluid style={{ width: '100%' }}>
      <Row>
        <Col className="leftPanel" xs={2}>
          {directEdit ? 
            <p>You are allow to edit this note directly</p> 
              : 
              <div>
            <ProposeButton location = {location}
                            history = {history}/>
            <p>You are not allow to edit this note directly</p> 
            <p>Please make a propose change to owner</p> 
            </div>}
        </Col>
        <Col className="mainPanel" xs={10}>
          <Editor readOnly={!directEdit} style={{ height: '100%' }} />
        </Col>
      </Row>
    </Container>
  );
}

const useStyles = makeStyles(theme => ({
  button: {
    // margin: theme.spacing(1)
  },
}));

function ProposeButton(props) {
  const classes = useStyles();
  const {history, location }= props;
  let { from } = location.state || { from: { pathname: "/" } };
  let handleCreateProposed = ()=>{
    console.log("from ", from);
    history.replace(from);
  }
  return (
    <div>
      <Button
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<CloudUploadIcon />}
        onClick={handleCreateProposed}
      >
        Create a propose Change to Owner
      </Button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    selectedNote: state.selectedNote,
    myNotes: state.myNotes,
    originalNotes: state.originalNotes
  };
}
export default connect(mapStateToProps)(GuestEditor);
