/*jshint node:true */
/* vim: set ts=2 sw=2: */
/*
 * grunt-patternlibrary
 * https://github.com/sambowler/grunt-patternlibrary
 *
 * Copyright (c) 2014 Sam Bowler
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {
  'use strict';

  var _ = require('lodash');
  var chalk = require('chalk');
  var path = require('path');
  var pluginRoot = path.join(__dirname, '../');
  var pattern = require('./lib/pattern')(grunt);
  var includes = require('./lib/includes')(grunt);
  var processData = require('./lib/processData')(grunt);
  var defaults = {};

  defaults.wrapperTemplate = pluginRoot + '/templates/wrapper.html';
  defaults.patternTemplate = pluginRoot + '/templates/pattern.html';
  defaults.indexName = 'index.html';
  defaults.title = 'Pattern Library';
  defaults.stylesheets = [
    'css/prism.css',
    'css/style.css'
  ];
  defaults.javascripts = [
    'js/jquery.min.js',
    'js/prism.js',
    'js/path.min.js',
    'js/main.js'
  ];
  defaults.include = [
    {
      src: pluginRoot + '/css',
      dest: 'css'
    },
    {
      src: pluginRoot + '/js',
      dest: 'js'
    }
  ];

  grunt.registerMultiTask('patternlibrary', 'Create a pattern library with a set of HTML files.', function() {
    var options = this.options(defaults);

    this.files.forEach(function(f) {
      if(typeof f.dest === 'undefined') {
        grunt.fail.warn('No destination specified, use the "dest" paramater.');
      }

      var indexName = f.indexName || options.indexName;
      var wrapperTemplate = f.wrapperTemplate || options.wrapperTemplate;
      var patterns = [];

      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(path) {
        var patternData = pattern.processPattern(path, f.patternTemplate || options.patternTemplate);

        if(patternData) patterns.push(patternData);
      });

      var html = processData.getMarkup(wrapperTemplate, {
        title: f.title || options.title,
        stylesheets: f.stylesheets ? options.stylesheets.concat(f.stylesheets) : options.stylesheets,
        javascripts: f.javascripts ? options.javascripts.concat(f.javascripts) : options.javascripts,
        patterns: patterns
      });

      grunt.file.write(f.dest + '/' + indexName, html);
      grunt.log.writeln(chalk.green('>>') + ' Patterns HTML created at "' + f.dest + '/' + indexName + '".');

      grunt.file.write(f.dest + '/patterns.json', processData.getJSON(patterns));
      grunt.log.writeln(chalk.green('>>') + ' Patterns JSON created at "' + f.dest + '/patterns.json".');

      var includesArr = includes.processArray(options.include, f.include, f.blankCanvas, wrapperTemplate === options.wrapperTemplate);

      includes.processIncludes(f.dest, includesArr);
    });
  });
};
