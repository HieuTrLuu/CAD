import { UPDATE_USER, TOGGLE_AUTHENTICATED, TOGGLE_SIGNUP, TOGGLE_SIGNOUT_MODAL, UPDATE_USER_PROFILE, UPDATE_USER_FOLLOWINGS, UPDATE_USER_FOLLOWERS, NULL_USER_PROFILE, UPDATE_USER_SIGNOUT } from './ActionTypes'
import dotenv from 'dotenv';
import { axiosInstance, getUserByUserName, getUserById } from '../util/rest';
import {userProfileInitialState} from '../redux/reducers/UserProfile';
dotenv.config();



export function toggleAuthentication() {
    return function (dispatch, getState) {
        const bool = getState().Authentication.isAuthenticated;
        dispatch({
            type: TOGGLE_AUTHENTICATED,
            payload: !bool
        })
    }
}

export function toggleShowSignOutModal() {
    return function (dispatch, getState) {
        const bool = getState().Authentication.toggleShowSignOutModal
        dispatch({
            type: TOGGLE_SIGNOUT_MODAL,
            payload: !bool
        })
    }
}


export function toggleSignUp() {
    return function (dispatch, getState) {
        const bool = getState().Authentication.isSignUp
        dispatch({
            type: TOGGLE_SIGNUP,
            payload: !bool
        })
    }
}

/**
 * Update the information on the profile page of different user
 * @param {*} user 
 */
export function updateUserProfile(user){
    // console.log('update user profile is called');
    return function (dispatch, getState) {
        const buffer = JSON.parse(JSON.stringify(user))
        dispatch({
            type: UPDATE_USER_PROFILE,
            payload: buffer
        })
    }
}
/*
* Clean up for "updateUserProfile()"
*/
export function updateUserProfileNull(){
    // console.log('update user profile null is called');
    return function (dispatch, getState) {
        const buffer = userProfileInitialState
        dispatch({
            type: NULL_USER_PROFILE,
            payload: buffer
        })
    }
}


export function updateUser(user){
    return function (dispatch, getState) {
        const buffer = JSON.parse(JSON.stringify(user));
        console.log(`the value of updated current user = ${JSON.stringify(buffer)}`)
        dispatch({
            type: UPDATE_USER,
            payload: buffer
        })
    }
}

export function updateUserFollowers(userId){
    // console.log('update user profile is called');
    return function (dispatch, getState) {
        const buffer = userId;
        dispatch({
            type: UPDATE_USER_FOLLOWERS,
            payload: buffer
        })
    }
}

export function updateUserFollowings(userId){
    // console.log('update user profile is called');
    return function (dispatch, getState) {
        const buffer = userId
        dispatch({
            type: UPDATE_USER_FOLLOWINGS,
            payload: buffer
        })
    }
}



/**
 * Clean up current user as they sign out
 */
export function updateUserSignOut(){
    return function (dispatch, getState) {
        dispatch({
            type: UPDATE_USER_SIGNOUT,
        })
    }
}