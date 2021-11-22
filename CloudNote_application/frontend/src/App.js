import React, {useState, useMemo, useEffect } from "react";
import Header from "./components/layout/Header";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {connect} from "react-redux";
import SignIn from "./components/forms/SignIn";
import PrivateRoute from './components/routings/PrivateRoute'
import NoMatch from "./components/routings/NoMatch";
import PersonalNote from "./components/PersonalNote";
import UserProfile from "./components/UserProfile";
import NoteManagement from "./components/NoteManagement";
import { UserContext, initialUserContext, NoteContext, initialChangeContext, ChangeContext, MyNoteContext, TagsContext, initialNoteContext } from "./Contexts";
import Feed from "./components/FeedComponent";
import GuestEditor from "./components/GuestEditor";
import { getAllPages } from "./redux/Actions";
import axios from "axios";

function App(props) {
  let firebase = props.firebase;
  // Set up users and note contexts that can be access in any components
  const [user, setUser] = useState(initialUserContext);
  const userProvider = useMemo(() =>({user, setUser}), [user, setUser]);
  // const userProvider ={user, setUser};
  
  // originalNotes = the notes. I know stupid naming sorry for that
  const [originalNotes, setOriginalNotes] = useState(initialNoteContext);
  const noteProvider = useMemo(() => ({ originalNotes, setOriginalNotes }), [originalNotes, setOriginalNotes]);
  // const noteProvider = { originalNotes, setOrigina    tChanges }), [changes, setChanges]);


  // originalNotes = the notes. I know stupid naming sorry for that
  const [myNotes, setMyNotes] = useState(initialNoteContext);
  const myNoteProvider = useMemo(() => ({ myNotes, setMyNotes }), [originalNotes, setOriginalNotes]);

  const [guestNotes, setGuestNotes] = useState(initialNoteContext);
  const guestNoteProvider = useMemo(() => ({guestNotes, setGuestNotes }), [guestNotes, setGuestNotes]);


  const [changes, setChanges] = useState(initialChangeContext);
  const changeProvider = useMemo(() => ({changes, setChanges}), [changes, setChanges]);


  const [tags, setTags] = useState([]);
  const tagsProvider = useMemo(() =>({tags, setTags}), [tags, setTags]);

  //check LocalStorage for user
//check LocalStorage for user
useEffect(() => {
  // effect
  // look up user from local storage
  const local_user = JSON.parse(window.localStorage.getItem('user'));
  if(local_user){
    setUser(local_user);
    let start = async () => {props.dispatch(getAllPages()).then(res => {
      const myNotes = props.originalNotes.filter(note => note.owner_id == user.id);
      // props.dispatch(setMyNotes(myNotes));
    }).catch(err=>{
      // alert(err);
    })}
  }   
  return () => {
    // cleanup
    // axios.CancelToken.source().cancel('App Component unmounted.');
  }
}, []);
  //return render
  return (

    <NoteContext.Provider value={noteProvider}>
    <MyNoteContext.Provider value={{myNotes, setMyNotes}}>
    <TagsContext.Provider value={{tags, setTags}}>
    <UserContext.Provider value={userProvider}>
    <ChangeContext.Provider value={changeProvider}>
      {/* {console.log("notes: ",originalNotes.notes)} */}
      <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          {/* <Feed notes={originalNotes} notesWithTag={originalNotes}/> */}
          <Feed firebase={firebase}/>
          {/* <p>This is the home page with uneditable editor </p> */}
          {/* <Editor firebase = {firebase} readOnly={true}/> */}
        </Route>

        <Route exact path="/user">
          <p>User Profile</p>
        </Route>

        <PrivateRoute exact path="/userProfile/:email">
          {/* <CustomForm/> */}
          <UserProfile/>
        </PrivateRoute>
        <PrivateRoute exact path="/userProfile">
          {/* <CustomForm/> */}
          <UserProfile/>
        </PrivateRoute>

        <PrivateRoute exact path="/notes">
          <PersonalNote
          firebase = {firebase}
          />
        </PrivateRoute>

        <PrivateRoute exact path="/notes/:noteId">
          <GuestEditor />
        </PrivateRoute>

        <PrivateRoute exact path="/management">
          <NoteManagement
          firebase = {firebase}          
          />
        </PrivateRoute>
        
        <Route path="/signin">
          <SignIn />
        </Route>

        <Route path="/signup">
          <SignIn isSignUp={true}/>
        </Route>
        
        {/* <PrivateRoute exact path="/signOut">
          <SimpleContainer />
        </PrivateRoute>  */}

        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
    </ChangeContext.Provider>
    </UserContext.Provider>
    </TagsContext.Provider>
    </MyNoteContext.Provider>
    </NoteContext.Provider>
  
  );
}

function mapStateToProps(state){
  return{originalNotes: state.originalNotes,}
}
export default connect(mapStateToProps)(App);
