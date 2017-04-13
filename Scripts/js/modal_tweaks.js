// Toggle visible & not visible items in login modals
$(function() {
    
    $(".js-toggle-visible").on('click', function(e) {
        e.preventDefault();
        $('.visible').toggleClass('hidden');
    });

    $('.js-double-switch').click(function(e) {
        e.preventDefault();
        $(this).closest('.js-md-double').toggleClass('md-switch');
    });

    $('.js-md-close').click(function(e) {
        e.preventDefault();
        // $(this).closest('.js-md-double').removeClass('md-switch');
        $(this).closest('.md-modal').find(".md-close").trigger('click'); 
    });

});

// Close modals with ESC key
$(document).keyup(function(e) {
  if (e.keyCode == 27) { 
   $('body').find(".md-close").trigger('click');
  }
});