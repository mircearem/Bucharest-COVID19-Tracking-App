const Datastore = require('nedb');

const infections = new Datastore({ filename: './data/infections.db', autoload: true });
infections.ensureIndex({fieldName: 'timestamp', unique: true});

module.exports = { infections }
