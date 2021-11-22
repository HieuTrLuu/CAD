import { TOGGLE_AUTHENTICATED, TOGGLE_SIGNUP, TOGGLE_SIGNOUT_MODAL } from '../ActionTypes'
const initialState = {
    isAuthenticated: true,
    showSignOutModal: false,
    showSignUp: false,
};

export default function (state = initialState, action) {
    // console.log(`dispatch action type = ${action.type}`)
    switch (action.type) {
        case TOGGLE_AUTHENTICATED: {
            return {
                ...state,
                isAuthenticated: action.payload
            };
        }
        case TOGGLE_SIGNOUT_MODAL: {
            return {
                ...state,
                showSignOutModal: action.payload
            };
        }
        case TOGGLE_SIGNUP: {
            return {
                ...state,
                isSignUp: action.payload
            };
        }
    default:
        return state;

    }
}