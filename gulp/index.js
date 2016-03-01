'use strict';

var fs = require('fs');
var onlyScripts = require('./util/scriptFilter');
var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

var argv = require('yargs')
    .usage('Usage: $0 <task name> [options] [<args>]')
    .alias('e', 'env')
    .default('e', 'dev')
    .describe('e', 'Environment Name. args: dev|test|staging|production')
    .help('h')
    .alias('h', 'help')
    .argv;

tasks.forEach(function (task) {
    require('./tasks/' + task);
});
