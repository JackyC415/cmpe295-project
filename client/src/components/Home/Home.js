import React, { Component } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../../styling/styles.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      uploadInProgress: false,
      recommendInProgress: false,
      status: "",
      offset: 0,
      perPage: 6,
      currentPage: 0,
      paginatedData: [],
      loadingStatus: false,
      userId: "",
    };

    this.handleApply = this.handleApply.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.handleRecommendations = this.handleRecommendations.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount = () => {
    const jobs = JSON.parse(localStorage.getItem("jobs"));

    if (jobs) {
      let slice = jobs.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      this.setState({
        jobs: [...jobs],
        pageCount: Math.ceil(jobs.length / this.state.perPage),
        paginatedData: slice,
        loadingStatus: true,
        recommendInProgress: false,
        userId: jobs[0].userId,
      });
    }
  };

  loadMoreData() {
    const slice = this.state.jobs.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    this.setState({
      pageCount: Math.ceil(this.state.jobs.length / this.state.perPage),
      paginatedData: slice,
    });
  }

  handlePageChange = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.loadMoreData();
      }
    );
  };

  handleUploadFile = (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    this.setState({ uploadInProgress: true });

    axios
      .post("/upload", formData)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            uploadInProgress: false,
            recommendInProgress: true,
            status: "Resume Uploaded Successfully!",
          });
          this.handleRecommendations();
        }
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  handleRecommendations = () => {
    axios
      .get("/recommend")
      .then((res) => {
        if (res.status === 200) {
          let slice = res.data.slice(
            this.state.offset,
            this.state.offset + this.state.perPage
          );
          this.setState({
            jobs: [...res.data],
            pageCount: Math.ceil(res.data.length / this.state.perPage),
            paginatedData: slice,
            loadingStatus: true,
            recommendInProgress: false,
            userId: res.data[0].userId,
          });
          localStorage.setItem("jobs", JSON.stringify(res.data));
        }
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  handleApply = (url, jobId) => {
    window.open("https://www.indeed.com/", "_blank");
    this.handleRating(jobId, 5, "apply");
  };

  handleBookmark = (jobId) => {
    this.handleRating(jobId, 3, "bookmark");
  };

  handleRating = (jobId, score, type) => {
    let newRating = {
      jobId: jobId,
      userId: this.state.userId,
      rating: score,
    };
    axios
      .post("/rate", newRating)
      .then((res) => {
        if (res.status === 200)
          alert("User: " + this.state.userId + " Rated: " + jobId);
      })
      .catch((errors) => {
        if (type === "bookmark")
          alert("Job ID: " + jobId + " is already bookmarked.");
        console.log(errors);
      });
  };

  render() {
    return (
      <div className="wrapper">
        <div className="center-form">
          <Form>
            <Form.File
              id="custom-file"
              label="Please upload PDF resume"
              onChange={this.handleUploadFile}
              custom
            />
          </Form>
          {this.state.uploadInProgress ? (
            <div>
              <Spinner animation="border" /> Upload in progress...
            </div>
          ) : (
            ""
          )}
          <br></br>
          <b>{this.state.status}</b>
          <br></br>
          {this.state.recommendInProgress ? (
            <div>
              <Spinner animation="border" /> Recommending Jobs...
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="main">
          <Container>
            <Row>
              {this.state.paginatedData?.map((jobs) => {
                return (
                  <Col key={jobs.jid} xs>
                    <Card
                      border="primary"
                      style={{
                        height: "25rem",
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
                        {jobs.title?.toUpperCase()}
                      </Card.Header>
                      <Card.Body>
                        <Card.Title
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {jobs.company_name?.toUpperCase()}
                        </Card.Title>
                        <Card.Text>
                          <b>Matching Score:</b> {jobs.score?.toFixed(3)}
                        </Card.Text>
                        <b>Description:</b>
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
                            this.handleApply(jobs.url, jobs.jid);
                          }}
                        >
                          Apply
                        </Button>
                        <Button
                          style={{ marginLeft: "20px" }}
                          variant="primary"
                          onClick={() => {
                            this.handleBookmark(jobs.jid);
                          }}
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

          {this.state.loadingStatus ? (
            <div className="paginateBttns">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageChange}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttns"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
