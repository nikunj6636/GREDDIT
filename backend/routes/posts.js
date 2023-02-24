const router = require("express").Router();

const postModel = require("../models/postModel");
const subgredditModel = require("../models/subgredditModel");

const jwt = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

router.post("/create/post", jwt.authenticateToken, async (request, response) => {

    let {text, banned} = request.body;

    let words = text.split(' ');

    words.forEach(elem => {
      if (banned.includes(elem.toLowerCase()) === true){
        text = text.replace(elem, "*"); // replaced by * here
      }
    });

    const object = {
        ["text"]: text,
        ["postedby"]: request.user.email,
        ["postedin"]: mongoose.Types.ObjectId(request.body.subgredditId),  // passing an array here
        ["date"]: new Date()
    }
    
    const post = new postModel(object);
    try{
        await post.save();

        await subgredditModel.findByIdAndUpdate(request.body.subgredditId, {$inc: {posts: 1}}) // to increment posts by 1
            .then(res => {
                response.status(201).send({message: "post created"});
            })
            .catch(err => {
                console.log(err);
                response.send(err).status(501);
                return;
            })   
    }

    catch(err){
        response.status(500).send(err);
        console.log(err);
    }
})

// to find all posts posted in a subgreddit

router.post("/myposts", jwt.authenticateToken, async (request, response) => {
    await postModel.find({postedin: mongoose.Types.ObjectId(request.body.subgredditId)})
        .then(res => {
            response.send(res).status(201); // send the array of posts
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

// to find post corresponding to id

router.post("/get/post", jwt.authenticateToken, async (request, response) => {
    await postModel.findById(request.body.postId)
        .then(async res => {
            await subgredditModel.findById(res.postedin)
            .then(result => {
                if (result.removed.includes(res.postedby)){
                    res.postedby = "Blocked User"
                }
                response.send(res).status(201); // send the array of posts
            })
            .catch(err => {
                response.send(err).status(500);
            })
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

// to add a comment in the post

router.put("/add/comment", jwt.authenticateToken, async (request, response) => {
    await postModel.findByIdAndUpdate(request.body.postId, {$push: {comments: request.body.comment}})
        .then(res => {
            response.send({message: "comment added"}).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

// to like the post

router.put("/like/post", jwt.authenticateToken, async (request, response) => {
    await postModel.findByIdAndUpdate(request.body.postId, {$inc: {upvotes: 1}})
        .then(res => {
            response.send({message: "post liked"}).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

// to dislike the post

router.put("/dislike/post", jwt.authenticateToken, async (request, response) => {
    await postModel.findByIdAndUpdate(request.body.postId, {$inc: {downvotes: 1}})
        .then(res => {
            response.send({message: "post disliked"}).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

// to add the post in saved

router.put("/save/post", jwt.authenticateToken, async (request, response) => {
    await postModel.findByIdAndUpdate(request.body.postId, {$push: {savedby: request.user.email}})
        .then(res => {
            response.send({message: "post saved"}).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})


router.put("/delete/savedpost", jwt.authenticateToken, async (request, response) => {
    await postModel.findByIdAndUpdate(request.body.postId, {$pull: {savedby: request.user.email}})
        .then(res => {
            response.send({message: "post deleted"}).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

router.get("/get/savedposts", jwt.authenticateToken, async (request, response) => {
    await postModel.find({savedby: {$in: request.user.email}})
        .then(res => {
            response.send(res).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

module.exports = router;