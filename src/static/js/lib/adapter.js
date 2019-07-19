// 默认750宽度对应的字体大小是100px，这里是所有的都会缩放，
(function () {
	function Adapter(config) {
		this.config = config;
		return this;
	}

	Adapter.prototype = {
		reset: function () {
			var logicFontSize = document.documentElement.clientWidth / 375 * 100;
			document.documentElement.style.fontSize = logicFontSize + 'px';

			var actualFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize),
				scaleRate = logicFontSize / actualFontSize;
			if (scaleRate == 1) {
				return;
			}
			document.documentElement.style.fontSize = (logicFontSize * scaleRate) + "px";
		}

	};

	window.Adapter = new Adapter();

	window.Adapter.reset();

	window.onload = function () {
		window.Adapter.reset();
	};

	window.addEventListener('resize', function () {
		window.Adapter.reset();
	})
})();
