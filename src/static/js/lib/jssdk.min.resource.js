if (window.Native) { // Android
	window.JSBridge = {
		id: 0,
		on: function (action, data, cb, version) {
			this.id++;
			this.callback[action] = cb;
			window.Native.on(action, data, this.id, version);
		},
		call: function (action, data, cb, version) {
			this.id++;
			this.callback[action] = cb;
			window.Native.call(action, data, this.id, version);
		},
		callback: {},
		getCallBack: function (action, params) {
			var cb = this.callback[action];
			cb(params);
		}
	}
}

if (window.webkit) { // iOS
	window.JSBridge = {
		id: 0,
		on: function (action, data, cb, version) {
			this.id++;
			this.callback[action] = cb;
		},
		call: function (action, data, cb, version) {
			this.id++;
			this.callback[action] = cb;
			window.webkit.messageHandlers.call.postMessage({
				action: action,
				data: data,
				id: this.id,
				version: version
			})
		},
		callback: {},
		getCallBack: function (action, params) {
			var cb = this.callback[action];
			cb(params);
		}
	}
}