import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Fuse from "fuse.js";

import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";

const server = "http://localhost:5000";

const Card = ({ features, email, refresh }) => {
  
  const creator = features.created === email;
  const [follower, setfollower] = useState(features.people.includes(email));
  const [banned, setbanned] = useState(features.removed.includes(email));

  const tokenStr = localStorage.getItem("token"); // subgreddits of logged in user

  const handlejoin = (id) => {

    if (banned){
      alert("You can't join as you left the subgreddit earlier");
      return;
    }

    if (features.join_requests.includes(email)){
      alert("Joining request already send");
      return;
    }

    if (follower) {
      axios // adding him in the banned list as well
        .put(
          server + "/leave/subgreddit",
          { id: id },
          {
            headers: { Authorization: `Bearer ${tokenStr}` },
          }
        )
        .then((res) => {
          setfollower(false); // removed from the follower
          setbanned(true); // banned from further join
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } 
    
    else {
      axios
        .put(
          server + "/join/subgreddit",  // send the join request
          { id: id },
          {
            headers: { Authorization: `Bearer ${tokenStr}` },
          }
        )
        .then((res) => {
          alert("Joing request send to the Moderator");
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    refresh();
  };

  let navigate = useNavigate();

  return (
    <div className="card" style={{ width: "18rem", marginTop: "2rem" }}>
      <div className="card-body">
        <h5 className="card-title"> {features.name} </h5>

        <h6 className="card-subtitle mb-2 text-muted">
          {features.description}
        </h6>

        <div className="card-text">Followers: {features.people.length}</div>

        <div className="card-text">posts: {features.posts}</div>

        <div>
          <span> Banned keywords: </span>{" "}
          {/* span is used here for inline element */}
          {features.banned.map((elem) => {
            return <span> {elem}, </span>;
          })}
        </div>

        {/* To join or leave subgreddit */}
        <button
          type="button"
          className="btn btn-primary"
          disabled={creator}
          onClick={() => handlejoin(features._id)}
        >
          {follower ? "Leave" : "Join"}
        </button>

        {/* to open subgreddit */}
        <button
          type="button"
          className="btn btn-primary"
          disabled={!follower}
          onClick={() => navigate("/subgredditPage/" + features._id)}
          style={{marginLeft: "1em"}}
        >
          Open
        </button>

      </div>
    </div>
  );
};

const Subgreddits = () => {
  
  const [mysubgreddits, setmysubgreedits] = useState([]);
  const [allsubgreddits, setallsubgreedits] = useState([]);

  const [email, setemail] = useState("");

  const [refresh, setrefresh] = useState(false);

  const tokenStr = localStorage.getItem("token"); // subgreddits of logged in user

  useEffect(() => {
    // fetch the subgrediits created by the user and !user

    axios
      .get(server + "/joinedsubgreddits", {
        headers: { Authorization: `Bearer ${tokenStr}` },
      })
      .then((res) => {
        setmysubgreedits(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get(server + "/notjoinedsubgreddits", {
        headers: { Authorization: `Bearer ${tokenStr}` },
      })
      .then((res) => {
        setallsubgreedits(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get(server + "/getemail", {
        headers: { Authorization: `Bearer ${tokenStr}` },
      })
      .then((res) => {
        setemail((prev)=>res.data); // callback function
      })
      .catch(err => {
        console.log(err);
      })
  }, [refresh]);

  const formik = useFormik({
    initialValues: {
      name: "",
      tags: "",
      sort: "", // basis of sorting
    },
  });

  const myfuse = new Fuse(mysubgreddits, {
    // for making fuzzy search
    keys: ["name"],
  });

  const allfuse = new Fuse(allsubgreddits, {
    keys: ["name"],
  });

  const findTags = (set) => {
    // set is the list of all tags in the subgreddit
    let flag = true;

    if (formik.values.tags === "") return true; // empty here

    let tags = formik.values.tags.split(","); // chack whether all the required tags are in the input

    tags.map((elem) => {
      // if required tags are in the set then include, else exclude
      flag = set.includes(elem.toLowerCase());
      return true;
    });
    return flag;
  };

  const sortFunc = (a, b) => {
    // sorting func referred from internet

    if (formik.values.sort === "name")
      return a.name > b.name ? 1 : -1; // names in ascending order
    else if (formik.values.sort === "people")
      return (
        b.people.length - a.people.length
      ); // descending number of followers
    else return a.date > b.date ? -1 : +1; // date in descending order
  };

  return (
    <div>
      <Navbar />

      <form
        style={{
          width: "20em",
          margin: "auto",
          border: "solid blue",
          padding: "1em",
          marginTop: "1em",
        }}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name of SubGreddit
          </label>
          <input
            name="name"
            className="form-control"
            id="name"
            placeholder="filter by Name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Tags
          </label>
          <input
            className="form-control"
            id="tags"
            placeholder="Enter , separated tags"
            name="tags"
            onChange={formik.handleChange}
            value={formik.values.tags}
          />
        </div>

        <div className="mb-3">
          <label className="form-label"> Sort </label>
          <select
            class="form-select"
            aria-label="Default select example"
            onChange={formik.handleChange}
            value={formik.values.sort}
            name="sort"
          >
            <option selected value="date">
              {" "}
              Creation Date{" "}
            </option>
            <option value="name"> Name </option>
            <option value="people"> Followers </option>
          </select>
        </div>
      </form>

      {/* To display all the subgreddits */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {!formik.values.name &&
          mysubgreddits
            .filter((elem) => findTags(elem.tags))
            .sort(sortFunc)
            .map((elem) => {
              return (
                <Card
                  features={elem}
                  email={email}
                  refresh={() => setrefresh(!refresh)}
                />
              );
            })}
        {!formik.values.name &&
          allsubgreddits
            .filter((elem) => findTags(elem.tags))
            .sort(sortFunc)
            .map((elem) => {
              return (
                <Card
                  features={elem}
                  email={email}
                  refresh={() => setrefresh(!refresh)}
                  key={elem._id}
                />
              );
            })}

        {formik.values.name &&
          myfuse
            .search(formik.values.name)
            .map((elem) => {
              return elem.item;
            })
            .filter((elem) => findTags(elem.tags))
            .sort(sortFunc)
            .map((elem) => {
              return (
                <Card
                  features={elem}
                  email={email}
                  refresh={() => setrefresh(!refresh)}
                  key={elem._id}
                />
              ); // doing fizzy search in the frontend
            })}
        {formik.values.name &&
          allfuse
            .search(formik.values.name)
            .map((elem) => {
              return elem.item;
            })
            .filter((elem) => findTags(elem.tags))
            .sort(sortFunc)
            .map((elem) => {
              return (
                <Card
                  features={elem}
                  email={email}
                  refresh={() => setrefresh(!refresh)}
                  key={elem._id}
                />
              );
            })}
      </div>
    </div>
  );
};

export default Subgreddits;
