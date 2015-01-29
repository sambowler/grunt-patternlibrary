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

#####Example:

```js
grunt.initConfig({
  patternlibrary: {
    patterns: {
      dest: 'patterns/dist',
      indexName: 'foobar.html',
      stylesheets: [ 'stylesheet1.css', 'stylesheet2.css' ],
      javascripts: [ 'script1.js', 'script2.js' ],
      blankCanvas: true
      title: 'My Pattern Library',
      include: [
        {
          src: 'some-folder/style.css',
          // Relative to "dest"
          dest: 'css/my-styles.css'
        }
      ],
      src: 'patterns/src/**/*.html',
      wrapperTemplate: 'patterns/wrapperTemplate.html',
      templateSrc: 'patterns/templates'
    }
  }
});
```

| Option | Description |
:---|:---
| `dest` | Destination folder for the generated pattern library to be saved in
| `indexName` | Name of the index HTML file that is generated (default: "index.html")
| `stylesheets` | Stylesheets to include on the page (path relative to `dest`) -- will be output in sequential order in the `<head>` of the document
| `javascripts` | JavaScripts to include on the page (path relative to `dest`) -- wil be output in sequential order at the bottom of the `<body>` tag in the document
| `blankCanvas` | If this is set to true, none of grunt-patternlibrary's built in CSS or JS will be brought through to the output
| `title` | Title for the pattern library, used in the `<title>` and pattern library header.
| `include` | Additional files to copy into pattern library build folder (these can be used in the `stylesheets` and `javascripts` options above by referencing the `dest` location)
| `src` | Path to your individual pattern HTML files (see [Patterns](#patterns))
| `wrapperTemplate` | Path to a custom template for the wrapper around the patterns (see [Wrapper Template](#wrapper-template))
| `templateSrc` |  Path to template files (see [Templates](#templates))


##Patterns
Each HTML file found by the `src` path can be considered a *pattern*

The Pattern file supports 'YAML frontmatter' that allows data added at the top of the file to be used by the patternlibrary, it looks something like this:

```yml
---
	title: Headings
---
```

anything between the tripple-dashed lines will be parsed as [YAML](http://www.yaml.org/)

The patternlibrary supports the following options;

| Option | Description |
:---|:---
| `title` | The only **required** variable, it is used as the pattern name within the ui
| `status` | By default; displays an icon next to the pattern entry that denotes its progress.<br>Supported values: `not-started` `in-progress` `done`
| `category` | If set; creates a category that can be associated with one or many patterns (by adding the same value to multiple patterns) to form logical groups within the ui
| `template` | If set; uses the specified html file to wrap the pattern without including it in the source output. Use [EJS](http://www.embeddedjs.com/) to add the pattern content to each template: `<%= content %>` (see [Templates](#templates))
| `notes` | Allows the addition of markdown enhanced documentation to the pattern. Note: to preserve newlines in yaml; use a pipe character followed by the multi-line content [example](https://gist.github.com/rjattrill/7523554)

A full example of a pattern's frontmatter:

```yml
---
	title: Headings
	status: done
	category: Text
	template: content-box
	notes: |
		**heading styles** for user edited content throughout the site
---
```

## Wrapper Template
The wrapper template is the base HTML for the patternlibrary. (see [default wrapper](https://github.com/sambowler/grunt-patternlibrary/blob/master/templates/wrapper.html)) 

This option can be used when you need more flexibility than custom js + css afford.

Variables available to the wrapper template:

| Variable | Description |
:---|:---
| `rootTitle` | *String* (default *Pattern Library*) used in the header and `<title>`
| `javascripts` | *Array* default script tags extended by options.
| `stylesheets` | *Array* default css locations extended by options
| `patterns` | *Object* contains named key for each pattern (see below)

```js
patterns: {
	"News Listing" : {
		title: "News Listing",
		slug: "news-listing",
		template: "sidebar",
		content: //full html content
	},
	...
}
```


## Templates

Reusable markup that wraps a pattern to give visual context but doesn't show in the source markup for the pattern.

example `templates/sidebar.html`

```html
<aside class="sidebar">
	<div class="sidebar__inner">
		<%= content %>
	</div>
</aside>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
