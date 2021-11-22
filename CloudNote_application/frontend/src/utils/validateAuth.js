export default function validateAuth(values) {
    let errors = {};
    // Email Errors
    if (!values.email) {
      errors.email = "Required Email";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    // Password Errors
    if (!values.password) {
      errors.password = "Required Password";
    } if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } if (values.password2){
      console.log("compare password ", values.password, values.password2 )
      if(values.password != values.password2){
        errors.password2 = "Passwords are not the same";
      }
    }
    return errors;
  }
  