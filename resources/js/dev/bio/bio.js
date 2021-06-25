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

	if('undefined' === typeof window.NDev) {
		NDev = window.NDev = {};	//Newriber Development script

		NDev.Data = {};
	}

	var Data = NDev.Data = {
		init: function () {
			Data.viewLink();
			Data.ui();
			
			if(location.hash.indexOf('PRODUCT') > -1) $(".bio-menu-type ul li:eq(1) a").trigger('click');
			else if(location.hash.indexOf('PIPE') > -1) $(".bio-menu-type ul li:eq(2) a").trigger('click');
		},
		
		viewLink: function () {
			$(".viewLink").click(function(){
				var pipe_seq = $(this).data('val');
				ui.layerpopup.open('/bio/imgPopup?pipe_seq=' + pipe_seq);
			});
			
		},
		ui: function(){
			
			ui.tabAction('.bio-menu-type ul', '.bio-cont');
			
			$('#pagination a').each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                	if (!NDev.Util.isNull(_this.data('page'))) {
                		$("#currentPage").val(_this.data('page'));
                		Data.listLoad();
                	}
                });
            });
		},
		
		listLoad: function(){
			
			NDev.Util.post('/bio/bioList', $("#fAction").serialize(), 'html').done(function(html) {
				$(".product-news").html(html);
				Data.ui();				
			}).fail(function() { alert(arguments[1]); });
			
		}
		
	};
}));