define([
	'dispatcher',
	'utils',
	'resize/resize.store',
	'scroll/scroll.store',
	'directional-scroll/directional-scroll.store'
], function(
	dispatcher,
	utils,
	resizeStore,
	scrollStore,
	dScrollStore
) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();
	var scrolled;
	var wh = 0;
	var ww = 0;
	var requestAnimationFrame = utils.getRequestAnimationFrame();
	var virtualScroll = {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	}

	var _loop = function() {
		var scrolledWHeight = scrolled.top + wh;
		var scrolledWWidth = scrolled.left + ww;

		if (Math.round(virtualScroll.top) !== scrolled.top 
				|| Math.round(virtualScroll.bottom) !== scrolledWHeight
				|| Math.round(virtualScroll.left) !== scrolled.left
				|| Math.round(virtualScroll.right) !== scrolledWWidth) {


			virtualScroll.top = virtualScroll.top + (scrolled.top - virtualScroll.top)/20;
			virtualScroll.bottom = virtualScroll.bottom + (scrolledWHeight - virtualScroll.bottom)/20;
			virtualScroll.left = virtualScroll.left + (scrolled.left - virtualScroll.left)/20;
			virtualScroll.right = virtualScroll.right + (scrolledWWidth - virtualScroll.right)/20;

			eventEmitter.dispatch();
		}

		requestAnimationFrame(_loop);
	}

	var _handleEvent = function(e) {

	}

	var _handleResize = function() {
		wh = resizeStore.getData().height;
		ww = resizeStore.getData().width;
	}

	var _handleScroll = function() {
		scrolled = scrollStore.getData();
	}

	var getData = function() {
		return {
			top: Math.round(virtualScroll.top),
			left: Math.round(virtualScroll.left),
			right: Math.round(virtualScroll.right),
			bottom: Math.round(virtualScroll.bottom)
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