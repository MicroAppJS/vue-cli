'use strict';

const { path } = require('@micro-app/shared-utils');
const { resolvePkg, isPlugin } = require('@vue/cli-shared-utils');

const PRI_DEPS = [ '@micro-app/vue-cli-plugin-microapp' ];

module.exports = (api, { context }) => {

    const pkg = _resolvePkg(context);

    const idToPlugin = id => ({
        id: id.replace(/^.\//, 'built-in:'),
        apply: require(id),
    });

    const projectPlugins = Object.keys(pkg.devDependencies || {})
        .concat(Object.keys(pkg.dependencies || {}))
        .filter(key => !PRI_DEPS.includes(key))
        .filter(isPlugin)
        .map(id => {
            if (pkg.optionalDependencies && id in pkg.optionalDependencies) {
                let apply = () => {};
                try {
                    apply = require(id);
                } catch (e) {
                    api.logger.warn('[vue-service]', `Optional dependency ${id} is not installed.`);
                }

                return { id, apply };
            }
            return idToPlugin(id);

        });

    return {
        pkg,
        plugins: PRI_DEPS.map(id => {
            return {
                id,
                apply: require(id),
            };
        }).concat(projectPlugins),
    };
};

function _resolvePkg(context) {
    const pkg = resolvePkg(context);
    if (pkg.vuePlugins && pkg.vuePlugins.resolveFrom) {
        const pkgContext = path.resolve(context, pkg.vuePlugins.resolveFrom);
        return _resolvePkg(null, pkgContext);
    }
    return pkg;
}
