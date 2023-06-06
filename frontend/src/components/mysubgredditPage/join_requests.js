import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";

let tokenStr = localStorage.getItem("token");
const server = '/api';


const JoinRequestsPage = () => {
    const { id } = useParams(); // subgreddit-id

    const [join_requests, setjoin_requests] = useState([]);

    useEffect(() => {
        axios 
          .post(server + "/get/subgreddit", {id: id}, {headers: { Authorization: `Bearer ${tokenStr}` }})
          .then(res => {
            setjoin_requests(res.data.join_requests);
          })
          .catch(err => console.error(err));
      }, []);

    const handleAccept = (sender) => {
        axios 
          .put(server + "/accept/request", {id: id, email: sender}, {headers: { Authorization: `Bearer ${tokenStr}` }})
          .then(res => {
            console.log(res.data);
          })
          .catch(err => console.error(err));

        setjoin_requests(join_requests.filter(elem => {
            return elem != sender;
        }))
    }

    const handleReject = (sender) => {
        axios 
          .put(server + "/reject/request", {id: id, email: sender}, {headers: { Authorization: `Bearer ${tokenStr}` }})
          .then(res => {
            console.log(res.data);
          })
          .catch(err => console.error(err));

        setjoin_requests(join_requests.filter(elem => {
            return elem != sender;
        }))
    }

    return ( 
        <div>
            <Navbar id={id}/>
            {join_requests.map(email => {
                return(
                    <div style={{display: 'flex', gap: '1em'}}>
                        <span> request to join send by: <i> {email} </i>  </span>
                        <button className="btn btn-primary" onClick={() => handleAccept(email)}> Accept </button>
                        <button className="btn btn-primary" onClick={() => handleReject(email)}> Reject </button>
                    </div>
                )
            })}
        </div>
    );
}
 
export default JoinRequestsPage;