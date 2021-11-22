import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';


function SignUp(props) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [pass2, setPass2] = useState('');
    const [passMatched, setMatched] = useState(false);
    const [reqSuccess, setReqSuccess] = useState(true);


    let handleCloseModal = () => {
        // props.dispatch(toggleSignUp());
    }

    let handleUserSignUp = () => {
        //TODO
    }

    let handleRetypePass = (e) =>{
        setPass2(e.nativeEvent.target.value.trim());
        if(pass==pass2){
            setMatched(true);
        }
    }

    return (
        <Container  >
            <Form 
            // onSubmit={e => handleUserSignUp()}
            >
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.nativeEvent.target.value.trim())}/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                

                
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => {setPass(e.nativeEvent.target.value.trim());}}/>
                    {/* <Form.Control type="password" placeholder="Re-enter Password" onChange={(e) => handleRetypePass(e)}/> */}
                    {/* <Form.Check type="checkbox" label="I agree to all inivisible terms and conditions and will write post in a polite way " /> */}
                </Form.Group>
                <Button variant="primary" 
                // type="submit"
                onClick = {e => {handleUserSignUp()}}>
                    Submit
                </Button>
                {}
            </Form>
            
            < Modal show={props.isSignUp} onHide={handleCloseModal} >
            {/* //This throws a wierd error that it need to be pass as a variable not a function ?? or it will be recurse too many times ??? */}

            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
                {reqSuccess ? 'Congratulations you have finished sign up with the read SNS' : 'Server error can not sign you up'}

            </Modal.Body>
    
            
            </Modal>
        </Container>

    )
}
//TODO: catch a case when 2 password is not the same, axios throws error


export default SignUp;
  