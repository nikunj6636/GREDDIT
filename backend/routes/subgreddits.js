const router = require("express").Router();

const subgredditModel = require("../models/subgredditModel");
const postModel = require("../models/postModel");
const reportModel = require("../models/reportModel");

const jwt = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

router.post("/get/subgreddit", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.findById(request.body.id)
        .then(res => {
            response.send(res).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

router.post("/create/subgreddit", jwt.authenticateToken, async (request, response) => {
    const object = {
        ...request.body,
        ["created"]: request.user.email,
        ["people"]: [request.user.email],  // passing an array here
        ["date"]: new Date()
    }
    const subgreddit = new subgredditModel(object);
    try{
        await subgreddit.save();
        response.status(201).send({message: "subgreddit created"});
    }
    catch(err){
        response.status(500).send(err);
    }
})

router.get("/mysubgreddits", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.find({created: request.user.email})
        .then(res => {
            response.send(res).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

router.get("/joinedsubgreddits", jwt.authenticateToken, async (request, response) => { // subgreddits that does not belong to user
    await subgredditModel.find({people: { $in: [request.user.email] } })    // people is an array that contians email as one of it's elements
        .then(res => {
            response.send(res).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

router.get("/notjoinedsubgreddits", jwt.authenticateToken, async (request, response) => { // subgreddits that does not belong to user
    await subgredditModel.find({people: {$nin: [request.user.email] }})    // people is an array that contians email as one of it's elements
        .then(res => {
            response.send(res).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})


router.put("/join/subgreddit", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.findByIdAndUpdate(request.body.id, {$push: {join_requests: request.user.email}}) 
        .then(res => {
            response.send({message: "Joining request send"}).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

router.put("/leave/subgreddit", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.findByIdAndUpdate(request.body.id, {$pull: {people: request.user.email}}) 
        .then(async res => {
            await subgredditModel.findByIdAndUpdate(request.body.id, {$push: {removed: request.user.email}} )
            .then(result => {
                response.send({message: "subgreddit leaved"}).status(201);
            })
            .catch(err => {
                response.send(err).status(501);
                return;
            })
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

router.get("/getemail", jwt.authenticateToken, async (request, response) => {
    try{
        response.send( request.user.email).status(201);
    }
    catch{
        response.send("email not fetched").status(501);
    }
})

router.put("/delete/subgreddit", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.findByIdAndDelete(request.body._id)
        .then(async res => {
            await postModel.deleteMany({postedin: mongoose.Types.ObjectId(request.body._id)})
            .then(async result => {
                await reportModel.deleteMany({reportedin: mongoose.Types.ObjectId(request.body._id)})
                .then(resp => {
                    response.send({message: "subgreddit, related posts and reports deleted"}).status(201);
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
            response.send(err).status(500);
        })
})

router.put("/accept/request", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.findByIdAndUpdate(request.body.id, {$push: {people: request.body.email}}) 
        .then(async res => {
            await subgredditModel.findByIdAndUpdate(request.body.id, {$pull: {join_requests: request.body.email}}) 
            .then(resp => {
                response.send({message: "Joining request accepted"}).status(201);
            })
            .catch(err => {
                response.send(err).status(501);
            })
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})


router.put("/reject/request", jwt.authenticateToken, async (request, response) => {
    await subgredditModel.findByIdAndUpdate(request.body.id, {$pull: {join_requests: request.body.email}}) 
        .then(res => {
            response.send({message: "Joining request rejected"}).status(201);
        })
        .catch(err => {
            response.send(err).status(500);
        })    
})

module.exports = router;