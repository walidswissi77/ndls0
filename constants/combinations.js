const file_char2 = require('./combinationFiles/char/char2');
const file_char3 = require('./combinationFiles/char/char3');
const file_char4 = require('./combinationFiles/char/char4');
const file_char5 = require('./combinationFiles/char/char5');
const file_char6 = require('./combinationFiles/char/char6');

const file_digit2 = require('./combinationFiles/digit/digit2');
const file_digit3 = require('./combinationFiles/digit/digit3');
const file_digit4 = require('./combinationFiles/digit/digit4');
const file_digit5 = require('./combinationFiles/digit/digit5');
const file_digit6 = require('./combinationFiles/digit/digit6');

const file_mixed2 = require('./combinationFiles/mixed/mixed2');
const file_mixed3 = require('./combinationFiles/mixed/mixed3');
const file_mixed4 = require('./combinationFiles/mixed/mixed4');
const file_mixed5 = require('./combinationFiles/mixed/mixed5');
const file_mixed6 = require('./combinationFiles/mixed/mixed6');


exports.combinations = {
  getKeys: () => {
    return Object.keys(this.combinations);
  },
  digit2: (index, size) => {
    return file_digit2.get(index, size);
  },
  digit3: (index, size) => {
    return file_digit3.get(index, size);
  },
  digit4: (index, size) => {
    return file_digit4.get(index, size);
  },
  digit5: (index, size) => {
    return file_digit5.get(index, size);
  },
  digit6: (index, size) => {
    return file_digit6.get(index, size);
  },
  char2: (index, size) => {
    return file_char2.get(index, size);
  },
  char3: (index, size) => {
    return file_char3.get(index, size);
  },
  char4: (index, size) => {
    return file_char4.get(index, size);
  },
  char5: (index, size) => {
    return file_char5.get(index, size);
  },
  char6: (index, size) => {
    return file_char6.get(index, size);
  },
  mixed2: (index, size) => {
    return file_mixed2.get(index, size);
  },
  mixed3: (index, size) => {
    return file_mixed3.get(index, size);
  },
  mixed4: (index, size) => {
    return file_mixed4.get(index, size);
  },
  mixed5: (index, size) => {
    return file_mixed5.get(index, size);
  },
  mixed6: (index, size) => {
    return file_mixed6.get(index, size);
  }
};

exports.counts = {
  char2: () => {
    return file_char2.getCount();
  },
  char3: () => {
    return file_char3.getCount();
  },
  char4: () => {
    return file_char4.getCount();
  },
  char5: () => {
    return file_char5.getCount();
  },
  char6: () => {
    return file_char6.getCount();
  },
  digit2: () => {
    return file_digit2.getCount();
  },
  digit3: () => {
    return file_digit3.getCount();
  },
  digit4: () => {
    return file_digit4.getCount();
  },
  digit5: () => {
    return file_digit5.getCount();
  },
  digit6: () => {
    return file_digit6.getCount();
  },
  mixed2: () => {
    return file_mixed2.getCount();
  },
  mixed3: () => {
    return file_mixed3.getCount();
  },
  mixed4: () => {
    return file_mixed4.getCount();
  },
  mixed5: () => {
    return file_mixed5.getCount();
  },
  mixed6: () => {
    return file_mixed6.getCount();
  }
}
