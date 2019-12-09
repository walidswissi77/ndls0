const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const httpStatus = require("../constants/httpStatus");
const config = require("../config");
const User = require("../models/userModel");

exports.createUser = (req, res, next) => {
  const user = new User({
    username: req.body.username
  });
  user.save()
    .then( response => {
      res.status(httpStatus.CREATED.code).json({ created: response });
    })
    .catch( error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({ 
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });

    })
}

exports.firstLogin = async (req, res, next) => {
  const user = await getUserSync(req.body.username);
  if(user.password !== null){
    res.status(httpStatus.BAD_GATEWAY.code).json({
      message: httpStatus.BAD_GATEWAY.message
    });
    return;
  }
  const hash = bcrypt.hashSync(req.body.password, 10);
  User.updateOne({ username: req.body.username }, { $set: { password: hash, name: req.body.name } })
    .then(result => {
      if (result.n > 0) {
        const token = createToken(user)
        res.status(httpStatus.SUCCESS.code).json({
          token: token.token,
          id: user._id,
          expiresIn: token.expiresIn,
          username: user.username,
          name: req.body.name,
          role: user.role
        });
      }
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: "Couldn't update password!"
      });
    });

}

exports.login = async (req, res, next) => {
  const user = await getUserSync(req.body.username);
  if(!user){
    res.status(httpStatus.NOT_FOUND.code).json({
      message: 'Sorry, you don\'t exist.' 
    });
    return;
  }
  bcrypt.compare(req.body.password, user.password)
    .then( result => {
      if(result){
        const token = createToken(user)
        res.status(httpStatus.SUCCESS.code).json({
          token: token.token,
          expiresIn: token.expiresIn,
          id: user._id,
          username: user.username,
          name: user.name,
          role: user.role
        });
      } else {
        res.status(httpStatus.BAD_REQUEST.code).json({
          message: 'Wrong password.'
        });
      }
    })
    .catch( error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    })
}

exports.checkUsername = async (req, res, next) => {
  User.findOne({ username: req.params.username})
    .then( user => {
      if(user){
        res.status(httpStatus.SUCCESS.code).json({
          usernameExists: true,
          firstUse: user.password == null
        });
      }
      else{
        res.status(httpStatus.SUCCESS.code).json({
          usernameExists: false,
          firstUse: false
        });
      }
    })
    .catch(error => {
          res.status(httpStatus.SUCCESS.code).json({
            usernameExists: false,
            firstUse: false
          });
    })
}

exports.block = (req, res, next) => {
  User.findOneAndUpdate( {username: req.body.username}, {$set: { blocked: req.body.blocked}})
    .then( result => {
      if(result){
        res.status(httpStatus.SUCCESS.code).json({
          blocked: req.body.blocked
        });
      }
      else{
        res.status(httpStatus.NOT_FOUND.code).json({
          message: httpStatus.NOT_FOUND.message
        });
      }
    })
    .catch( error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
}

exports.getBlocked = (req, res, next) => {
  User.findOne({ username: req.userData.username})
    .then( result => {
      res.status(httpStatus.SUCCESS.code).json({
        blocked: result.blocked
      });
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
}

exports.getUsers = (req, res, next) => {
  User.find({ role: 'user' })
    .then(result => {
      res.status(httpStatus.SUCCESS.code).json({
        users: result
      });
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
}

exports.getUser = (req, res, next) => {
  User.findOne({ username: req.userData.username })
    .then(user => {
      if(user){
        res.status(httpStatus.SUCCESS.code).json({
          user: {
            name: user.name,
            blocked: user.blocked,
            username: user.username
          }
        });
      }
      else{
        res.status(httpStatus.NOT_FOUND.code).json({
          message: 'User doesn\'t exist'
        });
      }
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
}

exports.delete = (req, res, next) => {
  User.findOneAndRemove({ username: req.userData.username })
    .then(result => {
      console.log(result);
      if(result){
        res.status(httpStatus.SUCCESS.code).json({
          message: httpStatus.SUCCESS.message
        });
      }
      else{
        res.status(httpStatus.NOT_FOUND.code).json({
          message: httpStatus.NOT_FOUND.message
        });
      }
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
};
exports.deleteUser = (req, res, next) => {
  User.findOneAndRemove({ username: req.params.username })
    .then(result => {
      console.log(result);
      if(result){
        res.status(httpStatus.SUCCESS.code).json({
          deleted: true,
          message: `${req.params.username} account has been deleted.`
        });
      }
      else{
        res.status(httpStatus.NOT_FOUND.code).json({
          deleted: false,
          message: httpStatus.NOT_FOUND.message
        });
      }
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
};


function getUserSync(username){
  return User.findOne( { username: username});
}

function createToken(user) {
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.name
    },
    config.JWT_SECRET,
    { expiresIn: "3d" }
  );
  return { token: token, expiresIn: 259200 };
}