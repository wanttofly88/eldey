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

	function isElementVisible(el) {
	 	var rect     = el.getBoundingClientRect(),
			vWidth   = window.innerWidth || doc.documentElement.clientWidth,
			vHeight  = window.innerHeight || doc.documentElement.clientHeight,
			efp      = function (x, y) { return document.elementFromPoint(x, y) };     

		if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) return false;
		return (
			el.contains(efp(rect.left,  rect.top))
			||  el.contains(efp(rect.right, rect.top))
			||  el.contains(efp(rect.right, rect.bottom))
			||  el.contains(efp(rect.left,  rect.bottom))
		);
	}

	var elementProto = Object.create(triggerPrototype);

	elementProto.handleScroll = function() {
		if (isElementVisible(this)) {
			if (!this._triggered) {
				dispatcher.dispatch({
					type: 'trigger-element',
					id: this._id
				});
			}
		} else {
			if (this._triggered) {
				dispatcher.dispatch({
					type: 'untrigger-element',
					id: this._id
				});
			}
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