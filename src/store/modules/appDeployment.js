import axios from 'axios';
import message from '@/services/message';
import constant from '@/services/constant';
import SocketHandler from '@/services/socket';

export default {
  namespaced: true,

  actions: {
    // Sending command to deploy app to the server
    deployApp(state, { id, deployBody, deployOption }) {
      return new Promise((resolve, reject) => {
        const url = `${constant.api.enframe}apps/${id}/deployment/${deployOption}`;

        axios.post(url, deployBody)
          .then(({ data }) => {
            const socket = new SocketHandler();
            // connection to socket
            socket.start(data.result.deployment.roomId);
            // subscribing to socket event
            socket.registerEvent('updateDeploymentStatus', socketData => {
              if (socketData.result === constant.deployStatuses.success) {
                socket.close();
                resolve(data.result.url);
              }
              if (socketData.result === constant.deployStatuses.failure) {
                socket.close();
                reject(socketData);
              }
              // if the status is not Success or Failure - setting this status for app
              this.dispatch('applicationList/updateAppFromList', { id, status: socketData.result });
            });
          })
          .catch(e => reject(e));
      });
    },

    deleteApp(state, { id, withBackup, name, status }) {  // eslint-disable-line
      this.dispatch('applicationList/updateAppFromList', { id, status: constant.deployStatuses.running });
      axios.delete(
        `${constant.api.enframe}apps/${id}/`,
        { params: { withBackup } },
      )
        .then(() => {
          this.dispatch('applicationList/changeAppInfo', { status });
          this.dispatch('applicationList/updateAppFromList', { id, status: constant.deployStatuses.deleted });
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.success,
            title: message.appDeployment.deleteAppTitle,
            message: message.appDeployment.deleteSuccess(name),
          });
        })
        .catch(({ response }) => {
          this.dispatch('applicationList/updateAppFromList', { id, status: constant.deployStatuses.inactive });
          this.dispatch('snackbar/show', {
            type: constant.snackbarTypes.error,
            title: message.appDeployment.deleteAppErrorTitle,
            message: response.data.message,
          });
        });
    },
  },
};
