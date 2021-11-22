import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import { mediumMargin } from '../util/cssVar'
import { connect } from 'react-redux';
import { getUserById } from '../util/rest';
import UserSmallDisplay from './ShowTwitComponent/UserSmallDisplay';

function FollowPanel(props) {

    let displayUserList = list => {
        return list.map((user, index) => {
            // console.log(`list = ${JSON.stringify(user[0])}`)
            if (user)
                // return <ListGroup.Item key={user[0].id}> {user[0].userName}</ListGroup.Item>
                return <ListGroup.Item><UserSmallDisplay userName={user[0].userName}/></ListGroup.Item>
        })

    }
    let getUserList = list_id => {
        return (list_id).map(id => {
            return getUserById(id);
        })
    }
    //list of json contains public infor of users to display their name
    const [followers, setFollower] = useState([]);
    const [followings, setFollowing] = useState([]);

    useEffect(() => {

        console.log(`user = ${props.user.userName}`);

        try {
            // console.log(`user = ${JSON.stringify(props.user)}`)
            // console.log(`length followers = ${props.user.followers.length}`)
            // console.log(`length followings= ${props.user.followings.length}`)
            

            if (props.user.followings.length > 0) {
                Promise.all(getUserList(props.user.followings)).then(res => {
                    setFollowing(res);
                });
            }else{
                setFollowing([]);
            }
            if (props.user.followers.length > 0) {

                Promise.all(getUserList(props.user.followers)).then(res => {
                    setFollower(res);
                });
            }else{
                setFollower([]);
            }
        } catch{

        }

        // }
        return () => {
            // cleanup
            //when exactly do we clean up ?
        };
    }, [props.user]);

    return (
        <div>
            <ListGroup variant="flush" style={mediumMargin}>
                <font color="black">
                    <ListGroup.Item variant="dark" >Follower List</ListGroup.Item>
                    {displayUserList(followers)}
                </font>
            </ListGroup>
            <ListGroup variant="flush" style={mediumMargin}>
                <font color="black">
                    <ListGroup.Item variant="dark" >Following List</ListGroup.Item>
                    {displayUserList(followings)}
                </font>
            </ListGroup>
        </div>)
}

function mapStateToProps(state) {
    return {
    }
}

export default connect(mapStateToProps)(FollowPanel);