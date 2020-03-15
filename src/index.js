'use strict';

const commands = [
    'version',
    'vue',
    'vue-service',
];

const builtIn = Symbol.for('built-in');

module.exports = function(service) {

    // 注册 webapck 插件
    service.registerPlugin({
        id: '@micro-app/plugin-webpack',
        [builtIn]: true,
    });

    commands.forEach(name => {
        service.registerPlugin({
            id: `vue-cli:plugin-command-${name}`,
            link: require.resolve(`./commands/${name}`),
            [builtIn]: true,
        });
    });

};
