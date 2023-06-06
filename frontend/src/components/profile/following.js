import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import {Row, Container, Modal, Col} from 'react-bootstrap';
import axios from 'axios';

const Following = ["aayush", "tejas", "rohan", "kartik", "apurva"];
// iterate over all the elements and dispaly their names

const MyFollowing = (props) => {

  const server = '/api';
  let tokenStr = localStorage.getItem("token");

  const [following, setfollowing] = useState([]); // initially empty

  useEffect(() => { // myfollowing
    axios.get(server+'/myfollowing', { headers: {"Authorization" : `Bearer ${tokenStr}`} })
    .then(response => {
      setfollowing(response.data);
    })
    .catch(err => {
      console.log(err);
    })
  }, [])

  const unfollowUser = async (unfollow_email) => {
    await axios.put(server + '/unfollow', {email: unfollow_email} , { headers: {"Authorization" : `Bearer ${tokenStr}`} })
      .then((res) => {
        console.log(res.data);

        setfollowing( following.filter(email => {
          return email != unfollow_email; // remove that email
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
          Following
        </Modal.Title>
      </Modal.Header>

    {/* Body */}
      <Modal.Body>

      <Container fluid="sm"> {/* javascipt object here */}
        {following.map(email => {
            return (
            <Row style={{marginBottom: 11}}>
                <Col xs={6} style={{paddingTop: 10}}>{email} </Col>
                <Col xs={6}>
                  <Button variant="light" onClick={() => unfollowUser(email)}> unfollow </Button>
                </Col>
            </Row>
          )
        })}
      </Container>
    
      </Modal.Body>

    </Modal>
  );
}

export default MyFollowing;