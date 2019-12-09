const axios = require('axios');
const bcrypt = require("bcryptjs");

const Domain = require('../models/domainModel');
const User = require('../models/userModel');
const Progress = require('../models/progressModel');
const cmbs = require('../constants/combinations');

exports.AVAILABLE_STEP = 20;
exports.UNAVAILABLE_STEP = 5;
exports.getCombintaions = (combinationType, skip, step) => {
  const index = (!skip) ? 0 : +skip;
  return cmbs.combinations[combinationType](index, step);
}
exports.getRandomIndex = async () => {
  const domainsCount = await Domain.find({ available: true }).countDocuments();
  let index = this.random(domainsCount - 10);
  index = (index < 0 )? 0 : index;

  console.log('ind', index);
  return index;
}

exports.sleep = async (millis) => {
  return new Promise(resolve => setTimeout(resolve, millis));
}

exports.getUserIndex = async (userId, combinationType) => {
  const user = await User.findOne({ _id: userId });
  if(user){
    return user.index[combinationType];
  }
  return null;
}

exports.setUserIndex = async (userId, combinationType, newIndex) => {
  const $set = { $set: {} };
  $set.$set['index.' + combinationType] = newIndex;
  await User.findOneAndUpdate({ _id: userId }, $set);
}


function randomCombinationType() {
  const types = ['char', 'digit', 'mixed'];
  const sizes = ['4', '5', '6'];
  const type = types[this.random(types.length)];
  const size = sizes[this.random(sizes.length)];
  return type+size;
}

exports.random = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

//init
exports.init = async () => {
  const usersCount = await User.find().countDocuments();
  if (usersCount === 0) {
    initUsers();
  }
  const progressCount = await Progress.find().countDocuments();
  if(progressCount == 0) {
    initProgress();
  }
}

async function initUsers(){
  const user1 = new User({
    username: 'trk',
    role: 'admin'

  })
  // const hash2 = bcrypt.hashSync('password', 10);
  const user2 = new User({
    username: 'nasriakil',
    role: 'admin'
  })
  await user1.save();
  await user2.save();
}
exports.geti = () => {
  const sizes = {};
  Object.keys(cmbs.counts)
    .forEach(key => {
      sizes[key] = cmbs.counts[key]();
    });
  console.log(sizes);
}
async function initProgress(){
  const sizes = {};
  Object.keys(cmbs.counts)
    .forEach(key => {
      sizes[key] = cmbs.counts[key]();
    });
  const available = new Progress({
    available: true,
    data: [
      { combinationType: 'char2', index: 0, total: sizes['char2'], lastUpdate: Date.now() },
      { combinationType: 'char3', index: 0, total: sizes['char3'], lastUpdate: Date.now() },
      { combinationType: 'char4', index: 0, total: sizes['char4'], lastUpdate: Date.now() },
      { combinationType: 'char5', index: 0, total: sizes['char5'], lastUpdate: Date.now() },
      { combinationType: 'char6', index: 0, total: sizes['char6'], lastUpdate: Date.now() },
      { combinationType: 'digit2', index: 0, total: sizes['digit2'], lastUpdate: Date.now() },
      { combinationType: 'digit3', index: 0, total: sizes['digit3'], lastUpdate: Date.now() },
      { combinationType: 'digit4', index: 0, total: sizes['digit4'], lastUpdate: Date.now() },
      { combinationType: 'digit5', index: 0, total: sizes['digit5'], lastUpdate: Date.now() },
      { combinationType: 'digit6', index: 0, total: sizes['digit6'], lastUpdate: Date.now() },
      { combinationType: 'mixed2', index: 0, total: sizes['mixed2'], lastUpdate: Date.now() },
      { combinationType: 'mixed3', index: 0, total: sizes['mixed3'], lastUpdate: Date.now() },
      { combinationType: 'mixed4', index: 0, total: sizes['mixed4'], lastUpdate: Date.now() },
      { combinationType: 'mixed5', index: 0, total: sizes['mixed5'], lastUpdate: Date.now() },
      { combinationType: 'mixed6', index: 0, total: sizes['mixed6'], lastUpdate: Date.now() }
    ]
  });
  const notAvailable = new Progress({
    available: false,
    data: [
      { combinationType: 'char2', index: 0, total: sizes['char2'], lastUpdate: Date.now() },
      { combinationType: 'char3', index: 0, total: sizes['char3'], lastUpdate: Date.now() },
      { combinationType: 'char4', index: 0, total: sizes['char4'], lastUpdate: Date.now() },
      { combinationType: 'digit2', index: 0, total: sizes['digit2'], lastUpdate: Date.now() },
      { combinationType: 'digit3', index: 0, total: sizes['digit3'], lastUpdate: Date.now() },
      { combinationType: 'digit4', index: 0, total: sizes['digit4'], lastUpdate: Date.now() },
      { combinationType: 'mixed2', index: 0, total: sizes['mixed2'], lastUpdate: Date.now() },
      { combinationType: 'mixed3', index: 0, total: sizes['mixed3'], lastUpdate: Date.now() },
      { combinationType: 'mixed4', index: 0, total: sizes['mixed4'], lastUpdate: Date.now() }
    ]
  });
  await available.save();
  await notAvailable.save();
}

