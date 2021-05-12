module.exports = {
  filters: {},
  projections: {
    getAll: {
      _id: 1,
      name: 1,
      description: 1,
      type: 1,
      runTime: 1,
      days: 1,
      dates: 1,
      actions: 1,
      isActive: 1,
      deactivationReason: 1,
      deactivatedBy: 1,
      createdBy: 1,
      instanceType: 1,
    },
  },
};
