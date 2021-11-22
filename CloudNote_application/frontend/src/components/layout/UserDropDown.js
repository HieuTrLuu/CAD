import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Link} from "react-router-dom";
import { UserContext } from "../../Contexts";

function UserDropDown(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  //useContext for user 
  const {user, setUser} = useContext(UserContext);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setUser(null);
    window.localStorage.removeItem('user');
    console.log("handle logout fired");
  };

  let userProfileLink = `/userProfile/`;
  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        User
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}><Link to={userProfileLink}>My Profile </Link></MenuItem>
        <MenuItem onClick={handleClose}><Link to='/notes' >My Notes </Link></MenuItem>
        <MenuItem onClick={handleClose}><Link to='/management'>Note Management</Link></MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default UserDropDown;