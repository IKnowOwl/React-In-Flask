import React, { useState, useEffect } from "react";
import {login, useAuth, authFetch, logout} from "../auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";


export default class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);



    authFetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        alert("Upload Successful")
        logout()
        console.log(response.filename)
        this.setState({ imageURL: `http://localhost:5000/api/${body.file}` })
    });
    }).then(response => {
      if (response && response.filename){
        console.log(response.filename)
      }
    })
  }

  render() {
    return (
      <>
      <button onClick={() => logout()}>Logout</button>  
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        <br />
        <div>
          <button>Upload</button>
        </div>
        <img src={this.state.imageURL} alt="img" />
      </form>
      </>
    );
  }
}