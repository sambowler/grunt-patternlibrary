/* vim: set ts=2 sw=2: */
/*
 * grunt-patternlibrary
 * https://github.com/sambowler/grunt-patternlibrary
 *
 * Copyright (c) 2014 Sam Bowler
 * Licensed under the MIT license.
 *
 * TODO: YAML front matter for each pattern
 * TODO: Class to each pattern wrapper
 * TODO: One pattern visible at a time (separate URLs for each)
 * TODO: HAML
 */
module.exports = function(grunt) {
  'use strict';

  var yamlFrontMatter = require('yaml-front-matter');
  var _ = require('lodash');

  grunt.registerMultiTask('patternlibrary', 'Create a pattern library with a set of HTML files.', function() {
    var moduleRoot = (function() {
      var dirArr = __dirname.split('/');

      dirArr.pop();

      return dirArr.join('/');
    })();
    var wrapperTemplate = moduleRoot + '/templates/wrapper.html';
    var patternTemplate = moduleRoot + '/templates/pattern.html';
    var options = this.options({
      cssFiles: [],
      wrapperTemplate: wrapperTemplate,
      patternTemplate: patternTemplate
    });

    function getPatternSlug(path, data) {
      if(data.hasOwnProperty('slug')) {
        return data.slug;
      } else {
        var fileName = path.split('/').pop();

        return fileName.split('.')[0];
      }
    }

    function processPattern(path, templatePath) {
        var fileContents = grunt.file.read(path);
        var frontMatter = yamlFrontMatter.loadFront(fileContents);
        var template = grunt.file.read(templatePath);
        var data = {
          content: frontMatter.__content,
          slug: getPatternSlug(path, frontMatter),
        };

        delete frontMatter.slug;
        delete frontMatter.__content;

        // Carry the rest of the front matter data to the object
        data = _.defaults(data, frontMatter);

        return grunt.template.process(template, { data: data });
    }

    function getWrapperMarkup(template, patternsArray) {
      var data = {
        data: {
          patterns: patternsArray
        }
      };

      return grunt.template.process(grunt.file.read(template), data);
    }

    var patterns = [];

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(path) {
        patterns.push(processPattern(path, options.patternTemplate));
      });

      var src = getWrapperMarkup(options.wrapperTemplate, patterns);

      // Write the destination file.
      grunt.file.write(f.dest, src);

      getCss(options.additionalCss);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
