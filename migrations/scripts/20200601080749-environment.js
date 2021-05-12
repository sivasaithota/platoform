const localDockerRegistry = require('config').get('environments.localDockerRegistry');
const collectionNameConstants = require('../../app/common/constants').collection.names;
const typeConstants = require('../../app/common/constants').types;

const defaultEnvironments = [
  {
    internalName: 'tableau',
    type: 'internal',
    name: 'python-executor:3.5.2',
    command: 'python3.5 -uO',
    options: '',
    registry: 'opexanalytics/',
    description: 'python35',
  },
  {
    internalName: 'ticdat',
    type: 'internal',
    name: 'python-executor:3.8.1',
    command: 'python3.8 -uO',
    options: '',
    registry: 'opexanalytics/',
    description: 'python3',
  },
  {
    internalName: 'XlsxGenerator',
    type: 'internal',
    name: 'python-executor:3.8.1',
    command: 'python3.8 -uO',
    options: '',
    registry: 'opexanalytics/',
    description: 'python3',
  },
  {
    internalName: 'scanner',
    name: 'python-executor:3.7.2',
    type: 'internal',
    command: 'bandit',
    options: ' -t B605  --format custom --msg-template \'FileName:{relpath}:Line:{line:03}:Error Message: {msg}\'',
    registry: 'opexanalytics/',
    description: 'python_scanner',
  },
  {
    internalName: 'shiny',
    type: 'internal',
    name: 'r-executor:3.4.4',
    command: 'R -e \'shiny::runApp(/analytics_center/%s/shinyr,host=0.0.0.0,port=7279)\'',
    options: '',
    registry: 'opexanalytics/',
    description: 'shiny',
  },
  {
    name: 'terraform:0.11.11',
    command: {
      startCommand: 'terraform apply -auto-approve',
      stopCommand: 'terraform destroy -auto-approve',
    },
    type: 'internal',
    registry: 'opexanalytics/',
    description: 'terraform',
  },
  {
    name: 'r-executor:3.6.1',
    command: 'Rscript',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'Rscript',
  },
  {
    name: 'r-executor:3.4.4',
    command: 'Rscript',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'r-executor3.4.4',
  },
  {
    name: 'python-executor:3.7.2',
    command: 'python3.7 -uO',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'python3.7',
  },
  {
    name: 'python-executor:2.7.5',
    command: 'python -u',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'python2',
  },
  {
    name: 'python-executor:3.5.2',
    command: 'python3.5 -uO',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'python3.5',
  },
  {
    name: 'python-executor:3.8.1',
    command: 'python3.8 -uO',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'python3.8',
  },
  {
    name: 'node-executor:8.6.0',
    command: 'node',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'node',
  },
  {
    name: 'pandoc-executor:3.4.4',
    command: 'Rscript',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'pandoc',
  },
  {
    name: 'r-py-gurobi:3.8.1',
    command: 'python3.8 -uO',
    options: '-v /home/opex_workarea/docker_workarea/docker_volumes/common_store/licenses/gurobi.lic:/opt/gurobi810/gurobi.lic -v /home/opex_workarea/docker_workarea/docker_volumes/common_store/licenses/gurobi.lic:/opt/gurobi/gurobi.lic',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'r-py-gurobi',
  },
  {
    name: 'job-executor',
    command: 'sh',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'sh',
  },
  {
    name: 'python-tika:3.5.2',
    command: 'python3.5 -u',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'python-tika',
  },
  {
    name: 'dotnetcore-executor:3.1',
    command: 'sh /run.sh',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'dotnetcore',
  },
  {
    name: 'java-executor:8',
    command: 'sh /run.sh',
    options: '',
    type: 'default',
    registry: 'opexanalytics/',
    description: 'java8',
  },
];

const commandTemplates = {
  name: 'command',
  collection: [
    {
      typeName: 'python',
      displayName: 'python',
      versions: [
        { value: '2', displayValue: 'v2', command: 'python' },
        {
          value: '3', displayValue: 'v3', command: 'python3', defaultExtension: '.py',
        },
      ],
    },
    {
      typeName: 'shell',
      displayName: 'Shell Script',
      versions: [{
        value: '4', displayValue: 'v4', command: 'shell', defaultExtension: '.sh',
      }],
    },
    {
      typeName: 'pandoc',
      displayName: 'pandoc',
      versions: [{ value: '3', displayValue: 'v3', command: 'pandoc' }],
    },
    {
      typeName: 'r',
      displayName: 'R',
      versions: [{
        value: '3', displayValue: 'v3', command: 'Rscript', defaultExtension: '.r',
      }],
    },
    {
      typeName: 'node',
      displayName: 'Node.js',
      versions: [{
        value: '8', displayValue: 'v8', command: 'node', defaultExtension: '.js',
      }],
    },
    {
      typeName: 'r-py-gurobi',
      displayName: 'r-py-gurobi',
      versions: [{ value: '3.6.3', displayValue: 'v3.6.3', command: 'r-py-gurobi' }],
    },
    {
      typeName: 'python-tika',
      displayName: 'python-tika',
      versions: [{ value: '3.5.2', displayValue: 'v3.5.2', command: 'python-tika' }],
    },
  ],
};

module.exports = {
  async up(db) {
    await db.createCollection(collectionNameConstants.environment);
    await db.collection(collectionNameConstants.setting).updateOne({},
      {
        $set: {
          environment: {
            maxLimit: 10,
            baseDockerRegistry: 'opexanalytics',
            localDockerRegistry,
          },
        },
      });
    await db.collection(collectionNameConstants.environment).insertMany(defaultEnvironments);

    await db.collection(collectionNameConstants.template).deleteOne({ name: typeConstants.template.command });
  },

  async down(db) {
    await db.collection(collectionNameConstants.environment).drop();
    await db.collection(collectionNameConstants.template).insertOne(commandTemplates);
    await db.collection(collectionNameConstants.setting).updateOne({},
      {
        $unset: {
          environment: { },
        },
      });
  },
};
