const workflowConfig = require('config').get('workflow');
const qs = require('qs');
const RequestHelper = require('../../common/requestHelper');
const actionDataService = require('../../dataServices/action');
const environmentDataService = require('../../dataServices/environment');
const logger = require('../../common/logger');

const requestHelper = new RequestHelper(workflowConfig.apiBaseUrl);

/*
 * We can have common configs across actions in actionsDefault.
 * If needed we could overide this in specific action in future.
 * This helps to reduce the payload.
 */
const transformToWorkflowSchedule = async (scheduleId, appId, scheduleData) => {
  const actionsFromDB = await actionDataService.getActions(appId);
  let startDate = new Date().toISOString().split('T')[0];
  if (scheduleData.dates && scheduleData.dates.length) {
    [customDateStr] = scheduleData.dates;
    startDate = new Date(customDateStr).toISOString().split('T')[0];
  }
  const start = new Date(`${startDate}T${scheduleData.runTime}:00.000Z`);
  const workingDir = `${workflowConfig.appBasePath}/${appId}${workflowConfig.scriptUploadDir}`;
  const workflowSchedule = {
    schedule_id: scheduleId,
    is_active: scheduleData.isActive,
    user_email: scheduleData.userEmail,
    tags: [scheduleData.name],
    schedule: {
      start,
      schedule_type: scheduleData.type,
      days: scheduleData.days,
    },
    actions: await Promise.all(
      scheduleData.actions.map(async (action) => {
        const actionData = actionsFromDB.find(a => a._id.toString() === action.actionId);
        const environmentData = await environmentDataService.getEnvironmentByName(actionData.environment);
        let command = `${environmentData.command} ${actionData.fileName} scenario_${action.scenarioId} `;
        command += `${workflowConfig.appBasePath}/${appId}${workflowConfig.appConfigPath}`;

        action_conf = {
          scenario_id: action.scenarioId,
          action_id: action.actionId,
          image: `${environmentData.registry}${environmentData.name}`,
          command,          
        };
        return action_conf;
      }),
    ),
    actionsDefault: {
      app_id: appId,
      network_mode: workflowConfig.dockerNetwork,
      working_dir: workingDir,
      volumes: [`${process.env.ANALYTICS_CENTER_BASE_FOLDER}:${workflowConfig.appBasePath}`],
    },
  };
  if (scheduleData.instance_type && scheduleData.instance_type !== 'default') {
    workflowSchedule["provision_server"] = {
      "size": action.instance_type
    }
  }  

  return workflowSchedule;
};

const createOrUpdateSchedule = async (scheduleId, appId, scheduleData, isUpdate) => {
  logger.debug('Incoming scheduled data', scheduleData);
  const workflowSchedule = await transformToWorkflowSchedule(scheduleId, appId, scheduleData);
  logger.debug('Payload for workflow api', workflowSchedule);
  if (isUpdate === true) {
    return requestHelper.put.url(`/actions/schedule/${scheduleId}`)
      .data(workflowSchedule).makeRequest();
  }
  return requestHelper.post.url('/actions/schedule')
    .data(workflowSchedule).makeRequest();
};

const createSchedule = (scheduleId, appId, scheduleData) => {
  return createOrUpdateSchedule(scheduleId, appId, scheduleData, false);
};

const updateSchedule = (scheduleId, appId, scheduleData) => {
  return createOrUpdateSchedule(scheduleId, appId, scheduleData, true);
};


const getStatus = async (scheduleIds) => {
  if (scheduleIds && scheduleIds.length) {
    const arrayQueryParam = [];
    scheduleIds.forEach(scheduleId => {
      arrayQueryParam.push(['schedule_ids', scheduleId])
    })

    const searchParams = new URLSearchParams(arrayQueryParam);
    const response = await requestHelper.get.url('/actions/schedule/statuses')
      .params(searchParams)
      .makeRequest();
    return response.data;
  }
  return [];
};

const deleteSchedule = (scheduleId) => {
  return requestHelper.delete.url(`/actions/schedule/${scheduleId}`).makeRequest();
};

module.exports = {
  createSchedule,
  updateSchedule,
  getStatus,
  deleteSchedule,
};
