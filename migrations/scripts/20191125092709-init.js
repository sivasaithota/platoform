/* eslint-disable object-curly-newline */

const crypto = require('crypto');
const { ObjectID } = require('mongodb');

const collectionNameConstants = require('../../app/common/constants').collection.names;

const collections = {
  templates: [
    {
      name: 'command',
      collection: [
        {
          typeName: 'python',
          displayName: 'python',
          versions: [
            { value: '2', displayValue: 'v2', command: 'python' },
            { value: '3', displayValue: 'v3', command: 'python3', defaultExtension: '.py' },
          ],
        },
        {
          typeName: 'shell',
          displayName: 'Shell Script',
          versions: [{ value: '4', displayValue: 'v4', command: 'shell', defaultExtension: '.sh' }],
        },
        {
          typeName: 'pandoc',
          displayName: 'pandoc',
          versions: [{ value: '3', displayValue: 'v3', command: 'pandoc' }],
        },
        {
          typeName: 'r',
          displayName: 'R',
          versions: [{ value: '3', displayValue: 'v3', command: 'Rscript', defaultExtension: '.r' }],
        },
        {
          typeName: 'node',
          displayName: 'Node.js',
          versions: [{ value: '8', displayValue: 'v8', command: 'node', defaultExtension: '.js' }],
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
    },
    {
      name: 'datatype',
      collection: [
        { typeName: 'varchar', properties: ['length'] },
        { typeName: 'numeric', properties: ['precision', 'scale'] },
        { typeName: 'double precision', properties: ['precision'] },
        { typeName: 'integer', properties: [] },
        { typeName: 'date', properties: [] },
        { typeName: 'text', properties: [] },
        { typeName: 'boolean', properties: [] },
        { typeName: 'timestamp', properties: [] },
        { typeName: 'bigint', properties: [] },
        { typeName: 'time', properties: [] },
      ],
    },
    {
      name: 'parameterType',
      collection: [
        {
          typeName: 'inputBox',
          displayName: 'Input Box',
          properties: [
            { name: 'isNumeric', displayName: 'Numeric Only', type: 'boolean' },
            { name: 'defaultValue', displayName: 'Default Value' },
          ],
        },
        {
          typeName: 'dropdownSingle',
          displayName: 'Dropdown (Single Choice)',
          properties: [
            { name: 'dropdownValues', displayName: 'Dropdown Options', type: 'string[]' },
            { name: 'defaultValue', displayName: 'Default Value', type: 'string' },
          ],
        },
        {
          typeName: 'dropdownMultiple',
          displayName: 'Dropdown (Multiple Choice)',
          properties: [
            { name: 'dropdownValues', displayName: 'Dropdown Options', type: 'string[]' },
            { name: 'defaultValue', displayName: 'Default Value', type: 'string[]' },
          ],
        },
        {
          typeName: 'dateField',
          displayName: 'Date Field',
          properties: [
            { name: 'defaultValue', displayName: 'Default Values', type: 'string' },
          ],
        },
        {
          typeName: 'switch',
          displayName: 'Switch (ON/OFF)',
          properties: [
            { name: 'defaultValue', displayName: 'Default Values', type: 'boolean' },
          ],
        },
      ],
    },
    {
      name: 'reportType',
      collection: [
        { typeName: 'default', displayName: 'HTML - Default' },
        { typeName: 'url', displayName: 'Custom URL' },
      ],
    },
  ],
  themes: [
 /*   {
      name: 'Ardagh Group',
      group: 'Client Themes',
      images: { background: 'adargh-banner-image.png', logo: 'ardagh-logo.png' },
      colorSchemes: [
        { mainColor: '#00263e', extraColor: '#0085ca', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'ABCSupply',
      group: 'Client Themes',
      images: { background: 'abc-bg.png', logo: 'abc-logo-app.png' },
      colorSchemes: [
        { mainColor: '#004182', extraColor: '#CB494E', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Comcast',
      group: 'Client Themes',
      images: { background: 'comcast-bg.png', logo: 'comcast-logo.png' },
      colorSchemes: [
        { mainColor: '#1F232E', extraColor: '#2B9CD8', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Coca Cola',
      group: 'Client Themes',
      images: { background: 'coca-cola-bg.png', logo: 'cocacola_logo.png' },
      colorSchemes: [
        { mainColor: '#47474f', extraColor: '#fe001a', complimentaryColor: '#FFC300' },
      ],
    },*/
    {
      name: 'CPG',
      group: 'Demo Themes',
      images: { background: 'banner-image-12.png' },
      colorSchemes: [
        { mainColor: '#47474F', extraColor: '#EA5265', complimentaryColor: '#FFC300' },
      ],
    },
/*    {
      name: 'Belcorp',
      group: 'Client Themes',
      images: { background: 'belcorp-bg.png', logo: 'opex-belcorp-logo.png' },
      colorSchemes: [
        { mainColor: '#47474F', extraColor: '#9A5EAD', complimentaryColor: '#FFC300' },
      ],
    },*/
    {
      name: 'Default Theme',
      group: 'Default Themes',
      images: { background: 'default-theme-2.png' },
      colorSchemes: [
        { mainColor: '#2D1389', extraColor: '#e53d6e', complimentaryColor: '#FFC300' },
      ],
    },
/*    {
      name: 'Facebook',
      group: 'Client Themes',
      images: { background: 'fb-bg.png', logo: 'fb-opex-logo.png' },
      colorSchemes: [
        { mainColor: '#3B5998', extraColor: '#8B9DC3', complimentaryColor: '#FFC300' },
      ],
    },*/
    {
      name: 'Finance II',
      group: 'Demo Themes',
      images: { background: 'finance_2-banner-image.png' },
      colorSchemes: [
        { mainColor: '#004059', extraColor: '#009688', complimentaryColor: '#FFC300' },
        { mainColor: '#455A64', extraColor: '#9CC60B', complimentaryColor: '#FFC300' },
        { mainColor: '#232F3E', extraColor: '#FF9900', complimentaryColor: '#FF9901' },
        { mainColor: '#004A80', extraColor: '#FF9800', complimentaryColor: '#FF9802' },
        { mainColor: '#282828', extraColor: '#F7941D', complimentaryColor: '#F7941E' },
      ],
    },
    {
      name: 'Finance I',
      group: 'Demo Themes',
      images: { background: 'finance_1-banner-image.png' },
      colorSchemes: [
        { mainColor: '#004059', extraColor: '#009688', complimentaryColor: '#FFC300' },
        { mainColor: '#455A64', extraColor: '#9CC60B', complimentaryColor: '#FFC300' },
        { mainColor: '#232F3E', extraColor: '#FF9900', complimentaryColor: '#FF9901' },
        { mainColor: '#385185', extraColor: '#3CB878', complimentaryColor: '#FFC300' },
        { mainColor: '#004A80', extraColor: '#FF9800', complimentaryColor: '#FF9802' },
        { mainColor: '#282828', extraColor: '#F7941D', complimentaryColor: '#F7941E' },
      ],
    },
    {
      name: 'Generic I',
      group: 'Demo Themes',
      images: { background: 'generic_1-banner-image.png' },
      colorSchemes: [
        { mainColor: '#004059', extraColor: '#009688', complimentaryColor: '#FFC300' },
        { mainColor: '#455A64', extraColor: '#9CC60B', complimentaryColor: '#FFC300' },
        { mainColor: '#232F3E', extraColor: '#FF9900', complimentaryColor: '#FF9901' },
        { mainColor: '#385185', extraColor: '#3CB878', complimentaryColor: '#FFC300' },
        { mainColor: '#004A80', extraColor: '#FF9800', complimentaryColor: '#FF9802' },
        { mainColor: '#282828', extraColor: '#F7941D', complimentaryColor: '#F7941E' },
      ],
    },
    {
      name: 'Generic II',
      group: 'Demo Themes',
      images: { background: 'generic_2-banner-image.png' },
      colorSchemes: [
        { mainColor: '#004059', extraColor: '#009688', complimentaryColor: '#FFC300' },
        { mainColor: '#455A64', extraColor: '#9CC60B', complimentaryColor: '#FFC300' },
        { mainColor: '#004A80', extraColor: '#FF9800', complimentaryColor: '#FF9802' },
      ],
    },
/*    {
      name: 'Grant Thornton 2',
      group: 'Client Themes',
      images: { background: 'gt-bg-2.png', logo: 'gt-logo.png' },
      colorSchemes: [
        { mainColor: '#4F2D7F', extraColor: '#00A7B5', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Grant Thornton 3',
      group: 'Client Themes',
      images: { background: 'gt-bg-3.png', logo: 'gt-logo.png' },
      colorSchemes: [
        { mainColor: '#4F2D7F', extraColor: '#00A7B5', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Grant Thornton 4',
      group: 'Client Themes',
      images: { background: 'gt-bg-4.png', logo: 'gt-logo.png' },
      colorSchemes: [
        { mainColor: '#4F2D7F', extraColor: '#00A7B5', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Grant Thornton',
      group: 'Client Themes',
      images: { background: 'gt-bg-1.png', logo: 'gt-logo.png' },
      colorSchemes: [
        { mainColor: '#4F2D7F', extraColor: '#00A7B5', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Johnson & Johnson',
      group: 'Client Themes',
      images: { background: 'jnj-bg.png', logo: 'j&j-logo.png' },
      colorSchemes: [
        { mainColor: '#1F232E', extraColor: '#D51900', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'McDonalds',
      group: 'Client Themes',
      images: { background: 'McD.jpg', logo: 'mcdonalds-logo.png' },
      colorSchemes: [
        { mainColor: '#2E2E37', extraColor: '#C8515B', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Mondelez',
      group: 'Client Themes',
      images: { background: 'BG-Mondelez-1.png', logo: 'mondelez-logo.png' },
      colorSchemes: [
        { mainColor: '#502172', extraColor: '#8E3A80', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Morton Salt',
      group: 'Client Themes',
      images: { background: 'morton-salt-bg.png', logo: 'morton-salt-logo.png' },
      colorSchemes: [
        { mainColor: '#2f3460', extraColor: '#6c73b4', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'NIKE',
      group: 'Client Themes',
      images: { background: 'nike-bg.png', logo: 'nike-logo.png' },
      colorSchemes: [
        { mainColor: '#333333', extraColor: '#FF6600', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Nissan',
      group: 'Client Themes',
      images: { background: 'banner-image-13.jpg' },
      colorSchemes: [
        { mainColor: '#343434', extraColor: '#C71444', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Landstar',
      group: 'Client Themes',
      images: { background: 'landstar-bg.png', logo: 'UPS_logo-name.svg' },
      colorSchemes: [
        { mainColor: '#351C15', extraColor: '#FFB500', complimentaryColor: '#BDBDBD' },
      ],
    },
    {
      name: 'Nordstrom',
      group: 'Client Themes',
      images: { background: 'ns-bg.png', logo: 'ns-opex-logo.png' },
      colorSchemes: [
        { mainColor: '#333333', extraColor: '#9EA2A2', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'SmartMDR',
      group: 'Client Themes',
      images: { background: 'smartmdr-bg.png', logo: 'gt-logo.png' },
      colorSchemes: [
        { mainColor: '#4F2D7F', extraColor: '#00A7B5', complimentaryColor: '#FFC300' },
      ],
    },*/
    {
      name: 'Retail',
      group: 'Demo Themes',
      images: { background: 'retail-banner-image.png' },
      colorSchemes: [
        { mainColor: '#004059', extraColor: '#009688', complimentaryColor: '#FFC300' },
        { mainColor: '#455A64', extraColor: '#9CC60B', complimentaryColor: '#FFC300' },
        { mainColor: '#232F3E', extraColor: '#FF9900', complimentaryColor: '#FF9901' },
        { mainColor: '#282828', extraColor: '#F7941D', complimentaryColor: '#F7941E' },
      ],
    },
    {
      name: 'Supply Chain End to End',
      group: 'Demo Themes',
      images: { background: 'productionline-1.png' },
      colorSchemes: [
        { mainColor: '#3b4e5b', extraColor: '#18a2a5', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Supply Chain I',
      group: 'Demo Themes',
      images: { background: 'supplychain-1.png' },
      colorSchemes: [
        { mainColor: '#455A64', extraColor: '#9CC60B', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Transportation',
      group: 'Demo Themes',
      images: { background: 'transportation-banner-image.png' },
      colorSchemes: [
        { mainColor: '#004059', extraColor: '#009688', complimentaryColor: '#FFC300' },
        { mainColor: '#455A64', extraColor: '#9CC60B', complimentaryColor: '#FFC300' },
        { mainColor: '#385185', extraColor: '#3CB878', complimentaryColor: '#FFC300' },
        { mainColor: '#3b4e5b', extraColor: '#0099cc', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Supply Chain II',
      group: 'Demo Themes',
      images: { background: 'supplychain-2.png' },
      colorSchemes: [
        { mainColor: '#385185', extraColor: '#3CB878', complimentaryColor: '#FFC300' },
      ],
    },
/*    {
      name: 'TreeHouse',
      group: 'Client Themes',
      images: { background: 'TreeHouse-bg.png', logo: 'TreeHouse-Logo.png' },
      colorSchemes: [
        { mainColor: '#47474f', extraColor: '#1ab571', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Universal Studios',
      group: 'Client Themes',
      images: { background: 'US-Bg.png', logo: 'us-opex-logo.png' },
      colorSchemes: [
        { mainColor: '#162B75', extraColor: '#046FE6', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Universal Studios 3',
      group: 'Client Themes',
      images: { background: 'US-Bg-3.png', logo: 'us-opex-logo.png' },
      colorSchemes: [
        { mainColor: '#162B75', extraColor: '#046FE6', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Universal Studios 4',
      group: 'Client Themes',
      images: { background: 'US-Bg-4.png', logo: 'us-opex-logo.png' },
      colorSchemes: [
        { mainColor: '#162B75', extraColor: '#046FE6', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'Universal Studios 2',
      group: 'Client Themes',
      images: { background: 'US-Bg-2.png', logo: 'us-opex-logo.png' },
      colorSchemes: [
        { mainColor: '#162B75', extraColor: '#046FE6', complimentaryColor: '#FFC300' },
      ],
    },
    {
      name: 'UPS',
      group: 'Client Themes',
      images: { background: 'ups-bg.png', logo: 'UPS_logo-name.svg' },
      colorSchemes: [
        { mainColor: '#351C15', extraColor: '#FFB500', complimentaryColor: '#BDBDBD' },
      ],
    },*/
  ],
};

module.exports = {
  async up(db) {
    await Promise.all(
      Object.entries(collections).map(async ([collectionName, collection]) => {
        const documents = collection.map(document => {
          return {
            _id: new ObjectID(crypto.createHash('md5').update(document.name).digest('hex').slice(8)),
            ...document,
          };
        });

        await Promise.all(
          documents.map(async (document) => {
            // Get existing document data
            const oldDocument = await db.collection(collectionName).findOne(
              { name: document.name },
            );
            // Check if document already exists, if it does, it might be an older version with different ID
            if (oldDocument) {
              if (collectionName === collectionNameConstants.theme) {
                // Replace old theme Id with new theme Id in application details
                await db.collection(collectionNameConstants.application).updateMany(
                  { 'theme.id': oldDocument._id },
                  { $set: { 'theme.id': ObjectID(document._id) } },
                );
              }
              // Delete document with old ID
              await db.collection(collectionName).deleteOne(
                { _id: ObjectID(oldDocument._id) },
              );
            }
            // Create document with new ID
            await db.collection(collectionName).insertOne(
              document,
            );
          }),
        );
      }),
    );
  },

  async down(db) {
    db.collection(collectionNameConstants.template).drop();
    db.collection(collectionNameConstants.theme).deleteMany({ name: { $ne: 'Custom Themes' } });
  },
};
