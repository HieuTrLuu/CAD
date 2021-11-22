import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { axiosInstance } from './../../util/rest'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import {connect} from 'react-redux';
import {toggleAuthentication,toggleSignIn} from '../../redux/Actions';

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
      fakeAuth.isAuthenticated = true;
      setTimeout(cb, 100); // fake async
    },
    signout(cb) {
      fakeAuth.isAuthenticated = false;
      setTimeout(cb, 100);
    }
  };

function SignIn(props) {
    let history = useHistory();
    let location = useLocation();

    let { from } = location.state || { from: { pathname: "/" } };

    let login = () => {
        // fakeAuth.authenticate(() => {
            //this is redirection once the user is log in 
            // history.replace(from);
        // });


        props.dispatch(toggleAuthentication());
        // props.dispatch(toggleSignIn());

        history.replace(from);

    };

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    let testUserID = 1

    useEffect(() => {
        // effect
        // console.log(`email = ${email}`);
        // console.log(`pass = ${pass}`);

        return () => {
            // cleanup
        };
    }, [email, pass])


    let handleUserSignIn = () => {
        axiosInstance.get(`ReadFromDB?ID=${testUserID}`).then(res => { console.log(res.data) });
    }

    return (
        <Container  >
            {/* <Col className='mainPanel' xs={7}> */}
            <Form onSubmit={(e) => handleUserSignIn()}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address !!!</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.nativeEvent.target.value.trim())} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPass(e.nativeEvent.target.value.trim())} />
                </Form.Group>
                <Button variant="primary"
                    // type="submit"
                    onClick={e => { handleUserSignIn() }}
                >
                    Submit
                </Button>

                <Button variant="danger"
                // type="submit"
                onClick={e=>{login()}}
                >
                    Fake authentication
                </Button>
            </Form>
            {/* </Col> */}
        </Container>

    );
}

function mapStateToProps(state){
    return{
      isAuthenticated: state.Authentication.isAuthenticated,
    }
}
export default connect(mapStateToProps)(SignIn);