module.exports = {
  projections: {
    table: {
      _id: 1,
      name: 1,
      displayName: 1,
      type: 1,
      tag: 1,
      isVisible: 1,
    },
    column: {
      'columns._id': 1,
      'columns.name': 1,
      'columns.displayName': 1,
      'columns.datatype': 1,
      'columns.length': 1,
      'columns.precision': 1,
      'columns.scale': 1,
      'columns.isVisible': 1,
      'columns.hasFilter': 1,
      'columns.isEditable': 1,
    },
  },
};
