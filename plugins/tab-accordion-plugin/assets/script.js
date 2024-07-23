jQuery(document).ready(function ($) {
    $('#tab1').show();
    $('#tab1 .tab').addClass('active');
    $('.tabs .tab').on('click', function () {
        var tabId = $(this).data('tab');
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').hide();
       
        $('#' + tabId).show();
    });

    // Accordion
   $('.accordion-header').click(function() {
        $('.accordion-header').removeClass('header-active');
    var contentId = $(this).next('.accordion-content').attr('id');
    $('.accordion-content').not('#' + contentId).slideUp();
    $(this).addClass('header-active');
    $('#' + contentId).slideToggle();
});
});
