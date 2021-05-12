module.exports = {
  getParametersAggregatePipeline: (appId) => [
    {
      $match: {
        appId,
      },
    }, {
      $lookup: {
        from: 'parameters',
        localField: 'refParameters',
        foreignField: '_id',
        as: 'parameters',
      },
    }, {
      $unwind: {
        path: '$parameters',
        preserveNullAndEmptyArrays: true,
      },
    }, {
      $addFields: {
        parameterPosition: {
          $indexOfArray: ['$refParameters', '$parameters._id'],
        },
      },
    }, {
      $sort: {
        parameterPosition: 1,
      },
    }, {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        isCollapsed: { $first: '$isCollapsed' },
        position: { $first: '$position' },
        parameters: { $push: '$parameters' },
      },
    }, {
      $sort: {
        position: 1,
      },
    },
  ],
};
