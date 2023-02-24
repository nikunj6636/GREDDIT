import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";
import { useFormik } from "formik";

import pic from "./profile.jpeg"; // img to be rendered
import Posts from "./mypost";

let tokenStr = localStorage.getItem("token");
const server = 'http://localhost:5000';

const CreatePostModal = ({refresh, subgredditId, banned}) => {

  const [disabled, setDisabled] = useState(true);

  const validate = (values) => {

    const errors = {}; // declaring an object

    if (!values.text) {
      errors.name = "Required";
      setDisabled(true);
    }

    else{
      setDisabled(false);
    }
  
    return errors;
  };

  const formik = useFormik({
    // formik values
    initialValues: {
      text: ""
    },

    validate,
  
    onSubmit: (values, {resetForm}) => { // post the subgreddit in the database

      let words = values.text.split(' ');

      words.forEach(elem => {
        if (banned.includes(elem.toLowerCase()) === true){
          alert("post contains the banned keyword " + elem);
        }
      });

       axios
         .post(server + "/create/post", {
                text: values.text, 
                subgredditId: subgredditId,  // post id here, in function hence dont use curly brackets
                banned: banned
              },
            { headers: {"Authorization" : `Bearer ${tokenStr}`} }
        )
         .then(res => {
            console.log(res.data);
            resetForm({values: ''}); // clear form values
            refresh();  // to re-render the page, to show added subgreddit
         })
         .catch(err => {
            console.error(err)
         });
    }
  });

  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id="postModal"
        tabIndex={-1}
        aria-labelledby="postModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Create Post
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            {/* Modal Body */}
            <div className="modal-body">

              <form onSubmit={formik.handleSubmit}>

                <div className="mb-3">
                  <input
                    name="text"
                    required
                    placeholder="Enter the Post "
                    onChange={formik.handleChange}
                    value={formik.values.text}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={disabled}>
                  Create
                </button>

              </form>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

const SubgredditPage = () => {

  const [subgreddit, setsubgreddit] = useState({
    name: "",
    description: "",
  });

  const { id } = useParams(); // subgreddit-id
  const tokenStr = localStorage.getItem("token"); // subgreddits of logged in user
  const server = "http://localhost:5000";

  useEffect(() => {
    axios // id is the subgreddit id to retrieve data from
      .post(server + "/get/subgreddit", {id: id}, {headers: { Authorization: `Bearer ${tokenStr}` }})
      .then(res => {
        setsubgreddit(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const [refresh, setrefresh] = useState(false);  // to render again to load the posts here

  const [posts, setposts] = useState([]); // data type init, is the array of posts

  useEffect(() => { // fetch all the posts of subgreddit-id = id
    axios
      .post(server + "/myposts", {subgredditId: id}, {headers: { Authorization: `Bearer ${tokenStr}` }})
      .then(res => {
        setposts(res.data);
      })
      .catch(err => console.error(err));
  }, [refresh])


  return (
    <div>
      <Navbar />

      <div style={{display: 'flex', gap: '4em', margin: '1em'}}>

        <img src={pic} className="img-thumbnail" alt="subgreddit abc" style={{width: '15em', height: '15em'}}/>
        {/* image with it's width and height*/}

        <div>

          <h2>Name: {subgreddit.name}</h2>
          <h6>Description: {subgreddit.description}</h6> {/* h1 - h6 */}

          <button   // to trigger modal
            type="button"
            className="btn btn-primary mt-3 mb-3"
            data-bs-toggle="modal"
            data-bs-target="#postModal"
          >
            Create Post
          </button>

          <CreatePostModal refresh={() => setrefresh(!refresh)} subgredditId={subgreddit._id} banned={subgreddit.banned} /> {/* passing array of banned keywords */}

          <h1>Posts</h1>

          {posts.map(elem => {
            return(
              <div>
                <Posts postId={elem._id}/>
                <hr
                  style={{
                  background: "#6F38C5",
                  height: "5px",
                  border: "none",
                  }}
                />
              </div>
            )
          })}

        </div>

      </div>

    </div>
  );
};

export default SubgredditPage;