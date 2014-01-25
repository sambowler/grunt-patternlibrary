/* vim: set ts=2 sw=2: */
/*
 * grunt-patternlibrary
 * https://github.com/sambowler/grunt-patternlibrary
 *
 * Copyright (c) 2014 Sam Bowler
 * Licensed under the MIT license.
 *
 * TODO: One pattern visible at a time (separate URLs for each)
 * TODO: Notes in patterns
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
  var defaults = {
    wrapperTemplate: wrapperTemplate,
    patternTemplate: patternTemplate,
    indexName: 'index.html',
    title: 'Pattern Library',
    include: [
      {
        src: bowerComponents,
        dest: 'bower_components'
      },
      {
        src: css,
        dest: 'css'
      },
      {
        src: js,
        dest: 'js'
      }
    ]
  };

  grunt.registerMultiTask('patternlibrary', 'Create a pattern library with a set of HTML files.', function() {
    function getWrapperMarkup(template, title, patternsArray) {
      var data = {
        data: {
          title: title,
          patterns: patternsArray
        }
      };

      return grunt.template.process(grunt.file.read(template), data);
    }

    var patterns = [];

    this.files.forEach(function(f) {
      var indexName = f.indexName || defaults.indexName;
      var patternTemplate = f.patternTemplate || defaults.patternTemplate;
      var wrapperTemplate = f.wrapperTemplate || defaults.wrapperTemplate;
      var title = f.title || defaults.title;
      var includesArr = f.include ? defaults.include.concat(f.include) : defaults.include;

      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(path) {
        var patternData = pattern.process(path, patternTemplate);

        if(patternData) patterns.push(patternData);
      });

      var markup = getWrapperMarkup(wrapperTemplate, title, patterns);

      grunt.file.write(f.dest + '/' + indexName, markup);

      includes.process(f.dest, includesArr);

      grunt.log.writeln('Patterns created in "' + f.dest + '".');
    });
  });

};
