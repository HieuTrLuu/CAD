import React, {useState, useEffect, useContext} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { Container } from "@material-ui/core";
import PreviewList from "./PreviewList";
import Tags from "../Tags";
import Banner from "../Banner";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {connect} from 'react-redux';
import { getAllPages } from "../../redux/Actions";
import axios from "axios";
import {GET_ALL_PAGES} from "../../redux/reducers/index";
import {backendURL} from "../../utils/helper";



function Feed(props){
  const [value, setValue] = useState(0);
  const [state, setstate] = useState({});
  // The chip tag will be fetched from backend and replace this sample code
  const [selectedChip, setSelectedChip ] = useState({});
  const [chipData, setChipData] = useState([]);
  
  //Call 1 time at initial render 
  useEffect(() => {
    // effect
    props.dispatch(getAllPages()).then(res => {
      }).catch(err=>{
      alert(err);
    });

    return () => {
      // cleanup
      axios.CancelToken.source().cancel('Feed Component unmounted.')
    };
  }, [])

  useEffect(() => {

  },[])




  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // const {notes, notesWithTag} = props;



  return (
    <div>
    <Banner/>
  
    <Container>
      <Row>
    <Col xs={9}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Global Feed" />
        {
          selectedChip ? <Tab label={selectedChip.label}/> : null
        }
        
      </Tabs>
      <TabPanel value={value} index={0}>
          <PreviewList notes={props.originalNotes}></PreviewList>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <p>List of note with tag {selectedChip.label}</p>
        {/* <PreviewList notes={notesWithTag}></PreviewList> */}
      </TabPanel>
      </Col>

      <Col xs={3}>
      <Tags chipData={chipData} setChipData ={setChipData} selectedChip={selectedChip} setSelectedChip={setSelectedChip} value ={value} setValue ={setValue}/>
      </Col>
      </Row>
    </Container>

    
    </div>
  );
}
function mapStateToProps(state){
  return{
    originalNotes: state.originalNotes
  }
}
export default connect(mapStateToProps)(Feed);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return <div>{value === index && <Box p={3}>{children}</Box>}</div>;
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
