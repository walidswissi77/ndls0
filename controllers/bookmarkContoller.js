const Bookmark = require('../models/bookmarkModel');
const httpStatus = require("../constants/httpStatus");

exports.create = async (req, res, next) => {
  const domain = req.body.domain;
  const bookmark = new Bookmark({
    available: domain.available,
    name: domain.name,
    combinationType: domain.combinationType,
    username: req.userData.username,
    expirationDate: domain.expirationDate
  });
  bookmark.save()
    .then( result => {
      res.status(httpStatus.CREATED.code).json({
        bookmark: result
      });
    })
    .catch( error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
}

exports.remove = (req, res, next) => {
  console.log('bookmark id', req.params.id);
  Bookmark.findOneAndRemove( {_id: req.params.id})
    .then(result => {
      res.status(httpStatus.SUCCESS.code).json({
        message: httpStatus.SUCCESS.message
      });
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
}

exports.getBookmarks= (req, res, next) => {
  Bookmark.find({ username: req.userData.username })
    .then(result => {
      res.status(httpStatus.SUCCESS.code).json({
        bookmarks: result
      });
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message
      });
    });
}

