'use strict';

const chai = require('chai');
chai.should();

const LoggingFactory = require('../lib/logging-factory');

describe('Config Test', () => {

    const Logger = LoggingFactory.getLogger();

    describe('Test [A] - getLogger()', () => {
        it('Case #1 - Logger should be created', () => {
            Logger.should.exist;
        })
    })

})