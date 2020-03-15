'use strict';

module.exports = function VueCommand(api, opts) {

    api.assertVersion('>=0.3.0');

    const { execa } = require('@micro-app/shared-utils');

    const cmdOpts = {
        description: 'enhance vue-cli',
        usage: 'micro-app vue [options]',
        options: {
            'create [options] <app-name>': 'create a new project powered by vue-cli-service',
            'add [options] <plugin> [pluginOptions]': 'install a plugin and invoke its generator in an already created project',
            'invoke [options] <plugin> [pluginOptions]': 'invoke the generator of a plugin in an already created project',
            'inspect [options] [paths...]': 'inspect the webpack config in a project with vue-cli-service',
            'serve [options] [entry]': 'serve a .js or .vue file in development mode with zero config',
            'build [options] [entry]': 'build a .js or .vue file in production mode with zero config',
            'ui [options]': 'start and open the vue-cli ui',
            'init [options] <template> <app-name>': 'generate a project from a remote template (legacy API, requires @vue/cli-init)',
            'config [options] [value]': 'inspect and modify the config',
            'outdated [options]': '(experimental) check for outdated vue cli service / plugins',
            'upgrade [options] [plugin-name]': '(experimental) upgrade vue cli service / plugins',
            'migrate [options] [plugin-name]': '(experimental) run migrator for an already-installed cli plugin',
            info: 'print debugging information about your environment',
        },
        details: `
Examples:
    micro-app vue create
            `.trim(),
    };

    api.registerCommand('vue', cmdOpts, function(args) {

        let argv = [];
        if (process.argv[2] === 'vue') {
            argv = process.argv.slice(3);
        } else {
            argv = process.argv.slice(2);
        }

        if (argv.length === 0 || [
            'serve', 'build', 'inspect',
            'create', 'add', 'invoke', 'ui', 'init', 'config',
            'outdated', 'upgrade', 'migrate', 'info',
        ].includes(args[0])) {
            return api.runCommand('help', { _: [ 'vue' ] });
        }

        const binPath = require.resolve('@vue/cli/bin/vue');
        return execa(binPath, argv, {
            stdio: 'inherit',
        }).catch(err => {
            api.logger.error(err);
        });
    });
};
