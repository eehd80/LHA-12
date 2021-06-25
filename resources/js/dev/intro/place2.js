////////////////////////////////////////////////////////////////////////////////
////																		////
////////////////////////////////////////////////////////////////////////////////
'use strict';

(function (root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(factory);
	}
	else if (typeof exports === 'object') {
		module.exports = factory();
	}
	else {
		root.creator = factory();
	}

}(this, function() {

	/********************************************************************************/
	/*	NDev.Conf : 이벤트 일괄 바인드													*/
	/*		listAction : 목록 페이지 URL. 페이징 버튼에서 사용								*/
	/*		formAction : 버튼 클릭시 #fAction 을 submit									*/
	/*			*url	: 폼데이터를 전달할 URL											*/
	/*			*target	: 이벤트가 바인드 될 버튼(jQuery 선택자)								*/
	/*			msg		: alert 문구													*/
	/*			ask		: confirm 문구												*/
	/*			valid	: submit 전에 실행할 함수										*/
	/*		popupAction : 버튼 클릭시 팝업 오픈											*/
	/*			*url	: 팝업 URL													*/
	/*			*target	: 이벤트가 바인드 될 버튼(jQuery 선택자)								*/
	/*			msg		: alert 문구													*/
	/*			ask		: confirm 문구												*/
	/*			valid	: 팝업이 오픈되기 전에 실행할 함수									*/
	/*																				*/
	/*	* 표시는 필수 항목입니다.															*/
	/********************************************************************************/
	
	if('undefined' === typeof window.NDev) {
		NDev = window.NDev = {};

		NDev.Data = {};
				
	}

	var Data = NDev.Data = {
		init: function () {
			Data.ui();
			Data.map2();
			Data.map3();
			
		},	
				
		ui: function(){
			ui.tabAction('.place-type ul', '.place-cont');
		},
		
		map2: function(){
			
			var mapContainer = document.getElementById("map2");
			var mapOption;
			var map;
			var markerPosition  = new daum.maps.LatLng(36.999306109322205, 127.82999238103135); //마커표시 위치
			
			mapOption = {
		      // 임의의 지도 중심좌표		
			  center: new daum.maps.LatLng(36.999306109322205, 127.82999238103135),
			  // 지도의 확대 레벨
			  level: 2
			 };
			// 지도 생성
			map = new daum.maps.Map(mapContainer, mapOption);
			
			//마커 생성
			var marker = new daum.maps.Marker({
			    position: markerPosition
			});
			
			//줌 비활성
			map.setZoomable(false);
			
			//지도에 마커 생성
			marker.setMap(map); 
			
			// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
			var zoomControl = new daum.maps.ZoomControl();
			map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
			
			var iwContent = '<div style="display: inline-block; width: 150px; text-align: center; padding: 10px; background: #052ab6; color: #ffffff;">충주공장<br><a href="https://map.kakao.com/link/map/충주시 대소원면 기업도시 1로 54,36.999306109322205,127.82999238103135" style="display: inline-block; margin: 10px 0 0;  color: #ffffff" target="_blank" rel="noopener noreferrer">크게보기</a></div>',
		    iwPosition = new daum.maps.LatLng(36.999306109322205, 127.82999238103135);
			
			var infowindow = new daum.maps.InfoWindow({
			    position : iwPosition, 
			    content : iwContent 
			});
			
			infowindow.open(map, marker);
		
			
		},
		
		map3: function(){
			
			var mapContainer = document.getElementById("map3");
			var mapOption;
			var map;
			var markerPosition  = new daum.maps.LatLng(36.95273354454358, 127.52122511202762); //마커표시 위치

			 mapOption = {
			  // 임의의 지도 중심좌표
			  center: new daum.maps.LatLng(36.95273354454358, 127.52122511202762),
			  // 지도의 확대 레벨
			  level: 2
			 };
			// 지도 생성
			map = new daum.maps.Map(mapContainer, mapOption);
			
			//마커 생성
			var marker = new daum.maps.Marker({
			    position: markerPosition
			});
			
			map.setZoomable(false);
			
			//지도에 마커 생성
			marker.setMap(map); 
			
			// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
			var zoomControl = new daum.maps.ZoomControl();
			map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
			
			var iwContent = '<div style="display: inline-block; width: 150px; text-align: center; padding: 10px; background: #052ab6; color: #ffffff;">음성공장<br><a href="https://map.kakao.com/link/map/충청북도 음성군 대소면 대동로530번길 11-16,36.95273354454358, 127.52122511202762" style="display: inline-block; margin: 10px 0 0;  color: #ffffff" target="_blank" rel="noopener noreferrer">크게보기</a></div>',
		    iwPosition = new daum.maps.LatLng(36.95273354454358, 127.52122511202762);
			
			var infowindow = new daum.maps.InfoWindow({
			    position : iwPosition, 
			    content : iwContent 
			});
			
			infowindow.open(map, marker);
		}
		
	};
}));