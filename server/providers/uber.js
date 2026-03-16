// Uber — API deprecada en 2018. Estimación propia + deep links.
const BaseProvider = require('./base');
class UberProvider extends BaseProvider {
  constructor() { super('uber'); }
}
module.exports = new UberProvider();

