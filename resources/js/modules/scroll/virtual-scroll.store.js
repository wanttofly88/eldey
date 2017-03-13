define([
	'dispatcher',
	'utils',
	'resize/resize.store',
	'scroll/scroll.store'
], function(
	dispatcher,
	utils,
	resizeStore,
	scrollStore
) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();
	var scrolled = 0;
	var scrolldWHeight;
	var wh = 0;
	var requestAnimationFrame = utils.getRequestAnimationFrame();
	var virtualScroll = 0;
	var prev = 0;

	var _loop = function() {
		if (Math.round(virtualScroll) !== scrolldWHeight) {
			scrolldWHeight = Math.floor(scrolldWHeight);
			virtualScroll = virtualScroll + (scrolldWHeight - virtualScroll)/20;

			if (prev !== Math.round(virtualScroll)) {
				eventEmitter.dispatch();
			}
			prev = Math.round(virtualScroll);
		}

		requestAnimationFrame(_loop);
	}

	var _handleEvent = function(e) {

	}

	var _handleResize = function() {
		wh = resizeStore.getData().height;
		scrolldWHeight = scrolled + wh;
	}

	var _handleScroll = function() {
		scrolled = scrollStore.getData().top;
		scrolldWHeight = scrolled + wh;
	}

	var getData = function() {
		return {
			top: Math.round(virtualScroll)
		}
	}

	var _init = function() {
		dispatcher.subscribe(_handleEvent);
		_handleScroll();
		_handleResize();
		scrollStore.subscribe(_handleScroll);
		resizeStore.subscribe(_handleResize);
		_loop();
	}

	_init();

	return {
		subscribe: eventEmitter.subscribe.bind(eventEmitter),
		unsubscribe: eventEmitter.unsubscribe.bind(eventEmitter),
		getData: getData
	}
});