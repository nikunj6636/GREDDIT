import React, {useState, useEffect} from "react";
import './profile.css'
import Navbar from "../navbar";

// to import for modal
import MyFollowers from "./followers";
import MyFollowing from "./following";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const server = '/api';

const ProfilePage = () => {

  let tokenStr = localStorage.getItem("token");

  // Followers

  // to use pop up box / modal
  const [FollowersShow, setFollowersShow] = useState(false);
  const [n_followers, setn_followers] = useState(null);

  useEffect(() => { // myfollowers
    axios.get(server+'/myfollowers', { headers: {"Authorization" : `Bearer ${tokenStr}`} })
    .then(response => {
      setn_followers(response.data.length)
    })
    .catch(err => {
      console.log(err);
    })
  }, [FollowersShow])


  // Following

  const [FollowingShow, setFollowingShow] = useState(false); 
  const [n_following, setn_following] = useState(null);

  useEffect(() => { // myfollowing
    axios.get(server+'/myfollowing', { headers: {"Authorization" : `Bearer ${tokenStr}`} })
    .then(response => {
      setn_following(response.data.length);
    })
    .catch(err => {
      console.log(err);
    })
  }, [FollowingShow])

  const [editProfile, seteditProfile] = useState(false); // for edit profile button
  
  const [Profile, setProfile] = useState({ // initial defn
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    contact_number:"",
    age:12
  });

    // function called only once after first render
    useEffect(() => {
        axios.get(server + "/profile", { headers: {"Authorization" : `Bearer ${tokenStr}`} } )
        .then(response => {
            setProfile(response.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []); 

    const handleChange = (e) => { // e(event) as parameter, contains info about event that just happened
        setProfile((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value // change state of object, learned through chatGPT
        }))
      }

    // to update the profile
    const handleEdit = () => {
        if (editProfile === true){
            axios.put(server + '/profile/update', Profile, { headers: {"Authorization" : `Bearer ${tokenStr}`} })
            .then(response => {
                console.log(response.data);
            })
            .catch(err => {
                console.log(err);
            });
        }
        seteditProfile(!editProfile);
    };
    
  return (
    <div className='profile'>

    <Navbar />

    <div class="container rounded bg-white mt-5">   {/* margin-top */}
    <div class="row">
        <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"/><span class="font-weight-bold">{Profile.first_name}</span><span class="text-black-50">{Profile.username}</span><span> </span></div>
        </div>
        <div class="col-md-5 border-right">
            <div class="p-3 py-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-right">Profile Settings</h4>
                </div>
                <div class="row mt-2">
                    <div class="col-md-6"><label class="labels"> First Name</label><input name="first_name" class="form-control" placeholder="First Name" value={Profile.first_name} onChange={handleChange} disabled={!editProfile} /></div>
                    <div class="col-md-6"><label class="labels">Last Name</label><input name="last_name" class="form-control" value={Profile.last_name} placeholder="Last Name" onChange={handleChange} disabled={!editProfile}/></div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-12"><label class="labels">Contact no.</label><input name="contact_number" class="form-control" placeholder="enter phone number" value={Profile.contact_number} onChange={handleChange} disabled={!editProfile} /></div>
                    <div class="col-md-12"><label class="labels">username</label><input name="username" class="form-control" placeholder="enter username" value={Profile.username} onChange={handleChange} disabled={true} /></div>
                    <div class="col-md-12"><label class="labels">email</label><input name="email" class="form-control" placeholder="enter email" value={Profile.email} onChange={handleChange} disabled = {true} /></div>
                    <div class="col-md-12"><label class="labels">age</label><input name="age" class="form-control" placeholder="enter age" value={Profile.age} onChange={handleChange} disabled={!editProfile} /></div>
                </div>

                {/* edit button */}
                <div class="mt-5 text-center">
                    <button class="btn btn-primary profile-button" type="button" onClick={handleEdit}>{editProfile ? "Save Profile" : "Edit Profile"}
                    </button>
                </div>

            </div>
        </div>
        <div class="col-md-4">
            <div class="p-3 py-5"> {/* to set padding of 3, and 4 top and bottom */}
            
            {/* Followers */}
            <div class="col-md-12" className="Followers">
                <span> Followers </span>
                <Button variant="primary" onClick={() => setFollowersShow(true)}>
                    {n_followers}
                </Button>
                <MyFollowers
                  show={FollowersShow}
                  onHide={() => setFollowersShow(false)}
                />
            </div>

            {/* Following */}
            <div class="col-md-12" className="Following">
                <span> Following </span>
                <Button variant="primary" onClick={() => setFollowingShow(true)}>
                    {n_following}
                </Button>
                <MyFollowing
                  show={FollowingShow}
                  onHide={() => setFollowingShow(false)}
                />
            </div>

            </div>
        </div>
    </div>
    </div>
</div>
  );
};

export default ProfilePage;
