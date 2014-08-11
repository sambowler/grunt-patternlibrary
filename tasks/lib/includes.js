/*global require, process */
module.exports = function(grunt) {
  'use strict';

  var wrench = require('wrench');
  var chalk = require('chalk');

  function processArray(defaults, customArr, blankCanvas ) {
    customArr = customArr || [];

    if(blankCanvas) {
        return customArr;
    } else {
        return defaults.concat(customArr);
    }
  }

  /**
   * Process the object of files to be included
   *
   * @param {string} basePath - Path to base the destination of the files upon
   * @param {object} obj
   */
  function processIncludes(basePath, obj) {
    obj.forEach(function(include, i) {
      var src = include.src;
      var dest = basePath + '/' + include.dest;

      if(!grunt.file.exists(src)) {
        grunt.log.warn('Couldn\'t find "' + src + '".');

        return false;
      }

      if(grunt.file.isFile(src)) {
        grunt.file.copy(src, dest);
        grunt.log.writeln(chalk.green('>>') + ' Copied file "' + src + '" to "' + dest + '".');
      } else {
        wrench.copyDirSyncRecursive(src, dest, {
          forceDelete: true,
          preserveFiles: false
        });

        var srcFromGruntfile = src.split(process.cwd())[1].slice(1);

        grunt.log.writeln(chalk.green('>>') + ' Copied directory "' + srcFromGruntfile + '" to "' + dest + '".');
      }

      // grunt.log.writeln('Copied "' + src + '" to "' + dest + '".');
    });
  }

  return {
    processIncludes: processIncludes,
    processArray: processArray
  };
};
