function getShareLink() {
	var link = setShareCount();
	return $('input[name="shareLink"]').val() || link;
}

function getShareTitle() {
	var title = '';
	title = $.trim($('input[name="shareTitle"]').val()) || title;
	return title;
}

function getShareDesc() {
	var desc = '';
	desc = $.trim($('input[name="shareDesc"]').val()) || desc;
	return desc;
}

function getShareImage() {
	var imgUrl = '';
	//兼容多图二次分享
	if (!imgUrl) {
		imgUrl = $('#weixinShareLogo').attr('src');
	}
	return $('input[name="shareImage"]').val() || imgUrl;
}

function getShareTimelineTitle() {
	var title = '';
	title = $.trim($('input[name="shareTimelineTitle"]').val()) || $.trim($('input[name="shareTitle"]').val()) || title;
	return title;
}

function getShareTimelineLink() {
	var link = setShareCount();
	return $('input[name="shareTimelineLink"]').val() || $('input[name="shareLink"]').val() || link;
}

function getShareTimelineImage() {
	var imgUrl = '';
	//兼容多图二次分享
	if (!imgUrl) {
		imgUrl = $('#weixinShareLogo').attr('src');
	}

	return $('input[name="shareTimelineImage"]').val() || $('input[name="shareImage"]').val() || imgUrl;
}

function getShareAppTitle() {
	var title = '';
	title = $.trim($('input[name="shareAppTitle"]').val()) || $.trim($('input[name="shareTitle"]').val()) || title;
	return title;
}

function getShareAppLink() {
	var link = setShareCount();
	return $('input[name="shareAppLink"]').val() || $('input[name="shareLink"]').val() || link;
}

function getShareAppDesc() {
	var desc = '';
	desc = $.trim($('input[name="ShareAppDesc"]').val()) || $.trim($('input[name="shareDesc"]').val()) || desc;
	return desc;
}

function getShareAppImage() {
	var imgUrl = '';
	//兼容多图二次分享
	if (!imgUrl) {
		imgUrl = $('#weixinShareLogo').attr('src');
	}

	return $('input[name="shareAppImage"]').val() || $('input[name="shareImage"]').val() || imgUrl;
}

function setShareCount() {
	var link = location.href;

	// may use hash in weixin
	var hash = location.hash;

	//设置微信二次分享
	if (!location.search) {
		link = link + '?wxshare_count=2';
	} else if (location.search.indexOf('wxshare_count=') == -1) {
		// link = utils.setUrlParam(link, 'wxshare_count', 2);
	} else {
		// var count = utils.getUrlParam(link, 'wxshare_count') || '0';
		// count = count ? parseInt(count) + 1 : 0;
		// link = utils.setUrlParam(link, 'wxshare_count', count);
	}

	return link;
}

function init() {
	var doRegister = function () {
		var title = getShareTitle(),
			desc = getShareDesc(),
			link = getShareLink(),
			img = getShareImage(),

			timelineTitle = getShareTimelineTitle(),
			timelineLink = getShareTimelineLink(),
			timelineImage = getShareTimelineImage(),

			appTitle = getShareAppTitle(),
			appLink = getShareAppLink(),
			appDesc = getShareAppDesc(),
			appImage = getShareImage();

		wx.onMenuShareTimeline({
			title: timelineTitle, // 分享标题
			link: timelineLink, // 分享链接
			imgUrl: timelineImage,
			success: function () {

			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			}
		});

		wx.onMenuShareAppMessage({
			title: appTitle, // 分享标题
			link: appLink, // 分享链接
			desc: appDesc, //分享描述
			imgUrl: appImage,
			success: function () {

			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			}
		});

		wx.onMenuShareQQ({
			title: title, // 分享标题
			link: link, // 分享链接
			desc: desc, //分享描述
			imgUrl: img,
			success: function () {},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			}
		});
	};

	doRegister();

	// if ($.browser.weixin) {
	// 	if (typeof wx === 'undefined') {
	// 		var s = $.getScript(__uri('/static/script/weixin_sdk/h.js'));
	// 		s.done(function () {
	// 			if (typeof wx != 'undefined') {
	// 				wx.onReady(function () {
	// 						doRegister();
	// 					},
	// 					_setting.weixinSetting);
	// 			}
	// 		});
	// 	} else {
	// 		doRegister();
	// 	}
	// }
}

var DEFAULT_SETTING = {
	ctn: $(document.body),
	weixinSetting: {}
};
var _setting = {};

export default new class WeixinUtil {
	init(setting) {
		_setting = $.extend({}, DEFAULT_SETTING, setting);
		init();
	}
}
