const router = require("express").Router();
const userModel = require("../models/userModel");
const jwt = require("../middleware/auth");

// to bcyprt the function
const bcrypt = require('bcrypt');
const { request, response } = require("express");

router.get("/profile", jwt.authenticateToken, async (request, response) => { // get the profile of the user
  const user = await userModel.findOne({email: request.user.email});
  
  try {
    response.send(user).status(201); 
  } catch (error) {
    response.status(500).send(error);
  }
});

// to update the profle of the id
router.put("/profile/update", jwt.authenticateToken, async (request, response) => {
  await userModel.updateOne({email: request.user.email}, {$set: request.body})
  .then(res => {
    response.send({message: "updated"}).status(201);
  })
  .catch(err => {
    response.send(err).status(500);
  })
})

router.post("/register", async (request, response) => { // add_user

  const userExists = await userModel.findOne({email: request.body.email}); // conition here

  if (userExists) {
    response.status(400).send({ message: "Email already exists" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(request.body.password, salt);

  request.body.password = hashPassword;

  const user = new userModel(request.body); // creating a new object to be stored in the database

  try {
    await user.save(); // method to parse the string
    response.status(201).send( jwt.createToken( {email: request.body.email}) );
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/login", async (request, response) => { // post the profile of te user

  const user = await userModel.findOne({email: request.body.email}); // conition here

  try{

    if (!user) {
      response.status(401).send({ message: "Email does not exist"});
      return;
    }
  
    const cmp = await bcrypt.compare(request.body.password, user.password);
  
    if (cmp === false){ // this is false here
      response.status(401).send({ meassage: "Incorrect password"});
      return;
    }
  
    let accessToken = jwt.createToken( {email: request.body.email});
    response.status(201).send(accessToken); // response in {accessToken: __} object is passed
  }

  catch(err){
    response.send(err).status(404);
  }
});

router.get('/myfollowers', jwt.authenticateToken, async (req, res) => {
  await userModel.findOne({email: req.user.email})
        .then(response => {
          res.send(response.followers); // passing array in response
        })
        .catch(err => {
          res.send(err).status(401);
        });
})


router.get('/myfollowing', jwt.authenticateToken, async (req, res) => {
  await userModel.findOne({email: req.user.email})
        .then(response => {
          res.send(response.following); // passing array in response
        })
        .catch(err => {
          res.send(err).status(401);
        });
})

// current user req.user.email follows req.body.email

router.put('/follow' , jwt.authenticateToken, async (req,res) => { 

  if (req.user.email === req.body.email) {
    res.send({message: "you cannot follow yourself"}).status(401);
    return;
  }

  const user = await userModel.findOne({email: req.user.email}); // conition here

  if (user.following.includes(req.body.email)){
    res.send({message: "user is already followed"}).status(401);
    return;
  }

  await userModel.updateOne({email: req.body.email}, {
    $push: {followers: req.user.email}
  },{new: true} )
  .then(async result => {
    await userModel.updateOne({email: req.user.email}, {
      $push: {following: req.body.email}
    })
    .catch(err => {
      res.send(err).status(404);
      return;
    })
  })
  .then(result => {
    res.send({message: "Followed Successfully"}).status(201);
  })
  .catch(err => {
    res.send(err).status(401);
  }) 

})

// to remove the person from the following list
router.put('/unfollow' , jwt.authenticateToken, async (req,res) => { 

  await userModel.updateOne({email: req.body.email}, {
    $pull: {followers: req.user.email}
  },{new: true} )
  .then(async result => {
    await userModel.updateOne({email: req.user.email}, {
      $pull: {following: req.body.email}
    })
    .catch(err => {
      res.send(err).status(401);
      return;
    })
  })
  .then(result => {
    res.send({message: "Unfollowed Successfully"}).status(201);
  })
  .catch(err => {
    res.send(err).status(401);
  }) 

})

// to remove the person from followers list
router.put('/remove' , jwt.authenticateToken, async (req,res) => { 

  await userModel.updateOne({email: req.body.email}, {
    $pull: {following: req.user.email}
  },{new: true} )
  .then(async result => {
    await userModel.updateOne({email: req.user.email}, {
      $pull: {followers: req.body.email}
    })
    .catch(err => {
      res.send(err).status(401);
      return;
    })
  })
  .then(result => {
    res.send({message: "Removed Successfully"}).status(201);
  })
  .catch(err => {
    res.send(err).status(401);
  }) 

})

module.exports = router;