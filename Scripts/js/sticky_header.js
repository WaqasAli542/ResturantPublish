/* All scrolling functions for the OLO menu page */    
$(document).ready(function(){   
   
   var header = $(".js-sticky-header");
   var headerOffset = 1;
   
   $(window).scroll(function() {
       var scroll = $(window).scrollTop();
       // toggle the header stuck class
       if ( scroll > headerOffset ) { 
           header.removeClass("unstuck");
           header.addClass("stuck"); 
       } else { 
           header.removeClass("stuck"); 
           header.addClass("unstuck"); 
       } 
   });

   if ( $(".js-sticky-nav").length ) {

       var navbar = $(".js-sticky-nav");
       var navbarOffset = navbar.offset().top - navbar.height();
       var scrollOffset = 200;
       var array = new Array();
       $(".js-scroll-section").each(function() { array.push($(this).offset().top); })

       $(window).scroll(function() {
           var scroll_nav = $(window).scrollTop();
           // toggle the navbar stuck class
           if ( scroll_nav > navbarOffset ) { navbar.addClass("stuck"); } else { navbar.removeClass("stuck"); }
           // highlight the current section of the navigation bar
           for (var i=0; i<array.length; i++) {
               if ( scroll_nav > ( array[i] - scrollOffset ) ) {
                   navbar.find('li').removeClass("current-section");
                   $(navbar.find('li')[i]).addClass("current-section");
               } else if ( scroll_nav < navbarOffset ) {
                   navbar.find('li').removeClass("current-section");
               }
           }  
       });

   }     

});