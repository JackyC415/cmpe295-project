import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap'
import axios from 'axios';
import '../../styling/CenterFormStyling.css';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            address: "",
            city: "",
            state: "",
            zipcode: "",
            output: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    clearFormInput = () => {
        this.setState({
            name: "",
            email: "",
            password: "",
            address: "",
            city: "",
            state: "",
            zipcode: ""
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const credential = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zipcode: this.state.zipcode
        }

        axios.post('/register', credential)
            .then(res => {
				console.log(res);
                if (res.status === 200) this.props.history.push('/login');
            }).catch((errors) => {
                console.log(errors);
                this.clearFormInput();
                alert('Oops, something went wrong!');
            });
    }

    render() {
        const states = [
            { value: 'AL' }, { value: 'AK' }, { value: 'AZ' }, { value: 'AR' }, { value: 'CA' },
            { value: 'CO' }, { value: 'CT' }, { value: 'DE' }, { value: 'FL' }, { value: 'GA' },
            { value: 'HI' }, { value: 'ID' }, { value: 'IL' }, { value: 'IN' }, { value: 'IA' },
            { value: 'KS' }, { value: 'KY' }, { value: 'LA' }, { value: 'ME' }, { value: 'MD' },
            { value: 'MA' }, { value: 'MI' }, { value: 'MN' }, { value: 'MS' }, { value: 'MO' },
            { value: 'MT' }, { value: 'NE' }, { value: 'NV' }, { value: 'NH' }, { value: 'NJ' },
            { value: 'NM' }, { value: 'NY' }, { value: 'NC' }, { value: 'ND' }, { value: 'OH' },
            { value: 'OK' }, { value: 'OR' }, { value: 'PA' }, { value: 'RI' }, { value: 'SC' },
            { value: 'SD' }, { value: 'TN' }, { value: 'TX' }, { value: 'UT' }, { value: 'VT' },
            { value: 'VA' }, { value: 'WA' }, { value: 'WV' }, { value: 'WI' }, { value: 'WY' }];
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="center-form">
                    <h2 className="text-info">Create account</h2>
                    <Form.Group controlId="formUsername">
                        <Form.Label className="text-muted">Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            minLength="3"
                            maxLength="30"
                            onChange={this.handleChange}
                            placeholder="John Doe"
                            required />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="text-muted">E-mail</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="john.doe@email.com"
                            onChange={this.handleChange}
                            required />
                    </Form.Group>
                    <Form.Group controlId="formGridAddress">
                        <Form.Label className="text-muted">Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            onChange={this.handleChange}
                            placeholder="Enter your personal address" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label className="text-muted">City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                placeholder="City"
                                onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label className="text-muted">State</Form.Label>
                            <Form.Control
                                as="select"
                                type="text"
                                name="state"
                                onChange={this.handleChange}>
                                required
                                <option>State</option>
                                {states.map((option, index) => {
                                    return (<option key={index} value={option.value}>{option.value}</option>)
                                })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formZipcode">
                            <Form.Label className="text-muted">Zipcode</Form.Label>
                            <Form.Control
                                type="number"
                                name="zipcode"
                                maxLength="5"
                                placeholder="5 digits"
                                value={this.state.zipcode}
                                onChange={this.handleChange}
                             />
                        </Form.Group>
                    </Form.Row>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="text-muted">Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="At least 6 characters"
                            minLength="6"
                            maxLength="16"
                            onChange={this.handleChange}
                            required />
                    </Form.Group>
                    <Button variant="info" type="submit">
                        Register
          </Button> &nbsp;
          <div>Already have an account? <Link to="/login" className="text-info">Login</Link></div><br />
                    <div> {this.state.output} </div>
                </Form>
            </div>
        )

    }
}

export default Register;