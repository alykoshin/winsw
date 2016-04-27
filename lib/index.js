'use strict';

var fs = require('fs');
var miniFs = require('mini-fs');
var path = require('path');
var js2xmlparser = require('js2xmlparser');
var childProcess = require('child_process');


var Winsw = function(config, options) {
  var self = this;

  options = options || {};
  options.winswExe = options.winswExe || 'winsw.exe';

  var srcExe   = path.join(__dirname, '/../bin', 'winsw-1.16-bin.exe');
  var destPath = path.join(__dirname, '/../tmp');
  var destExe  = path.join(destPath, config.id+'.exe');
  var destXml  = path.join(destPath, config.id+'.xml');

  var commands = [
    'install',
    'uninstall',
    'start',
    'stop',
    'restart',
    'status'
  ];

  self.createWrapper = function () {
    // rename .exe
    miniFs.copySync(srcExe, destExe);
    // write .xml
    var xmlConfig = js2xmlparser('service', config, { declaration: { include: false }});
    fs.writeFileSync(destXml, xmlConfig, { encoding: 'utf8' });
  };


  self.removeWrapper = function () {
    // delete .exe
    fs.unlinkSync(destExe);
    // delete .xml
    fs.unlinkSync(destXml);
  };


  self._exec = function(cmd, args) {
    args.unshift(cmd);
    var callback = args.pop();

    childProcess.execFile(destExe, args, { encoding: 'utf16le' }, function(error, stdout, stderr) {
      // Convert Buffer to String and remove trailing EOLs
      stdout = stdout.toString('utf8').trim();
      stderr = stderr.toString('utf8').trim();
      // Treat warnings on stderr as error
      if (stderr && !error) {
        error = new Error(stderr.toString('utf8'));
      }
      // ENOENT
      if (error && error.code === 'ENOENT') {
        error = new Error('winsw wrapper not found: \''+destExe +'\'');
      }
      // Handle error
      if (error) {
        return callback(error, stderr);
      }

      return callback(null, stdout);

    });
  };

  commands.forEach(function(command) {
    self[command] = function(/*arguments*/) {
      var args = Array.prototype.slice.call(arguments);
      self._exec(command, args);
    };
  });


};


module.exports = function(options) { return new Winsw(options); };
