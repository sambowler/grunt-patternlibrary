(function() {
  var activeClass = 'is-active';
  var patterns;
  var iframe = document.querySelector('.ptrnlib-content');
  var getPatternJSON = $.getJSON('patterns.json');
  var currViewType, currPattern;
  var ptrnlibToggle = $('.ptrnlib-toggle');
  var ptrnlibHeader = $('.ptrnlib-header');

  getPatternJSON.then(function(data) {
    patterns = data;
  });

  function updateNav() {
    document.querySelector('.ptrnlib-nav').value = window.location.pathname;
  }

  $('.ptrnlib-nav').on('change', function() {
    window.location.href = this.value;
  });

  ptrnlibToggle.on('click', function(){
      ptrnlibHeader[ ptrnlibHeader.hasClass( activeClass ) ? 'removeClass' : 'addClass' ]( activeClass );
      return false;
  });

  updateNav();
})();
