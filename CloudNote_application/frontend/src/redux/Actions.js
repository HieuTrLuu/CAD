import axios from 'axios';
import {
  CREATE_PAGE,
  DELET_PAGE,
  GET_ALL_PAGES,
  PROPOGATE_LOCAL_TITLE,
  SET_MY_NOTES,
  SET_SELECTED_NOTE,
} from './reducers/index';
import {backendURL} from '../utils/helper';
import * as firebase from 'firebase';

export function getAllPages() {
  return function(dispatch, getState) {
    return axios
      .get(`${backendURL}/api/getAllPages`)
      .then(function(response) {
        // handle success
        // convert page_id to id
        const notes = response.data.result.map(note_ => {
          var temp_id = note_.page_id; // or data['oldKey']
          note_.id = temp_id;

          delete note_.page_id;
          delete note_.content;
          return note_;
        });
        // //console.log("fetched all notes", notes);
        //   setOriginalNotes(originalNotes=> {return {...originalNotes, notes: notes }});
        dispatch({
          type: GET_ALL_PAGES,
          payload: notes,
        });
        return notes;
      })
      .catch(function(error) {
        // handle error
        //console.log('error form rest API', error);
      })
      .finally(function() {
        // always executed
      });
  };
}

export function setMyNotes(notes) {
  return function(dispatch, getState) {
    // //console.log("action", setMyNotes);
    // //console.log("payload", notes);
    dispatch({
      type: SET_MY_NOTES,
      payload: notes,
    });
  };
}

export function updateLocalTitle(id, title) {
  return function(dispatch, getState) {
    // let selectedNote = getState().selectedNote.title
    let resultMyNotes = getState().myNotes.map(note =>
      note.id == id ? { ...note, title: title } : note,
    );
    let resultOriginalNotes = getState().originalNotes.map(note =>
      note.id == id ? { ...note, title: title } : note,
    );

    dispatch({
      type: PROPOGATE_LOCAL_TITLE,
      payload: { resultMyNotes, resultOriginalNotes },
    });
  };
}

export function updateTitleSQL(owner_id, page_id, title) {
  return axios
    .post(`${backendURL}/api/updateNoteTitle`, {
      owner_id: owner_id,
      page_id: page_id,
      title: title,
    })
    .then(function(response) {
      // console.log("response from rest api, response");
    })
    .catch(function(error) {
      // handle error
      // console.log("error form rest API", error);
    })
    .finally(function() {
      // always executed
    });
}

export function deleteNote(page_id, owner_id) {
  return function(dispatch, getState) {
    return axios
      .post(`${backendURL}/api/deletePage`, {
        owner_id: owner_id,
        page_id: page_id,
      })
      .then(function(response) {
        // console.log("response from rest api, response");
        let resultMyNotes = getState().myNotes.filter(note => !(note.id == page_id && note.owner_id == owner_id) );
        let resultOriginalNotes = getState().originalNotes.filter(note => !(note.id == page_id && note.owner_id == owner_id));
        dispatch({
          type: DELET_PAGE,
          payload: { resultMyNotes, resultOriginalNotes },
        });
      })
      .catch(function(error) {
        // handle error
        // console.log("error form rest API", error);
      })
      .finally(function() {
        // always executed
      });
  };
}

export function setSelectedNote(id) {
  return function(dispatch, getState) {
    firebase
      .database()
      .ref('/notes/' + id)
      .once('value');

    readNoteFromFireBase(id).then(function(snapshot) {
      //console.log("res", snapshot.val());
      const note = snapshot.val();
      if(!note){
        //Added incase snapshot.val() is null, happens when selecting note in notelist
        dispatch({
          type: SET_SELECTED_NOTE,
          payload: getState().originalNotes.filter(note => note.id === id)[0]
        })
      }else {
        dispatch({
          type: SET_SELECTED_NOTE,
          payload: note,
        });
      }
    });
  };
}

export function readNoteFromFireBase(id) {
  console.log(`readNoteFromFireBase is triggered for note ${id}`);
  return firebase
      .database()
      .ref('/notes/' + id)
      .once('value');
}

export function addNotes(owner_id, owner_email, page_id, title) {
  return function(dispatch, getState) {
    return axios
      .post(`${backendURL}/api/createPage`, {
        owner_id: owner_id,
        owner_email: owner_email,
        page_id: page_id,
        title: title,
      })
      .then(function(response) {
        const note = {
          id: page_id,
          title: title,
          body: '',
        };
        return firebase
          .database()
          .ref('/notes/' + page_id)
          .set(note, function(error) {
            if (error) {
              // The write failed...
            } else {
              // Data saved successfully!
              dispatch({
                type: CREATE_PAGE,
                payload: note,
              });
            }
          });
      })
      .catch(function(error) {
        // handle error
        console.log('error form rest API', error);
      })
      .finally(function() {
        // always executed
      });
  };
}
