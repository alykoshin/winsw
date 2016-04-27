#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2));
var pkg = require('./package.json');
var Winsw = require('./');


function help() {
  console.log([
    '',
    '  Package name: ' + pkg.name,
    '',
    '  Package description: ' + pkg.description,
    '',
    '  Example:',
    '    node node_modules/' + pkg.name + '/cli.js',
    ''
  ].join('\n'));
}

function version() {
  console.log([
    '* version info:',
    '* package.json version: ' + pkg.version,
    '* process.version: ' + process.version,
    ''
  ].join('\n'));
}

if (argv.h || argv.help) {
  help();
  process.exit(0);
}

if (argv.v || argv.version) {
  version();
  process.exit(0);
}

//<service>
//<id>jenkins</id>
//<name>Jenkins</name>
//<description>This service runs Jenkins continuous integration system.</description>
//<env name="JENKINS_HOME" value="%BASE%"/>
//  <executable>java</executable>
//  <arguments>-Xrs -Xmx256m -jar "%BASE%\jenkins.war" --httpPort=8080</arguments>
//  <logmode>rotate</logmode>
//  </service>

var config = {
  id: 'test',
  name: 'testname',
  description: 'testdescription',
  executable: 'node.exe',
  arguments: 'app.js'
};

var options = { name: 'test' };

var winsw = Winsw(config, options);

winsw.createWrapper();
