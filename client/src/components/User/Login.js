import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import axios from 'axios';
import cookie from 'react-cookies';
import { Form, Button } from 'react-bootstrap'
import '../../styling/CenterFormStyling.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      authFlag: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    this.setState({ [e.target.type]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let credential = {
      email: this.state.email,
      password: this.state.password
    }
    this.verifyUser(credential);
  }

  verifyUser = (data) => {
    axios.defaults.withCredentials = true;
    axios.post('/login', data)
      .then(res => {
        if (res.status === 200) {
          this.setState({ authFlag: true })
        } else {
          this.setState({ authFlag: false })
        }
        console.log(res.token);
      }).catch((errors) => {
          alert('Invalid credential!');
      });
  }

  render() {

    let redirectHome = null;
    if (cookie.load('cookie')) {
      redirectHome = <Redirect to="/" />
    }

    return (
      <div>{redirectHome}
        <Form onSubmit={this.handleSubmit} className="center-form">
          <h2 className="text-info">Login</h2>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="text-muted">E-mail</Form.Label>
            <Form.Control
              type="email"
              name="email" 
              placeholder="john.doe@email.com"
              value={this.state.email}
              onChange={this.handleChange}
              required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
                </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label className="text-muted">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="At least 6 characters"
              minLength="6"
              maxLength="16"
              value={this.state.password}
              onChange={this.handleChange}
              required />
          </Form.Group>
          <Button variant="info" type="submit">Login</Button> 
          <div>New ? <Link to="/register" className="text-info">Create account</Link></div>
          <div>{this.state.output}</div>
        </Form>
      </div>
    )
  }
}

export default Login;