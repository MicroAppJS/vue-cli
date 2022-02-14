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

module.exports = function(context, rawArgv, params, api) {
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

    if (command === 'build') {
        api.modifyCreateBuildProcess(() => {
            return async function({ args }) {
                const mode = args.mode || api.mode;

                if (process.env.MICRO_APP_TEST) {
                    api.logger.debug('MICRO_APP_TEST --> Exit!!!');
                    return Promise.resolve();
                }

                return service.run(command, args, rawArgv).catch(err => {
                    error(err);
                    api.applyPluginHooks('onBuildFail', { err, args });
                    process.exit(1);
                }).then(() => {
                    api.applyPluginHooks('onBuildSuccess', { args });
                });
            };
        });
        // call build
        return api.runCommand(command, { ...{
            ...args,
            _: args._.splice(1),
        } });
    } else if (command === 'serve') {
        api.modifyCreateDevServer(() => {
            return async function({ args }) {
                const mode = args.mode || api.mode;

                if (process.env.MICRO_APP_TEST) {
                    api.logger.debug('MICRO_APP_TEST --> Exit!!!');
                    return Promise.resolve();
                }

                return service.run(command, args, rawArgv).catch(err => {
                    error(err);
                    process.exit(1);
                });
            };
        });
        // call serve
        return api.runCommand(command, { ...{
            ...args,
            _: args._.splice(1),
        } });
    }

    // other
    return service.run(command, args, rawArgv).catch(err => {
        error(err);
        process.exit(1);
    });

};
