module.exports = function(grunt) {
  /**
   * Gets JSON from the provided patterns aray
   *
   * @param {array} patterns
   *
   * @returns {string} - Stringified JSON of data
   */
  function getJSON(patterns) {
    var _ = require('lodash');
    var data = patterns;

    return JSON.stringify(data);
  }

  /**
   * Gets markup given the provided data
   *
   * @param {string} template - Path to the wrapper template
   * @param {string} data.title - Title for the page
   * @param {array} data.stylesheets - Array of stylesheets
   * @param {array} data.javascripts - Array of javascripts
   * @param {array} data.patterns - Array of patterns
   *
   * @returns {string} - Markup for the wrapper
   */
  function getMarkup(template, data) {
      data.javascripts = data.javascripts.map(function(script) {
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

      return grunt.template.process(grunt.file.read(template), { data: data });
  }

  return {
    getMarkup: getMarkup,
    getJSON: getJSON
  };
};
