(function() {
    var iframe = document.querySelector('.ptrnlib-content');
    var currViewType, currPattern;
    var ptrnlibHandle = $('.ptrnlib-handle');
    var ptrnlibHtml = $('html.ptrnlib');
    var ptrnlibToggle = $('.ptrnlib-toggle');
    var ptrnlibDetails = $('.ptrnlib-pattern__details');

    function updateNav() {
        var current = window.location.pathname.match( /(patterns\/)?([^\/]+\.html$)/g );
        if( current !==  null && document.querySelector('.ptrnlib-nav option[value$="'+ current[0] +'"]') !== null ){
            document.querySelector('.ptrnlib-nav option[value$="'+ current[0] +'"]').setAttribute('selected', true);
        }
    }

    $('.ptrnlib-nav').on('change', function() {
        window.location.href = this.value;
    });

    function bindToggle( trigger, target, activeClass ){
        trigger.on('click', function(){
            var test = target.hasClass( activeClass );
            target[ test ? 'removeClass' : 'addClass' ]( activeClass );
            setState( 'ptrnlib-' + activeClass, !test );
            return false;
        });
    }

    function setState( key, state ){
        if( window && window.localStorage ){
            window.localStorage[ key ] = state;
        }
    }

    function getState( name ){
        if( window && window.localStorage ){
            var item = window.localStorage[ 'ptrnlib-' + name ];
            if( typeof item !== 'undefined' ) {
                ptrnlibHtml[ item === 'true' ? 'addClass' : 'removeClass' ]( name );
            }
        }
    }

    getState( 'is-expanded' );
    getState( 'is-active' );
    bindToggle( ptrnlibToggle, ptrnlibHtml, 'is-expanded' );
    bindToggle( ptrnlibHandle, ptrnlibHtml, 'is-active' );

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
