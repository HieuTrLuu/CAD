import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import axiosInstance from '../../util/rest';
import axios from 'axios';

//TODO: understand why the file is null ?
function FileUpload(props) {
    let initialState = {
        selectedFile: null,
        loaded: 0
    };
    const [state, setState] = useState(initialState)

    let onChangeHandler = event => {
        var files = event.target.files
        // if (maxSelectFile(event) && checkMimeType(event) && checkFileSize(event)) {
        // if return true allow to setState
        console.log(`files ${JSON.stringify(files)}`);
        console.log(`state selected file ${JSON.stringify(state)}`);
        setState({
            selectedFile: files,
            loaded: 0
        })

        console.log(`files ${JSON.stringify(files)}`);
        console.log(`state selected file ${JSON.stringify(state)}`);
        // }
    }
    let onClickHandler = () => {
        const data = new FormData()
        for (var x = 0; x < state.selectedFile.length; x++) {
            data.append('file', state.selectedFile[x])
        }
        // axios.post("http://localhost:7071/api/BlobWrite", data, {
        //     onUploadProgress: ProgressEvent => {
        //         setState({
        //             loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
        //         })

        //         console.log(`upload process = ${state.loaded}`)
        //     },
        // })
        //     .then(res => { // then print response status
        //         console.log('sucess');
        //         console.log(JSON.stringify(res));
        //         // toast.success('upload success')
        //     })
        //     .catch(err => { // then print response status
        //         // toast.error('upload fail')
        //         console.log('fail');
        //         console.log(JSON.stringify(err));
        //     })

        
        console.log(btoa(data));
        axios.post('http://localhost:7071/api/BlobWrite', data, {
            headers: {
                // 'Content-Type': data.type
            }
        }).then(res => { // then print response status
                console.log('sucess');
                console.log(JSON.stringify(res));
                // toast.success('upload success')
            })
            .catch(err => { // then print response status
                // toast.error('upload fail')
                console.log('fail');
                console.log(JSON.stringify(err));
            });

    }


    return (
        [
            <Col md="5"><input type="file" className="form-control" multiple onChange={onChangeHandler} /></Col>,
            <Col md="auto"><Button onClick={onClickHandler}>Upload</Button></Col>
        ]

    );
}

export default FileUpload;