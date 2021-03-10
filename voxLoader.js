const readVox = require('vox-reader');

module.exports = (content) => {
  const obj = readVox(content);
  return `module.exports = ${JSON.stringify(obj)}`;
};
module.exports.raw = true;
