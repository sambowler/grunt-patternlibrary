/*global $*/
(function() {
    var ptrnlibHtml = $('html.ptrnlib'),
        ptrnlibToggle = $('.ptrnlib-toggle'),
        ptrnlibBody = $('body')

        // sets select element to current pattern
        ptrnlibUpdateNav = function(){
            var current = window.location.pathname.match( /(patterns\/)?([^\/]+\.html$)/g );
            if( current !==  null && document.querySelector('.ptrnlib-nav option[value$="'+ current[0] +'"]') !== null ){
                document.querySelector('.ptrnlib-nav option[value$="'+ current[0] +'"]').setAttribute('selected', true);
            }
        };

    $('.ptrnlib-nav').on('change', function() {
        window.location.href = '/patterns/' + this.value;
    });

    // toggle is-expanded on <html>
    ptrnlibToggle.on('click', function(){
        var test = ptrnlibHtml.hasClass( 'is-expanded' );
        ptrnlibHtml[ test ? 'removeClass' : 'addClass' ]( 'is-expanded' );
        return false;
    });

    // close expanded on overlay click
    ptrnlibHtml.on('click', function( e ){
        if ( e.target.nodeName !== 'HTML' ) return;
        ptrnlibHtml.removeClass( 'is-expanded' );
    });

    ptrnlibUpdateNav();
})();


(function(){
    var filter = $('#ptrnlib-filter'),
    items = $('.ptrnlib-list__item'),
    categories = $('.ptrnlib-list__category'),
    visibleClass = 'is-visible';

    filter.on('keyup', function(){
        var val = filter.val();

        // add visible class to elements that have data-slug matching val
        items.removeClass( visibleClass ).filter(function(){
            return ( val === '' ) ? true : $(this).is( '[data-slug*=' + val.toLowerCase() + '], [data-status=' + val.toLowerCase() + ']' );
        }).addClass( visibleClass );

        // only show categories that contain matching elements
        categories.removeClass( visibleClass ).filter( function(){
            return $( this ).find( '.' + visibleClass ).length ? true : false;
        }).addClass( visibleClass );
    });
})();
