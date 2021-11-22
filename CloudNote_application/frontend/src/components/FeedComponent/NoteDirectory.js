import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import NoteList from "./NoteList";

function NoteDirectory(props) {
    const useStyles = makeStyles({
        root: {
          height: 216,
          flexGrow: 1,
          maxWidth: 400,
        },
      });

    const classes = useStyles();
    const [expanded, setExpanded] = useState([]);

    const handleChange = (event, nodes) => {
        setExpanded(nodes);
    };

    return (
        <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        onNodeToggle={handleChange}
        >
            <TreeItem nodeId="1" label="COMP3207: Cloud App Development">
                <NoteList
                    selectedNoteId={props.selectedNoteId}
                    notes={props.notes}
                    deleteNote={props.deleteNote}
                    selectNote={props.selectNote}
                    newNote={props.newNote}
                />
            </TreeItem>
            
        </TreeView>
    );
}

export default NoteDirectory;
