/* vim: set ts=2 sw=2: */
/*
 * grunt-patternlibrary
 * https://github.com/sambowler/grunt-patternlibrary
 *
 * Copyright (c) 2014 Sam Bowler
 * Licensed under the MIT license.
 *
 * TODO: Styling (more specificity: IDs)
 * TODO: Detailed and simple switcher
 * TODO: Switcher updates URL
 */
module.exports = function(grunt) {
  'use strict';

  var _ = require('lodash');
  var chalk = require('chalk');
  var moduleRoot = (function() {
    var dirArr = __dirname.split('/');

    dirArr.pop();

    return dirArr.join('/');
  })();
  var pattern = require('./lib/pattern')(grunt);
  var includes = require('./lib/includes')(grunt);
  var processData = require('./lib/processData')(grunt);
  var defaults = {};

  defaults.wrapperTemplate = moduleRoot + '/templates/wrapper.html';
  defaults.patternTemplate = moduleRoot + '/templates/pattern.html';
  defaults.indexName = 'index.html';
  defaults.title = 'Pattern Library';
  defaults.stylesheets = [
    'bower_components/prism/themes/prism.css',
    'css/style.css'
  ];
  defaults.javascripts = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/prism/prism.js',
    'bower_components/pathjs/path.min.js',
    'js/main.js'
  ];
  defaults.include = [
    {
      src: moduleRoot + '/css',
      dest: 'css'
    },
    {
      src: moduleRoot + '/js',
      dest: 'js'
    },
    {
      src: moduleRoot + '/bower_components',
      dest: 'bower_components'
    }
  ];

  grunt.registerMultiTask('patternlibrary', 'Create a pattern library with a set of HTML files.', function() {
    var options = this.options(defaults);

    this.files.forEach(function(f) {
      var indexName = f.indexName || options.indexName;
      var wrapperTemplate = f.wrapperTemplate || options.wrapperTemplate;
      var patterns = [];

      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn(chalk.red('>>') + ' Source file "' + filepath + '" not found.');
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
