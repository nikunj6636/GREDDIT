import React, {useEffect} from 'react';

// MUI icons
import {Avatar, Button, CssBaseline,TextField, Grid, Box, Typography  } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// to Navigate
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// formik library for form validation
import { useFormik } from "formik";

const validate = values => {
  const errors = {}; // declaring an object
  
  // use validation conditions here

  return errors;
}

const theme = createTheme();

const server = 'http://localhost:5000';

export default function SignUpPage({isSignIn}) {
  
  let navigate = useNavigate();

  const formik = useFormik({ // formik values
    initialValues: {
      first_name:"",
      last_name:"",
      username:"",
      email: '', 
      password:'',
      age: 12,
      contact_number:""
    },

    validate,

    onSubmit: values => {
      axios.post(server + "/register", values)
          .then(response => {
            
            console.log(response.data);
            localStorage.setItem("token", response.data.accessToken);
            navigate('/home');
          })
          .catch(error => {
            console.log(error);
          });
      
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',  /* in top-down middle */
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Greddit
          </Typography>

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>

            <Grid container spacing={2}> 

              <Grid item xs={6}>
                <TextField
                  autoFocus
                  fullWidth
                  label="First Name"

                  required
                  name="first_name"

                  onChange={formik.handleChange}
                  value={formik.values.first_name}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.first_name && formik.errors.first_name ? <div>{formik.errors.first_name}</div> : null}
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"

                  required
                  name="last_name"

                  onChange={formik.handleChange}
                  value={formik.values.last_name}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.last_name && formik.errors.last_name ? <div>{formik.errors.last_name}</div> : null}
              </Grid>

              <Grid item xs={12}>
                <TextField
                   fullWidth
                   label="Username"
 
                   required
                   name="username"
 
                   onChange={formik.handleChange}
                   value={formik.values.username}
                   onBlur={formik.handleBlur}
                 />
                 {formik.touched.username && formik.errors.username ? <div>{formik.errors.username}</div> : null}
              </Grid>
              
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Age"

                  required
                  name="age"
                  type="number"

                  onChange={formik.handleChange}
                  value={formik.values.age}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.age && formik.errors.age ? <div>{formik.errors.age}</div> : null}
              </Grid>

              <Grid item xs={9}>
                <TextField
                  fullWidth
                  label="Contact no."

                  required
                  name="contact_number"
                  type="tel"

                  onChange={formik.handleChange}
                  value={formik.values.contact_number}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.contact_number && formik.errors.contact_number ? <div>{formik.errors.contact_number}</div> : null}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
    
                  required
                  name="email"
                  type="email"
    
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
              </Grid>

              <Grid item xs={12}>
                <TextField
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
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex' ,flexDirection: 'row', justifyContent:'flex-end', width: 1}}>
              <Button 
                variant="text"
                onClick = {isSignIn}
                sx={{
                  fontSize: 15
                }}
              > 
                Already have an account? Sign In
              </Button>
          </Box>
          
        </Box>
      </Container>
    </ThemeProvider>
  );
}
