/* vim: set ts=2 sw=2: */
module.exports = function(grunt) {
  'use strict';

  var yamlFrontMatter = require('yaml-front-matter');
  var _ = require('lodash');

  function getPatternSlug(path, data) {
    if(data.hasOwnProperty('slug')) {
      return data.slug;
    } else {
      var fileName = path.split('/').pop();

      return fileName.split('.')[0];
    }
  }

  function process(path, templatePath) {
    var fileContents = grunt.file.read(path);
    var frontMatter = yamlFrontMatter.loadFront(fileContents);

    if(typeof frontMatter.title === 'undefined') {
      grunt.log.warn('"' + path + '" doesn\'t have a title -- ignoring');
      return false;
    }

    var template = grunt.file.read(templatePath);
    var data = {
      content: frontMatter.__content,
      slug: getPatternSlug(path, frontMatter),
    };

    delete frontMatter.slug;
    delete frontMatter.__content;

    // Carry the rest of the front matter data to the object
    data = _.defaults(data, frontMatter);

    data['html'] = grunt.template.process(template, { data: data });

    return data;
  }

  return {
    process: process
  }
}
