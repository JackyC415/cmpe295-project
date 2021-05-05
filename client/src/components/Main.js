import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Navbar from './Navbar/Navbar';
import Login from './User/Login';
import Register from './User/Register';
import Home from './Home/Home';
import Jobs from './Jobs/Jobs';
import Detail from './Jobs/Detail';
import Resume from './Resume/Resume';
import Recommend from './Recommend/Recommend';

class Main extends Component {
    render() {
        return (
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/home" component={Home} />
				<Route path="/jobs" component={Jobs} />
				<Route path="/jobs_detail" component={Detail} /> 
				<Route path="/resume" component={Resume} />
				<Route path="/recommend" component={Recommend} />
            </div>
        )
    }
}

export default Main;