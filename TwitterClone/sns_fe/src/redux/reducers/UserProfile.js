import {UPDATE_USER_PROFILE,NULL_USER_PROFILE} from '../ActionTypes';

export const userProfileInitialState = {
    "email": "",
    "userName": "",
    "pass": "",
    "imgURL": "https://comp3207studentweb.blob.core.windows.net/img/default-user-icon-4.jpg",
    "followers": [],
    "followings": [],
    "userId": "",
};

export default function (state = userProfileInitialState, action) {
    // console.log(`dispatch action type = ${action.type}`)
    switch (action.type) {
        case UPDATE_USER_PROFILE: {
            let bufferUser = JSON.parse(JSON.stringify(action.payload));
            return {
                ...bufferUser,
                userId: bufferUser.id
            };
        }
        case NULL_USER_PROFILE: {
            // let bufferUser = JSON.parser(JSON.stringify(action.payload));
            // return action.payload;
            return userProfileInitialState;
        }
        default:
            return state;

    }
}