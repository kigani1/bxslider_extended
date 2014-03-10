;
(function ($) {
    $.fn.bxSliderExt = function (options) {

        // create a namespace to be used throughout the plugin
        var slider = {};
        var el = this;
        var bxslider;

        if (this.length == 0) return this;

        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () {
                $(this).bxSliderExt(options)
            });
            return this;
        }

        var init = function () {

            //TODO: run orginal onSliderLoad and onSliderBefore. Don't just overwrite them

            slider.settings = options;
            slider.slides = el.find('.slide');

            slider.caption = $('<div>').addClass('caption-main');


            //add preloader to slider
          $(el).append('<div class="slider-preloader"></div>');


            slider.settings.onSliderLoad = function (index) {
                var self = this;

                slider.slides.each(function () {


                    //fix the position of copyright icon in mobile version (add class used to set up the position of copyrights icon, switch order of bx-caption and copyright icon)
                    var tmpCaption = $(this).find(".bx-caption"),
                        isPresent = tmpCaption.find('h1').length;

                    if (isPresent == 0) {
                        tmpCaption.addClass('hidden');
                    }
                    var tmpCopyright = $(this).find(".copyright");

                    if (tmpCaption && tmpCopyright) {
                        $(tmpCopyright).insertAfter(tmpCaption);
                    }

                    //open link in the new window

//                    if ($(this).attr('data-url') != undefined && $(this).attr('data-url').length != 0) {
//                        var link = $(this).attr('data-url');
//                        $(this).css('cursor', 'pointer');
//
//                        $(this).click(function () {
//                            if ($(this).attr('data-target') != undefined && $(this).attr('data-target') == "True") {
//                                var win = window.open(link, '_blank');
//                                win.focus();
//                            } else {
//                                $(location).attr('href', link);
//                            }
//
//                        });
//                        $(this).find('.copyright').on('click', function (e) {
//                            e.stopPropagation();
//                        });
//                    }

                });

                el.find('.slider-preloader').hide();


                //prepend static caption container and add content
                el.find('img').css('opacity', 1);
                if ($(el).hasClass('slider-panoramic')) {
                    el.find('.bx-viewport').prepend(slider.caption);
                }
                var currentCaption = slider.slides.eq(index).find('.bx-caption').html();
                if (currentCaption != undefined) {
                    slider.caption.html(currentCaption);

//                    if (slider.slides.eq(index).attr('data-url') != undefined && slider.slides.eq(index).attr('data-url').length != 0) {
//                        slider.caption.css('cursor', 'pointer');
//                        slider.caption.click(
//                            function () {
//                                if (slider.slides.eq(index).attr('data-target') != undefined && slider.slides.eq(index).attr('data-target') == "True") {
//                                    var win = window.open(slider.slides.eq(index).attr('data-url'), '_blank');
//                                    win.focus();
//                                } else {
//                                    $(location).attr('href', slider.slides.eq(index).attr('data-url'));
//                                }
//                            });
//
//                    }
                }
                else {
                    slider.caption.hide();
                }


                el.find('iframe').each(function (index) {
                    $(this)[0].src = $(this)[0].src + '?wmode=transparent&api=1&enablejsapi=1&player_id=player' + index;
                    //$(this)[0].src = $(this)[0].src + '?api=1&player_id=player' + index;
                    $(this).attr('wmode', 'Opaque');
                    $(this).attr('id', 'player' + index);

                    //break auto mode when video is playing
                    $(this).iframeTracker({
                        blurCallback: function () {
                            bxslider.stopAuto();
                        }
                    });
                });

                //custom pager with thumbnails
                if (slider.settings.pagerCustom) {
                    var controls = $(".bx-pg-controls-direction"),
                        pager = el.find('.slider-pager'),
                        pagerContainer = pager.find('.pager-overflow').children(),
                        pagerOverflowSize = $('.pager-overflow').height(),
                        prevButton = undefined,
                        nextButton = undefined,
                        pagerSize = pagerContainer.height(),
                        currentPage = 1,
                        disabledPoint = Math.ceil($('.pager-container a').length / 3);

                    //adjust height of thumbnails images (to keep aspect ratio on different viewport widths)
                    var adjustHeight = function () {
                        pagerContainer.find('.pager-item').map(function () {
                            var width = $(this).width();
                            $(this).height(width / 2);
                        });
                    }
                    adjustHeight();
                    $(window).on('resize', function () {
                        adjustHeight();
                    });
                    //count the distance the container with thumbnails should be scroll on clicking 'prev/next' buttons
                    var distanceToScroll = Math.round($('.slider-with-thumbs .pager-item').outerHeight(true) * 3);

                   //wait for resize event is finished and then recalculate the data
                    $(window).resize(function () {
                        waitForFinalEvent(function () {
                            pagerOverflowSize = $('.pager-overflow').height();
                            distanceToScroll = Math.round($('.slider-with-thumbs .pager-item').outerHeight(true) * 3)
                        }, 500, "resize event finished");
                    });
                    //recalculate data on 'orientation-change' event
                    if (isMobile) {
                        window.addEventListener("orientationchange", function () {
                            pagerOverflowSize = $('.pager-overflow').height();
                            distanceToScroll = Math.round($('.slider-with-thumbs .pager-item').outerHeight(true) * 3)
                        }, false);
                    }


                    if (disabledPoint > 1) {

                        controls.show();
                        prevButton = pager.find('.bx-pg-prev');
                        nextButton = pager.find('.bx-pg-next');

                        pager.find('.bx-pg-controls-direction').on('click', 'a', function (event) {
                            event.preventDefault();

                            if ($(this).hasClass('bx-pg-next')) {
                                if (currentPage !== disabledPoint) {
                                    if (supportsTransitions()) {
                                        pagerContainer.css('top', -distanceToScroll * currentPage++);
                                    } else {
                                        pagerContainer.animate({'top': (-distanceToScroll * currentPage++)}, 1000);
                                    }
                                    prevButton.removeClass('disabled');
                                    if (currentPage === disabledPoint) {
                                        nextButton.addClass('disabled');
                                    }
                                }
                            } else {
                                if (currentPage !== 1) {
                                    if (supportsTransitions()) {
                                        pagerContainer.css('top', -distanceToScroll * (--currentPage - 1));

                                    } else {
                                        pagerContainer.animate({'top': (-distanceToScroll * (--currentPage - 1))}, 1000);
                                    }
                                    nextButton.removeClass('disabled');
                                    if (currentPage === 1) {
                                        prevButton.addClass('disabled');
                                    }
                                }
                            }
                        });

                    }


                }

                //handle showing copyright information on mobile devices
                if (isMobile) {
                slider.slides.find('.copyright').on('touchstart', function (e) {
                    e.preventDefault();
                    var el = $(this).find('p'),
                        checkVisibility = el.css('display');

                    if (checkVisibility == 'none') {
                        el.css('display', 'block');
                        setTimeout(function () {
                            el.hide();
                        }, 3000);
                        {

                        }
                    } else {
                        el.css('display', 'none');
                    }
                });
                }


                var check = slider.slides.find('.bx-caption').find('h1').length;
                if (check == 0) el.addClass('no-title');


            };

            slider.settings.onSlideBefore = function (slide) {
               slider.caption.html(slide.find('.bx-caption').html());

               //hide copyright information if it is visible
               var currentCopyright = slide.find('.copyright p');
               if (currentCopyright.is(':visible')) currentCopyright.hide();

//                var currentCaption = slide.find('.bx-caption').html(),
//                if (currentCaption != undefined) {
//
//                    slider.caption.fadeIn(function () {
//                        if (slide.attr('data-url') != undefined && slide.attr('data-url').length != 0) {
//                            $(this).css('cursor', 'pointer');
//
//                            $(this).click(function () {
//
//                                if (slide.attr('data-target') != undefined && slide.attr('data-target') == "True") {
//                                    var win = window.open(slide.attr('data-url'), '_blank');
//                                    win.focus();
//                                } else {
//                                    $(location).attr('href', slide.attr('data-url'));
//                                }
//                            });
//                        }
//                        else {
//                            $(this).css('cursor', '');
//                            $(this).unbind('click');
//                        }
//
//                    }).html(slide.find('.bx-caption').html());
//
//                }
//                else {
//                    slider.caption.fadeOut(200);
//                }
                el.find('iframe').each(function (index) {
                    if ($(this)[0].src.indexOf('vimeo') !== -1) {
                        var player = $f($(this)[0]);
                        player.api('pause');
                    } else {
                        callPlayer($(this).attr('id'), "pauseVideo");
                    }

                });

            };

            bxslider = el.find('.slide-container').bxSlider(slider.settings);
        }

        init();

        // returns the current bxslider
        return bxslider;
    }
})(jQuery);
