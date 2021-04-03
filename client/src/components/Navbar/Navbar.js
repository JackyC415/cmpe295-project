import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Spinner
} from 'reactstrap';

class NavbarPage extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    handleLogout = () => {
        axios.post('/logout')
            .then(res => {
                if (res) {
                    cookie.remove('cookie', { path: '/' });
                    this.props.history.push('/login');
                }
            });
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        let main, redirectHome = null;
        if(cookie.load('cookie') === 'authenticated') {
            main = (
                <Navbar color="light" light expand="md">
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/">Automated Jobs Recommendation Portal</NavLink>
                        </NavItem>
                    </Nav>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to="/resume">Resume</NavLink>
                            </NavItem>
							<NavItem>
                                <NavLink tag={Link} to="/home">Recommender</NavLink>
                            </NavItem>
							<NavItem>
                                <NavLink tag={Link} to="/jobs">Jobs</NavLink>
                            </NavItem>
							<NavItem>
                                <NavLink tag={Link} to="/" onClick={this.handleLogout}>Logout</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            )
        } else {
            main = (
                <Navbar color="light" light expand="md">
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/">Automated Jobs Recommendation Portal</NavLink>
                        </NavItem>
                    </Nav>
                    <div>
                        <Spinner type="grow" color="primary" />
                        <Spinner type="grow" color="secondary" />
                        <Spinner type="grow" color="success" />
                        <Spinner type="grow" color="danger" />
                        <Spinner type="grow" color="warning" />
                        <Spinner type="grow" color="info" />
                        <Spinner type="grow" color="light" />
                        <Spinner type="grow" color="dark" />
                        <Spinner color="primary" />
                        <Spinner color="secondary" />
                        <Spinner color="success" />
                        <Spinner color="danger" />
                        <Spinner color="warning" />
                        <Spinner color="info" />
                        <Spinner color="light" />
                        <Spinner color="dark" />
                    </div>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to="/login">Login </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/register">Register</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            )
        }
        cookie.load('cookie') === 'authenticated'
            ? redirectHome = <Redirect to="/home" /> : redirectHome = null;
        return (
            <div>
                {main}
                {redirectHome}
            </div>
        )
    }
}

export default NavbarPage;