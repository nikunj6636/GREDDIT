const jwt = require("jsonwebtoken");
require('dotenv').config();

const createToken = (obj) => {
    const accessToken = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET);
    return {accessToken: accessToken};
}  

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user; // user is the obj here
      next();
    }); 
}

module.exports.authenticateToken = authenticateToken;
module.exports.createToken = createToken;