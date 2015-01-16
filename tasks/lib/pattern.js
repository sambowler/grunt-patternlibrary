/*global require */
/* vim: set ts=2 sw=2: */
/**
 * Processes a specific pattern
 */
module.exports = function(grunt) {
  'use strict';

  var yamlFrontMatter = require('yaml-front-matter');
  var _ = require('lodash');
  var chalk = require('chalk');

  /**
   * Gets the slug for a pattern if specified in the YAML front matter and
   * constructs one if not available.
   */
  function getPatternSlug(path, data) {
    if(data.hasOwnProperty('slug')) {
      return data.slug;
    } else {
      var fileName = path.split('/').pop();

      return fileName.split('.')[0];
    }
  }

  /**
   * Processes passed data in to an object of data about the pattern
   *
   * @param {String} path - Path to the pattern's HTML
   * the path data with
   *
   * @returns {object} Object of data about the processed pattern
   */
  function processPatternData( path ){
    var fileContents = grunt.file.read(path);
    var frontMatter = yamlFrontMatter.loadFront(fileContents);
    var initData = {
      content: frontMatter.__content.trim(),
      slug: getPatternSlug(path, frontMatter)
    };

    if(typeof frontMatter.title === 'undefined') {
      grunt.log.warn('"' + path + '" doesn\'t have a title -- ignoring this file.');
      return false;
    }

    var data = _.merge( initData, ( typeof arguments[2] !== "undefined" ) ? arguments[2] : {} );

    delete frontMatter.slug;
    delete frontMatter.__content;

    // Carry the rest of the front matter data to the object
    return _.defaults(data, frontMatter);
  }
  return {
    processPatternData: processPatternData
  };
};
