import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { smallMargin } from '../../util/cssVar'
import FileUpload from './FileUpload'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { submitTwit } from '../../util/rest';
import { connect } from 'react-redux';


function TwitSubmit(props
) {
    const [selectImg, setSelectImg] = useState(false);
    const [text, setText] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    let handleSelectImg = () => {
        const bool = selectImg;
        setSelectImg(!bool);
        // console.log(`state of the post submit = ${selectImg}`)
    }

    let handleSubmitTwit = () => {
        //TODO: catch error in submission
        console.log(`userId ${props.userId}`);
        submitTwit(props.userName, props.userId, text, imgUrl);
        // console.log('datetime');
        // console.log(Date.prototype.getUTCSeconds());
    }

    return (
        //TODO: include feature of only show the text field when user select to option to write a post
        <Form>
            include feature of only show the text field when user select to option to write a post
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows="3" onChange={(e) => setText(e.nativeEvent.target.value.trim())} />
            </Form.Group>

            <Container >
                <Row float="center">
                    <Button variant="primary" type="button" style={smallMargin} onClick={e => handleSelectImg()}>
                        {selectImg ? 'Deselect image' : 'Select image to upload'}

                    </Button>
                    <Button variant="primary" type="submit" style={smallMargin} onClick={e => handleSubmitTwit()}>
                        Twit
                    </Button>

                    {selectImg ? <FileUpload /> : null}
                </Row>
            </Container>

        </Form>
    )
}


function mapStateToProps(state) {
    return {
        userId: state.User.userId,
        userName: state.User.userName,
    }
}
export default connect(mapStateToProps)(TwitSubmit);