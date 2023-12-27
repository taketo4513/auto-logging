'use strict';

const fs = require('fs');
const path = require('path');
const nconf = require('nconf');

nconf.formats.yaml = require('nconf-yaml');

const keys = {
    LoggingRoot: 'logging',
    Template: 'logging-template',
    FormatsRoot: 'logging-formats',
    Formats: {
        Timestamp: 'logging-formats-timestamp',
        Label: 'logging-formats-label',
        JsonRoot: 'logging-formats-json',
        Json: {
            Space: 'logging-formats-json-space'
        },
        Pad: 'logging-formats-pad',
        Align: 'logging-formats-align',
        AttributeFormatRoot: 'logging-formats-attributeformat',
        AttributeFormat: {
            Timestamp: 'logging-formats-attributeformat-timestamp',
            Label: 'logging-formats-attributeformat-label',
            Level: 'logging-formats-attributeformat-level',
            Module: 'logging-formats-attributeformat-module',
            Message: 'logging-formats-attributeformat-message',
            Metadata: 'logging-formats-attributeformat-metadata'
        },
        ColorizeRoot: 'logging-formats-colorize',
        Colorize: {
            All: 'logging-formats-colorize-all',
            Timestamp: 'logging-formats-colorize-timestamp',
            Label: 'logging-formats-colorize-label',
            Level: 'logging-formats-colorize-level',
            Module: 'logging-formats-colorize-module',
            Message: 'logging-formats-colorize-message',
            Metadata: 'logging-formats-colorize-metadata',
            Colors: {
                Info: 'logging-formats-colorize-colors-info',
                Error: 'logging-formats-colorize-colors-error',
                Warn: 'logging-formats-colorize-colors-warn',
                Debug: 'logging-formats-colorize-colors-debug',
            }
        },
    },
    Targets: 'logging-targets'
};

/**
 * Normalizes the key of the given setting.
 * @param {{key: string, value: any}} kvPair The setting as a key-value pair.
 * @return {{key: string, value: any}} The setting with the modified key.
 */
function normalizeSettingKey(kvPair) {
    let newKey = kvPair.key.toLowerCase().replace(/[_]/g, '-');
    // only change the command line argument or environment variable name for Logging settings
    if (newKey.startsWith('')) {
        kvPair.key = newKey;
    }

    return kvPair;
}

/**
 * Returns the settings for parsing a configuration file.
 * @param {string} filename The path of the configuration file.
 * @return {{file: string, logicalSeparator: string, format: object}} The parsing options.
 */
function getFileParsingOptions(filename) {
    return { file: filename, logicalSeparator: '-', format: nconf.formats.yaml };
}

/**
 * Creates an absolute path from the provided relative path if necessary.
 * @param {String} relOrAbsPath The relative or absolute path to convert to an absolute path.
 *                              Relative paths are considered relative to the Logging root folder.
 * @param {String} root_path root path to use
 * @return {String} The resolved absolute path.
 */
function resolvePath(relOrAbsPath, root_path) {
    if (!relOrAbsPath) {
        throw new Error('Config.resolvePath: Parameter is undefined');
    }

    if (path.isAbsolute(relOrAbsPath)) {
        return relOrAbsPath;
    }

    return path.join(root_path, relOrAbsPath);
}

/**
 * The class encapsulating the hierarchy of runtime configurations.
 * @type {Config}
 */
class Config {
    /**
     * Constructor
     */
    constructor() {
        // create own instance in case other dependencies also use nconf
        this._config = new nconf.Provider();

        ///////////////////////////////////////////////////////////////////////////////
        // the priority is the following:                                            //
        // memory > commandline args > environment variables > project config file > //
        // > user config file > machine config file > default config file            //
        ///////////////////////////////////////////////////////////////////////////////

        this._config.use('memory');

        // normalize the argument names to be more robust
        this._config.argv({ parseValues: true, transform: normalizeSettingKey });

        // normalize the argument names to be more robust
        this._config.env({ parseValues: true, transform: normalizeSettingKey });

        // if "projectconfig" is set at this point, include that file
        // check whether logging.yaml is present in the workspace directory for convenience
        const workspace = path.resolve(__dirname, '../../../..');
        let projectConfFileYML = resolvePath('logging.yml', workspace);
        if (fs.existsSync(projectConfFileYML)) {
            this._config.file('project', getFileParsingOptions(projectConfFileYML));
        }

        let projectConfFileYAML = resolvePath('logging.yaml', workspace);
        if (fs.existsSync(projectConfFileYAML)) {
            this._config.file('project', getFileParsingOptions(projectConfFileYAML));
        }

        const defaultConfig = path.join(__dirname, 'default.yaml');
        this._config.file('default', getFileParsingOptions(defaultConfig));
    }

    /**
     * Get the config setting with name.
     * If the setting is not found, returns the provided default value.
     * @param {string} name Key/name of the setting.
     * @param {any} defaultValue The default value to return if the setting is not found.
     * @return {any} Value of the setting
     */
    get(name, defaultValue) {
        let value = null;

        try {
            value = this._config.get(name);
        }
        catch (err) {
            value = defaultValue;
        }

        // NOTE: can't use !value, since a falsey value could be a valid setting
        if (value === null || value === undefined) {
            value = defaultValue;
        }

        return value;
    }

    /**
     * Set a value into the 'memory' store of config settings.
     * This will override all other settings.
     * @param {string} name name of the setting
     * @param {any} value value of the setting
     */
    set(name, value) {
        this._config.set(name, value);
    }
}

module.exports = Config;
module.exports.keys = keys;

