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
			
			$('#srchWord').keydown(function() {
			    if (event.keyCode === 13) {
			    	$(".btnSearch").trigger('click');
			        event.preventDefault();
			    }
			});
			
			$(".search").off('click').on('click', function(){
				var srchKey = $(this).data('val');
				$("#srchKey").val(srchKey);
			});
			
			$(".btnSearch").off('click').on('click', function(){
				$("#currentPage").val(1);
				$("#srchBeforeWord").val($("#srchWord").val());
				
				Data.loadList();
			});
			
			$(".btnSort").off('click').on('click', function(){
				var srchStatus = $(this).data('val');
				
				$(this).parent().addClass('on').siblings().removeClass('on');
				$("#currentPage").val(1);
				$("#srchStatus").val(srchStatus);
				$("#srchWord").val($("#srchBeforeWord").val());
				
				Data.loadList();
			});
			
			$(".viewLink").off('click').on('click', function(){
				var acticleNo = $(this).data('val');
				$("#srchMode").val("");
				$("#acticleNo").val(acticleNo);				
				$("#fAction").attr("action", '/ir/ir_view?acticleNo='+acticleNo);
				$("#fAction").submit();
			});
			
			$('#pagination a').each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                	if (!NDev.Util.isNull(_this.data('page'))) {
                		$("#currentPage").val(_this.data('page'));
                		Data.loadList();
                	}
                });
            });
		},
		
		loadList: function(){
			$("#srchMode").val("AJAX");
			NDev.Util.post('/ir/ir_list', $("#fAction").serialize(), 'html').done(function(html) {
				$(".board-list").html(html);
				Data.ui();
			}).fail(function() { alert(arguments[1]); });
			
		}
	};
}));