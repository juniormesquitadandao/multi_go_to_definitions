const { expect } = require('chai');
const deactivate = require('../src/deactivate');

describe('Deactivate Function', () => {
  it('should not throw an error when called', () => {
    expect(() => deactivate()).to.not.throw();
  });
});
