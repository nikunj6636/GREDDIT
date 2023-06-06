import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";

let tokenStr = localStorage.getItem("token");
const server = '/api';

const MySubgredditPage = () => {
    const { id } = useParams(); // subgreddit-id

    const [subgreddit, setsubgreddit] = useState({
        name: ""
    })

    useEffect(() => {
        axios 
          .post(server + "/get/subgreddit", {id: id}, {headers: { Authorization: `Bearer ${tokenStr}` }})
          .then(res => {
            setsubgreddit(res.data);
          })
          .catch(err => console.error(err));
      }, []);

    return ( 
        <div>
            <Navbar id={id}/>
            <div style={{textAlign: "center"}}>
                <h3> Welcome to the Subgreddit:  {subgreddit.name} </h3>
            </div>
        </div>
    );
}
 
export default MySubgredditPage;