define(['dispatcher', 'trigger/trigger.store'], function(dispatcher, triggerStore) {
	"use strict";

	var elementProto = Object.create(HTMLDivElement.prototype);
	var idName = 'trigger-element-';
	var idNum = 0;

	elementProto.handleStore = function() {
		var storeData = triggerStore.getData().items[this._id];

		if (storeData.triggered) {
			this.classList.add('triggered');
			this.classList.add('triggered-once');
			this._triggered = true;
		} else {
			this.classList.remove('triggered');
			this._triggered = false;
		}
	}

	elementProto.createdCallback = function() {
		this.handleStore = this.handleStore.bind(this);
		this._triggered = false;
	}
	elementProto.attachedCallback = function() {
		this._id = this.getAttribute('data-trigger-id');
		if (!this._id) {
			idNum++;
			this._id = idName + idNum;
			this.setAttribute('data-trigger-id', this._id);
		}

		triggerStore.subscribe(this.handleStore);

		dispatcher.dispatch({
			type: 'trigger-element-add',
			id: this._id
		});
	}
	elementProto.detachedCallback = function() {
		triggerStore.unsubscribe(this.handleStore);

		dispatcher.dispatch({
			type: 'trigger-element-remove',
			element: this
		});
	}

	return elementProto;
});