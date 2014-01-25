(function() {
  var activeClass = 'is-active';
  var patternSelector = '.pattern';

  function iterateNodes(els, cb) {
    [].forEach.call(els, cb);
  }

  function removeClassFromAll(patterns) {
    iterateNodes(patterns, function(pattern) {
      pattern.classList.remove(activeClass);
    });
  }

  Path.root('#/');

  Path.map('#/').to(function() {
    removeClassFromAll(document.querySelectorAll(patternSelector));

    document.querySelector('.pattern-listing').classList.add(activeClass);
  });

  Path.map('#/:name').to(function() {
    document.querySelector('.pattern-listing').classList.remove(activeClass);
    removeClassFromAll(document.querySelectorAll(patternSelector));

    document.getElementById(this.params.name).classList.add(activeClass);
  });

  Path.listen();
})();
