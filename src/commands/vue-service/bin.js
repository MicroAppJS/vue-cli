#!/usr/bin/env node
'use strict';

const { semver, error } = require('@vue/cli-shared-utils');
const requiredVersion = require('@vue/cli-service/package.json').engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
    error(
        `You are using Node ${process.version}, but vue-cli-service ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    );
    process.exit(1);
}

module.exports = function(context, rawArgv, params) {
    const Service = require('@vue/cli-service');
    const service = new Service(context, params);

    const args = require('minimist')(rawArgv, {
        boolean: [
            // build
            'modern',
            'report',
            'report-json',
            'inline-vue',
            'watch',
            // serve
            'open',
            'copy',
            'https',
            // inspect
            'verbose',
        ],
    });
    const command = args._[0];

    return service.run(command, args, rawArgv).catch(err => {
        error(err);
        process.exit(1);
    });

};
