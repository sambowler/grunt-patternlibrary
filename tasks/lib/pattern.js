/* vim: set ts=2 sw=2: */
/**
 * Processes a specific pattern
 */
module.exports = function(grunt) {
  'use strict';

  var yamlFrontMatter = require('yaml-front-matter');
  var _ = require('lodash');

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
   * @param {String} templatePath - Path to the template to be used to process
   * the path data with
   *
   * @returns {object} Object of data about the processed pattern
   */
  function processPattern(path, templatePath) {
    var fileContents = grunt.file.read(path);
    var frontMatter = yamlFrontMatter.loadFront(fileContents);

    if(typeof frontMatter.title === 'undefined') {
      grunt.log.warn('"' + path + '" doesn\'t have a title -- ignoring this file.');
      return false;
    }

    var template = grunt.file.read(templatePath);
    var data = {
      content: frontMatter.__content.trim(),
      slug: getPatternSlug(path, frontMatter)
    };

    delete frontMatter.slug;
    delete frontMatter.__content;

    // Carry the rest of the front matter data to the object
    data = _.defaults(data, frontMatter);

    data['html'] = grunt.template.process(template, { data: data });

    return data;
  }

  return {
    processPattern: processPattern
  }
}
