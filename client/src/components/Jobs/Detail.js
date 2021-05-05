import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import { Form, Button } from 'react-bootstrap'
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

import '../../styling/CenterFormStyling.css';
import '../../styling/styles.css';

class Detail extends Component {
    constructor(props) {
        super(props);
		const params	= this.props.match.params;
		const paramsI	= parseInt((window.location.search).replace('?', ''));
		
		this.state = {
			id			: 0,
//			index		: params.i,
			index		: paramsI,
			title		: "",
			comany		: "",
			salary		: "",
			location	: "",
			position	: "",
			Skills		: "",
			description	: ""
		};
		console.log(params);
		console.log(paramsI);
		this.handleGetData();
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
						this.setState({
							title 		: detail.title,
							comany		: detail.comany_name,
							salary		: detail.salary,
							location	: detail.location,
							position	: detail.position,
							Skills		: detail.Skills,
							description	: detail.description	
						});
					}
				}
            }).catch((errors) => {
                console.log(errors);
            });
    }
	
    render() {
		let redirectHome = null;
		if(cookie.load('cookie') !== 'authenticated'){
			redirectHome	= <Redirect to="/" />
		}
        return (
            <div className="wrapper">
				{redirectHome}
				<div className="main">
					<h1 className="page-title">Job Detail</h1>
					<div className="detail-page">
						<div className="wp-btn"><a className="btn btn-primary" href="/jobs">View More Jobs</a></div>
						<h1 className="page-title">{this.state.title}</h1>
						<div className="grid-view">
							<div className="comany-name">Company: <strong>{this.state.comany}</strong></div>
							<div className="salary">Sallary: <strong>{this.state.salary}</strong></div>
						</div>
						<div className="grid-view">
							<div className="location">Location: <strong>{this.state.location}</strong></div>
							<div className="position">Position: <strong>{this.state.position}</strong></div>
						</div>
						<div className="skill">Skills: <strong>{this.state.Skills}</strong></div>
						<div className="desc">Description: <div className="wp-desc">{this.state.description}</div></div>
					</div>
             	</div>
            </div>
        )

    }
}

export default Detail;