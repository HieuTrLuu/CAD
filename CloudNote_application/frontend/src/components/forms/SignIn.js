import React, { useState, useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
// import PropTypes from "prop-types";
import { Container } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import useForm from "../../customHooks/useForm";
import validateAuth from "../../utils/validateAuth";
import {mediumMargin} from "../../utils/cssVar";
import { UserContext, initialUserContext } from "../../Contexts";
// import axios from "axios";


const INITIAL_STATE = {
  email: "",
  password: ""
};

const TEST_USER = {
      email: 'thl1g15@soton.ac.uk',
      pass: 'thl1g15',
      id: '1'
  };
// const tempURL = "http://localhost:8080";
function SignIn(props) {
  const {user, setUser} = useContext(UserContext);
  //ONLY FOR TESTING: set userExist to true 
  const [userExist, setUserExist] = useState(true);
  useEffect(() => {
    // effect
    return () => {
      // cleanup
      if(user){
        history.replace(from);
      }
    };
  })
  const [errorMsg, setErrorMsg] = useState(null);
  let history = useHistory();
  let location = useLocation();

  

  let { from } = location.state || { from: { pathname: "/" } };


  let handleUserSignUp = (e) => {
    

  }

  let handleUserSignIn = async (e) => {
    await handleSubmit(e, props.isSignUp);
    if(user){
      window.localStorage.setItem('user', user);
    }else{
      // throw notification  
      (!props.isSignUp) ? setErrorMsg('Incorrect email or password'): setErrorMsg(null);
    }
  };
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting
  } = useForm(INITIAL_STATE, validateAuth);

  return (
    <Container>
      <Col className='mainPanel' xs={5}>
      <Form onSubmit={handleUserSignIn}>
        {/* <input */}
        <Form.Control as='input'
          style = {mediumMargin}
          onChange={handleChange}
          onBlur={handleBlur}
          name="email"
          value={values.email}
          className={errors.email && "error-input"}
          autoComplete="off"
          placeholder="Your email address"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        < Form.Control as='input'
          style = {mediumMargin}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          className={errors.password && "error-input"}
          name="password"
          type="password"
          placeholder="Enter password"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        {/* Retype password field for signup */}
        {props.isSignUp ? 
          < Form.Control as='input'
            style = {mediumMargin}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password2}
            className={errors.password2 && "error-input"}
            name="password2"
            type="password"
            placeholder="Renter password"
          />
        : null}        

        {/* retype - password fields for sign up  */}
        {props.isSignUp ?  errors.password2 && <p className="error-text">{errors.password2}</p> :null}

        {errorMsg ? <p>{errorMsg}</p> : null}

        <div>
          <Button as='button' disabled={isSubmitting} type="submit">
            Submit
          </Button>
        </div>
      </Form>
      </Col>
    </Container>
  );
}

SignIn.defaultProps = {
  isSignUp: false
};

export default SignIn;
