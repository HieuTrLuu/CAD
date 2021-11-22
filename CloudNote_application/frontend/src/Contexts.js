import { createContext } from "react";

export const initialUserContext = null;
// Set up Context/Global variable for React components

export const UserContext = createContext();

export const initialNoteContext = {
  // selectedNoteId: null,
  selectedNote: {
    id:null,
    tags:[],
    owner_id:null,
    owner_email:null,
    contributors:[]
  },
  originalNotes: [],
  myNotes:[],
  tags: [],
};

export const NoteContext = createContext();


/**
 * change : {
 *     id: number,
 *     author: user : {
 *         email: string
 *         userName: string
 *     },
 *     noteID: number,
 *     body: string,
 *     timestamp: string
 * }
 */
export const initialChangeContext = [];


export const ChangeContext = createContext();

export const MyNoteContext = createContext();

export const GuestNoteContext = createContext();

export const TagsContext = createContext();
