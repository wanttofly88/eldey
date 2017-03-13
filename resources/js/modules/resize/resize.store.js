define(['dispatcher', 'utils'], function(dispatcher, utils) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();

	var size = {
		width: 0,
		height: 0
	}

	var _windowSize = function() {
		return {
			height: window.innerHeight,
			width:  window.innerWidth
		}
	}

	var _onResize = function() {
		size = _windowSize();
		eventEmitter.dispatch();
	}

	var _handleEvent = function(e) {
		if (e.type === 'fire-resize') {
			eventEmitter.dispatch();
		}
	}

	var _init = function() {
		_onResize();

		window.addEventListener('resize', _onResize, false);
		window.addEventListener('orientationchange', _onResize, false);
		window.addEventListener('load', _onResize, false);
		dispatcher.subscribe(_handleEvent);
	}

	var getData = function() {
		return size;
	}

	_init();

	return {
		subscribe: eventEmitter.subscribe.bind(eventEmitter),
		unsubscribe: eventEmitter.unsubscribe.bind(eventEmitter),
		getData: getData
	}
});