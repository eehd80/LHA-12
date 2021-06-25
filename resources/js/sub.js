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
            
            ui.onlyScroll('.pc-family-menu > ul');
            ui.familySite.init();


        }
    }
}));


var now_type_num = 1;
var now_showroom_num = 1;
$(function () {

    'use strict';
    
    var address = unescape(location.href);
    var param = "";
    if(address.indexOf("tab", 0) != -1) {
        param = address.substring(address.indexOf("tab", 0) + 4);
    } else {
        param = "1";
    }

    go_tab(param);
    
    $(".tab_btn").on("click", function () {
        var tab = $(this).data("tab");
        go_tab(tab);

        //alert(type);
    });
    
    $(".find_way_btn").on("click", function () {

        var ww = $(window).width();

       if(ww > 960){
            window.open("https://map.naver.com/v5/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%8B%9C%ED%9D%A5%EC%8B%9C%20%EC%9E%A5%ED%98%84%EB%8F%99%2071/address/14114710.407524321,4492622.80479092,%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%8B%9C%ED%9D%A5%EC%8B%9C%20%EC%9E%A5%ED%98%84%EB%8F%99%2071,jibun?c=14113778.8312421,4492622.8047909,14,0,0,0,dha");
        } else {
            window.open("https://m.map.naver.com/search2/search.nhn?query=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%8B%9C%ED%9D%A5%EC%8B%9C%20%EC%9E%A5%ED%98%84%EB%8F%99%2071&sm=shistory&style=v5");
        }


        //alert(type);
    });
    
    $(".sub_3_1 .title").on("click", function () {
        $(".sub_3_1 .title").removeClass("active");
        $(this).addClass("active");
            
    });
    
    
    $(".cal-box").hide();
    $("#cal_201911").show();
    
    $(".cal_btn").on("click", function () {
        var ym = $(this).data("ym");
        $(".cal-box").hide();
        $("#cal_"+ym).show();
            
    });
    
    
    

});

function go_tab(num){
    $(".tab_btn").removeClass("active");
    $(".tab_btn").eq(num-1).addClass("active");
    $(".tab_contant").hide();
    $("#tab_" + num).show();
    
    $(".sub_3_1 .title").removeClass("active");
    $("#tab_" + num + ".sub_3_1 .title").eq(0).addClass("active");
}
