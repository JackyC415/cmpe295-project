import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap'
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

import '../../styling/CenterFormStyling.css';
import '../../styling/styles.css';

class Jobs extends Component {
    constructor(props) {
        super(props);
		this.state = {
            page	: 1,
            keyword	: "",
			jobs	: ''
        };
		
		let redirectHome = null;
		if(cookie.load('cookie') !== 'authenticated') {
			redirectHome = <Redirect to="/" />
			window.location = "/";
		}
//		this.handleGetData = this.handleGetData.bind(this);
		this.handleGetData();
    }

    handleChange = (e) => {
        e.preventDefault();
       	
    }
	
	handleGetData = () => {
       const post = {
            page	: this.state.page,
            keyword	: this.state.keyword
        };
		axios.post('http://localhost:3001/get_jobs', post)
            .then(res => {
				console.log(res.data);
                if(res.status === 200){
					if(res.data.items.length > 0){
						var output = '<div class="grid-view items">';
						var items  = res.data.items
						for(var i = 0; i < items.length; i++){
							output += '<div class="item">\
								<div class="inner-item">\
									<div class="item-id">' + items[i].id + '</div>\
									<div class="item-title"><a href="/job_detail/' + items[i].id + '/' + items[i].index + '">' + items[i].title + '</a></div>\
									<div class="grid-view">\
										<div class="item-company-name">Company: <strong>' + items[i].company + '</strong></div>\
										<div class="item-salary">Salary: <strong>' + items[i].salary + '</strong></div>\
									</div>\
									<div class="grid-view">\
										<div class="item-position">Position: <strong>'+ items[i].position+'</strong></div>\
										<div class="item-location">Location: <strong>'+ items[i].location+'</strong></div>\
									</div>\
									<div class="item-source">Source: <strong>' + items[i].source + '</strong></div>\
									<div class="item-skills">Skill: <strong>'  + items[i].skills + '</strong></div>\
									<div class="item-desc">Description:<br/>'  + items[i].description + '</div>\
								</div>\
							   </div>';
						}
						output += '</div>';
						this.setState({
							jobs : output
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
					<h1 className="page-title">Job Page</h1>
					<div className="wp-search">
						<Form action="/jobs" method="get">
							<div className="input-group mb-3">
								<Form.Control type="text" name="keyword" placeholder="keyword" />
								<div className="input-group-append"><Button variant="primary" className="btn btn-primary" type="submit">Search</Button></div>
							</div>
						</Form>
					</div>
					<div dangerouslySetInnerHTML={{__html: this.state.jobs}} />
             	</div>
            </div>
        )

    }
}

export default Jobs;