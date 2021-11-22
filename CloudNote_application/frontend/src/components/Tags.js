import React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
// import useNotes from "../customHooks/useNotes";

// Example component for building Tags
export default function Tags(props) {
  
  
  const handleDelete = chipToDelete => () => {
    setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };

  const handleClick = (data) => {
    console.info("You clicked the Chip.", data.label);
    setSelectedChip(setSelectedChip=>data);
    // set the tab to selected tag
    setValue(1);
  };

  const {value, setValue, chipData, setChipData, selectedChip, setSelectedChip} = props
  return (
    <Card style={{ backgroundColor: "#eeeeee" }}>
      <CardContent>
      <Typography gutterBottom variant="h5" component="h3">
            Recent/Most popular tags
      </Typography>
        {chipData ? chipData.map(data => {
        return (
          <Chip
            key={data.key}
            label={data.label}
            // onDelete={data.label === 'React' ? undefined : handleDelete(data)}
            clickable	={true}
            onClick={e=> handleClick(data)}
          />
        );
      })
    :
    null}
      </CardContent>
      <CardActions>
      <Paper component="form" >
      <InputBase
        // className={classes.input}
        placeholder="Search Tags"
        inputProps={{ "aria-label": "search google maps" }}
      />
      <IconButton
        type="submit"
        // className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
      </CardActions>
    </Card>
  );
}
