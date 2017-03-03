define(['dispatcher', 'utils'], function(dispatcher, utils) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();
	var items = {}

	var _handleEvent = function(e) {
		if (e.type === 'tabs:add') {
			if (items.hasOwnProperty(e.id)) return;
			items[e.id] = {
				id: e.id,
				index: e.index
			}
			eventEmitter.dispatch();
		}
		if (e.type === 'tabs:remove') {
			if (!items.hasOwnProperty(e.id)) return;
			delete items[e.id];
			eventEmitter.dispatch();
		}
		if (e.type === 'tabs:switch') {
			
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].index === e.index) return;

			items[e.id].index = e.index;
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