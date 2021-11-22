// import _ from 'lodash';
import { cloneDeep } from 'lodash';

export const GET_ALL_PAGES = 'GET_ALL_PAGES';
export const GET_MY_PAGES = 'GET_MY_PAGES';
export const CREATE_PAGE = 'CREATE_PAGE';
export const DELET_PAGE = 'DELET_PAGE';
export const UPDATE_PAGE_BODY = 'UPDATE_PAGE_BODY';
export const UPDATE_PAGE_TITLE = 'UPDATE_PAGE_TITLE';
export const SET_SELECTED_NOTE = 'SET_SELECTED_NOTE';
export const SET_MY_NOTES = 'SET_MY_NOTES';
export const PROPOGATE_LOCAL_TITLE = 'PROPOGATE_LOCAL_TITLE';

const initialState = {
  originalNotes: [],
  myNotes: [],
  selectedNote: null,
  // tempplate of a note
  // {
  //   id: null,
  //   title: 'UntitleNote',
  //   body: 'initial body',
  //   owner: {},
  //   contributors: [],
  // },
  proposedNotes: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_PAGES:
      return {
        ...state,
        originalNotes: action.payload,
      };
    case GET_MY_PAGES:
      return {
        ...state,
        myNotes: action.payload,
      };
    case SET_SELECTED_NOTE:
      return {
        ...state,
        selectedNote: action.payload,
      };
    case CREATE_PAGE:
      let cloneMyNotes = cloneDeep(state.myNotes);
      cloneMyNotes.push(action.payload);
      let cloneOriginalNotes = cloneDeep(state.originalNotes);
      cloneOriginalNotes.push(action.payload);
      return {
        ...state,
        myNotes: cloneMyNotes,
        originalNotes: cloneOriginalNotes,
      };
    case SET_MY_NOTES:
      return {
        ...state,
        myNotes: action.payload,
      };

    case PROPOGATE_LOCAL_TITLE:
      // const { resultMyNotes, resultOriginalNotes } = cloneDeep(action.payload);
      //console.log("resultMyNotes", cloneDeep(action.payload));
      return {
        ...state,
        myNotes: action.payload.resultMyNotes,
        originalNote: action.payload.resultOriginalNotes,
      };

    case DELET_PAGE:
      // const { resultMyNotes, resultOriginalNotes } = cloneDeep(action.payload);
      //console.log("resultMyNotes", cloneDeep(action.payload));
      return {
        ...state,
        myNotes: action.payload.resultMyNotes,
        originalNote: action.payload.resultOriginalNotes,
      };
    case UPDATE_PAGE_BODY:
      return {
        ...state,
      };
    case UPDATE_PAGE_BODY:
      return {
        ...state,
      };
    default:
      // throw new Error("Unexpected action");
      console.error('Unexpected action');
      return state;
  }
}
