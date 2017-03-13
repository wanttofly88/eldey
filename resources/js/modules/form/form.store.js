define(['dispatcher', 'utils'], function(dispatcher, utils) {
	'use strict';

	var eventEmitter = new utils.EventEmitter();
	var items = {}

	var _handleEvent = function(e) {
		if (e.type === 'form-add') {
			items[e.id] = {
				id: e.id,
				status: 'waiting'
			}
		}
		if (e.type === 'form-remove') {
			if (!items.hasOwnProperty(e.id)) return;
			delete items[e.id];
		}


		if (e.type === 'form-send') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].status === 'sending') return;

			items[e.id].status = 'sending';

			eventEmitter.dispatch();
		}
		if (e.type === 'form-submit') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].status === 'submitted') return;

			items[e.id].status = 'submitted';

			eventEmitter.dispatch();
		}
		if (e.type === 'form-reset') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].status === 'waiting') return;

			items[e.id].status = 'waiting';

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