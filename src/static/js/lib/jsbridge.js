export default new class SodaJSBridge {
	closeWebview() {
		if (window.JSBridge) {
			window.JSBridge.call('closeWebview', null, null);
		}
	}

	gotoSetting() {
		if (window.JSBridge) {
			window.JSBridge.call('goSetting', null, null);
		}
	}

	getProfile(cb) {
		if (window.JSBridge) {
			window.JSBridge.call('getProfile', null, cb);
		}
	}

	switchStatus() {
		if (window.JSBridge) {
			window.JSBridge.call('switchStatus', null, null);
		}
	}

	listenOnCancel(cb) {
		if (window.JSBridge) {
			window.JSBridge.on('cancelEdition', null, cb);
		}
	}

	listenOnOK(cb) {
		if (window.JSBridge) {
			window.JSBridge.on('finishEdition', null, cb);
		}
	}

	listenOnNetworkError(data, cb) {
		if (window.JSBridge) {
			window.JSBridge.on('postAnswerFailed', null, cb);
		}
	}

	uploadProfile(data) {
		if (window.JSBridge) {
			window.JSBridge.call('uploadProfile', data, null);
		}
	}

	connectSoda() {
		if (window.JSBridge) {
			window.JSBridge.call('connectSoda', null, null);
		}
	}

	copy(text) {
		if (window.JSBridge) {
			window.JSBridge.call('didPasteCode', text, null);
		}
	}

	getCode(cb) {
		if (window.JSBridge) {
			window.JSBridge.call('getCode', null, cb);
		}
	}

	feedback(data, cb) {
		if (window.JSBridge) {
			window.JSBridge.call('feedback', data, cb);
		}
	}

	copyText(data) {
		if (window.JSBridge) {
			window.JSBridge.call('copytext', data, null);
		}
	}

	getCommonParams(cb) {
		if (window.JSBridge) {
			window.JSBridge.call('queryCommonParam', null, cb);
		}
	}

	saveImage(data, cb) {
		if (window.JSBridge) {
			window.JSBridge.call('saveimage', data, cb);
		}
	}

	uploadAnswer(data, cb) {
		if (window.JSBridge) {
			window.JSBridge.call('getAnswer', data, cb);
		}
	}

	closeLoading(data, cb) {
		if (window.JSBridge) {
			window.JSBridge.call('closeHud', data, cb);
		}
	}

	getUserInfo(data, cb) {
		if (window.JSBridge) {
			window.JSBridge.call('getUserinfo', data, cb);
		}
	}

	fetch(data, cb) {
		if (window.JSBridge) {
			window.JSBridge.call('fetch', data, cb);
		}
	}

	notify(data, cb) {
		if (window.JSBridge) {
			window.JSBridge.call('notify', data, cb);
		}
	}
}
