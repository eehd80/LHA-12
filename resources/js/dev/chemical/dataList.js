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
		NDev = window.NDev = {};	//Newriber Development script

		NDev.Data = {};
	}

	var Data = NDev.Data = {
			
		init: function () {
			Data.ui();
			ui.tabAction('.medicine-menu-type ul', '.medicine-cont');
			
			Data.listLoad();
			Data.productLoad();
		},	
		ui: function(){
			ui.foldAction('.field-list', '.field-cont');
			
			$('#pagination a').each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                	if (!NDev.Util.isNull(_this.data('page'))) {
                		$("#currentPage").val(_this.data('page'));
                		Data.listLoad();
                	}
                });
            });
			
			$(".tab-list li:eq(1)").on('click', function () {				
				ui.customSelect();
			});
		},
		
		listLoad: function(){
			
			NDev.Util.post('/chemical/dataList', $("#fAction").serialize(), 'html').done(function(html) {
				$(".possession-skill").html(html);
				Data.ui();				
			}).fail(function() { alert(arguments[1]); });
			
		},
		
		productLoad: function(){
			
			NDev.Util.post('/chemical/product', $("#fProduct").serialize(), 'html').done(function(html) {
				
				$("#productList .medicine-detail").remove();
				$("#productList").append(html);
				
				if($(".viewLink:eq(0)").length > 0){					
					var viewLink = $(".viewLink:eq(0)").data('val');				
					$(this).parent('li').addClass('on').siblings('li').removeClass('on');
					
					$("#info_seq").val(viewLink);
					
					NDev.Util.post('/chemical/data_view', $("#fProduct").serialize(), 'html').done(function(html) {
						$(".cont-area").html(html);
						Data.ui();				
						
					}).fail(function() { alert(arguments[1]); });
				}
				
				Data.uiProduct();
			}).fail(function() { alert(arguments[1]); });
			
		},
		
		uiProduct: function(){		
			ui.customSelect();		
			
			$(".custom-scroll li").off('click').on('click', function(){
				var depth 	 = $(this).find('button').data('depth');
				var depth_id = $(this).find('button').data('val');
				
				console.log(depth, depth_id);
				
				$("#subType"+depth).val(depth_id);
				
				if(depth == 2){					
					$("#subType3").val('');
					Data.categoryLoad(depth_id);
				}
			});
			
			$(".btnProductSearch").off('click').on('click', function(){
				$("#pcurrentPage").val(1);
				$("#srchWord").val($('#inputWord').val());				
				Data.productLoad();
			});
			
			$('#inputWord').keydown(function() {
			    if (event.keyCode === 13) {
			    	$(".btnProductSearch").trigger('click');
			        event.preventDefault();
			    }
			});
			
			$(".viewLink").off('click').on('click', function(){
				
				var viewLink = $(this).data('val');				
				$(this).parent('li').addClass('on').siblings('li').removeClass('on');
				
				$("#info_seq").val(viewLink);
				
				NDev.Util.post('/chemical/data_view', $("#fProduct").serialize(), 'html').done(function(html) {
					$(".cont-area").html(html);
					Data.ui();				
					
				}).fail(function() { alert(arguments[1]); });
				
			});
			
			$('#pagination_pc a, #pagination_mo a').each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                	if (!NDev.Util.isNull(_this.data('page'))) {
                		$("#pcurrentPage").val(_this.data('page'));
                		Data.productLoad();
                	}
                });
            });
			
			$('.tab-area-m ul li a').off('click').on('click', function () {
				var $trg = $(this).parent('li');
				$trg.hasClass('on') ? $trg.removeClass('on') : $trg.addClass('on').siblings('li').removeClass('on');
			});			
		},
		
		categoryLoad: function(id){
			
			var $select = $("#sdepth3");
			$select.find('.custom-scroll li').remove();			
			$select.find(".custom-scroll ul").append('<li><button type="button" data-depth="3" data-val="">선택</button></li>');
			
			NDev.Util.post('/chemical/categoryListAjax', {'id' : id, 'gubun' : 2 }, 'json').done(function(data) {						
				$select.find(".custom-input").html('선택');
				
				if(Number(data.cnt) > 0){		
					$.each(data.categoryList, function(idx, info){						
						$select.find(".custom-scroll ul").append('<li><button type = "button" data-depth="3" data-val="'+info.depth_id+'">'+info.depth_name+'</button></li>');						
					});					
				}
				
				setTimeout(function(){					
					Data.uiProduct();
				}, 200);
				
			}).fail(function() { alert(arguments[1]); });
		}		
	};
}));