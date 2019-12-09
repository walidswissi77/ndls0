const jwt = require("jsonwebtoken");
const config = require('../config');

exports.checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    req.userData = { username: decodedToken.username, id: decodedToken.id, role: decodedToken.role, name: decodedToken.name };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated."});
  }
};

exports.checkAdmin = (req, res, next) => {
  try {

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    if(decodedToken.role == 'admin'){
      req.userData = { username: decodedToken.username, id: decodedToken.id };
      next();
    }
    else{
      res.status(401).json({ message: "You are not authorized." });
    }
  } catch (error) {

    res.status(401).json({ message: "You are not authenticated." });
  }
};
