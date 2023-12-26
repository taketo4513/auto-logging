'use strict';

const Config = require('./Config.js');

/**
 * Gets the singleton Config instance, creates it if necessary.
 * @return {Config} The singleton Config instance.
 * @private
 */
function _getConfigInstance() {
    if (!global.logging) {
        global.logging = {};
    }

    if (!global.logging.config) {
        global.logging.config = new Config();
    }

    return global.logging.config;
}

/**
 * Utility function for setting a value for a key in the configuration store.
 * @param {string} name The key of the configuration to set.
 * @param {any} value The value to set.
 */
function set(name, value) {
    _getConfigInstance().set(name, value);
}

/**
 * Utility function for retrieving a value from the configuration store.
 * @param {string} name The key of the configuration to retrieve.
 * @param {any} defaultValue The value to return in case the key is not found.
 * @return {any} The value of the configuration or the defaultValue parameter if not found.
 */
function get(name, defaultValue = undefined) {
    return _getConfigInstance().get(name, defaultValue);
}

module.exports.get = get;
module.exports.set = set;
module.exports.keys = Config.keys;
