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
		},
		
		ui: function(){
			ui.folderList('.faq-list.general ul li');
			
			$('#pagination a').each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                	if (!NDev.Util.isNull(_this.data('page'))) {
                		$("#currentPage").val(_this.data('page'));
                		Data.listLoad();
                	}
                });
            });
			
			$(".faq-type li").off('click').on('click', function(){
				
				var inquriy = $(this).data('inquriy');
				$("#srchGroup").val(inquriy);
				$("#currentPage").val(1);
				
				$(this).addClass("on").siblings().removeClass("on");
				Data.listLoad();
			});
		},
		
		listLoad: function(){
			
			NDev.Util.post('/cs/inquiryList', $("#fAction").serialize(), 'html').done(function(html) {
				$(".general").html(html);
				Data.ui();				
			}).fail(function() { alert(arguments[1]); });
			
		}
	};
}));