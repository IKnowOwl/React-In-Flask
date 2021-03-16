import React, {useState, Component } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom'
import ReactImageZoom from 'react-image-zoom';
import {login, useAuth, authFetch, logout} from "../auth";
import { useLocation } from 'react-router-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";

export const Upload = () => {
    const history = useHistory()
    const [selectedFile, setSelectedFile] = useState(null)
    const onFileChange = e => {
        setSelectedFile(e.target.files[0])
    }
    const onFileUpload = () => {
        const formData = new FormData()
        formData.append('pic', selectedFile, selectedFile.name)
        history.push({
           pathname:'/AfterUpload',
            state:{selectedFile}
        })
    
    }
    return (
        <div>
            <form onSubmit={onFileUpload}>
                <input type="file" onChange={onFileChange} required/>
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export const AfterUpload = () => {
    const location = useLocation()
    const objectUrl = URL.createObjectURL(location.state.selectedFile)
    const [imageSrc, setImageSrc] = useState(objectUrl)
    
    const fileData = () => {       
        return(
            <div>
                <h2>file details:</h2>
                <p>file name: {location.state.selectedFile.name}</p>
                <p>file type: {location.state.selectedFile.type}</p>
            </div>
        )  
    }
    const props = { width: 400, height: 250, scale:2,zoomPosition: 'bottom', img:imageSrc}
    return (

        <div>
         <button onClick={() => logout()}>Logout</button>
            <ReactImageZoom {...props}/>
            {fileData()}
        </div>
    )
}
