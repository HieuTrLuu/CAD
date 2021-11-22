import React, { useContext, useEffect, useMemo, useState } from "react";
import { DialogTitle } from "@material-ui/core";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NoteList from "./NoteList";
import useNotes from "../customHooks/useNotes";
import { Link } from "react-router-dom";
import {
  Button,
  TableCell,
  Table,
  TableRow,
  TableBody,
} from "@material-ui/core";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Timestamp from "react-timestamp";
import { Check, Clear, Add, Delete } from "@material-ui/icons";
import { green } from "@material-ui/core/colors";
import Editor from "./Editor";
import useChanges from "../customHooks/useChanges";
import Dialog from "@material-ui/core/Dialog";
import { backendURL } from "../utils/helper";
import axios from "axios";
import {connect} from "react-redux";
import * as firebase from 'firebase';
/**
 * Going to assume a note has this form, if this is wrong then will convert it
 * Note = {
 *     title : String,
 *     body : String,
 *     owner : User
 *     contributors : Array[User]
 *     proposedChanges : Array[
 *         author : User,
 *         body : String, //might change to be diff
 *         timestamp : String
 *     ]
 * }
 * User = {
 *     email : String,
 *     userName : String,
 * }
 */

function NoteManagement(props) {
  // console.log("props in notemangement: ", props.firebase);
  const { originalNotes, selectedNote,  myNotes} = props;

  const { getChangesByNoteID, approveChange, rejectChange } = useChanges(
    firebase, selectedNote
  );
  const [addContPopupOpen, setAddContPopupOpen] = useState(false);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    if (selectedNote) {
      axios
        .get(`${backendURL}/api/contributors`, {
          params: {
            page_id: selectedNote.id
          }
        })
        .then(res => {
          console.log(
            "contributors",
            res.data.contributors.map(cont => {
              return {
                email: cont.uni_email,
                id: cont.user_id
              };
            })
          );
          setContributors(
            res.data.contributors.map(cont => {
              return {
                email: cont.uni_email,
                id: cont.user_id
              };
            })
          );
        })
        .catch(err => {
          alert("An error occurred when fetching contributor data");
        });
    } else {
      setContributors([]);
    }
  }, [selectedNote]);

  const addContributorOpenHandler = e => {
    e.preventDefault();
    setAddContPopupOpen(true);
  };

  const addContributorCloseHandler = e => {
    e.preventDefault();
    setAddContPopupOpen(false);

    // selectNote(selectedNote, selectedNote.id);
  };

  const deleteContributorCB = userID => e => {
    e.preventDefault();
    console.log("userId", userID);
    axios
      .delete(`${backendURL}/api/contributors/remove`, {
        params: {
          page_id: selectedNote.id,
          user_id: userID
        }
      })
      .then(res => {});

    setContributors(
      contributors.filter(contributor => contributor.id !== userID)
    );
  };

  return (
    // <ChangeContext.Provider value={changesProvider}>
    <Container fluid style={{ width: "100%" }}>
      <Row>
      <Col className="leftPanel">
        <NoteList managment={true} />
      </Col>
      <Col className="mainPanel" xs={10}>

      {selectedNote ? (
        <div>
          <h1>Permissions</h1>
          <h3>Owner</h3>
          <UserLink
            user={{
              email: selectedNote.owner_email,
              id: selectedNote.owner_id
            }}
          />

          <h3>Approved contributors</h3>
          <Button
            variant={"contained"}
            startIcon={<Add />}
            onClick={addContributorOpenHandler}
          >
            Add
          </Button>
          <AddContDialog
            open={addContPopupOpen}
            onClose={addContributorCloseHandler}
            pageID={selectedNote.id}
          />
          {/*TODO button to add contributors*/}
          <UserLinkList
            users={contributors}
            deleteContributorCB={deleteContributorCB}
          />
          {/*<h3>Default</h3> Dont know what default means*/}

          <h1>Proposed changed</h1>
          <ProposedChangesList
            changes={getChangesByNoteID(selectedNote.id)}
            currentNote={selectedNote}
            approveChange={approveChange}
            rejectChange={rejectChange}
            firebase={firebase}
          />
        </div>
      ) : (
        <p>select a note</p>
      )}
      </Col>
      </Row>
    </Container>
    // </ChangeContext.Provider>
  );
}

NoteManagement.defaultProps = {
  userName: ""
};

