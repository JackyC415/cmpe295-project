import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Navbar from './Navbar/Navbar';
import Login from './User/Login';
import Register from './User/Register';
import Home from './Home/Home';

class Main extends Component {
    render() {
        return (
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/home" component={Home} />
            </div>
        )
    }
}

export default Main;