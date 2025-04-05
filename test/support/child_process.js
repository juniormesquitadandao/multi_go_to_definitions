const sinon = require('sinon');

const child_process = {
  exec: sinon.stub(),
  spawn: sinon.stub(),
  execSync: sinon.stub(),
};

module.exports = child_process; 