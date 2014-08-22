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
  var marked = require('marked');
  var pluginRoot = path.join(__dirname, '../');
  var pattern = require('./lib/pattern')(grunt);
  var includes = require('./lib/includes')(grunt);
  var processData = require('./lib/processData')(grunt);
  var defaults = {};

  defaults.wrapperTemplate = pluginRoot + '/templates/wrapper.html';
  defaults.patternTemplate = pluginRoot + '/templates/pattern.html';
  defaults.indexTemplate = pluginRoot + '/templates/index.html';
  defaults.headerTemplate = pluginRoot + '/templates/header.html';
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
      var patternTemplate = f.patternTemplate || options.patternTemplate;
      var headerTemplate = f.headerTemplate || options.headerTemplate;
      var indexTemplate = f.indexTemplate || options.indexTemplate;
      var stylesheets = f.stylesheets ? options.stylesheets.concat(f.stylesheets) : options.stylesheets;
      var javascripts = f.javascripts ? options.javascripts.concat(f.javascripts) : options.javascripts;
      javascripts = javascripts.map(function(script) {
        if(typeof script === 'string') {
          return '<script src="' + script + '"></script>';
        }

        if(typeof script === 'object') {
          if(typeof script.src === 'undefined' || script.src === '') return false;

          var str = '<script src="' + script.src + '"';

          if(typeof script.attrs === 'object') {
            for(var attr in script.attrs) {
              str += ' ' + attr + '="' + script.attrs[attr] + '"';
            }
          }

          return str + '></script>';
        }
      });

      /**
       *  @type {object} patterns
       *  @example
       *  {
       *      categoryName: {
       *          category: true,
       *          patterns: [{},{}]
       *      },
       *      patternName: {}
       *  }
       */
      var patterns = {};
      var templateData = {
        rootTitle: f.title || options.title,
        javascripts: javascripts,
        stylesheets: stylesheets
      };


      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(path) {
        var patternData = pattern.processPatternData( path );
        if( typeof patternData.category !== 'undefined' ){
          if( typeof patterns[ patternData.category ] !== 'undefined' ) {
            patterns[ patternData.category ].patterns.push( patternData );
          } else {
            patterns[ patternData.category ] = { title: patternData.category, category: true, patterns: [ patternData ] };
          }
        } else {
          patterns[ patternData.title ] = patternData;
        }
        return patternData;
      }).map( function( data ){
        /**
         * @var {string} source - the html source of the base pattern
         * @var {object} data - data for indevidual pattern
         */
        var source = data.content;
        data.source = source;

        // wrap pattern in template
        if( typeof data.template !== 'undefined' ){
          data.content = processData.getMarkup( 'patterns/templates/' + data.template + '.html', data );
        }

        if( typeof data.note !== 'undefined' ) data.note = marked( data.note );

        // list of all patterns needed for header
        if( typeof templateData.patterns === 'undefined' ) { templateData.patterns = patterns; }

        var mergedData = _.assign( _.clone( templateData ), data );
        // template out the header
        mergedData.sub = true;
        mergedData.header = processData.getMarkup( headerTemplate, mergedData );

        // full markup for pattern file
        data.content = processData.getMarkup( wrapperTemplate, mergedData );

        grunt.file.write(f.dest + '/patterns/' + data.slug + '.html', data.content);
        grunt.log.writeln(chalk.green('>>') + ' Pattern HTML created at "' + f.dest + '/patterns/' + data.slug + '.html');
      });


      templateData.header = processData.getMarkup( headerTemplate, templateData );
      var indexContent = processData.getMarkup( indexTemplate, templateData );
      templateData.stylesheets = stylesheets;
      templateData.javascripts = javascripts;
      var html = processData.getMarkup(wrapperTemplate, _.assign( templateData, {content: indexContent} ) );

      grunt.file.write(f.dest + '/' + indexName, html);
      grunt.log.writeln(chalk.green('>>') + ' Patterns HTML created at "' + f.dest + '/' + indexName + '".');

      var includesArr = includes.processArray(options.include, f.include, f.blankCanvas );

      includes.processIncludes(f.dest, includesArr);
    });
  });
};
