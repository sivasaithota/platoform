// list of possible app statuses
module.exports = {

  getEnframeInfoAggregatePipeline: (filterObj) => [
    {
      $match: filterObj,
    },
    {
      $group: { _id: '$status', count: { $sum: 1 } },
    },
  ],
};
