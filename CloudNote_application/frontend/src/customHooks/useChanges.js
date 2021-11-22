import { useEffect, useContext } from "react";
import {ChangeContext, NoteContext, UserContext} from "../Contexts";
import uuidv1 from "uuid";
import axios from "axios";
import useNotes from "./useNotes";
import {backendURL} from "../utils/helper";

/*
* Logic of talking to the backend for basic CRUD operations of changes
*/

export default function useChanges(firebase, selectedNote) {
    const { changes, setChanges } = useContext(ChangeContext);
    const { user } = useContext(UserContext);
    const { originalNotes, noteUpdate } = useNotes(firebase);
    // const { originalNotes } = useContext(NoteContext);
    // const { notes, selectedNote, selectedNoteID } = originalNotes;

    console.log("selectedNote at useChanges", selectedNote)

    useEffect(() => {
        // effect
        // console.trace("useEffect start of useChanges")
        // firebase
        //     .firestore()
        //     .collection('changes')
        //     .onSnapshot(serverUpdate => {
        //         console.log("serverUpdate ", serverUpdate);
        //         const _changes = serverUpdate.docs.map(_doc => {
        //             const data = _doc.data();
        //             data['id'] = _doc.id;
        //             return data;
        //         });
        //         setChanges(_changes);
        //     })
        //TODO change to api call
        console.log("note", selectedNote);
        if(selectedNote){
            axios.get(`${backendURL}/api/changes/get`, {
                params: {
                    page_id: selectedNote.id,
                },
            }).then(res => {
                let _changes = res.data.changes.map(_change => {
                    return {
                        id: _change.change_id,
                        noteID: _change.page_id,
                        author: {
                            email: _change.uni_email,
                            userName: _change.username,
                            id: _change.user_id,
                        },
                        body: _change.newBody,
                        timestamp: _change.time,
                    }
                });
                setChanges(_changes);
            }).catch(err => {
                console.log(err);
                alert("An error occurred while fetching changes")
            });
        }
        return () => {
            // cleanup
        };
    }, [selectedNote]);

    // Helpers functions to update notes data
    const getChangesByNoteID = noteID => {

        return changes.filter(change => change.noteID === noteID);
    };

    const locallyRemoveChange = changeID => {
        setChanges(changes.filter(change => change.id !== changeID))
    };

    const approveChange = async change => {
        /**
         * remove change from change list, change body of note to change contents
         */

        console.log(`approving change `, change);


        noteUpdate(change.noteID, change.body)
        // firebase
        //     .database()
        //     .ref(`/notes/${change.noteID}/content`)
        //     .set(change.body, () => {console.log(`change success ${change}`)});

        axios.get(`${backendURL}/api/changes/accept`, {
            params: {
                change_id: change.id,
            },
        }).then(res => {
            //Successful
        }).catch(err => {
            alert("An error occurred while trying to accept the change")
        });

        //noteUpdate with change body
        locallyRemoveChange(change.id);
    };

    const rejectChange = async changeID => {
        /**
         * remove change from change list
         */
        console.log(`rejecting change ${changeID}`);
        axios.get(`${backendURL}/api/changes/accept`, {
            params: {
                change_id: changeID,
            },
        }).then(res => {
            //Successful
        }).catch(err => {
            alert("An error occurred while trying to reject the change")
        });
        locallyRemoveChange(changeID);
    };

    const proposeChange = async (noteID, content) => {
        /**
         * create new change for noteID with content, by user, if not owner/contributor
         */
        console.log(`creating new change for note ${noteID} with content ${content} by user ${user}`);
        //TODO maybe remove uuid bit using one generated from DB
        const change = {
            author_id: user.id,
            page_id: noteID,
            body: content,
            time: new Date().toISOString(),
        };
        axios.post(`${backendURL}/api/changes/propose`, change)
            .then(res => {
                //Successful
            }).catch(err => {
                console.log(err);
                alert("An error occurred when proposing a change")
        });
        // const newChangeEntry = firebase
        //     .firestore()
        //     .collection('changes')
        //     .add({
        //         ...change,
        //         // timestamp: firebase.firestore.FieldValue.serverTimestamp()
        //     });
        // setChanges([...changes, change]);
    };


    return {
        changes, setChanges, getChangesByNoteID, approveChange, rejectChange, proposeChange
    }
}
