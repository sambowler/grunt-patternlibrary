(function() {
  var activeClass = 'is-active';
  var patterns;
  var iframe = document.querySelector('.ptrnlib-content');
  var getPatternJSON = $.getJSON('patterns.json');
  var currViewType, currPattern;

  getPatternJSON.then(function(data) {
    patterns = data;
  });

  function updateNav(value) {
    document.querySelector('.ptrnlib-nav').value = '#/' + value;
  }

  function changeVisiblePattern(patternName) {
    $('.ptrnlib-overview').removeClass(activeClass);
    $('.ptrnlib-pattern').removeClass(activeClass);

    var pattern = document.getElementById('ptrnlib-' + patternName);

    $(pattern).addClass(activeClass);

    updateNav(patternName);

    $('body').addClass('is-pattern-page');
  }

  function changeViewType(newType) {
    var types = ['simple', 'detailed'];
    var $body = $('body');

    for(var i = 0; i < types.length; i++) {
      var klass = 'is-' + types[i] + '-view';

      if(types[i] === newType) {
        $body.addClass(klass);

        document.querySelector('.ptrnlib-view-type').value = types[i];
      } else {
        $body.removeClass(klass);
      }
    }

    currViewType = newType;
  }

  Path.root('#/');

  Path.map('#/').to(function() {
    $('body').removeClass('is-pattern-page is-simple-view is-detailed-view');
    $('body').addClass('is-pattern-listing');
    $('.ptrnlib-overview').addClass(activeClass);
    $('.ptrnlib-pattern').removeClass(activeClass);

    updateNav('');
  }).exit(function() {
    $('body').removeClass('is-pattern-listing');
  });

  Path.map('#/:name(/:view)').to(function() {
    var patternName = this.params.name;
    if(typeof this.params.view === 'undefined' ) {
        window.location.href = '#/' + patternName + '/' + document.querySelector('.ptrnlib-view-type').value;
    } else {
        changeViewType(this.params.view);
    }

    if(typeof patterns === 'undefined') {
      getPatternJSON.done(function() {
        changeVisiblePattern(patternName);
      });
    } else {
      changeVisiblePattern(patternName);
    }

    currPattern = patternName;
  });

  Path.listen();

  $('.ptrnlib-nav').on('change', function() {
    var path = this.value;

    if(!path) path = '#/';

    window.location.href = path;
  });

  $('.ptrnlib-view-type').on('change', function() {
    window.location.href = '#/' + currPattern + '/' + this.value;
  });
})();
