import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap'
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

import '../../styling/CenterFormStyling.css';
import '../../styling/styles.css';

class Jobs extends Component {
    constructor(props) {
        super(props);
		this.state = {
			btnPrev	: "",
			btnNext	: "",
			prevPage: 0,
			nextPage: 0,
            page	: 1,
            keyword	: "",
			jobs	: ''
        };
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange	= this.handleChange.bind(this);
//		this.handleGetData	= this.handleGetData.bind(this);
		this.handleGetData();
    }
	handleSubmit = (e) => {
        e.preventDefault();
		this.state.page = 1;
		this.handleGetData();
	};
	
	handleChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
		this.state[e.target.name] = e.target.value;
		if(e.target.name === 'page')
			this.handleGetData();
		
    }
	
	handlePageNav = (e) => {
        e.preventDefault();
		
		if(e.target.id === 'btnPrev')
			this.state.page = this.state.prevPage;
		else
			this.state.page = this.state.nextPage;
		this.handleGetData();
    }
	
	handleGetData = () => {
		if(this.state.page > 0){
			const post = {
				page	: this.state.page,
				keyword	: this.state.keyword
			};
			axios.post('/get_jobs', post)
				.then(res => {
					
					if(res.status === 200){
						if(res.data.items.length > 0){
							var output = '<div class="grid-view items">';
							var items  = res.data.items
							for(var i = 0; i < items.length; i++){
								output += '<div class="item"><div class="inner-item">';
								output += '<div class="item-id">' + items[i].id + '</div>';
								output += '<div class="item-title"><a href="/jobs_detail?' + items[i].index + '">' + items[i].title + '</a></div>';
								output += '<div class="grid-view">';
								output += '<div class="item-company-name">Company: <strong>' + items[i].company + '</strong></div>';
								output += '<div class="item-salary">Salary: <strong>' + items[i].salary + '</strong></div>';
								output += '</div>';
								output += '<div class="grid-view">';
								output += '<div class="item-position">Position: <strong>'+ items[i].position+'</strong></div>';
								output += '<div class="item-location">Location: <strong>'+ items[i].location+'</strong></div>';
								output += '</div>';
								output += '<div class="item-source">Source: <strong>' + items[i].source + '</strong></div>';
								output += '<div class="item-skills">Skill: <strong>'  + items[i].skills + '</strong></div>';
								output += '<div class="item-desc">Description:<br/>'  + items[i].description + '</div>';
								output += '</div></div>';
							}
							output += '</div>';
							this.setState({
								jobs		: output,
								prevPage	: res.data.prev_page,
								nextPage	: res.data.next_page
							});
						} else
							this.setState({
								jobs		: '<h3>Item Not Found</h3>',
								prevPage	: 0,
								nextPage	: 0
							});
					}
				}).catch((errors) => {
					console.log(errors);
				});
		} else {
			alert("This is first page!");
		}
		
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
					<h1 className="page-title">Job Page</h1>
					<Form onSubmit={this.handleSubmit}>
						<div className="wp-search">
							<div className="input-group mb-3">
								<Form.Control type="text" name="keyword" placeholder="keyword" onChange={this.handleChange} />
								<div className="input-group-append"><Button variant="primary" className="btn btn-primary" type="submit">Search</Button></div>
							</div>
						</div>
						<div dangerouslySetInnerHTML={{__html: this.state.jobs}} />
						<div className="wp-pagination">
							<div className="btn-group">
								<label id="btnPrev" className="btn btn-danger btn-nav" onClick={this.handlePageNav} >
									Prev Page
								</label>
								<label className="btn btn-primary">
									&nbsp;&nbsp;&nbsp;{this.state.page}&nbsp;&nbsp;&nbsp;
								</label>
								<label id="btnNext" className="btn btn-success btn-nav" onClick={this.handlePageNav} >
									Next Page
								</label>
							</div>
						</div>
					</Form>
             	</div>
            </div>
        )

    }
}


export default Jobs;