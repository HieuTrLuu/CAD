import { useState, useEffect, useContext } from "react";
import { TagsContext } from "../Contexts";
import axios from "axios";

export default function useTags(){
    const {originalNotes, setOriginalNotes} = useContext(NoteContext);
    const {user, setUser} = useContext(UserContext);
    const tempURL = "http://localhost:8080";

    let newTags


}