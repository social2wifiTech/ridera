// Cabify — No API pública. Estimación propia + deep links.
const BaseProvider = require('./base');
class CabifyProvider extends BaseProvider {
  constructor() { super('cabify'); }
}
module.exports = new CabifyProvider();

