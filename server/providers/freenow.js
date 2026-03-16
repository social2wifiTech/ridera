// FREE NOW — API MyTaxi deprecada. Estimación propia + deep links.
const BaseProvider = require('./base');
class FreeNowProvider extends BaseProvider {
  constructor() { super('freenow'); }
}
module.exports = new FreeNowProvider();

