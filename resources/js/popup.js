var audio1 = new Audio();
audio1.src = "./resources/sound/01_main.mp3";

var audio2 = new Audio();
audio2.src = "./resources/sound/02_read.mp3";

var audio3 = new Audio();
audio3.src = "./resources/sound/03_help.mp3";

var audio4 = new Audio();
audio4.src = "./resources/sound/04_movie.mp3";

var audio5 = new Audio();
audio5.src = "./resources/sound/05_ending.mp3";

// youtube API 불러옴
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 플레이어변수 설정
var youTubePlayer;

$(function () {

    'use strict';

    $("#header").load("./header.html");

    $("#layerbox").load("./smart.html");

    $("#footer").load("./footer.html");

});

function loadingYoutube(videoId) {
    console.log(videoId);

    if (youTubePlayer) {
        youTubePlayer.loadVideoById(videoId);
    } else {
        youTubePlayer = new YT.Player('video-iframe', {
            videoId: videoId,
            playerVars: { // 아래는 해당 플레이어의 기본 속성들을 정할 수 있습니다.
                'modestbranding': 1,
                'autoplay': 1, // 자동재생
                'controls': 1, // 컨트롤러의 유무
                'showinfo': 0, // 재생영상에 대한 정보 유무
                'rel': 0, // 해당 영상이 종류 된 후, 관련 동영상을 표시할지의 여부
                //'loop': 1, // 반복 재생의 여부
                //'playlist': 'M7lc1UVf-VE'
                // 단일 동영상을 반복재생하기 위해서 해당 매개변수가 필요합니다.
                // 같은 동영상 id를 넣어줌으로써 반복 재생이 됩니다.
            },

            events: {
                'onReady': onPlayerReady, //로딩할때 이벤트 실행
                'onStateChange': onPlayerStateChange //플레이어 상태 변화시 이벤트실행
            }
        });//youTubePlayer1셋팅
    }

}


function onPlayerReady(event) {
    console.log("loading...");
    event.target.playVideo();//자동재생
    //로딩할때 실행될 동작을 작성한다.
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        page_video_finish();
    }
}


function wrapWindowByMask() {
    //화면의 높이와 너비를 구한다.
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    //문서영역의 크기
    console.log("document 사이즈:" + $(document).width() + "*" + $(document).height());
    //브라우저에서 문서가 보여지는 영역의 크기
    console.log("window 사이즈:" + $(window).width() + "*" + $(window).height());

    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
    $('#mask').css({
        'width': maskWidth,
        'height': maskHeight
    });

    //애니메이션 효과
    //$('#mask').fadeIn(1000);
    $('#mask').fadeTo("slow", 0.5);
}

function popupOpen() {
    goPage('page_start');
    $('.layerpop').css("position", "absolute");
    //영역 가운에데 레이어를 뛰우기 위해 위치 계산
    $('.layerpop').css("top", (($(window).height() - $('.layerpop').outerHeight()) / 2) + $(window).scrollTop());
    $('.layerpop').css("left", (($(window).width() - $('.layerpop').outerWidth()) / 2) + $(window).scrollLeft());
    $('#layerbox').show();
}

function popupClose() {
    if (audio1.played.length) {
        audio1.pause();
        audio1.currentTime = 0;

    }
    if (audio2.played.length) {
        audio2.pause();
        audio2.currentTime = 0;

    }
    if (audio3.played.length) {
        audio3.pause();
        audio3.currentTime = 0;
    }
    if (audio4.played.length) {
        audio4.pause();
        audio4.currentTime = 0;
    }
    if (audio5.played.length) {
        audio5.pause();
        audio5.currentTime = 0;
    }

    goMain();
    
    $('#layerbox').hide();
    $('#mask').hide();
}

function goSmart() {

    /*팝업 오픈전 별도의 작업이 있을경우 구현*/
    ;
    //console.log();

    if ($('html').hasClass('navi-open')) {
        $("#navi-trg").removeClass('open');
        $('#navigation').css('left', '100%');
        $('#navigation .inner').css('left', 0);
        $('html').removeClass('navi-open');

        // if ($('#main').length) {
        // 	$('#main').fullpage.setMouseWheelScrolling(true);
        // 	$('#main').fullpage.setAllowScrolling(true);
        // }
        //$('#mask').hide();
        $('#nav-mobile-wap').hide();
        $flag = false;
    }
    audio1.play();
    $(".sound_btn").addClass("playing");

    popupOpen(); //레이어 팝업창 오픈
    wrapWindowByMask(); //화면 마스크 효과
}


function goMain() {
    if (youTubePlayer) {
        youTubePlayer.stopVideo();
    }

    $("#vr-iframe").attr("src", "about:blank");
    $("#video-iframe").html("");
    $("#pop_main").show();
    $("#pop_in").hide();
}

function goVr(type) {
    if (youTubePlayer) {
        youTubePlayer.stopVideo();
    }
    $("#pop_main").hide();
    $("#pop_in").show();
    $("#video-iframe").hide();
    $("#vr-iframe").show();
    $("#vr-iframe").attr("src", "./data/" + type + "/");
    $("#type_text").html(type);

    $(".text_btn").removeClass("active");
    $(".text_btn.btn_vr_in").addClass("active");

    var ww = $(window).width();

    if (ww < 960) {
        var offset = $("#layerbox").offset();
        $('html, body').animate({scrollTop: offset.top}, 400);
    }
}

function goVideo(type) {
    $("#pop_main").hide();
    $("#pop_in").show();

    $("#video-iframe").show();
    //console.log(typeYoutyube[type]);
    loadingYoutube(typeYoutyube[type]);

    $("#vr-iframe").hide();
    $("#vr-iframe").attr("src", "about:blank");

    $(".text_btn").removeClass("active");
    $(".text_btn.btn_video_in").addClass("active");

    $("#type_text").html(type);

    var ww = $(window).width();

    if (ww < 960) {
        var offset = $("#layerbox").offset();
        $('html, body').animate({scrollTop: offset.top}, 400);
    }

}

function goTab(num) {
    $(".info_view_cont").hide();
    $("#info_view_cont_" + num).show();
}

function goPage(name) {
    $(".layerpop_area > .content").hide();
    $(".layerpop_area > .content." + name).show();
}
