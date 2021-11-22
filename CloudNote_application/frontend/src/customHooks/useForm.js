import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../Contexts";
import axios from "axios";
import {backendURL} from "../utils/helper";
function useForm(initialState, validate) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);
  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        // console.log("authenticated!", values.email, values.password);
        //TODO do the authentication here (call database for login and set up user)
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    }
  }, [errors, isSubmitting, values]);

  function handleChange(event) {
    console.log("event.target.name ", event.target.name);
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  }

  function handleBlur() {
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }

  async function handleSubmit(event, isSignUp) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitting(true);
    // let user;

    let apiPath = `/api/${isSignUp ? "addUser" : "signIn"}`;
    await axios.post(`${backendURL}${apiPath}`,{
        email: values.email,
        pass: values.password
      }).then(res=>{
        console.log("res", res);
        if(res.status == 200){
          // window.localStorage.setItem('user', 'test');
          const id = res.data.substring(8);
          console.log("new id", id);
          window.localStorage.setItem('user', JSON.stringify({ 
            email: values.email,
            id
          }));
          setUser({ 
            email: values.email,
            id
          })
        }return;
      }).catch(err=>{
        if(err.reponse)
        alert(`Could not complete your request\n${err.response.data}`)
      });

    console.log("submitted");
  }

  return {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting
  };
}

export default useForm;
