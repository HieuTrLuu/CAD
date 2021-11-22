import React, {useEffect, useContext, useState} from "react";
import {useParams} from "react-router-dom";
import {UserContext} from "../Contexts";


function UserProfile(props) {
    const {user, setUser} = useContext(UserContext);
    let {email} = useParams();
    const [displayUser, setDisplayUser] = useState(email ? {email} : user);




    //own profile : other users profile
    return (
        <div>
            {console.log("user : ", JSON.stringify(displayUser))}
            <center><h2>User email: {displayUser.email} </h2></center>
        </div>
    );
}

export default UserProfile;
