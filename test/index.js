'use strict';

const { cmd, argv, service } = require('@micro-app/cli');

require('../src')(service);

service.run(cmd, argv);
