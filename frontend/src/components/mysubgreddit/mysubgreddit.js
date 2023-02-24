import React, { useEffect, useState} from "react";
import { useFormik } from "formik";
import axios from "axios";
import Navbar from "../navbar";

import { useNavigate } from "react-router-dom";

const Modal = ({ refresh }) => {
  const [disabled, setDisabled] = useState(true);

  const [tags, settags] = useState([]);
  const [banned, setbanned] = useState([]);

  const validate = (values) => {
    const errors = {}; // declaring an object

    if (!values.name || !values.description || !values.tags || !values.banned)
      errors.name = "Required";

    let tags = values.tags.split(",");

    settags(
      tags.map((t) => {
        let words = t.split(" ");
        if (words.length > 1 || words.length === 0) {
          errors.tag = "multple word";
        } else if (words[0] !== words[0].toLowerCase()) {
          errors.tag = "Uppercase";
        }
        return words[0];
      })
    );

    let banned = values.banned.split(",");
    setbanned(
      banned.map((t) => {
        let words = t.split(" ");
        if (words.length > 1 || words.length === 0) {
          errors.banned = "multple word";
        }
        words[0] = words[0].toLowerCase();
        return words[0];
      })
    );

    if (!errors.banned && !errors.tag && !errors.name) setDisabled(false);
    else setDisabled(true);

    return errors;
  };

  let tokenStr = localStorage.getItem("token");
  const server = "http://localhost:5000";

  const formik = useFormik({
    // formik values
    initialValues: {
      name: "",
      description: "",
      tags: "",
      banned: "",
    },

    validate,

    onSubmit: (values, { resetForm }) => {
      // post the subgreddit in the database
      axios
        .post(
          server + "/create/subgreddit",
          {
            name: values.name,
            description: values.description,
            tags: tags,
            banned: banned,
          },
          { headers: { Authorization: `Bearer ${tokenStr}` } }
        )
        .then((res) => {
          console.log(res.data);
          resetForm({ values: "" }); // to clear the form values
          refresh(); // to re-render the page, to show added subgreddit
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                SubGreddit
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
                {" "}
                {/* to inherit the size of parent */}
                <div className="mb-3">
                  <input
                    name="name"
                    required
                    placeholder="Name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                </div>
                <div className="mb-3">
                  <input
                    name="description"
                    required
                    placeholder="Description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </div>
                <div className="mb-3">
                  <input
                    name="tags"
                    required
                    placeholder="Enter (,) separated in lowercase"
                    onChange={formik.handleChange}
                    value={formik.values.tags}
                  />
                </div>
                <div className="mb-3">
                  <input
                    name="banned"
                    required
                    placeholder="Enter , separated banned keyword"
                    onChange={formik.handleChange}
                    value={formik.values.banned}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={disabled}
                >
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

const Card = ({ features, handleDelete }) => {

  let navigate = useNavigate();

  return (
    <div className="card" style={{ width: "18rem", marginTop: "2rem" }}>
      <div className="card-body">
        <h5 className="card-title"> {features.name} </h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {" "}
          {features.description}{" "}
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

        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={handleDelete}
        >
          Delete
        </button>

        <button
          type="button"
          className="btn btn-primary mt-3 mx-3"
          onClick={() => navigate("/mysubgredditPage/" + features._id)}
        >
          Open
        </button>

      </div>
    </div>
  );
};

const MySubgreddit = () => {
  let tokenStr = localStorage.getItem("token");
  const server = "http://localhost:5000";

  const [mysubgreddits, setmysubgreedits] = useState([]);

  const [refresh, setrefresh] = useState(false);

  useEffect(() => {
    // fetch the subgrediits created by the user
    axios
      .get(server + "/mysubgreddits", {
        headers: { Authorization: `Bearer ${tokenStr}` },
      })
      .then((res) => {
        setmysubgreedits(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const handleDelete = async (id) => {
    await axios
      .put(
        server + "/delete/subgreddit",
        { _id: id },
        { headers: { Authorization: `Bearer ${tokenStr}` } }
      )
      .then((res) => {
        console.log(res.data);

        setmysubgreedits(
          mysubgreddits.filter((greddit) => {
            return greddit._id != id; // remove that email
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Navbar />

      <div style={{ textAlign: "center" }}>
        {/* Button trigger modal */}
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style={{ marginTop: "1em" }}
        >
          Create Sub-Greddit
        </button>

        <Modal refresh={() => setrefresh(!refresh)} />
      </div>

      {/* To display all the subgreddits */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {/* returns an array of cards */}
        {mysubgreddits.map((elem) => {
          return (
            <Card features={elem} handleDelete={() => handleDelete(elem._id)} />
          );
        })}
      </div>
    </div>
  );
};

export default MySubgreddit;
