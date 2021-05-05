import React, { Component } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

import "../../styling/CenterFormStyling.css";
import "../../styling/styles.css";

class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnPrev: "",
      btnNext: "",
      prevPage: 0,
      nextPage: 0,
      page: 1,
      keyword: "",
      jobs: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    this.handleUrlRedirect = this.handleUrlRedirect.bind(this);
  }

  componentDidMount() {
    this.handleGetData();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ page: 1 });
    this.handleGetData();
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === "page") this.handleGetData();
  };

  handlePageNav = (e) => {
    e.preventDefault();
    e.target.id === "btnPrev"
      ? (this.state.page = this.state.prevPage)
      : (this.state.page = this.state.nextPage);
    this.handleGetData();
  };

  handleGetData = () => {
    if (this.state.page > 0) {
      const post = {
        page: this.state.page,
        keyword: this.state.keyword,
      };
      axios
        .post("/get_jobs", post)
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              jobs: res.data.items,
              prevPage: res.data.prev_page,
              nextPage: res.data.next_page,
            });
          }
        })
        .catch((errors) => {
          console.log(errors);
        });
    }
  };

  handleUrlRedirect = (url) => {
    window.open(url, "_blank");
  };

  render() {
    return (
      <div className="wrapper">
        <div className="main">
          <h1 className="page-title">Job Page</h1>
          <Form onSubmit={this.handleSubmit}>
            <div className="wp-search">
              <div className="input-group mb-3">
                <Form.Control
                  type="text"
                  name="keyword"
                  placeholder="keyword"
                  onChange={this.handleChange}
                />
                <div className="input-group-append">
                  <Button
                    variant="primary"
                    className="btn btn-primary"
                    type="submit"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            <Container>
              <Row>
                {this.state.jobs.map((jobs) => {
                  return (
                    <Col key={jobs.id} xs>
                      <Card
                        border="primary"
                        style={{
                          height: "20rem",
                          width: "20rem",
                          display: "flex",
                          marginBottom: "20px",
                        }}
                      >
                        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                        <Card.Header
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {jobs.title.toUpperCase()}
                        </Card.Header>
                        <Card.Body>
                          <Card.Title
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            {jobs.company.toUpperCase()}
                          </Card.Title>
                          <Card.Text
                            style={{
                              overflow: "scroll",
                              maxWidth: "25rem",
                              maxHeight: "10rem",
                            }}
                          >
                            {jobs.description}
                          </Card.Text>
                          <Button
                            variant="primary"
                            onClick={() => {
                              this.handleUrlRedirect(jobs.url);
                            }}
                          >
                            Apply
                          </Button>
                          <Button
                            style={{ marginLeft: "20px" }}
                            variant="primary"
                          >
                            Bookmark
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Container>

            <div className="wp-pagination">
              <div className="btn-group">
                <label
                  id="btnPrev"
                  className="btn btn-danger btn-nav"
                  onClick={this.handlePageNav}
                >
                  Prev Page
                </label>
                <label className="btn btn-primary">
                  &nbsp;&nbsp;&nbsp;{this.state.page}&nbsp;&nbsp;&nbsp;
                </label>
                <label
                  id="btnNext"
                  className="btn btn-success btn-nav"
                  onClick={this.handlePageNav}
                >
                  Next Page
                </label>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default Jobs;
