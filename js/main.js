$(function(){

    $('.slider-with-thumbs').bxSliderExt({
        type: 'slider-with-thumbs',
        mode: 'fade',
        captions: true,
        slideWidth: 530,
        pagerCustom: '.pager-container', // option added in bxsliderExt, create custom pager with thumbnails
        video: true,
        pause: 5000,

        auto: (function () {
            var bool = ($('.slider-product .slide').length > 1);
            return bool;
        })(),
        touchEnabled: (function () {
            return $('.slider-product .slide').length > 1 ? true : false;
        })()
    });
    $('.slider-panoramic').bxSliderExt({
        type: 'panoramic',
        slideWidth: 1024,
        captions: true,
        video: true,
        preloadImages: 'all',
        pager: false
    });

    $('.slider-simple').bxSliderExt({
        slideWidth: 530,
        infiniteLoop: true,
        hideControlOnEnd: true,
        captions: true,
        video: true,
        pager: false

    });
});