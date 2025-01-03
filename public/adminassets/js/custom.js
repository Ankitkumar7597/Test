/*--------------------- Copyright (c) 2020 -----------------------
[Master Javascript]
Project: Admin- Responsive HTML Template 
Version: 1.0.0
Assigned to: Theme Forest
-------------------------------------------------------------------*/
(function ($) {
    "use strict";

    /*-----------------------------------------------------
        Function  Start
    -----------------------------------------------------*/
    var admin = {
        initialised: false,
        version: 1.0,
        mobile: false,
        collapseScreenSize: 991,
        sideBarSize: 1199,
        init: function () {
            if (!this.initialised) {
                this.initialised = true;
            } else {
                return;
            }
            /*-----------------------------------------------------
                Function Calling
            -----------------------------------------------------*/
            this.userToggle();
            this.sideBarToggle();
            this.sideMenu();
            this.sideBarHover();
            this.searchToggle();
            this.rightSlide();
            this.tooltipHover();
            this.counter();
            this.nubberSpin();
            this.singleSlide();
            this.productRemove();
            this.Quantity();
            this.PriceRange();
            this.Product_thumb_slider();
            this.counter_number();
            this.loader();
        },

        /*-----------------------------------------------------
            Fix Header User Button
        -----------------------------------------------------*/
        // loader			
        loader: function () {
            jQuery(window).on('load', function () {
                $(".loader").fadeOut();
                $(".spinner").delay(500).fadeOut("slow");
            });
        },
        // loader

        //Counter Js start
        counter_number: function () {
            if ($('.counter-text').length > 0) {
                $('.counter-text').appear(function () {
                    $('.count-no1').countTo();
                });
            }
        },
        //Counter Js end

        // Product Thumd Slider js
        Product_thumb_slider: function () {
            if ($('.int-thumb-slider').length > 0) {
                var galleryThumbs = new Swiper('.gallery-thumbs', {
                    spaceBetween: 10,
                    slidesPerView: 4,
                    freeMode: true,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                });
                var galleryTop = new Swiper('.gallery-top', {
                    spaceBetween: 10,
                    thumbs: {
                        swiper: galleryThumbs
                    }
                });
            }
        },
        // Product Thumd Slider js

        // Range Slider start
        PriceRange: function () {
            if ($('.range-slider').length > 0) {
                $(function () {
                    $("#slider-range").slider({
                        range: true,
                        min: 12,
                        max: 2000,
                        values: [541, 1402],
                        slide: function (event, ui) {
                            $("#amount").text("$" + ui.values[0] + " - $" + ui.values[1]);
                        }
                    });
                    $("#amount").text("$" + $("#slider-range").slider("values", 0) +
                        " - $" + $("#slider-range").slider("values", 1));
                });
            }
        },
        // Range Slider End

        // Quantity js start
        Quantity: function () {
            var quantity = 0;
            $('.quantity-plus').on('click', function (e) {
                e.preventDefault();
                var quantity = parseInt($(this).siblings('.quantity').val());
                $(this).siblings('.quantity').val(quantity + 1);

            });
            $('.quantity-minus').on('click', function (e) {
                e.preventDefault();
                var quantity = parseInt($(this).siblings('.quantity').val());
                if (quantity > 0) {
                    $(this).siblings('.quantity').val(quantity - 1);
                }
            });
        },
        // Quantity js End

        userToggle: function () {
            var count = 0;
            $('.user-info').on("click", function () {
                if ($(window).width() <= admin.collapseScreenSize) {
                    if (count == '0') {
                        $('.user-info-box').addClass('show');
                        count++;
                    } else {
                        $('.user-info-box').removeClass('show');
                        count--;
                    }
                }
            });

            /* $(".user-info-box, .user-info").on('click', function(e) {
                if ($(window).width() <= admin.collapseScreenSize) {
                    event.stopPropagation();
                }
            }); */

            $('body').on("click", function () {
                if ($(window).width() <= admin.collapseScreenSize) {
                    if (count == '1') {
                        $('.user-info-box').removeClass('show');
                        count--;
                    }
                }
            });
        },

        /*-----------------------------------------------------
            Fix Sidebar Toggle
        -----------------------------------------------------*/

        sideBarToggle: function () {
            $(".toggle-btn").on('click', function (e) {
                e.stopPropagation();
                $("body").toggleClass('mini-sidebar');
                $(this).toggleClass('checked');

            });
            $('.sidebar-wrapper').on('click', function (event) {
                event.stopPropagation();
            });
        },

        /*-----------------------------------------------------
            Fix Side Menu
        -----------------------------------------------------*/

        sideMenu: function () {
            $('.side-menu-wrap ul li').has('.sub-menu').addClass('has-sub-menu');
            $.sidebarMenu = function (menu) {
                var animationSpeed = 300,
                    subMenuSelector = '.sub-menu';
                $(menu).on('click', 'li a', function (e) {
                    var $this = $(this);
                    var checkElement = $this.next();
                    if (checkElement.is(subMenuSelector) && checkElement.is(':visible')) {
                        checkElement.slideUp(animationSpeed, function () {
                            checkElement.removeClass('menu-show');
                        });
                        checkElement.parent("li").removeClass("active");
                    } else if ((checkElement.is(subMenuSelector)) && (!checkElement.is(':visible'))) {
                        var parent = $this.parents('ul').first();
                        var ul = parent.find('ul:visible').slideUp(animationSpeed);
                        ul.removeClass('menu-show');
                        var parent_li = $this.parent("li");
                        checkElement.slideDown(animationSpeed, function () {
                            checkElement.addClass('menu-show');
                            parent.find('li.active').removeClass('active');
                            parent_li.addClass('active');
                        });
                    }
                    if (checkElement.is(subMenuSelector)) {
                        e.preventDefault();
                    }
                });
            }
            $.sidebarMenu($('.main-menu'));
            $(function () {
                for (var a = window.location, counting = $(".main-menu a").filter(function () {
                    return this.href == a;
                }).addClass("active").parent().addClass("active"); ;) {
                    if (!counting.is("li")) break;
                    counting = counting.parent().addClass("in").parent().addClass("active");
                }
            });
        },

        /*-----------------------------------------------------
            Fix Sidebar Hover
        -----------------------------------------------------*/

        sideBarHover: function () {
            if ($(window).width() >= admin.sideBarSize) {
                $(".sidebar-wrapper").hover(function () {
                    $('body').addClass('sidebar-hover');
                }, function () {
                    $('body').removeClass('sidebar-hover');
                });
            }
        },

        /*-----------------------------------------------------
            Fix  Search
        -----------------------------------------------------*/

        searchToggle: function () {
            $('.search-toggle').on("click", function () {
                $('.serch-wrapper').addClass('show-search');
            });
            $('.search-close, .main-content').on("click", function () {
                $('.serch-wrapper').removeClass('show-search');
            });
        },

        /*-----------------------------------------------------
            Fix Sidebar
        -----------------------------------------------------*/

        rightSlide: function () {
            $(".setting-info").on('click', function (e) {
                e.stopPropagation();
                $("body").toggleClass('open-setting');
            });
            $('body, .close-btn').on('click', function () {
                $('body').removeClass('open-setting');
            });
            $('.slide-setting-box').on('click', function (event) {
                event.stopPropagation();
            });

        },

        /*-----------------------------------------------------
            Fix Toltip
        -----------------------------------------------------*/

        tooltipHover: function () {
            if ($('.toltiped').length > 0) {
                $(".toltiped").tooltip();
            }
            if ($('.toltiped-right').length > 0) {
                $(".toltiped-right").tooltip({
                    'placement': 'right',
                });
            }
        },

        /*-----------------------------------------------------
            Fix Remove Product
        -----------------------------------------------------*/

        productRemove: function () {
            $(".remove-product").on('click', function () {
                $(this).closest('.product-thumb-wrap').parent().remove();
            });
        },


        /*-----------------------------------------------------
                Fix Counter
        -----------------------------------------------------*/
        counter: function () {
            if ($('.counter-holder').length > 0) {
                var a = 0;
                $(window).scroll(function () {
                    var topScroll = $('.counter-holder').offset().top - window.innerHeight;
                    if (a == 0 && $(window).scrollTop() > topScroll) {
                        $('.count-no').each(function () {
                            var $this = $(this),
                                countTo = $this.attr('data-count');
                            $({
                                countNum: $this.text()
                            }).animate({
                                countNum: countTo
                            }, {
                                duration: 5000,
                                easing: 'swing',
                                step: function () {
                                    $this.text(Math.floor(this.countNum));
                                },
                                complete: function () {
                                    $this.text(this.countNum);
                                }
                            });
                        });
                        a = 1;
                    }
                });
            };
        },

        /*-----------------------------------------------------
            Fix Number Spin
        -----------------------------------------------------*/
        nubberSpin: function () {
            if ($('.number-spin').length > 0) {
                $('.number-increase').on('click', function () {
                    if ($(this).prev().val() < 50000) {
                        $(this).prev().val(+$(this).prev().val() + 1);
                    }
                });
                $('.number-decrease').on('click', function () {
                    if ($(this).next().val() > 1) {
                        if ($(this).next().val() > 1) $(this).next().val(+$(this).next().val() - 1);
                    }
                });
            }
        },


        /*-----------------------------------------------------
            Fix Single Slide
        -----------------------------------------------------*/
        singleSlide: function () {
            if ($('.swiper-container.s1').length > 0) {
                var slingleSlideSwiper = new Swiper('.swiper-container.s1', {
                    autoHeight: false,
                    autoplay: false,
                    loop: true,
                    spaceBetween: 0,
                    centeredSlides: false,
                    speed: 1500,
                    autoplay: {
                        delay: 1000,
                    },
                    navigation: {
                        nextEl: '.swiperButtonNext',
                        prevEl: '.swiperButtonPrev',
                    },
                });
            }
        },

    };

    admin.init();

})(jQuery);

