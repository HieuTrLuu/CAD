import { useState, useEffect, useContext } from "react";
import { MyNoteContext, UserContext, NoteContext } from "../Contexts";
import axios from "axios";
import uuidv1 from "uuid";
import {backendURL} from "../utils/helper";
/*
* Logic of talking to the backend for basic CRUD operations of notes
*/
export default function useMyNotes(firebase) {
//   const {myNotes, setMyNotes} = useContext(NoteContext);
  const {myNotes, setMyNotes} = useContext(MyNoteContext);
  const {originalNotes, setOriginalNotes} = useContext(NoteContext);
  const {user} = useContext(UserContext);
  // const tempURL = "http://localhost:8080";
  

  // fetch note from rest API endpoint at initial render
  useEffect(() => {
    // effect
    // console.log('user id', user.id);
    axios.get(`${backendURL}/api/getUserPages?owner_id=${user.id}`)
    .then(function (response) {
      // handle success
      // convert page_id to id
      const notes = response.data.result.map(note_ =>{
        var temp_id = note_.page_id; // or data['oldKey']
        note_.id = temp_id;
        delete note_.page_id;
        var temp_body = note_.content; // or data['oldKey']
        note_.body = temp_body;
        delete note_.content;
        return note_;
      })
      // console.log("fetched all notes", notes);
      setMyNotes(myNotes=> {return {...myNotes, notes: notes }});
    })
    .catch(function (error) {
      // handle error
      console.log("error form rest API", error);
    })
    .finally(function () {
      // always executed
    });
    return () => {
      // cleanup
    };
  }, [])
  
  let newNote = async title => {
    if(!title){
      title = "untitle note"
    }
    const newNoteIndex = uuidv1();
    // console.log("user in new notes");
    // console.log(user);
    const note = {
      title: title,
      body: "",
      owner_id: user.id,
      contributors: [],
      id: newNoteIndex
    };
    
    // console.log("original notes in create notes: ", myNotes);
    // set local state
    await setMyNotes(myNotes => {return { ...myNotes, notes: [...myNotes.notes, note],
      selectedNote: note,
      selectedNoteId: newNoteIndex
    
    }});
    // set firebase DB

    var noteContentRef = firebase.database().ref(`notes/${newNoteIndex}`).set({
        title:title,
        body:''
    });

    // set SQL DB
    await axios.post(`${backendURL}/api/createPage`,{
      owner_id:user.id,
      owner_email:user.email,
      page_id: newNoteIndex,
      title: title
    })
    .then(function (response) {
      // suppose to set local state here not above
      // console.count("res form createPage");
      // console.log(response.data)
      // setMyNotes(myNotes=> {return {...myNotes, notes: response.data }});
    })
    .catch(function (error) {
      // handle error
      console.log("error form rest API", error);
    })
    .finally(function () {
      // always executed
    });
  };


    let deleteNote = async note => {
    //delete on SQL db
    await axios.post(`${backendURL}/api/deletePage`,{
      owner_id:user.id,
      page_id: note.id,
    })
    .then(function (response) {
      // handle success
      console.count("res form delete pages");
      console.log(response.data)
      // setMyNotes(myNotes=> {return {...myNotes, notes: response.data }});
    })
    .catch(function (error) {
      // handle error
      console.log("error form rest API", error);
    })
    .finally(function () {
      // always executed
    });

    //delete on firebase
    firebase.database().ref(`notes/${note.id}`).remove();

    // delete locally
    let tempSelectedNote = {
      body: null,
      title: null,
      tags: [],
      id: null,
      theme: "snow"
    };
    const noteIndex = myNotes.notes.indexOf(note);
    await setMyNotes(myNotes => {return {
      ...myNotes, selectedNoteId: null, selectedNote: tempSelectedNote, notes: myNotes.notes.filter(_note => _note !== note)
    }});

    await setOriginalNotes(originalNotes => {return {
      ...originalNotes, selectedNoteId: null, selectedNote: tempSelectedNote, notes: originalNotes.notes.filter(_note => _note !== note)
    }});
  };


  return {
    myNotes, setMyNotes, newNote,  deleteNote
    //  , selectNote, selectNoteById, noteUpdate
  }
}
