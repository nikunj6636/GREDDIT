import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../navbar";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

const tokenStr = localStorage.getItem("token"); // subgreddits of logged in user
const server = "http://localhost:5000";

const Post = ({post, handleDelete}) => { // passing the post id to fetch the post, delete it

  // text, upvotes, downvotes and comments 
  const [subgreddit, setsubgreddit] = useState(""); // name of the subgreddit

  useEffect(() => {
    axios 
      .post(server + "/get/subgreddit", {id: post.postedin}, {headers: { Authorization: `Bearer ${tokenStr}` }})
      .then(res => {
        setsubgreddit(res.data.name);
      })
      .catch(err => console.error(err));
  }, []); 


  return (
    <div className="mb-3">

      <h3> Posted in: {subgreddit} </h3>

      <h3> Posted By: {post.postedby} </h3>

      <p className="mb-1">{post.text}</p>

      <span>
        {post.upvotes}
        <AiFillLike />
      </span>

      <span style={{marginLeft: "0.5em"}}>
        {post.downvotes}
        <AiFillDislike />
      </span>

      <h6 className="mb-2 mt-2">Comments</h6>
      {post.comments.map(elem => {
          return (
            <div>
              {elem}
            </div>
          )
        })
      }    

      <button className="btn btn-primary" onClick={handleDelete}> Delete </button>
    </div>
  )
}

const SavedPostPage = () => {   // derive all the posts of 

  const [savedPosts, setsavedPosts] = useState([]);

  useEffect(() => {
    axios 
      .get(server + "/get/savedposts", {headers: { Authorization: `Bearer ${tokenStr}` }})
      .then(res => {
        setsavedPosts(res.data);
      })
      .catch(err => console.error(err));
  }, []);   
  // fetch the posts

  const handleDelete = (id) => {
    axios 
      .put(server + "/delete/savedpost",{postId: id} , {headers: { Authorization: `Bearer ${tokenStr}` }})
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.error(err)); // delete from backend

    // delete from frontend
    setsavedPosts(savedPosts.filter(elem => {
        return (elem._id !== id);
    }))
  }

  return (
    <div>
      <Navbar />
      {savedPosts.map(elem => {
        return (
            <Post post={elem} handleDelete={() => handleDelete(elem._id)}/>
        )
      })}
    </div>
  );
};

export default SavedPostPage;