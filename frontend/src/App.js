import LoginPage from './components/login/loginPage';
import ProfilePage from './components/profile/profile';
import HomePage from './components/home/homepage';
import MySubgreddit from './components/mysubgreddit/mysubgreddit';
import Subgreddits from './components/subgreddits/subgreddits';
import SubgredditPage from './components/subgredditPage/subgredditPage';
import SavedPostPage from './components/savedPosts.js/savedPost';
import MySubgredditPage from './components/mysubgredditPage/mysubgredditPage';

// for mySubgreddits
import JoinRequestsPage from './components/mysubgredditPage/join_requests';
import ReportsPage from './components/mysubgredditPage/reports';
import UsersPage from './components/mysubgredditPage/users';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";


function App() { // use v6 version 

  const RequireAuth = ({ children }) => {
    const loggedInUser = localStorage.getItem("token"); // check if there is a user here
    if (!loggedInUser) 
    {
      return <LoginPage />; // traversing to loginPage
    }
    return children;
  };

    return (
    <Router> { /* Act as a Container */}
      <Routes>
        <Route path="/" element={<LoginPage />}/>

        <Route path="/profile" element={
             <RequireAuth>
                <ProfilePage />
             </RequireAuth>
          }
        />
        <Route path='/home' element={
              <RequireAuth>
                  <HomePage />
              </RequireAuth>
        } />

        <Route path='/mysubgreddit' element={
              <RequireAuth>
                  <MySubgreddit />
              </RequireAuth>
        } />
        <Route path='/subgreddits' element={
              <RequireAuth>
                  <Subgreddits />
              </RequireAuth>
        }/>
        <Route path='/subgredditPage/:id' element={
              <RequireAuth>
                  <SubgredditPage />
              </RequireAuth>
        }/>
        <Route path='/savedpostPage' element={
              <RequireAuth>
                  <SavedPostPage />
              </RequireAuth>
        }/>
        <Route path='/mysubgredditPage/:id' element={
              <RequireAuth>
                  <MySubgredditPage />
              </RequireAuth>
        }/>
        


        {/* routes for individual subgreddits */}


        <Route path='/join_requestsPage/:id' element={
              <RequireAuth>
                  <JoinRequestsPage />
              </RequireAuth>
        }/>

        <Route path='/report/:id' element={
              <RequireAuth>
                  <ReportsPage /> {/* All the reports of posted in a subgreddit */}
              </RequireAuth>
        }/>

        <Route path='/subgreddit/users/:id' element={
              <RequireAuth>
                  <UsersPage /> {/* All the reports of posted in a subgreddit */}
              </RequireAuth>
        }/>

      </Routes>
    </Router>
  )
}

export default App;