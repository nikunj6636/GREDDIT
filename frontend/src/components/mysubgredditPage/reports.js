import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";

const tokenStr = localStorage.getItem("token"); // subgreddits of logged in user
const server = "http://localhost:5000";

const Report = ({ reportId, refresh }) => {
  const [report, setreport] = useState({
    reportedby: "",
    reporteduser: "",
    concern: "",
    reportedin: "", // subgreddit id
    ignored: "",
    post: "" // postId
  });

  const [text, settext] = useState("");
  
  const [blocked, setblocked] = useState(false);
  const [ignored, setignored] = useState(false);

  useEffect(() => {
    axios
      .post(
        server + "/get/report",
        { reportId: reportId },
        { headers: { Authorization: `Bearer ${tokenStr}` } }
      )
      .then((res) => {

        setreport(res.data.data);
        settext(res.data.text);
        setignored(res.data.data.ignored); // if empty, don't ignore

        axios
          .post(
            server + "/isblocked/user",
            { id: res.data.data.reportedin, email: res.data.data.reporteduser },  // put him in the blocked list
            { headers: { Authorization: `Bearer ${tokenStr}` } }
          )
          .then((res) => {
            setblocked(res.data);
          })
          .catch((err) => console.error(err));
        
      })
      .catch((err) => console.error(err));

  }, []);

  const blockUser = () => {
    if (blocked) {
      alert("User is already blocked");
      return;
    }
    
    axios
      .put(
        server + "/block/user",
        { id: report.reportedin, email: report.reporteduser },  // put him in the blocked list
        { headers: { Authorization: `Bearer ${tokenStr}` } }
      )
      .then((res) => {
        console.log(res.data);
        alert("user blocked successfully");
        setblocked(true);
      })
      .catch((err) => console.error(err));
  }

  const ignoreUser = () => {    

    if (ignored) {
      alert("Report already ignored");
      return;
    }

    axios
      .post(
        server + "/ignore/user",
        { id: reportId},  // put him in the blocked list
        { headers: { Authorization: `Bearer ${tokenStr}` } }
      )
      .then((res) => {
        console.log(res.data);
        setignored(true);
      })
      .catch((err) => console.error(err));
  }

  const deletePost = () => {
    axios
      .put(
        server + "/delete/post",
        { 
          reportId: reportId,
          subgredditId: report.reportedin,
          postId: report.post
        },
        { headers: { Authorization: `Bearer ${tokenStr}` } }
      )
      .then((res) => {
        console.log(res.data);
        refresh();
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <p> Reported By: {report.reportedby} </p>
      <p> Reported User: {report.reporteduser} </p>
      <p> concern: {report.concern} </p>
      <p> text of the post reported: {text} </p>

      <button className="btn btn-primary m-2 ms-0" onClick={blockUser} disabled={ignored}> Block User </button>
      <button className="btn btn-primary m-2" onClick={deletePost} disabled={ignored}> Delete Post </button>
      <button className="btn btn-primary m-2" onClick={ignoreUser}> Ignore </button>
    </div>
  );
};

const ReportsPage = () => {
  // passing the post id to fetch and update the post

  const { id } = useParams(); // subgreddit-id of which reports are generated
  const [reports, setreports] = useState([]);

  const [refresh, setrefresh] = useState(false);

  // to fetch all the reports posted in the subgreddit
  useEffect(() => {
    axios
      .post(
        server + "/myreports",
        { subgredditId: id },
        { headers: { Authorization: `Bearer ${tokenStr}` } }
      )
      .then((res) => {
        setreports(res.data);
      })
      .catch((err) => console.error(err));
  }, [refresh]);

  return (
    <div>
      <Navbar id={id} />
      {reports.map((elem) => {
        return <Report reportId={elem._id} refresh={() => setrefresh(!refresh)} />; // return the report id
      })}
    </div>
  );
};

export default ReportsPage;
