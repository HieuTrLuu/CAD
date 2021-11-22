import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import Header from './components/layout/Header'
import './App.css';
import Footer from './components/layout/Footer';
import SimpleContainer from './components/SimpleContainer';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import SignIn from './components/forms/SignIn';
import SignUp from './components/forms/SignUp';
import PrivateRoute from './util/PrivateRoute'
import UserProfile from './components/profile/UserProfile'
import NoMatch from './util/NoMatch';
// import * as signalR from '@microsoft/signalr';


function App() {
  let apiBaseUrl = 'http://localhost:7071';

// const connect = () =>{
  
//   const connection = new signalR.HubConnectionBuilder().withUrl(`${apiBaseUrl}/api`)
//     .build();
//     connection.on('chat', newMessage=>{
//       console.log(`new message from signalR ${newMessage}`);
//     });
//     connection.onclose(() => console.log('disconnected'));

//     console.log('connecting...');
//     connection.start()
//       .then(() => data.ready = true)
//       .catch(console.error);
// }
  const [data, setdata] = useState({})
  // connect();
  return (
    <Router>
    <Header />
      <Switch>
        <Route exact path="/">
          <div className="App">
            <SimpleContainer />
            
          </div>
        </Route>

        <Route path="/signIn">
          <SignIn/>
        </Route>

        <Route path="/signUp">
          <SignUp/>
        </Route>

        <PrivateRoute exact path="/userProfile/:userName">
          <UserProfile/>
        </PrivateRoute>

        <PrivateRoute exact path="/feeds">
          <SimpleContainer />
        </PrivateRoute>

        <PrivateRoute exact path="/signOut">
          <SimpleContainer />
        </PrivateRoute>

        <Route path="*">
          <NoMatch/>
        </Route>

      </Switch>
      <Footer/>
    </Router>
    
  );
}

export default App;
