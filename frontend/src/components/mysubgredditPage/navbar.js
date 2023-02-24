import React from "react";
import { useNavigate } from 'react-router-dom';

import { GrDashboard } from "react-icons/gr";

const Navbar = ({id}) => {

  let navigate = useNavigate(); // to navigate here

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">

      <span class="navbar-brand" href="#">
        Greddit
      </span>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">

          <a class="nav-item nav-link active" href="#" onClick={() => navigate('/home')}>
            <GrDashboard />
            Dashboard
          </a>

          <a class="nav-item nav-link" href="#" onClick={() => navigate('/subgreddit/users/' + id)}>
            Users
          </a>

          <a class="nav-item nav-link" href="#" onClick={() => navigate('/join_requestsPage/' + id)}>
            Joining Request
          </a>

          <a class="nav-item nav-link" href="#" onClick={() => navigate()}>
            Stats
          </a>

          <a class="nav-item nav-link" href="#" onClick={() => navigate('/report/' + id)}>
            Reported Page
          </a>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
