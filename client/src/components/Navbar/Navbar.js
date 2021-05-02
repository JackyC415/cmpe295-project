import React, { Component } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import { useState } from "react";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  Button,
  Fade,
} from "reactstrap";

class NavbarPage extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  handleLogout = () => {
    axios.post("/logout").then((res) => {
      if (res) {
        cookie.remove("cookie", { path: "/" });
        localStorage.removeItem("jobs");  
        this.props.history.push("/login");
      }
    });
  };
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  render() {
    let main,
      redirectHome = null;
    if (cookie.load("cookie") === "authenticated") {
      main = (
        <Navbar color="dark" light expand="md">
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">
                <img src="../../styling/Images/MainLogo/logo_size_invert.jpg" />
              </NavLink>
            </NavItem>
          </Nav>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/home">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/jobs">
                  Recommendation
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/resume">
                  Resume
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/" onClick={this.handleLogout}>
                  Logout
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      );
    } else {
      main = (
        <Navbar color="faded" light expand="md">
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">
                <Link>
                  <img
                    src="../../styling/Images/MainLogo/logo_size_invert.jpg"
                    height={"50"}
                    width={"70"}
                  />
                </Link>
              </NavLink>
            </NavItem>
          </Nav>
          <div></div>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/login">
                  Login{" "}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/register">
                  Register
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      );
    }
    cookie.load("cookie") === "authenticated"
      ? (redirectHome = <Redirect to="/home" />)
      : (redirectHome = null);
    return (
      <div>
        {main}
        {redirectHome}
      </div>
    );
  }
}

const Example = (props) => {
  const [fadeIn, setFadeIn] = useState(true);
  const toggle = () => setFadeIn(!fadeIn);

  return (
    <div>
      <Button color="primary" onClick={toggle}>
        Toggle Fade
      </Button>
      <Fade in={fadeIn} tag="h5" className="mt-3">
        This content will fade in and out as the button is pressed
      </Fade>
    </div>
  );
};

export default NavbarPage;
