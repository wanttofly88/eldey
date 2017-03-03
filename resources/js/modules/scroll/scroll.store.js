define(['dispatcher', 'utils'], function(dispatcher, utils) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();

	var position = {
		top: 0,
		left: 0
	}

	var _scrollPositionTop = function() {
		var position = (window.pageYOffset || window.document.scrollTop) - (window.document.clientTop || 0);
		if (isNaN(position)) position = 0;
		return position;
	}
	var _scrollPositionLeft = function() {
		var position = (window.pageXOffset || window.document.scrollLeft) - (window.document.clientLeft || 0);
		if (isNaN(position)) position = 0;
		return position;
	}

	var _onScroll = function() {
		position.top = _scrollPositionTop();
		position.left = _scrollPositionLeft();
		eventEmitter.dispatch();
	}

	var _handleEvent = function(e) {

	}

	var getData = function() {
		return position;
	}

	var _init = function() {
		dispatcher.subscribe(_handleEvent);

		_onScroll();
		window.addEventListener('scroll', _onScroll, false);
	}

	_init();

	return {
		subscribe: eventEmitter.subscribe.bind(eventEmitter),
		unsubscribe: eventEmitter.unsubscribe.bind(eventEmitter),
		getData: getData
	}
});