import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import {Row, Container, Modal, Col} from 'react-bootstrap';
import axios from 'axios';

const MyFollowers = (props) => {

  const server = '/api';
  let tokenStr = localStorage.getItem("token");

  const [followers, setfollowers] = useState([]); // initially empty

  useEffect(() => { // myfollowers
    axios.get(server+'/myfollowers', { headers: {"Authorization" : `Bearer ${tokenStr}`} })
    .then(response => {
      setfollowers(response.data);
    })
    .catch(err => {
      console.log(err);
    })
  }, [])

  const removeUser = async (remove_email) => {
    await axios.put(server + '/remove', {email: remove_email} , { headers: {"Authorization" : `Bearer ${tokenStr}`} })
      .then((res) => {
        console.log(res.data);

        setfollowers( followers.filter(email => {
          return email != remove_email; // remove that email
        }));
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Followers
        </Modal.Title>
      </Modal.Header>

    {/* Body */}
      <Modal.Body>

      <Container fluid="sm"> {/* javascipt object here */}
        {followers.map(email => {
            return (
            <Row style={{marginBottom: 11}}>
                <Col xs={6} style={{paddingTop: 10}}>{email} </Col>
                <Col xs={6}>
                  <Button variant="light" onClick={() => removeUser(email)}>remove</Button>
                </Col>
            </Row>
          )
        })}
      </Container>

      </Modal.Body>

    </Modal>
  );
}

export default MyFollowers;