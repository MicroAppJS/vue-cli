'use strict';

const { service } = require('@micro-app/cli');

/* global expect */

describe('Command version', () => {

    it('version', async () => {

        const plugin = service.plugins.find(item => item.id === 'cli:plugin-command-version');
        expect(typeof plugin).toEqual('object');

        await service.init();

        expect(plugin[Symbol.for('api')]).not.toBeUndefined();
        require('./index')(plugin[Symbol.for('api')]);

        await service.runCommand('version');

        expect(service.commands.version).not.toBeNull();
        expect(service.commands.version).not.toBeUndefined();
        expect(typeof service.commands.version).toEqual('object');
    });

});
