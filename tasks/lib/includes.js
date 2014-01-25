module.exports = function(grunt) {
  'use strict';

  var wrench = require('wrench');

  function process(basePath, obj) {
    obj.forEach(function(include, i) {
      var src = include.src;
      var dest = basePath + '/' + include.dest;

      if(!grunt.file.exists(src)) {
        grunt.log.warn('Couldn\'t find "' + src + '".');

        return false;
      }

      if(grunt.file.isFile(src)) {
        grunt.file.copy(src, dest);
      } else {
        wrench.copyDirSyncRecursive(src, dest, {
          forceDelete: true,
          preserveFiles: false
        });
      }

      // grunt.log.writeln('Copied "' + src + '" to "' + dest + '".');
    });
  }

  return {
    process: process
  }
}
