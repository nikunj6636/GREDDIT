import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";

let tokenStr = localStorage.getItem("token");
const server = 'http://localhost:5000';

const UsersPage = () => {
    const { id } = useParams(); // subgreddit-id

    const [subgreddit, setsubgreddit] = useState({
        removed: [], 
        people: []
    });

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

            <h4>Blocked Users</h4>

            {subgreddit.removed.map(elem => {
                return (
                    <div>
                        {elem}
                    </div>
                )
            })}

            <h4> Followers of Subgreddit</h4>

            {subgreddit.people.map(elem => {
                return (
                    <div>
                        {elem}
                    </div>
                )
            })}
        </div>
    );
}
 
export default UsersPage;