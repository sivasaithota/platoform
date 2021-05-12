const Base = require('./base');
const controller = require('../controllers/schedule');
const validator = require('../middleware/validator/schedule');
const kc = require('../middleware/keycloak');
const { schedule } = require('../common/constants').permissions;

class Schedule extends Base {
  constructor() {
    super();
    this.get('/', kc.enforcer(schedule.read), validator.validateGetSchedules, controller.getSchedules);
    this.post('/', kc.enforcer(schedule.create), validator.validateCreateSchedule, controller.createSchedule);
    this.patch('/:scheduleId', kc.enforcer(schedule.update), validator.validateUpdateSchedule, controller.updateSchedule);
    this.delete('/:scheduleId', kc.enforcer(schedule.delete), validator.validateDeleteSchedule, controller.deleteSchedule);
  }
}

module.exports = Schedule;
