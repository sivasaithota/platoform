const sheduleDataService = require('../../dataServices').schedule;
const logger = require('../../common/logger');

class Schedule {
  async checkScheduleById(scheduleId) {
    logger.debug('Fetching schedule by Id', scheduleId);
    const scheduleCount = await sheduleDataService.getScheduleCountByProperties({ _id: scheduleId }, 1);
    return scheduleCount;
  }

  async checkScheduleByName(scheduleName, appId) {
    logger.debug('Fetching schedule by Name', scheduleName);
    const scheduleCount = await sheduleDataService.getScheduleCountByProperties({ name: scheduleName, appId }, 1);
    return scheduleCount;
  }
}

module.exports = new Schedule();
