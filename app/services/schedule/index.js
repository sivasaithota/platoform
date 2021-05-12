const scheduleDataService = require('../../dataServices').schedule;
const workflowScheduler = require('./workflowScheduler');
const helper = require('../../common/helper');
const logger = require('../../common/logger');

class Schedule {
  async getSchedules(idObject) {
    logger.debug('Getting schedules from the database');

    try {
      const result = await scheduleDataService.getSchedules(idObject.appId);
      const activeScheduleIds = result.filter(s => s.isActive).map(s => s._id.toString());
      const scheduleStatus = await workflowScheduler.getStatus(activeScheduleIds);
      logger.debug('Schedule status from workflow-api ', scheduleStatus);
      result.forEach((schedule) => {
        const status = scheduleStatus[schedule._id];
        if (status) {
          schedule.lastResult = status.state.toLocaleUpperCase();
          schedule.lastDuration = status.duration_in_sec;
        }
      });

      logger.debug('Successfully fetched schedules');
      return result;
    } catch (err) {
      logger.error('Error while getting schedules', err);
      throw err;
    }
  }

  async createSchedule(idObject, scheduleObject, userObject) {
    logger.debug('Creating a schedule in the database');
    let scheduleId;
    scheduleObject.isActive = true;
    scheduleObject.userEmail = userObject.username;
    Object.assign(scheduleObject, helper.getAuditProperties(userObject.username));

    try {
      scheduleId = (await scheduleDataService.createSchedule(idObject.appId, scheduleObject)).insertedId;
      await workflowScheduler.createSchedule(scheduleId, idObject.appId, scheduleObject);

      logger.debug('Successfully created schedule');
      return {
        id: scheduleId,
      };
    } catch (err) {
      logger.error('Error while creating schedule', err);
      if (scheduleId) await scheduleDataService.deleteSchedule(scheduleId);
      if (err.response) {
        logger.error(err.response.data)
      }
      throw err;
    }
  }

  async updateSchedule(idObject, scheduleObject, userObject) {
    logger.debug('Updating a schedule in the database', idObject.scheduleId);
    Object.assign(scheduleObject, helper.getAuditProperties(userObject.username, true));
    if (scheduleObject.isActive === false) scheduleObject.deactivatedBy = userObject.username;
    scheduleObject.userEmail = userObject.username;

    try {
      const result = await scheduleDataService.updateSchedule(idObject.scheduleId, scheduleObject);
      if (scheduleObject.isActive === false) {
        await workflowScheduler.deleteSchedule(idObject.scheduleId);
      } else {
        scheduleObject = await scheduleDataService.getScheduleByProperties({ _id: idObject.scheduleId });
        await workflowScheduler.updateSchedule(idObject.scheduleId, idObject.appId, scheduleObject);
      }

      logger.debug('Successfully updated schedule');
      return {
        ok: result.result.nModified > 0,
      };
    } catch (err) {
      logger.error('Error while updating schedule', err);
      if (err.response) {
        logger.error(err.response.data)
      }
      throw err;
    }
  }

  async deleteSchedule(idObject) {
    logger.debug('Deleting a schedule in the database', idObject.scheduleId);

    try {
      const result = await scheduleDataService.deleteSchedule(idObject.scheduleId);
      await workflowScheduler.deleteSchedule(idObject.scheduleId);
      logger.debug('Successfully deleted schedule');
      return {
        id: result.result.n > 0,
      };
    } catch (err) {
      logger.error('Error while deleting schedule', err);
      if (err.response) {
        logger.error(err.response.data)
      }
      throw err;
    }
  }
}

module.exports = new Schedule();
