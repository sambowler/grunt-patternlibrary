(function() {
  var activeClass = 'is-active';
  var patterns;
  var iframe = document.querySelector('.ptrnlib-content');
  var getPatternJSON = $.getJSON('patterns.json');

  getPatternJSON.then(function(data) {
    patterns = data;
  });

  function updateNav(value) {
    document.querySelector('.ptrnlib-nav').value = '#/' + value;
  }

  function changeVisiblePattern(patternName) {
    $('.ptrnlib-overview').removeClass(activeClass);
    $('.ptrnlib-pattern').removeClass(activeClass);

    var data = patterns[patternName];
    var pattern = document.getElementById(patternName);

    $(pattern).addClass(activeClass);

    updateNav(patternName);
  }

  Path.root('#/');

  Path.map('#/').to(function() {
    $('.ptrnlib-overview').addClass(activeClass);
    $('.ptrnlib-pattern').removeClass(activeClass);

    updateNav('');
  });

  Path.map('#/:name').to(function() {
    var patternName = this.params.name;

    if(typeof patterns === 'undefined') {
      getPatternJSON.done(function() {
        changeVisiblePattern(patternName)
      });
    } else {
      changeVisiblePattern(patternName);
    }
  });

  Path.listen();

  $( '.ptrnlib-nav' ).on( 'change', function() {
    var path = this.value;

    if(!path) path = '#/';

    window.location.href = path;
  });
})();
