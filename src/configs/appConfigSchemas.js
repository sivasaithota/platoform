// Schemas of the application config files used for validation the uploaded config files

const viewIOSchema = {
  type: 'array',
  items: {
    title: 'viewSchema',
    properties: {
      viewName: {
        type: 'string',
      },
      displayName: {
        type: 'string',
      },
      definition: {
        type: 'string',
      },
      tag: {
        class: {
          type: 'string',
        },
        tagName: {
          type: 'string',
        },
      },
      columns: {
        type: 'array',
        items: {
          properties: {
            columnName: {
              type: 'string',
            },
            displayName: {
              type: 'string',
            },
            visible: {
              name: {
                type: 'string',
              },
              value: {
                type: 'boolean',
              },
            },
            type: {
              type: 'string',
            },
            editable: {
              name: {
                type: 'string',
              },
              value: {
                type: 'boolean',
              },
            },
          },
          required: ['columnName', 'displayName', 'visible', 'type', 'editable'],
        },
      },
    },
    required: ['viewName', 'displayName', 'definition', 'tag', 'columns'],
  },
};

const editIOSchema = {
  type: 'array',
  items: {
    properties: {
      tableName: {
        type: 'string',
      },
      columns: {
        type: 'array',
        items: {
          properties: {
            columnName: {
              type: 'string',
            },
            custom_sql: {
              type: 'string',
            },
            dependent_schema: {
              type: 'string',
            },
            dependent_table: {
              type: 'string',
            },
            dependent_column: {
              type: 'string',
            },
            parent_column_name: {
              type: 'string',
            },
            custom_values: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};

// The properties should match the config file name
export default {
  TableConfig: {},

  InputTableConfig: {
    type: 'object',
    properties: {
      input: {
        type: 'array',
        minItems: 1,
        items: {
          title: 'Input',
          properties: {
            fileName: {
              type: 'string',
            },
            tableName: {
              type: 'string',
            },
            displayName: {
              type: 'string',
            },
            visible: {
              type: 'boolean',
            },
            inputColums: {
              type: 'array',
              minItems: 1,
              items: {
                properties: {
                  columnName: {
                    type: 'string',
                    pattern: '^[^,&]*$',
                  },
                  displayName: {
                    type: 'string',
                    pattern: '^[^,&]*$',
                  },
                  unique: {
                    type: 'boolean',
                  },
                  type: {
                    type: 'string',
                    pattern: '^(integer|double precision|varchar|date|text|boolean|timestamp|bigint|numeric)$',
                  },
                  visible: {
                    type: 'object',
                    properties: {
                      value: {
                        type: 'boolean',

                      },
                      name: {
                        type: 'string',
                        pattern: '^(Yes|No)$',
                      },
                    },
                    required: ['value', 'name'],

                  },
                  editable: {
                    type: 'object',
                    properties: {
                      value: {
                        type: 'boolean',

                      },
                      name: {
                        type: 'string',
                        pattern: '^(Yes|No)$',
                      },
                    },
                    required: ['value', 'name'],

                  },
                },
                required: ['columnName', 'displayName', 'type'],
              },
            },
            edit: {
              type: 'boolean',
            },
            tag: {
              type: 'object',
              properties: {
                class: {
                  type: 'string',

                },
                tagName: {
                  type: 'string',

                },
              },
            },
          },
          required: ['fileName', 'tableName', 'displayName', 'inputColums', 'tag'],
        },
      },
    },
    minProperties: 1,
  },

  OutputTableConfig: {
    type: 'object',
    properties: {
      output: {
        type: 'array',
        minItems: 1,
        items: {
          title: 'output',
          properties: {
            fileName: {
              type: 'string',
            },
            tableName: {
              type: 'string',
            },
            displayName: {
              type: 'string',
            },
            visible: {
              type: 'boolean',
            },
            outputColums: {
              type: 'array',
              minItems: 1,
              items: {
                properties: {
                  columnName: {
                    type: 'string',
                    pattern: '^[^,&]*$',
                  },
                  displayName: {
                    type: 'string',
                    pattern: '^[^,&]*$',
                  },
                  unique: {
                    type: 'boolean',
                  },
                  type: {
                    type: 'string',
                    pattern: '^(integer|double precision|varchar|date|text|boolean|timestamp|bigint|numeric)$',
                  },
                  visible: {
                    type: 'object',
                    properties: {
                      value: {
                        type: 'boolean',
                      },
                      name: {
                        type: 'string',
                        pattern: '^(Yes|No)$',
                      },
                    },
                    required: ['value', 'name'],
                  },
                  editable: {
                    type: 'object',
                    properties: {
                      value: {
                        type: 'boolean',
                      },
                      name: {
                        type: 'string',
                        pattern: '^(Yes|No)$',
                      },
                    },
                    required: ['value', 'name'],
                  },
                },
              },
            },
            edit: {
              type: 'boolean',
            },
            tag: {
              type: 'object',
              properties: {
                class: {
                  type: 'string',
                },
                tagName: {
                  type: 'string',
                },
              },
              required: ['class', 'tagName'],
            },
          },
          required: ['fileName', 'tableName', 'displayName', 'outputColums', 'tag'],
        },
      },
    },
    minProperties: 1,
  },

  ParameterOptionsConfig: {
    type: 'object',
    properties: {
      parameterOptions: {
        type: 'array',
        items: {
          properties: {
            groupName: {
              type: 'string',
            },
            displayName: {
              type: 'string',
            },
            dependency: {
              type: 'object',
              properties: {
                columnName: {
                  type: 'string',
                },
                custom_sql: {
                  type: 'string',
                },
                dependent_schema: {
                  type: 'string',
                },
                dependent_table: {
                  type: 'string',
                },
                dependent_column: {
                  type: 'string',
                },
                custom_values: {
                  type: 'boolean',
                },
              },
            },
          },
        },
      },
    },
  },

  ParameterConfig: {
    type: 'object',
    properties: {
      parameter: {
        type: 'array',
        minItems: 1,
        items: {
          properties: {
            groupName: {
              type: 'string',
            },
            parameters: {
              type: 'array',
              minItems: 1,
              items: {
                title: 'paramerters',
                properties: {
                  parameter: {
                    type: 'array',
                  },
                  displayName: {
                    type: 'string',
                  },
                  type: {
                    type: 'integer',
                    pattern: '^(1|2|3|4|5|6)$',
                  },
                  validation: {
                    type: 'string',
                  },
                  viewName: {
                    type: 'string',
                  },
                  tooltip: {
                    type: 'string',
                  },
                  dropdown: {
                    type: 'string',
                  },
                  isOpen: {
                    type: 'boolean',
                  },
                },
              },
            },
          },
          required: ['groupName', 'parameters'],
        },
      },
    },
    minProperties: 1,
  },

  TemplateConfig: {
    type: 'object',
    properties: {
      templates: {
        type: 'array',
        items: {
          properties: {
            id: {
              type: 'integer',
            },
            appId: {
              type: 'integer',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  },

  EditTableConfig: {
    type: 'object',
    properties: {
      input: editIOSchema,
      output: editIOSchema,
    },
    minProperties: 1,
  },

  ViewConfig: {
    type: 'object',
    properties: {
      input: viewIOSchema,
      output: viewIOSchema,
    },
    minProperties: 1,
  },

  MacrosConfig: {
    type: 'object',
    properties: {
      macros: {
        type: 'array',
        minItems: 1,
        items: {
          title: 'macros',
          properties: {
            segment: {
              type: 'string',
              pattern: '^(input|output)$',
            },
            type: {
              type: 'string',
              pattern: '^(input_refresh|output_refresh|input_validation|output_validation|validation|secondary|primary|upload|download)$',
            },
            actionDesc: {
              type: 'string',
            },
            fileName: {
              type: 'string',
            },
            commandToExecute: {
              type: 'string',
              pattern: '^(python|pandoc|node|sh|python3|Rscript|python-tika)$',
            },
          },
        },
      },
    },
    minProperties: 1,
  },

  TableauConfig: {
    type: 'object',
    properties: {
      input: {
        type: 'array',
        items: {
          properties: {
            id: {
              type: 'integer',
            },
            type: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
            label: {
              type: 'string',
            },
            project: {
              type: 'string',
            },
            workbook: {
              type: 'string',
            },
          },
        },
      },
      output: {
        type: 'array',
        items: {
          properties: {
            id: {
              type: 'integer',
            },
            type: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
            label: {
              type: 'string',
            },
            project: {
              type: 'string',
            },
            workbook: {
              type: 'string',
            },
          },
        },
      },
      tableauTrusted: {
        type: 'boolean',
      },
      tableauUsername: {
        type: 'string',
      },
      tableauExtract: {
        type: 'boolean',
      },
      tableauInput: {
        type: 'boolean',
      },
      tableauOutput: {
        type: 'boolean',
      },
    },
  },

  RowWidgetConfig: {
    type: 'object',
    properties: {
      rowView: {
        type: 'array',
        items: {
          properties: {
            table: {
              type: 'string',
            },
            type: {
              type: 'string',
            },
            columns: {
              type: 'array',
              items: {
                properties: {
                  name: {
                    type: 'string',
                  },
                  position: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
