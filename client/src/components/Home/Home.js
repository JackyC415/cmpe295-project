import React, { Component } from "react";
import { Form, Table, Spinner } from "react-bootstrap";
import axios from "axios";
import "../../styling/CenterFormStyling.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadInProgress: false,
      recommendInProgress: false,
      output: [],
      status: "",
    };
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.recommendJobs = this.recommendJobs.bind(this);
  }

  handleUploadFile = (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    this.setState({ uploadInProgress: true });

    axios
      .post("/upload", formData)
      .then((res) => {
        if (res.status === 200)
          this.setState({
            uploadInProgress: false,
          });
        alert("Uploaded resume!");
      })
      .catch((errors) => {
        console.log(errors);
        alert("Oops, something went wrong!");
      });
  };

  recommendJobs = () => {
    this.setState({ recommendInProgress: true });
    axios
      .get("/recommend")
      .then((res) => {
        this.setState({
          recommendInProgress: false,
        });
        this.setState({ output: [...res.data] });
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  render() {
    let uploadProgressBar,
      recommendProgressBar = "";
    if (this.state.uploadInProgress) {
      uploadProgressBar = (
        <div>
          <Spinner animation="border" /> Upload in progress...
        </div>
      );
    }
    if (this.state.recommendInProgress) {
      recommendProgressBar = (
        <div>
          <Spinner animation="border" /> Recommending Jobs...
        </div>
      );
    }
    let table = null;
    if (this.state.output.length > 0) {
      table = (
        <div>
          <Table style={{ marginLeft: "-400px" }} striped bordered hover>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Source</th>
              <th>Link</th>
              <th>Score</th>
              <th>Rating</th>
            </tr>
            <tbody>
              {this.state.output.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.source}</td>
                  <td>
                    <a href={item.url} target="_blank">{item.url}</a>
                  </td>
                  <td>{item.score}</td>
                  <button type="button" onClick={() => {
                    alert("Rated Job ID: " + item.id);
                  }} class="btn btn-primary">
                    Rate
                  </button>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }
    return (
      <div className="center-form">
        <Form>
          <Form.File
            id="custom-file"
            label="Please upload resume"
            onChange={this.handleUploadFile}
            custom
          />
        </Form>
        {uploadProgressBar}
        <br></br>
        <button
          type="button"
          onClick={this.recommendJobs}
          class="btn btn-primary"
        >
          Recommend
        </button>
        <br></br>
        {recommendProgressBar}
        <br></br>
        <br></br>
        {table}
      </div>
    );
  }
}

export default Home;
