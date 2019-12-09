const axios = require('axios');
const Domain = require('../models/domainModel');
const Progress = require('../models/progressModel');
const fns = require('../functions/fns');

const domainCheckRef = require('domain-check');
const DomainCheck = domainCheckRef.Domain;
getGoDaddyPromises = async (domainNames) => {
  promises = [];
  headers = { 'Content-Type': 'application/json', 'Authorization': 'sso-key 3mM44UaChUuE2R_APrYzPHR6r6edLh66Y8Y9E:78Xr4zXjQPU3s9GWSpmhfb' }
  for(let i=0; i<domainNames.length; i++){
    const url = `https://api.ote-godaddy.com/v1/domains/available?domain=${domainNames[i]}&checkType=FAST&forTransfer=false`;
    promises.push(axios.get(url, { headers }));
    await fns.sleep(200);
  }
  return promises;
}

generateDomainsFromGoDaddy = (responses) => {
  domains = [];
  for(let i=0; i<responses.length; i++){
    domains.push({ name: responses[i].data.domain, available: responses[i].data.available })
  }
  return domains;
}

getGooglePromises = (domainNames) => {
  let promises = []

  for (let i = 0; i < domainNames.length; i++) {
    const targetUrls = [
      `https://dns.google.com/resolve?name=${domainNames[i]}.com&type=A&dnssec=true`,
      `https://dns.google.com/resolve?name=${domainNames[i]}.com&type=AAAA&dnssec=true`,
      `https://dns.google.com/resolve?name=${domainNames[i]}.com&type=NS&dnssec=true`
    ];
    for (let j = 0; j < targetUrls.length; j++) {
      promises.push(axios.get(targetUrls[j]))
    }
  }
  return promises;
}

generateDomainsFromGoogle = (responses) => {
  let dataArr = []
  for (let i = 0; i < responses.length; i++) {
    if (responses[i].data.Question[0].name) {
      const index = dataArr
        .findIndex(value => value.name === responses[i].data.Question[0].name);
      if (index > -1) {
        dataArr[index].arr.push(responses[i]);
      } else {
        dataArr.push({
          name: responses[i].data.Question[0].name,
          arr: [responses[i]]
        });
      }
    }
  }
  return dataArr.map(value => {
    return {
      name: value.name.slice(0, -1),
      available: checkAvailable(value.arr)
    }
  });
}

exports.runGetAvailable = async () => {
  const progress = await Progress.findOne({ available: true });
  if(progress){
    this.getAvailableDomains();
  }
}
exports.getAvailableDomains = async () => {
  const x = await getProgressItem(true);
  console.log('x: ', x);
  const y = +(x.combinationType.charAt(x.combinationType.length-1));
  if(y <= 4){
    setProgressItem(true, x.combinationType, x.total, x.index + fns.AVAILABLE_STEP);
    return;
  }
  const combinations = fns
    .getCombintaions(x.combinationType, x.index, fns.AVAILABLE_STEP);
  const googlePromises = getGooglePromises(combinations);
  Promise.all(googlePromises)
    .then( responses => {
      return generateDomainsFromGoogle(responses)
        .filter( value => value.available === true)
        .map( value => {return value.name});
    })
    .then( async domainNames => {
      const promises = await getGoDaddyPromises(domainNames);
      Promise.all(promises)
        .then( responses => {
          const domains = generateDomainsFromGoDaddy(responses);
          if (domains.length > 0) {
            saveDomains(domains.filter(value => value.available === true));
          }
        })
    })
    .finally( () => {
      setProgressItem(true, x.combinationType, x.total, x.index + fns.AVAILABLE_STEP);
    })
    .catch( error => console.log('#error: ', error));
}


exports.getUnavailableDomains = async () => {
  const x = await getProgressItem(false);
  console.log('x: ', x);
  const combinations = fns
    .getCombintaions(x.combinationType, x.index, fns.UNAVAILABLE_STEP);
  const result = await getWhoisData(combinations);
  console.log(result.length);
  const domains = generateDomainsFormWhosis(result);
  // console.log(domains);
}

async function getWhoisData(urls){
  const arr = [];
  for (let i = 0; i < urls.length; i++) {
    const domain = new DomainCheck(urls[i]);
    const domainData = await domain;
    const name = await domain.domainUrl;
    const isFree = await domain.isFree();
    arr.push({ name: name, available: isFree, data: domainData });
    await fns.sleep(i * 257);
  }
  return arr;
}

async function generateDomainsFormWhosis(arr){
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    console.log('#arr', i, arr[i].data.whoisSearch);
    const name = arr[i].domainUrl;
    let available = true;
    let expirationDate = null;

    if (arr[i].data.whoisSearch.registrarRegistrationExpirationDate) {
      expirationDate = arr[i].whoisSearch.registrarRegistrationExpirationDate;
      console.log('in if', expirationDate);
    }
    // if (Object.keys(arr[i].data.whoisSearch).length > 6) {
    //   available = false;
    // }
    // if (expirationDate && !available) {
    //   result.push({ name, available });
    // }
  }
  return result;
}

async function getProgressItem(available){
  const progress = await Progress.findOne({ available: available });
  return progress.data.sort((a, b) => (a.lastUpdate > b.lastUpdate) ? 1 : -1)[0];
}

async function setProgressItem(available, combinationType, total, newIndex){
  const q = { $and: [
    { available: available},
    { 'data.combinationType': combinationType}
  ]};
  newIndex = (newIndex > total) ? 0 : newIndex;
  await Progress.findOneAndUpdate(q, {'data.$.index': newIndex, 'data.$.lastUpdate': Date.now()});
}

function checkAvailable(responses) {
  let available = null;
  available = responses
    .map(value => {
      if (value.data.Answer) {
        return false;
      }
      return true
    }).every(value => value === true);
  return available;
}

function saveDomains(domains) {
  for (let i = 0; i < domains.length; i++) {
    const domain = new Domain({
      name: domains[i].name,
      available: domains[i].available,
      combinationType: generateCombinationType(domains[i].name)
    });
    domain
      .save()
      .then(response => console.log())
      .catch(error => console.log(error));
  }
}

function generateCombinationType(domain) {
  const y = domain.substring(0, domain.length - 4);
  const size = y.length;
  let type = "";
  if (y.match(/^[a-zA-Z]+$/)) {
    type = "char";
  } else if (y.match(/^[0-9]+$/)) {
    type = "digit";
  } else if (y.match(/^[a-zA-Z0-9]+$/)) {
    type = "mixed";
  }
  return type + size;
}