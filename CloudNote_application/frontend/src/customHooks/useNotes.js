import { useState, useEffect, useContext } from "react";
import { NoteContext, UserContext, MyNoteContext } from "../Contexts";
import axios from "axios";
import uuidv1 from "uuid";
import {backendURL} from "../utils/helper";
/*
* Logic of talking to the backend for basic CRUD operations of notes
*/
export default function useNotes(firebase) {
  const {originalNotes, setOriginalNotes} = useContext(NoteContext);
  const {user} = useContext(UserContext);
  
  useEffect(() => {
    // effect
    return () => {
      // cleanup
    };
  }, [])

  // Helpers functions to update notes data
  let selectNote = (note, index) =>{
    return setOriginalNotes(originalNotes => {
      // console.log("note list in select Note: ", originalNotes);
      return { ...originalNotes, selectedNoteId: index, selectedNote: note };
    });
  }

  let selectNoteById = (id) =>{
    const note_ = originalNotes.notes.find(elt => elt.id ==id);
    // console.log(note_)

    selectNote(note_,id);
  }

  
  let newNote = async title => {
    if(!title){
      title = "Untitled Note"
    }
    const newNoteIndex = uuidv1();
    console.log("user in new notes", user);
    const note = {
      title: title,
      body: "",
      owner: user,
      contributors: [],
      id: newNoteIndex
    };
  }


  let noteUpdate = (id, noteObj) => {
    // console.log('update in firebase ', id, noteObj);
    var database = firebase.database();
    if(noteObj.title){
      var noteContentRef = database.ref(`notes/${id}`);
      noteContentRef.set({
        title:noteObj.title,
        body: noteObj.body
      })
    }else{

      var noteContentRef = database.ref(`notes/${id}/body`);
      //In this case noteObj is just a string
      noteContentRef.set(noteObj, () => console.log("set note ", id, "to ", noteObj));
    }
  }

  let deleteNote = async note => {
    let tempSelectedNote = {
      body: null,
      title: null,
      tags: [],
      id: null,
      theme: "snow"
    };
    const noteIndex = originalNotes.notes.indexOf(note);
    await setOriginalNotes(originalNotes => {return {
      notes: originalNotes.notes.filter(_note => _note !== note)
    }});
    if (originalNotes.selectedNoteId === noteIndex) {
      setOriginalNotes(originalNotes => {return{ ...originalNotes, selectedNoteId: null, selectedNote: tempSelectedNote }});
    } else {
      // originalNotes.notes.length > 1
      //   ? selectNote(
      //       originalNotes.notes[originalNotes.selectedNoteId - 1],
      //       originalNotes.selectedNoteId - 1
      //     )
      setOriginalNotes(originalNotes => {return{ ...originalNotes, selectedNoteId: null, selectedNote: tempSelectedNote }});
    }
  }
  // let noteUpdate = (id, noteObj) => {
  //   axios.post(`${backendURL}/api/updateNoteContent`,{
  //     owner_id : user.id,
  //     page_id : id,
  //     content : noteObj.body
  //   })
  // }



  return {
    originalNotes, setOriginalNotes, noteUpdate, selectNote, selectNoteById
    // newNote,
    // deleteNote,
  }
}
