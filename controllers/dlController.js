const fns = require('../functions/fns');
const dlfns = require('../functions/dlfns');
const Progress = require("../models/progressModel");
const Domain= require('../models/domainModel');
const httpStatus = require('../constants/httpStatus');


exports.test = async (req, res, next) => {
  fns.geti();
  // console.log(c );
}

exports.filterAvailableDomains = async (req, res, next) => {
  const save = req.query.save === 'true';
  const direction = +req.query.direction || 1;
  const count = +req.query.count || 0;
  const combinationType = req.params.type + req.params.size;
  const domainsCount = await Domain
  .find({ available: true, combinationType: combinationType}).countDocuments();
  let index = await fns.getUserIndex(req.userData.id, combinationType);
  if (index === null) {
    res.status(httpStatus.SUCCESS.code).json({ domains: [] });
    return;
  }
  if(direction < 0){
    index = index - count;
  }
  index = (index >= domainsCount || index < 0 )? 0 : index;
  Domain.find({ available: true, combinationType: combinationType}).skip(index).limit(count)
    .then(response => {
      let newIndex = index ;
      if (direction > 0) {
        newIndex = newIndex + direction * response.length;
      }
      newIndex = (newIndex >= domainsCount || newIndex < 0) ? 0 : newIndex;
      if (save){
        fns.setUserIndex(req.userData.id, combinationType, newIndex);
      }
      res.status(httpStatus.SUCCESS.code).json({
        domains: response,
        index: newIndex,
        total:domainsCount
      });
    })
    .catch(error => res.status(httpStatus.INTERNAL_SERVER_ERROR.code));
}

exports.getSuggestions = async (req, res, next) => {
  const index = await fns.getRandomIndex();
  if(index === null){
    res.status(httpStatus.SUCCESS.code).json({ domains: [] });
    return;
  }
  Domain.find({available: true})
    .skip(index)
    .limit(10)
    .then( response => {
      res.status(httpStatus.SUCCESS.code).json({ domains: response });
    })
    .catch( error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code);
    });
}

exports.getUnavailableDomains = (rq, res, next) => {
  // Domain.find({available: false}).limit(10).sort( {lastUpdate: -1});
}

exports.getProgress = (req, res, next) => {
  Progress.findOne({ available: req.params.available })
    .then(response => {
      res.status(httpStatus.SUCCESS.code).json({ progress: response.data });
    })
    .catch(error => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR.code);
    });
}