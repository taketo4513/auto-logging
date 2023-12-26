'use strict';

const chai = require('chai');
chai.should();

const Config = require('../../lib/config/Config');

describe('Config Test', () => {

    const config = new Config();

    describe('Test [A] - Constructor', () => {
        it('Case #1 - config should be created', () => {
            config.should.exist;
        })
    })

})