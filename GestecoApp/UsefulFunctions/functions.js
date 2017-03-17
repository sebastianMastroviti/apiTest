module.exports = {

  'checkProperties': function (obj, keys, data) {
    keys.forEach(function (key) {
      if (data[key]) obj[key] = data[key];
    });
  },

  'parseJSON': function parseJSON(stringToParse) {
    return new Promise((fullfil, reject) => {
      try {
        fullfil(JSON.parse(stringToParse));
      } catch (e) {
        reject(e);
      }
    });
  }

}

