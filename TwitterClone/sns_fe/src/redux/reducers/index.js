import { combineReducers } from 'redux';
import Authentication from './Authentication';
import User from './User';
import UserProfile from './UserProfile';

export default combineReducers({
    Authentication, User, UserProfile
})