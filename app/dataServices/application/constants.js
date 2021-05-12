module.exports = {
  getFilterRulesbyUser: (user, sharedApps) => {
    const filterObj = {};
    if (!user.isAdmin) {
      filterObj.resourceId = { $in: sharedApps };
    }
    return filterObj;
  },
};