function AddContDialog(props) {
  const { open, onClose, pageID } = props;

  const submitHandler = async e => {
    e.preventDefault();
    e.persist();
    console.log("e", e);
    let body = {
      page_id: pageID,
      contributor_email: e.target.elements[0].value
    };
    console.log("body", {
      ...body
    });
    await axios
      .get(`${backendURL}/api/contributors/add`, {
        params: {
          ...body
        }
      })
      .then(res => {
        //Successful
        onClose();
        alert("Successfully added contributor");
      })
      .catch(err => {
        console.log("response err", err.response);

        if (!err.response) return;

        let errMes = "";
        if (err.response.status === 409) {
          errMes = `That user is already a contributor`;
        } else if (err.response.status === 412) {
          errMes = `A user by that userName does not exist`;
        } else {
          alert(`An error occurred while attempting to add this contributor`);
          return;
        }
        alert(`Could not add this contributor\n${errMes}`);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add contributor</DialogTitle>
      <form onSubmit={submitHandler}>
        <p>Contributor Name</p>
        <input type="text" />
        <input type="submit" />
      </form>
    </Dialog>
  );
}

function ProposedChangesList(props) {
  const { changes, currentNote, approveChange, rejectChange } = props;
  const [changeListAltered, setChangeListAltered] = useState(false);
  const [expanded, setExpanded] = useState(null); //change.id of the expanded change

  //When a change is approved/rejects, refresh changes list
  useEffect(() => {
    if (changeListAltered) {
      setChangeListAltered(false);
      //Refresh proposed changes list
    }
  }, [changeListAltered]);

  const changeHandler = changeID => (event, newExpanded) => {
    setExpanded(newExpanded ? changeID : false);
  };

  const handleApproval = change => async e => {
    e.stopPropagation();
    await approveChange(change);
    setChangeListAltered(true);
  };
  const handleRejection = changeID => async e => {
    e.stopPropagation();
    await rejectChange(changeID);
    setChangeListAltered(true);
  };

  return changes.length === 0 ? (
    <p>there are no proposed changes for this note</p>
  ) : (
    <div>
      {changes.map(change => (
        <MuiExpansionPanel
          square
          expanded={expanded === change.id}
          onChange={changeHandler(change.id)}
        >
          <MuiExpansionPanelSummary>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <UserLink user={change.author} />
                  </TableCell>
                  <TableCell align={"right"}>
                    <Timestamp date={change.timestamp} />
                  </TableCell>
                  <TableCell align={"right"}>
                    <Button
                      variant={"contained"}
                      style={{ color: green[500] }}
                      startIcon={<Check />}
                      onClick={handleApproval(change)}
                    >
                      Approve
                    </Button>
                  </TableCell>
                  <TableCell align={"right"}>
                    <Button
                      variant={"contained"}
                      color={"secondary"}
                      startIcon={<Clear />}
                      onClick={handleRejection(change.id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </MuiExpansionPanelSummary>
          <MuiExpansionPanelDetails>
            <Editor
              readOnly={true}
              note={{
                body: currentNote.body,
                title: "Current Version",
                id: currentNote.id
              }}
              firebase={props.firebase}
            />
            <Editor
              readOnly={true}
              note={{
                body: change.body,
                title: "Proposed Change",
                id: currentNote.id
              }}
              firebase={props.firebase}
            />
          </MuiExpansionPanelDetails>
        </MuiExpansionPanel>
      ))}
    </div>
  );
}

function UserLinkList(props) {
  const { users, deleteContributorCB } = props;
  let content;
  // console.log("users in user Link list", users);
  if (users) {
    content = (
      <table>
        {users.map(user => (
          <UserLink
            user={{ email: user.email, id: user.id }}
            deleteContributorCB={deleteContributorCB}
          />
        ))}
      </table>
    );
  } else {
    content = <p>no contributors exist for this note</p>;
  }
  return content;
}

/**
 * Links to user profile for the given userName
 * @param props.user = {userName: String, ...other user data}
 * @returns Link to use profile within <p></p>
 */
function UserLink(props) {
  const { user, deleteContributorCB } = props;
  // console.log("at user link ", props);
  // console.log("user=",user," at userlink cb = ", typeof(deleteContributorCB(user.id)))
  return (
    <tr>
      <td>
        <Link to={`/UserProfile/${user.email}`}>
          <p>{user.email}</p>
        </Link>
      </td>
      {deleteContributorCB ? (
        <td>
          <Button
            color={"secondary"}
            startIcon={<Delete />}
            onClick={deleteContributorCB(user.id)}
          />
        </td>
      ) : (
        <div />
      )}
    </tr>
  );
}

function mapStateToProps(state) {
  return {
    originalNotes: state.originalNotes,
    myNotes: state.myNotes,
    selectedNote: state.selectedNote,
  };
}
export default connect(mapStateToProps)(NoteManagement);
