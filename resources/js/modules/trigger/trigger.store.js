define(['dispatcher', 'utils'], function(dispatcher, utils) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();
	var items = {};

	var _handleEvent = function(e) {
		var exists = false;
		if (e.type === 'trigger-element-add') {
			if (items.hasOwnProperty(e.id)) return;

			items[e.id] = {
				id: e.id,
				triggered: false
			}

			eventEmitter.dispatch();
		}
		if (e.type === 'trigger-element-remove') {
			if (!items.hasOwnProperty(e.id)) return;
			delete items[e.id];

			eventEmitter.dispatch();
		}
		if (e.type === 'trigger-element') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].triggered) return;

			items[e.id].triggered = true;
			eventEmitter.dispatch();
		}
		if (e.type === 'untrigger-element') {
			if (!items.hasOwnProperty(e.id)) return;
			if (!items[e.id].triggered) return;

			items[e.id].triggered = false;
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