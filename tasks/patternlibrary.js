/* vim: set ts=2 sw=2: */
/*
 * grunt-patternlibrary
 * https://github.com/sambowler/grunt-patternlibrary
 *
 * Copyright (c) 2014 Sam Bowler
 * Licensed under the MIT license.
 *
 * TODO: Specify stylesheets
 */
module.exports = function(grunt) {
  'use strict';

  var _ = require('lodash');
  var moduleRoot = (function() {
    var dirArr = __dirname.split('/');

    dirArr.pop();

    return dirArr.join('/');
  })();
  var pattern = require('./lib/pattern')(grunt);
  var includes = require('./lib/includes')(grunt);
  var wrapperTemplate = moduleRoot + '/templates/wrapper.html';
  var patternTemplate = moduleRoot + '/templates/pattern.html';
  var bowerComponents = moduleRoot + '/bower_components';
  var css = moduleRoot + '/css';
  var js = moduleRoot + '/js';

  grunt.registerMultiTask('patternlibrary', 'Create a pattern library with a set of HTML files.', function() {
    var options = this.options({
      wrapperTemplate: wrapperTemplate,
      patternTemplate: patternTemplate,
      indexName: 'index.html',
      title: 'Pattern Library',
      prefix: 'ptrn',
      include: [
        {
          src: bowerComponents,
          dest: 'bower_components'
        }
      ]
    });

    function getWrapperMarkup(template, title, prefix, patternsArray) {
      var data = {
        data: {
          title: title,
          patterns: patternsArray,
          prefix: prefix
        }
      };

      return grunt.template.process(grunt.file.read(template), data);
    }

    var patterns = [];

    this.files.forEach(function(f) {
      var indexName = f.indexName || options.indexName;
      var patternTemplate = f.patternTemplate || options.patternTemplate;
      var wrapperTemplate = f.wrapperTemplate || options.wrapperTemplate;
      var title = f.title || options.title;
      var includesArr = f.include ? options.include.concat(f.include) : options.include;
      var prefix = f.prefix || options.prefix;

      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(path) {
        var patternData = pattern.process(path, patternTemplate, prefix);

        if(patternData) patterns.push(patternData);
      });

      var markup = getWrapperMarkup(wrapperTemplate, title, prefix, patterns);

      grunt.file.write(f.dest + '/' + indexName, markup);

      includes.process(f.dest, includesArr);

      grunt.log.writeln('Patterns created in "' + f.dest + '".');
    });
  });

};
