import React, { useState ,useEffect } from "react";

// MUI styling
import {Avatar, Button, CssBaseline,TextField,FormControlLabel, Checkbox, Grid, Box, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// to Navigate and backend request
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// formik library for form validation
import { useFormik } from "formik";

// to validate the data
const validate = values => {
  const errors = {}; // declaring an object

  if (!values.email){ // empty error
    errors.email = 'Required' ;
    // just put every condn u have inside this section like length constraints
  }
  if (!values.password){
    errors.password = 'Required';
  }

  return errors;
}

// stateless functional components

const server = "/api";

const theme = createTheme();
export default function SignInPage({isSignIn}) {

  let navigate = useNavigate(); // to navigate here
  
  const formik = useFormik({  
    initialValues: {
      email: '', 
      password:'',
    },

    validate,

    onSubmit: values => {
      
      const email = values.email, password = values.password;

      axios.post(server + "/login" , {email: email, password: password})
        .then(response => {
            // contains data, status, headers, config, request    
            localStorage.setItem("token", response.data.accessToken);
            navigate('/home');
            // decided by statusCode
        })
        .catch(err => {
          if (err.response.status === 401){
            alert('invalid credentials');
          }
          else{
            console.log(err);
          }
        })
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Greddit
          </Typography>

          <Box component="form"  onSubmit={formik.handleSubmit}  sx={{ mt: 1 }}>

            <TextField
              margin="normal"
              fullWidth
              autoFocus
              label="Email Address"

              required
              name="email"
              type="text"

              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}

            <TextField
              margin="normal"
              fullWidth
              label="Password"

              required
              name="password"
              type="password"

              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}


            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>

          {/* See MUI style utilities */}
          <Box sx={{ display: 'flex' ,flexDirection: 'row', justifyContent:'flex-end', width: 1}}>
              <Button 
                variant="text"
                onClick = {isSignIn} // using property of the parent
                sx={{
                  fontSize: 15
                }}
              > 
                Don't have an account? Sign Up
              </Button>
          </Box>

        </Box>
      </Container>
    </ThemeProvider>
  );
}