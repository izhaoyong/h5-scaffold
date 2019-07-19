export default new class Util {
	/**
	 * @param {string} v1, v2 version to be compared.
	 * @returns {number|NaN}
	 * 0 if the versions are equal
	 * a negative integer iff v1 < v2
	 * a positive integer iff v1 > v2
	 * NaN if either version string is in the wrong format
	 * @desc  https://gist.github.com/TheDistantSea/8021359
	 */
	compareVersion(v1, v2, options) {
		var lexicographical = options && options.lexicographical,
			zeroExtend = options && options.zeroExtend,
			v1parts = v1.split('.'),
			v2parts = v2.split('.');

		function isValidPart(x) {
			return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
		}

		if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
			return NaN;
		}

		if (zeroExtend) {
			while (v1parts.length < v2parts.length) v1parts.push("0");
			while (v2parts.length < v1parts.length) v2parts.push("0");
		}

		if (!lexicographical) {
			v1parts = v1parts.map(Number);
			v2parts = v2parts.map(Number);
		}

		for (var i = 0; i < v1parts.length; ++i) {
			if (v2parts.length == i) {
				return 1;
			}

			if (v1parts[i] == v2parts[i]) {
				continue;
			} else if (v1parts[i] > v2parts[i]) {
				return 1;
			} else {
				return -1;
			}
		}

		if (v1parts.length != v2parts.length) {
			return -1;
		}

		return 0;
	}

	getUrlParameter(sParam) {
		let sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	}

	getDate(timestamp) {
		let date = new Date(timestamp);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		if (month < 10) {
			month = `0${month}`
		}
		let day = date.getDate();
		if (day < 10) {
			day = `0${day}`
		}

		return `${year}.${month}.${day}`
	}

	isMobile(ua) {
		return /Mobile/i.exec(ua) ? true : false;
	}

	isIos(ua) {
		return /iPhone|iPad/i.exec(ua) ? true : false;
	}

	isAndroid(ua) {
		return !/iPhone|iPad/i.exec(ua) ? true : false;
	}

	getShowTimeString(timestamp) {
		let currentTime = Date.now();
		let gapTime = currentTime - timestamp;
		let minuteTime = 1000 * 60;
		let hourTime = minuteTime * 60;
		let dayTime = hourTime * 24;
		let weekTime = dayTime * 7;
		if (gapTime / weekTime > 1) {
			let date = this.getDate(timestamp);
			let dateEles = date.split('.');
			dateEles = dateEles.splice(1);
			return dateEles.join('-');
		} else if (gapTime / dayTime > 1) {
			let days = Math.floor(gapTime / dayTime);
			return `${days}天前`;
		} else if (gapTime / hourTime > 1) {
			let days = Math.floor(gapTime / hourTime);
			return `${days}小时前`;
		} else if (gapTime / minuteTime > 1) {
			let days = Math.floor(gapTime / minuteTime);
			return `${days}分钟前`;
		} else {
			return `刚刚`;
		}
	}

	isSafari(ua) {
		return /Mobile.*Safari/i.exec(ua) ? true : false;
	}

	openIosApp(deepLink) {
		location.href = deepLink;
	}

	openApp(appUrl, schema) {
		let ua = navigator.userAgent.toLowerCase();
		if (this.isIos(ua)) {
			setTimeout(() => {
				this.openIosApp(appUrl);
			}, 0)
			location.href = schema;
		} else {
			location.href = appUrl;
			setTimeout(() => {
				this._checkOpen((isOpen) => {
					!isOpen && this._openAppInIframe(schema)
				});
			}, 1000);
		}
	}


	downloadApp(downloadUrl) {
		location.href = downloadUrl;
	}

	_openAppInIframe(schema) {
		$("body").append("<iframe id='app_iframe' src='" + schema + "' style='display:none'></iframe>");
	}

	_checkOpen(cb) {
		var _count = 0,
			_clickTime = +(new Date()),
			intHandle;

		function check(elsTime) {
			if (elsTime > 1000 || document.hidden || document.webkitHidden) {
				cb(true);
			} else {
				cb(false);
			}
		}
		//启动间隔20ms运行的定时器，并检测累计消耗时间是否超过1000ms，超过则结束
		intHandle = setInterval(() => {
			_count++;
			let elsTime = +(new Date()) - _clickTime;
			if (_count >= 25 || elsTime > 1000) {
				clearInterval(intHandle);
				check(elsTime);
			}
		}, 20);
	}

}
