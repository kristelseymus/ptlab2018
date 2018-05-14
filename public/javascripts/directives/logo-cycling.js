(function () {
    'use strict';
    angular.module('ptlab')
    .directive(
            "logoCycling",
            function() {
                // I alter the DOM to add the fader image.
                function compile( element, attributes, transclude ) {
                    element.prepend( "<img class='fader' />" );
                    return( link );
                }
                // I bind the UI events to the $scope.
                function link( $scope, element, attributes ) {
                    var fader = element.find( "img.fader" );
                    var primary = element.find( "img.image" );
                    // Watch for changes in the source of the primary
                    // image. Whenever it changes, we want to show it
                    // fade into the new source.
                    $scope.$watch(
                        function(){return $scope.image.source;},
                        function( newValue, oldValue ) {
                            // If the $watch() is initializing, ignore.
                            if ( newValue === oldValue ) {
                                return;
                            }
                            // If the fader is still fading out, don't
                            // bother changing the source of the fader;
                            // just let the previous image continue to
                            // fade out.
                            if ( isFading() ) {
                                return;
                            }
                            initFade( oldValue );
                        },
                        true
                    );
                    // I prepare the fader to show the previous image
                    // while fading out of view.
                    function initFade( fadeSource ) {
                      console.log(fadeSource);
                        fader.prop( "src", fadeSource ).addClass( "show" );
                        // Don't actually start the fade until the
                        // primary image has loaded the new source.
                        primary.one( "load", startFade() );
                    }
                    // I determine if the fader is currently fading
                    // out of view (that is currently animated).
                    function isFading() {
                        return(
                            fader.hasClass( "show" ) ||
                            fader.hasClass( "fadeOut" )
                        );
                    }
                    // I start the fade-out process.
                    function startFade() {
                      console.log("fade started");
                        // The .width() call is here to ensure that
                        // the browser repaints before applying the
                        // fade-out class (so as to make sure the
                        // opacity doesn't kick in immediately).
                        fader.width();
                        fader.addClass( "fadeOut" );
                        console.log(fader);
                        setTimeout( teardownFade(), 250 );
                    }
                    // I clean up the fader after the fade-out has
                    // completed its animation.
                    function teardownFade() {
                        fader.removeClass( "show fadeOut" );
                    }
                }
                // Return the directive configuration.
                return({
                    compile: compile,
                    restrict: "A"
                });
            }
        );

    /*.directive('logoCycling', function() {
      var link = function(scope, element, attrs){
        var images = ["images/Logo_PTLab-01.jpg","images/Logo_PTLab-02.jpg","images/Logo_PTLab-03.jpg"];
        var i = 0;
        setInterval(function () {
              i++;
              if (i >= images.length) {
                  i = 0;
              }
              $("#logo").fadeOut(function () {
                  $("#logo").attr('src', images[i]).fadeIn();
              })
          }, 10000)
      };

      return {
          restrict: 'A',
          link: link
      };
    });*/

})();
