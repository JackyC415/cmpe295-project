import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap'
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

import '../../styling/CenterFormStyling.css';
import '../../styling/styles.css';

class Resume extends Component {
    constructor(props) {
        super(props);
		this.state = {
			params		: this.props.match.params,
			id			: 1,
			Skills		: "",
			description	: "",
			form		: ""
		};
//		let redirectHome = null;
		if(!cookie.load('cookie')) {
//			redirectHome = <Redirect to="/" />
			window.location = "/";
		}
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleGetData();
    }
	
	handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
		this.state[e.target.name] = e.target.value;
    }
	
	handleSubmit = (e) => {
        e.preventDefault();
        const post = {
            id			: this.state.id,
            Skills		: this.state.Skills,
            description	: this.state.description
        }
        axios.post('http://localhost:3001/resume_update', post)
            .then(res => {
                if (res.status === 200){
					alert('Update Success');
				}
            }).catch((errors) => {
                console.log(errors);
            });
    }
	
	handleGetData = () => {
       const post = {
            id		: this.state.params.id
        };
		axios.post('http://localhost:3001/resume', post)
            .then(res => {
				
                if(res.status === 200){
					if(res.data.detail){
						var detail = res.data.detail;
						this.setState({
							id			: detail.id,
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
		var id 			= this.state.id;
		var Skills 		= this.state.Skills;
		var description = this.state.description;
        return (
			<div class="wp-form form-resume">
				<Form method="post" onSubmit={this.handleSubmit}>
					<input type="hidden" value="{id}" name="id" />
					<div className="grid-view">
						<div className="cell-label">Skills</div>
						<div className="cell-data">
							<textarea className="form-control"
                            	name="Skills"
                            	onChange={this.handleChange}
                            	placeholder="Skills"
								value={this.state.Skills} />
						</div>
					</div>
					<div className="grid-view">
						<div className="cell-label">Description</div>
						<div className="cell-data">
							<textarea className="form-control"
                            	name="description"
                            	onChange={this.handleChange}
                            	placeholder="description"
								value={this.state.description} />
						</div>
					</div>
					<div className="wp-btn">
						<Button className="btn btn-success">Update</Button>
					</div>
				</Form>
			</div>
        )

    }
}

export default Resume;