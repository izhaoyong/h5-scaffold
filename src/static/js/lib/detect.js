class Browser{
	constructor(){}

	detect(ua, platform) {
		let os = this.os = {}, browser = this.browser = {},
			webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
			android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
			osx = !!ua.match(/\(Macintosh\; Intel /),
			ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
			ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
			iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
			webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
			win = /Win\d{2}|Windows/.test(platform),
			wp = ua.match(/Windows Phone ([\d.]+)/),
			touchpad = webos && ua.match(/TouchPad/),
			kindle = ua.match(/Kindle\/([\d.]+)/),
			silk = ua.match(/Silk\/([\d._]+)/),
			blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
			bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
			rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
			playbook = ua.match(/PlayBook/),
			chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
			firefox = ua.match(/Firefox\/([\d.]+)/),
			firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
			ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
			webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
			safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
			//补充微信
			weixin = ua.match(/MicroMessenger[\s\/]+([\d.]+)/i),
			// 手机qq
			qq = ua.match(/\sQQ[\s\/]+([\d.]+)/i),
			// 新浪微博
			weibo = ua.match(/weibo[\s__]+([\d.]+)/i),
			// ios qq浏览器
			qqbrowser = ua.match(/qqbrowser/ig),

			// 火山直播客户端
			livestream = ua.match(/live_stream_([\d.]+)/i),
			// 内涵段子客户端
			jokeessay = ua.match(/joke_/i),
			// 头条客户端
			toutiao = ua.match(/NewsArticle\/([\d.]+)/i);

		if (browser.webkit = !!webkit) browser.version = webkit[1]

		if (android) os.android = true, os.version = android[2]
		if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
		if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
		if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
		if (wp) os.wp = true, os.version = wp[1]
		if (webos) os.webos = true, os.version = webos[2]
		if (touchpad) os.touchpad = true
		if (blackberry) os.blackberry = true, os.version = blackberry[2]
		if (bb10) os.bb10 = true, os.version = bb10[2]
		if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
		if (playbook) browser.playbook = true
		if (kindle) os.kindle = true, os.version = kindle[1]
		if (silk) browser.silk = true, browser.version = silk[1]
		if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
		if (chrome) browser.chrome = true, browser.version = chrome[1]
		if (firefox) browser.firefox = true, browser.version = firefox[1]
		if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
		if (ie) browser.ie = true, browser.version = ie[1]
		if (safari && (osx || os.ios || win)) {
			browser.safari = true
			if (!os.ios) browser.version = safari[1]
		}
		if (webview) browser.webview = true
		//补充微信
		if (weixin) browser.weixin = true, browser.version = weixin[1]
		// 手机qq
		if (qq) browser.qq = true, browser.version = qq[1]
		// 新浪微博
		if (weibo) browser.weibo = true, browser.version = weibo[1]

		// 火山直播客户端
		if (livestream) browser.livestream = true, browser.version = livestream[1]
		// 内涵段子客户端
		if (jokeessay) browser.jokeessay = true
		// 头条客户端
		if (toutiao) browser.toutiao = true, browser.version = toutiao[1]
		// 手机qq
		if (qqbrowser) browser.qqbrowser = true

		os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
			(firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
		os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
			(chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
			(firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))

		return {
			os, browser
		}
	}

}


export default new Browser()
