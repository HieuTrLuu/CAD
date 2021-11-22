import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import {mediumMargin, smallMargin} from '../../util/cssVar';
import {setFollowingStatus, getUserByUserName, getUserById} from '../../util/rest';
import {connect} from 'react-redux';
import { updateUser, updateUserFollowings } from '../../redux/Actions';



function FollowButton(props){
    //isFollowing is relative to the user profile that you are viewing
    const [isFollowing, setIsFollowing] = useState(false);


    useEffect(() => {
        // effect
        getUserById(props.currentUserId).then(res =>
            props.dispatch(updateUser(res[0]))
        );
        return () => {
            // cleanup
        };
    }, [isFollowing])

    useEffect(() => {
        //check if the view user id is in the current user followings list
        props.currentUserFollowingList.filter(e=> e == props.viewUser.id).length>0 ? setIsFollowing(true) : setIsFollowing(false)
        console.log(`isFollowing = ${isFollowing}`);

        return () => {
            // cleanup
        };
    }, [props.viewUser]);
    
    let toogleState = () =>{
        console.log()
        const bool = isFollowing;
        setIsFollowing(!bool);
    }
    let handleClick = ()=>{
        
        setFollowingStatus(props.email, props.email2Follow, !isFollowing);
        // props.dispatch(updateUserFollowings(props.viewUser.userId));
        toogleState();
        // console.log(`isFolowin ${isFollowing}`);
    }

    let label;
    isFollowing ? label='Following' : label='Follow';
    return(
        <Button onClick = {e=>handleClick()} type='submit' style={mediumMargin}>{label}</Button>
    )
}

FollowButton.defaultProps ={
}
function mapStateToProps(state){
    return{
        currentUserId: state.User.userId,
        currentUserFollowingList: state.User.followings,
        viewUser: state.UserProfile,
        currentEmail: state.User.email,
      }
}

export default connect(mapStateToProps)(FollowButton);

// function mapStateToProps(state) {
//     return {
//         isAuthenticated: state.Authentication.isAuthenticated,
//         isSignIn: state.Authentication.isSignIn,
//         currentUserName: state.User.userName,
//         currentEmail: state.User.email,
//         user: state.UserProfile
//     }
// }

{/* <FollowButton user={props.viewUser} viewId={props.viewUser.id} email={props.currentEmail} email2Follow={props.viewUser.email} /> : null} */}

// useEffect(() => {
//     // effect

//     return () => {
//         // cleanup
//     };
// }, [])