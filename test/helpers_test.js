'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const helpers = require('../helpers');

function withArgv(scriptName, fn) {
    const previous = process.argv[1];
    process.argv[1] = scriptName;
    try {
        return fn();
    } finally {
        process.argv[1] = previous;
    }
}

describe('helpers', function() {
    it('builds png and gif names from the script', function() {
        withArgv('/tmp/spiral-build.js', function() {
            assert.equal(helpers.takePngName(), 'spiral.png');
            assert.equal(helpers.takeGifName(), 'spiral.gif');
        });
    });

    it('rejects incomplete encoder and png arguments', function() {
        assert.throws(() => helpers.prepareEncoder(), /GIFEncoder/);
        assert.throws(() => helpers.saveAsPng(), /Clumsy/);
    });

    it('configures a gif encoder', async function() {
        const file = path.join(__dirname, 'encoder-out.gif');
        let output;

        function Encoder(width, height) {
            this.size = [width, height];
        }
        Encoder.prototype.createReadStream = function() {
            return {
                pipe(dest) {
                    output = dest;
                }
            };
        };
        Encoder.prototype.setRepeat = function(value) {
            this.repeat = value;
        };
        Encoder.prototype.setDelay = function(value) {
            this.delay = value;
        };
        Encoder.prototype.setQuality = function(value) {
            this.quality = value;
        };

        const encoder = helpers.prepareEncoder(Encoder, { width: 10, height: 20 }, file, -1, 40, 5);
        assert.deepEqual(encoder.size, [10, 20]);
        assert.equal(encoder.repeat, -1);
        assert.equal(encoder.delay, 40);
        assert.equal(encoder.quality, 5);
        await new Promise((resolve, reject) => {
            output.on('error', reject);
            output.end(resolve);
        });
        fs.rmSync(file, { force: true });
    });

    it('prefers createPNGStream and falls back to pngStream', async function() {
        const created = path.join(__dirname, 'created.png');
        const legacy = path.join(__dirname, 'legacy.png');

        function canvasWith(method) {
            const used = [];
            const canvas = {};
            canvas[method] = function() {
                used.push(method);
                return { pipe() {} };
            };
            return { canvas, used };
        }

        async function save(clumsy, file) {
            const out = helpers.saveAsPng(clumsy, file);
            await new Promise((resolve, reject) => {
                out.on('error', reject);
                out.end(resolve);
            });
            fs.rmSync(file, { force: true });
        }

        const modern = canvasWith('createPNGStream');
        modern.canvas.pngStream = function() {
            modern.used.push('pngStream');
            return { pipe() {} };
        };
        await save({ canvas: modern.canvas }, created);
        assert.deepEqual(modern.used, ['createPNGStream']);

        const old = canvasWith('pngStream');
        await save({ canvas: old.canvas }, legacy);
        assert.deepEqual(old.used, ['pngStream']);
    });
});
