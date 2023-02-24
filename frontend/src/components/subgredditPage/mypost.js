import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";

import { AiFillLike, AiFillDislike } from "react-icons/ai";

const tokenStr = localStorage.getItem("token"); // subgreddits of logged in user
const server = "http://localhost:5000";
  
const ReportPostModal = ({postId, reporteduser, subgredditId}) => {

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
  
         axios
           .post(server + "/create/report", {
                  concern: values.text, 
                  postId: postId,
                  reporteduser: reporteduser,
                  subgredditId: subgredditId
                },
              { headers: {"Authorization" : `Bearer ${tokenStr}`} }
          )
           .then(res => {
              console.log(res.data);
              resetForm({values: ''}); // clear form values
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
          id="reportModal"
          tabIndex={-1}
          aria-labelledby="postModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Report the Post
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
                      placeholder="Enter the concern "
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
  

const Posts = ({postId}) => { // passing the post id to fetch and update the post

    // To take the input post here
    
    const [post,setpost] = useState({ // NOTE: initialize the data type
      text: '',
      upvotes: 0,
      downvotes: 0,
      comments: [],
      postedin: "",
      postedby: '',
      savedby: []
    });
  
    const [email, setemail] = useState('');
  
    useEffect(() => {
      axios.get(server+"/getemail", {headers: { Authorization: `Bearer ${tokenStr}` }})
      .then(res => {
        setemail(res.data);
      })
    }, [])  // fetch the email initially
    
    const [refresh, setrefresh] = useState(false);  // to renrender on update
  
    useEffect(() => {
      axios
        .post(server + "/get/post", {postId: postId}, {headers: { Authorization: `Bearer ${tokenStr}` }})
        .then(res => {
          setpost(res.data);  // async function
        })
        .catch(err => console.error(err));
    }, [refresh]);  // fetch the data on every refresh, updation of data
  
  
    // To take the comment here
  
    const [disabled, setDisabled] = useState(true); // for add comment button
  
    const validate = (values) => {
  
      const errors = {}; // declaring an object
  
      if (!values.comment) {
        errors.name = "Required";
        setDisabled(true);
      }
      else{
        setDisabled(false);
      } 
      return errors;
    };
  
    const formik = useFormik({
      initialValues: {
        comment: ""
      },
  
      validate,
    
      onSubmit: (values, {resetForm}) => { // post the subgreddit in the database
         axios
           .put(server + "/add/comment", {
                  comment: values.comment, 
                  postId: postId
                },
              { headers: {"Authorization" : `Bearer ${tokenStr}`} }
          )
           .then(res => {
              console.log(res.data);
              resetForm({values: ''}); // clear form values
              setrefresh(!refresh); // refresh on click to update the data          
           })
           .catch(err => {
              console.error(err)
           });
      }
    });
  
    const like = () => {  // refresh on click to update the data
      axios
        .put(server + "/like/post", {
                postId: postId
              },
            { headers: {"Authorization" : `Bearer ${tokenStr}`} }
        )
         .then(res => {
            console.log(res.data);
            setrefresh(!refresh); // to re-render the component            
         })
         .catch(err => {
            console.error(err)
         });
    }
  
    const dislike = () => {  // refresh on click to update the data
      axios
        .put(server + "/dislike/post", {
                postId: postId
              },
            { headers: {"Authorization" : `Bearer ${tokenStr}`} }
        )
         .then(res => {
            console.log(res.data);
            setrefresh(!refresh); // to re-render the component            
         })
         .catch(err => {
            console.error(err)
         });
    }
  
    const savePost = () => {
      axios
        .put(server + "/save/post", {
                postId: postId
              },
            { headers: {"Authorization" : `Bearer ${tokenStr}`} }
        )
         .then(res => {
            console.log(res.data);
            setrefresh(!refresh); 
         })
         .catch(err => {
            console.error(err)
         });
    }
  
    const followuser = () => {  // current user follows body.email
      axios
        .put(server + "/follow", {
                email: post.postedby
              },
            { headers: {"Authorization" : `Bearer ${tokenStr}`} }
        )
         .then(res => {
            if (res.data.message === "user is already followed"){
              alert("user already followed");
            }
            else{
              console.log(res.data);
              alert("user followed successfully")
            }
         })
         .catch(err => {
            console.log(err);
         });
    }
  
    return (
      <div className="mb-3">
  
        <p className="mb-1">{post.text}</p>
  
        <p> Posted By: {post.postedby} </p>
  
        <span>  {/* inline element */}
          {post.upvotes}
          <AiFillLike onClick={like}/>
        </span>
  
        <span style={{marginLeft: "0.5em"}}>
          {post.downvotes}
          <AiFillDislike onClick={dislike}/>
        </span>
  
        <h6 className="mb-2 mt-2">Comments</h6>
        {post.comments.map(elem => {  // elem is the comment string here
            return (
              <div>
                {elem}  {/* javascript object here */}
              </div>
            )
          })
        }
  
        <form onSubmit={formik.handleSubmit}> {/* to add comment */}
          <input  // inline element
            name="comment"
            placeholder="Enter the Comment"
            onChange={formik.handleChange}
            value={formik.values.comment}
          />
          <button type="submit" class="btn btn-primary" disabled={disabled} style={{marginLeft: "1em"}}>Add Comment</button>  
       </form>
  
       <button class="btn btn-primary mt-2" onClick={savePost} disabled={post.savedby.includes(email)}>Save Post</button>
  
       <button class="btn btn-primary mt-2 ms-4" onClick={followuser}> Follow </button>  

       <button   // to trigger modal
            type="button"
            className="btn btn-primary mt-2 ms-4"
            data-bs-toggle="modal"
            data-bs-target="#reportModal"
        >
            Report
        </button>

        <ReportPostModal postId={postId} reporteduser={post.postedby} subgredditId={post.postedin}/>  {/* postId given */}

      </div>
    )
}
  
export default Posts;