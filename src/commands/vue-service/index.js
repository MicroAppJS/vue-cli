'use strict';

module.exports = function VueCommand(api, opts) {

    api.assertVersion('>=0.3.0');

    const cmdOpts = {
        description: 'enhance vue-cli-service',
        usage: 'micro-app vue-service [options]',
        options: {
            serve: 'start development server',
            build: 'build for production',
            inspect: 'inspect internal webpack config',
        },
        details: `
Examples:
    micro-app vue-service serve
            `.trim(),
    };

    api.registerCommand('vue-service', cmdOpts, function(args) {
        let argv = [];
        if (process.argv[2] === 'vue-service') {
            argv = process.argv.slice(3);
        } else {
            argv = process.argv.slice(2);
        }

        // console.warn('vue-service...', argv);
        if (argv.length === 0 || [ 'serve', 'build', 'inspect' ].includes(args[0])) {
            return api.runCommand('help', { _: [ 'vue-service' ] });
        }

        const context = process.env.VUE_CLI_CONTEXT || process.cwd();

        const { pkg, plugins } = require('./params')(api, {
            context,
        });

        const bin = require('./bin');
        return bin(context, argv, {
            pkg,
            useBuiltIn: true,
            plugins,
        }, api);
    });

};
