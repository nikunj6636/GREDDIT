const router = require("express").Router();
const reportModel = require("../models/reportModel");
const postModel = require("../models/postModel");
const subgredditModel = require("../models/subgredditModel");

const jwt = require("../middleware/auth");

const { default: mongoose } = require("mongoose");

router.post("/create/report", jwt.authenticateToken, async (request, response) => {

    let {concern, postId, reporteduser, subgredditId} = request.body;

    const object = {
        ["concern"]: concern,
        ["reportedby"]: request.user.email,
        ["reporteduser"]: reporteduser,
        ["reportedin"]: mongoose.Types.ObjectId(subgredditId),
        ["post"]: mongoose.Types.ObjectId(postId),  // passing an array here
        ["date"]: new Date()
    }
    
    const report = new reportModel(object);
    try{
        await report.save();
        response.send({message: "post reported successfully"}).status(201);
    }
    catch(err){
        response.status(500).send(err);
    }
})

router.post("/get/report", jwt.authenticateToken, async (request, response) => {
    
    await reportModel.findById(request.body.reportId)
        .then(async res => {

            await postModel.findById(res.post)
            .then(resp => {
                const object = {
                    data: res,
                    text: resp.text
                }
                response.send(object).status(201); // send the array of posts
            })
            .catch(err => {
                response.send(err).status(501);
            })
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

// to find all reports posted in a subgreddit

router.post("/myreports", jwt.authenticateToken, async (request, response) => {
    await reportModel.find({reportedin: mongoose.Types.ObjectId(request.body.subgredditId)})
        .then(res => {
            response.send(res).status(201); // send the array of posts
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

// to block the user from the subgreddit

router.put("/block/user", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.findByIdAndUpdate(request.body.id, {$pull: {people: request.body.email}}) 
        .then(async res => {
            await subgredditModel.findByIdAndUpdate(request.body.id, {$push: {removed: request.body.email}} )
            .then(result => {
                response.send({message: "user blocked"}).status(201);
            })
            .catch(err => {
                response.send(err).status(501);
            })
        })
        .catch(err => {
            response.send(err).status(500);
        })
})

// check if the user is blocked or not

router.post("/isblocked/user", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.findById(request.body.id)
    .then(result => {
        response.send(result.removed.includes(request.body.email)).status(201);
    })
    .catch(err => {
        response.send(err).status(501);
    })  
})

router.post("/ignore/user", jwt.authenticateToken, async (request, response) => {
    await reportModel.findByIdAndUpdate(request.body.id, {ignored: "yes"})
    .then(result => {
        response.send({message: "ignored successfully"}).status(201);
    })
    .catch(err => {
        response.send(err).status(501);
    })  
})

router.put("/delete/post", jwt.authenticateToken, async (request, response) => {
    await reportModel.findByIdAndDelete(request.body.reportId)
    .then(async a => {
        subgredditModel.findByIdAndUpdate(request.body.subgredditId, {$inc: {posts: -1}}) // to increment posts by 1
        .then(b => {
            postModel.findByIdAndDelete(request.body.postId)
            .then(c => {
                response.send({message: "post deleted successfully"})
            })
            .catch(err => {
                response.send(err).status(501);
            })
        })
        .catch(err => {
            response.send(err).status(502);
        })
    })
    .catch(err => {
        response.send(err).status(501);
    })  
})


module.exports = router;