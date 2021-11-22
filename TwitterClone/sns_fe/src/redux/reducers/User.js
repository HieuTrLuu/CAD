import { UPDATE_USER, UPDATE_USER_SIGNOUT, UPDATE_USER_FOLLOWERS, UPDATE_USER_FOLLOWINGS } from '../ActionTypes'
// const initialState = {
//   "userId": "724e30da-dbce-43d9-bf7a-28fbac46a28d",
//   "email": "admin@soton.ac.uk",
//   "userName": "admin",
//   "password": "admin",
//   "type": "admin",
// "followings": [],
//   "imgURL": "https://comp3207studentweb.blob.core.windows.net/img/default-user-icon-4.jpg",
//   "followers": [],
// };

const initialState = {
  "email": "thl1g15@soton.ac.uk",
  "userName": "thl1g15",
  "pass": "thl1g15",
  "followers": [],
  "followings": [],
  "imgURL": "https://comp3207studentweb.blob.core.windows.net/img/default-user-icon-4.jpg",
  "userId": "46130b96-e417-41b9-9a82-f071292567e0",
}

const nullUser = {
  "email": "",
  "userName": "",
  "pass": "",
  "followers": [],
  "followings": [],
  "imgURL": "https://comp3207studentweb.blob.core.windows.net/img/default-user-icon-4.jpg",
  "userId": "",
}
export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER: {
      return {
        ...action.payload,
        userId: action.payload.id
      };
    }
    case UPDATE_USER_SIGNOUT: {
      return nullUser;
    }
    case UPDATE_USER_FOLLOWERS: {
      return {
        ...state,
        followers: action.payload
      }
    }
    case UPDATE_USER_FOLLOWINGS: {
      return {
        ...state,
        followings: action.payload
      }
    }
    default:
      return state;
  }

}