$(document).ready(function () {

    //color picker start
    $(window).on("load", function () {

        var colorcode = document.cookie;
        if (colorcode != "") {
            var cname = "colorcssfile";
            var name = cname + "=";
            var cssname = '';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) {
                    cssname = c.substring(name.length, c.length);
                }
            }

            if (cssname != '') {
                var new_style = 'assets/css/' + cssname + '.css';
                $('#theme-change').attr('href', new_style);
            }
        }
    });
    //Color Change Script
    $('.colorchange').on("click", function () {
        var name = $(this).attr('id');
        var new_style = 'assets/css/' + name + '.css';
        $('#theme-change').attr('href', new_style);
    });

    $("#style-switcher .bottom a.settings").on("click", function (e) {
        e.preventDefault();
        var div = $("#style-switcher");
        if (div.css("right") === "-133px") {
            $("#style-switcher").animate({
                right: "0px"
            });
        } else {
            $("#style-switcher").animate({
                right: "-133px"
            });
        }
    });
    //color picker end

});

// added by ankit

// data table
$(document).ready(function () {
    $('#dt-length-0').next().text('Show Entries');
    $('#testList_wrapper').children().first().addClass('datatablefilter');
})

/* // theme 
const themeToggleButton = document.getElementById('themeToggle');

// Check and set the initial theme from local storage
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-theme');
}

// Event listener to toggle the theme
themeToggleButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');

    // Save the current theme preference to local storage
    if (document.documentElement.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
 */


const themeToggle = document.getElementById('theme-toggle');
const ball = document.querySelector('.ball');

// Set initial theme based on localStorage
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark-theme');
    themeToggle.checked = true;
    ball.classList.add('dark');
    document.querySelector('.page-title-light').style.display = 'none';
} else {
    document.querySelector('.page-title-dark').style.display = 'none';
}

// Toggle theme on click
themeToggle.addEventListener('change', () => {
    document.documentElement.classList.toggle('dark-theme');
    ball.classList.toggle('dark');

    // Save the theme preference in localStorage
    if (document.documentElement.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }

    // Update the visibility of page titles
    if (themeToggle.checked) {
        document.querySelector('.page-title-light').style.display = 'none';
        document.querySelector('.page-title-dark').style.display = 'block';
    } else {
        document.querySelector('.page-title-light').style.display = 'block';
        document.querySelector('.page-title-dark').style.display = 'none';
    }
});

