define([
	'dispatcher',
	'trigger/trigger.prototype',
	'preloader/preloader.store',
	'utils'
], function(
	dispatcher,
	triggerPrototype,
	preloaderStore,
	utils
) {
	"use strict";

	var elementProto = Object.create(triggerPrototype);

	elementProto.handlePreloader = function() {
		var complete = preloaderStore.getData().complete;
		var self = this;

		if (complete) {
			setTimeout(function() {
				dispatcher.dispatch({
					type: 'trigger-element',
					id: self._id
				});
			}, self._delay);
		} else {
			dispatcher.dispatch({
				type: 'untrigger-element',
				id: self._id
			});
		}
	}

	elementProto.createdCallback = function() {
		triggerPrototype.createdCallback.apply(this);
		this.handlePreloader = this.handlePreloader.bind(this);
	}
	elementProto.attachedCallback = function() {
		triggerPrototype.attachedCallback.apply(this);
		this._delay = this.getAttribute('data-delay') || 300;
		this._delay = parseInt(this._delay);

		console.log(this._delay);

		preloaderStore.subscribe(this.handlePreloader);
		this.handlePreloader();
	}
	elementProto.detachedCallback = function() {
		triggerPrototype.detachedCallback.apply(this);

		preloaderStore.unsubscribe(this.handlePreloader);
	}

	document.registerElement('timer-trigger', {
		prototype: elementProto,
		extends: 'div'
	});
});