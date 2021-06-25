////////////////////////////////////////////////////////////////////////////////
////																		////
////////////////////////////////////////////////////////////////////////////////
'use strict';

(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.creator = factory();
    }

}(this, function () {

    $(document).ready(function () {
        NDev.Ui.init();

    });

    if ('undefined' === typeof window.NDev) {
        NDev = window.NDev = {}; //Newriber Development script

        NDev.Data = {};

    }

    var Ui = NDev.Ui = {
        init: function () {
            ui.fullPage();
            
            ui.slider.mmainVisual();
            ui.onlyScroll('.pc-family-menu > ul');
            ui.familySite.init();
            
            ui.slider.mainVisual();


        }
    }
}));


var now_type_num = 1;
var now_showroom_num = 1;
$(function () {

    'use strict';
    
    var ww = $(window).width();
    
    if(ww > 960){
        $("#footer").css("position","absolute");
    }
    
    type_select(now_type_num);

    $(".select_type").on("click", function () {
        var num = $(this).data("num");
        now_type_num = num;
        type_select(num);

        //alert(type);
    });

    var ttl = $(".select_type.m").length;

    $("#paging_total").html("0" + ttl);
    $("#mpaging_total").html("0" + ttl);

    $("#section3_paging_prev").on("click", function () {
        if (now_type_num > 1) {
            now_type_num--;
            type_select(now_type_num);
        }
    });

    $("#section3_paging_next").on("click", function () {
        if (now_type_num < ttl) {
            now_type_num++;
            type_select(now_type_num);
        }
    });
    
    $("#msection3_paging_prev").on("click", function () {
        if (now_type_num > 1) {
            now_type_num--;
            type_select(now_type_num);
        }
    });

    $("#msection3_paging_next").on("click", function () {
        if (now_type_num < ttl) {
            now_type_num++;
            type_select(now_type_num);
        }
    });

    var swiper;

    $(".tab_showroom").on("click", function () {
        var num = $(this).data("num");
        $(".tab_showroom").removeClass("active");
        $(this).addClass("active");
        $(".showroom").hide();
        $("#showroom_" + num).show();
        $(".showroom_slide").hide();
        $("#showroom_slide_" + num).show();

        if( !$('#showroom_slide_' + num + ' .swiper-container').hasClass("swiper-container-initialized") ) {
            swiper = new Swiper('#showroom_slide_' + num + ' .swiper-container', {
                slidesPerView: 1,
                loop: true,
                navigation: {
                    nextEl: '.sub-slider__next',
                    prevEl: '.sub-slider__prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + '"></span>';
                    },
                },
            });

            setTimeout(reInit,500);
        }

    });

    /*$("#showroom_1").show();
    $("#showroom_slide_1").show();*/
    if( !$('#showroom_slide_1 .swiper-container').hasClass("swiper-container-initialized") ){
        swiper = new Swiper('#showroom_slide_1 .swiper-container', {
            slidesPerView: 1,
            loop: true,
            navigation: {
                nextEl: '.sub-slider__next',
                prevEl: '.sub-slider__prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '"></span>';
                },
            },
        });
    }


    function reInit(){
        swiper.update();
    }
    
    



});

function type_select(num) {
    var type = $("#type_" + num).html();
    $("#page_now").html("0" + num);
    $("#mpage_now").html("0" + num);
    $(".select_type").removeClass("active");
    $("#type_" + num).addClass("active");
    $("#mtype_" + num).addClass("active");
    $(".type-data").hide();
    $(".data" + num).show();

}

function page(num) {
    //$("#page_inner").removeClass('motion');
    $(".page").addClass("hide");
    $(".page0" + num).removeClass("hide");
}

function mpage(num) {
    //$("#page_inner").removeClass('motion');
    $(".mpage").addClass("hide");
    $(".mpage0" + num).removeClass("hide");
}


function go_sub(page, tab){
    location.href="./sub"+page+".html?tab="+tab;
}

function go_interior(tab){
    location.href="./sub03_02.html?tab="+tab;
}

