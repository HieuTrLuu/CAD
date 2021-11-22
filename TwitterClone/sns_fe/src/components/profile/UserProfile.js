import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FollowPanel from '../FollowPanel';
import TwitPagination from '../TwitPagination';
import Modal from 'react-bootstrap/Modal';
import { toggleAuthentication, toggleSignIn } from '../../redux/Actions';
import { smallMargin, mediumMargin } from '../../util/cssVar';
import AvatarComponent from './AvatarComponent';
import TwitListDisplay from '../ShowTwitComponent/TwitListDisplay'
import FollowButton from './FollowButton'
import { getUserByUserName } from '../../util/rest';
import { updateUserProfile } from '../../redux/Actions';

function UserProfile(props) {
    let handleCloseModal = () => {
        // props.dispatch(toggleAuthentication());
        // props.dispatch(toggleSignIn());
    };

    let handleFollowButton = () => {

    };
    let { userName } = useParams();

    useEffect(() => {
        // effect
        // console.log('param =' + userName)
        getUserByUserName(userName).then(res => {
            // console.log(`res in user profile = ${JSON.stringify(res[0])}`);
            props.dispatch(updateUserProfile(res[0]));
        })
        return () => {
            // cleanup
        };
    }, [userName]);

    return (
        <main style={{ 'fontSize': '14px' }}>
            <Container fluid style={{ width: '90%' }}>
                <Row>
                    <Col className='leftPanel' md={2}>
                        <AvatarComponent user={props.user} />
                        {/* {console.log(`userId = ${JSON.stringify(user)}` )} */}

                        {props.currentUserName != userName ? <FollowButton user={props.user} viewId={props.user.id} email={props.currentEmail} email2Follow={props.user.email} /> : null}
                    </Col>
                    <Col className='mainPanel' md={8}>
                        {/* {console.log(`userId = ${user.id}` )} */}


                        <TwitListDisplay userId={props.user.id} isFeed={false} />
                    </Col>
                    <Col className='rightPanel' md={2}>
                        <FollowPanel user={props.user} />
                    </Col>
                </Row>
            </Container>

            < Modal show={props.isSignIn && props.isAuthenticated}
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
    )
}

UserProfile.defaultProps = {
    userName: '1'
}
function mapStateToProps(state) {
    return {
        isAuthenticated: state.Authentication.isAuthenticated,
        isSignIn: state.Authentication.isSignIn,
        currentUserName: state.User.userName,
        currentEmail: state.User.email,
        user: state.UserProfile
    }
}
export default connect(mapStateToProps)(UserProfile);