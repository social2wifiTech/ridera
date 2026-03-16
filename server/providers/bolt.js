// Bolt — No API pública. Estimación propia + deep links.
const BaseProvider = require('./base');
class BoltProvider extends BaseProvider {
  constructor() { super('bolt'); }
}
module.exports = new BoltProvider();

