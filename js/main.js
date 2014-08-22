(function() {
    var patterns;
    var iframe = document.querySelector('.ptrnlib-content');
    var getPatternJSON = $.getJSON('patterns.json');
    var currViewType, currPattern;
    var ptrnlibHandle = $('.ptrnlib-handle');
    var ptrnlibBody = $('body.ptrnlib');
    var ptrnlibToggle = $('.ptrnlib-toggle');
    var ptrnlibDetails = $('.ptrnlib-pattern__details');

    getPatternJSON.then(function(data) {
        patterns = data;
    });

    function updateNav() {
        document.querySelector('.ptrnlib-nav').value = window.location.pathname;
    }

    $('.ptrnlib-nav').on('change', function() {
        window.location.href = this.value;
    });

    function bindToggle( trigger, target, activeClass ){
        trigger.on('click', function(){
            target[ target.hasClass( activeClass ) ? 'removeClass' : 'addClass' ]( activeClass );
            return false;
        });
    }

    bindToggle( ptrnlibToggle, ptrnlibBody, 'is-expanded' );
    bindToggle( ptrnlibHandle, ptrnlibBody, 'is-active' );

    updateNav();

    (function(){
        var filter = $('#ptrnlib-filter'),
            items = $('.ptrnlib-list__item'),
            categories = $('.ptrnlib-list__category'),
            visibleClass = 'is-visible';

        filter.on('keyup', function(){
            var val = filter.val();
            items.removeClass( visibleClass ).filter( ( val !== '' ) ? '[data-slug*=' + val.toLowerCase() + ']' : '*').addClass( visibleClass );
            categories.removeClass( visibleClass ).filter( function(){ 
               return $( this ).find( '.' + visibleClass ).length ? true : false;
            }).addClass( visibleClass );
        });
    })();

})();
