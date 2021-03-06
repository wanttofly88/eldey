define([
	'dispatcher',
	'utils',
	'scroll/scroll.store',
	'resize/resize.store'
], function(
	dispatcher,
	utils,
	scrollStore,
	resizeStore
) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();

	var LEFT_SHIFT = 152;
	var TOP_SHIFT = 0;
	var RADIUS = 150;
	var SECTION_PADDING = 600;
	var path, visiblePath;
	var curvePoints;
	var scrollPoints;
	var x, y;
	var direction = 'vertical';
	var active = false;

	var _handleEvent = function(e) {
		if (e.type === 'dScroll:path-change') {
			path = e.path;
			visiblePath = e.visiblePath;
			curvePoints = e.curvePoints;
			scrollPoints = e.scrollPoints;
			_handleScroll();
			eventEmitter.dispatch();
		}
		if (e.type === 'dScroll:enable') {
			active = true;
			eventEmitter.dispatch();
		}
		if (e.type === 'dScroll:disable') {
			active = false;
			eventEmitter.dispatch();
		}
	}

	var _handleScroll = function() {
		var scrolled = scrollStore.getData().top;
		var point;
		var wh = resizeStore.getData().height;

		if (!path) return;

		// point = path.getPointAtLength(scrolled + wh);
		point = path.getPointAtLength(scrolled);
		x = point.x;
		y = point.y;
		x = Math.round(x*100)/100;
		y = Math.round(y*100)/100;

		eventEmitter.dispatch();
	}

	var handleResize = function() {
		
	}

	var getData = function() {
		return {
			LEFT_SHIFT: LEFT_SHIFT,
			TOP_SHIFT: TOP_SHIFT,
			RADIUS: RADIUS,
			SECTION_PADDING: SECTION_PADDING,
			x: x,
			y: y,
			direction: direction,
			curvePoints: curvePoints,
			scrollPoints: scrollPoints,
			visiblePath: visiblePath,
			active: active
		}
	}

	var _init = function() {
		scrollStore.subscribe(_handleScroll);
		dispatcher.subscribe(_handleEvent);
	}

	_init();

	return {
		subscribe: eventEmitter.subscribe.bind(eventEmitter),
		unsubscribe: eventEmitter.unsubscribe.bind(eventEmitter),
		getData: getData
	}
});