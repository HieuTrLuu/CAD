import React, {useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FollowPanel from './FollowPanel';
import TrendingPanel from './TrendingPanel';
import TwitSubmit from './forms/TwitSubmit';
import TwitPagination from './TwitPagination';
import {connect} from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import TwitListDisplay from './ShowTwitComponent/TwitListDisplay'
import { toggleAuthentication} from '../redux/Actions';
import {updateUserProfileNull} from '../redux/Actions';

function SimpleContainer(props) {
  useEffect(() => {
    // effect
    props.dispatch(updateUserProfileNull());
    return () => {
      // cleanup
    };
  }, [])
  let handleCloseModal = () => {
    props.dispatch(toggleAuthentication());
    // props.dispatch(toggleSignIn());
  }
  return (
    <main style={{'fontSize': '14px'}}>
      <Container fluid style={{width: '90%'}}>
        <Row>
          <Col className='leftPanel'> <FollowPanel user={props.user}/> </Col>
          <Col className='mainPanel' xs={8}>
            <TwitSubmit/>
            <TwitListDisplay/>
          </Col>
          <Col className='rightPanel'><TrendingPanel/></Col>
        </Row>
      </Container>

      < Modal show={props.isAuthenticated && props.showSignOutModal} 
            onHide={handleCloseModal} //This throws a wierd error that it need to be pass as a variable not a function ?? or it will be recurse too many times ???
            >
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
                You have sign out of The real SNS
            </Modal.Body>
      </Modal>
    </main>
  );
}

function mapStateToProps(state){
  return{
    isAuthenticated: state.Authentication.isAuthenticated,
    showSignOutModal: state.Authentication.showSignOutModal,
    // isSignIn: state.Authentication.isSignIn,
    userId: state.User.userId,
    user: state.User
  }
}

export default connect(mapStateToProps)(SimpleContainer);