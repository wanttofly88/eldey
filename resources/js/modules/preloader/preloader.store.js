define(['dispatcher', 'utils'], function(dispatcher, utils) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();
	var complete = false;

	var _handleEvent = function(e) {
		if (e.type === 'preload-complete') {
			if (complete) return;
			complete = true;
			eventEmitter.dispatch();
		}
		if (e.type === 'preload-reset') {
			if (!complete) return;
			complete = false;
			eventEmitter.dispatch();
		}
	}

	var getData = function() {
		return {
			complete: complete
		}
	}

	var _init = function() {
		dispatcher.subscribe(_handleEvent);
	}

	_init();

	return {
		subscribe: eventEmitter.subscribe.bind(eventEmitter),
		unsubscribe: eventEmitter.unsubscribe.bind(eventEmitter),
		getData: getData
	}
});