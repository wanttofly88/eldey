define([
	'dispatcher',
	'trigger/trigger.prototype',
	'scroll/virtual-scroll.store',
	'resize/resize.store',
	'utils'
], function(
	dispatcher,
	triggerPrototype,
	vScrollStore,
	resizeStore,
	utils
) {
	"use strict";

	var elementProto = Object.create(triggerPrototype);

	elementProto.handleScroll = function() {
		var scrollPos = vScrollStore.getData().top;
		var self = this;

		if (scrollPos >= this._offset && !this._triggered) {
			dispatcher.dispatch({
				type: 'trigger-element',
				id: this._id
			});
		}
		if (scrollPos < this._offset && this._triggered) {
			dispatcher.dispatch({
				type: 'untrigger-element',
				id: this._id
			});
		}
	}

	elementProto.handleResize = function() {
		this._offset = utils.offset(this).top;
	}

	elementProto.createdCallback = function() {
		triggerPrototype.createdCallback.apply(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}
	elementProto.attachedCallback = function() {
		triggerPrototype.attachedCallback.apply(this);

		resizeStore.subscribe(this.handleResize);
		vScrollStore.subscribe(this.handleScroll);

		this.handleResize();
		this.handleScroll();
	}
	elementProto.detachedCallback = function() {
		triggerPrototype.detachedCallback.apply(this);

		resizeStore.unsubscribe(this.handleResize);
		vScrollStore.unsubscribe(this.handleScroll);
	}

	document.registerElement('scroll-trigger', {
		prototype: elementProto,
		extends: 'div'
	});
});