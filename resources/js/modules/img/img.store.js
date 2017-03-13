define(['dispatcher', 'utils'], function(dispatcher, utils) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();

	var items = [];

	var _handleEvent = function(e) {
		var exists = false;

		if (e.type === 'adaptive-image-add') {
			items.forEach(function(item) {
				if (item.id === e.id) exists = true;
			});

			if (exists) return;

			items.push({
				id: e.id,
				loaded: false
			});

			eventEmitter.dispatch();
		}

		if (e.type === 'adaptive-image-remove'){
			items = items.filter(function(item) {
				return item.id !== e.id;
			});

			eventEmitter.dispatch();
		}

		if (e.type === 'adaptive-image-load'){
			items.forEach(function(item) {
				if (item.id === e.id) {
					exists = true;
					item.loaded = true;
				};
			});

			if (!exists) return;
			eventEmitter.dispatch();
		}
	}

	var getData = function() {
		return {
			items: items
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