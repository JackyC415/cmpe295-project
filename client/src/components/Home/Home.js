import React, { Component } from 'react';
import { Form, Button, Col, Spinner } from 'react-bootstrap'
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inProgress: false,
            output: ""
        };
        this.handleUploadFile = this.handleUploadFile.bind(this);
    }

    handleUploadFile = (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        this.setState({ inProgress: true });

        axios.post('/upload', formData)
            .then(res => {
                if (res.status === 200) this.setState({
                    inProgress: false,
                    output: "Upload success!"
                });
            }).catch((errors) => {
                console.log(errors);
                alert('Oops, something went wrong!');
            });
    }

    render() {
        let progressBar = '';
        if (this.state.inProgress) {
            progressBar = <div>
                <Spinner animation="border" /> Upload in progress...
            </div>
        }
        return (
            <div className="center-form">
                <Form>
                    <Form.File
                        id="custom-file"
                        label="Please upload resume"
                        onChange={this.handleUploadFile}
                        custom
                    />
                </Form>
                {progressBar}
                {this.state.output}
                <br />
            </div>
        )
    }
}

export default Home;