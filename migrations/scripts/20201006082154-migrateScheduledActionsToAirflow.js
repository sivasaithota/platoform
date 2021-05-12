const collectionNameConstants = require('../../app/common/constants').collection.names;
const { createSchedule }  = require('../../app/services/schedule/workflowScheduler');

module.exports = {
  async up(db, client) {
    const schedules = await db.collection(collectionNameConstants.schedule).find();

    for (let i = 0; i < schedules.length; i += 1) {
      const schedule = schedules[i];
      if (schedule.type === 'once') return;
      schedule.userEmail = schedule.createdBy;
      await createSchedule(schedule._id, schedule.appId, schedule);
    }
    await client.db('scheduler').dropDatabase();
  },

  async down(db, client) {
    const schedules = await db.collection(collectionNameConstants.schedule).find();
    await client.db('scheduler').collection('schedules').insertMany(schedules);
  }
};
