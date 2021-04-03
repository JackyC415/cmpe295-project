import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import { Form, Button } from 'react-bootstrap'
import axios from 'axios';
import cookie from 'react-cookies';
//import { Redirect } from 'react-router';

import '../../styling/CenterFormStyling.css';
import '../../styling/styles.css';

class Jobs extends Component {
    constructor(props) {
        super(props);
		const params = this.props.match.params;
		this.state = {
			id			: params.id,
			index		: params.index,
			title		: "",
			comany		: "",
			salary		: "",
			location	: "",
			position	: "",
			Skills		: "",
			description	: ""
		};
		
//		let redirectHome = null;
		if(cookie.load('cookie') !== 'authenticated'){
//			redirectHome	= <Redirect to="/" />
			window.location = "/";
		}
		this.handleGetData();
    }

    handleChange = (e) => {
        e.preventDefault();
       	
    }
	
	handleGetData = () => {
       const post = {
            id		: this.state.id,
            index	: this.state.index
        };
		axios.post('http://localhost:3001/get_detail', post)
            .then(res => {
				
                if(res.status === 200){
					if(res.data.detail){
						var detail = res.data.detail;
						console.log(detail.title);
						this.setState({
							title 		: detail.title,
							comany		: detail.comany_name,
							salary		: detail.salary,
							location	: detail.location,
							position	: detail.position,
							Skills		: detail.Skills,
							description	: detail.description,
							hidden		: ""						
						});
					}
				}
            }).catch((errors) => {
                console.log(errors);
            });
    }
	
    render() {
        return (
            <div className="wrapper">
				<div className="main">
					<h1 className="page-title">Job Detail</h1>
					<div className="detail-page">
						<div class="wp-btn"><a class="btn btn-primary" href="/jobs">View More Jobs</a></div>
						<h1 class="page-title">{this.state.title}</h1>
						<div class="grid-view">
							<div class="comany-name">Company: <strong>{this.state.comany}</strong></div>
							<div class="salary">Sallary: <strong>{this.state.salary}</strong></div>
						</div>
						<div class="grid-view">
							<div class="location">Location: <strong>{this.state.location}</strong></div>
							<div class="position">Position: <strong>{this.state.position}</strong></div>
						</div>
						<div class="skill">Skills: <strong>{this.state.Skills}</strong></div>
						<div class="desc">Description: <div class="wp-desc">{this.state.description}</div></div>
					</div>
             	</div>
            </div>
        )

    }
}

export default Jobs;