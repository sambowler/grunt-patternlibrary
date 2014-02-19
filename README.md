# grunt-patternlibrary

> Create a pattern library with a set of HTML files.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-patternlibrary --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-patternlibrary');
```

## The "patternlibrary" task

### Overview
In your project's Gruntfile, add a section named `patternlibrary` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  patternlibrary: {
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options
No task-wide options

#### Custom Options

```js
grunt.initConfig({
  patternlibrary: {
    patterns: {
      // Destination folder for the generated pattern library to be saved in
      dest: 'patterns/dist',

      // Name of the index HTML file that is generated (default: "index.html")
      indexName: 'foobar.html',

      // Stylesheets to include on the page (path relative to "dest") -- will be output in sequential order in the HEAD of the document
      stylesheets: [ 'stylesheet1.css', 'stylesheet2.css' ],

      // JavaScripts to include on the page (path relative to "dest") -- wil be output in sequential order at the bottom of the BODY tag in the document
      javascripts: [ 'script1.js', 'script2.js' ],

      // If this is set to true, none of grunt-patternlibrary's built in CSS or JS will be brought through to the output (optional)
      blankCanvas: true

      // Title for the pattern library
      title: 'My Pattern Library',

      // Additional files to include (these can be referenced in the "stylesheets" and "javascripts" options above)
      include: [
        {
          src: 'some-folder/style.css',
          // Relative to "dest"
          dest: 'css/my-styles.css'
        }
      ],

      // Path to your individual pattern HTML files
      src: 'patterns/src/**/*.html',

      // Path to a custom template for individual patterns
      patternTemplate: 'patterns/patternTemplate.html',

      // Path to a custom template for the wrapper around the patterns
      wrapperTemplate: 'patterns/wrapperTemplate.html'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
