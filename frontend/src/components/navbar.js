import React from "react";
import { useNavigate } from 'react-router-dom';
import { FcHome, FcPortraitMode, FcImport, FcList, FcReading,  } from "react-icons/fc";
import { AiFillSave } from "react-icons/ai";

const Navbar = () => {

  let navigate = useNavigate(); // to navigate here

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

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
            <FcHome />
            Home
          </a>

          <a class="nav-item nav-link" href="#" onClick={() => navigate('/profile')}>
            <FcPortraitMode />
            Profile
          </a>

          <a class="nav-item nav-link" href="#" onClick={() => navigate('/mysubgreddit')}>
            <FcReading />
            My Subgreddit
          </a>
          <a class="nav-item nav-link" href="#" onClick={() => navigate('/subgreddits')}>
            <FcList />
            Subgreddits
          </a>

          <a class="nav-item nav-link" href="#" onClick={() => navigate('/savedpostPage')}>
            <AiFillSave />
            Saved Posts
          </a>

          <a class="nav-item nav-link" href="#" onClick={handleLogout}>
            <FcImport />
            Logout
          </a>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
