define([
	'dispatcher',
	'trigger/trigger.prototype',
	'scroll/virtual-scroll.store',
	'scroll/virtual-d-scroll.store',
	'resize/resize.store',
	'directional-scroll/directional-scroll.store',
	'utils',
	'preloader/preloader.store'
], function(
	dispatcher,
	triggerPrototype,
	vScrollStore,
	vDScrollStore,
	resizeStore,
	dScrollStore,
	utils,
	preloaderStore
) {
	"use strict";

	// var checkVisible = function(elm, shift) {
	// 	var rect = elm.getBoundingClientRect();
	// 	var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
	// 	var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
	// 	return !(rect.bottom - shift < 0 || rect.top - viewHeight + shift >= 0) && !(rect.right - shift < 0 || rect.left - viewWidth + shift>= 0);
	// }

	var elementProto = Object.create(triggerPrototype);

	elementProto.handleScroll = function() {
		var scrolled;
		if (dScrollStore.getData().active) return;
		if (!preloaderStore.getData().complete) return;

		scrolled = vScrollStore.getData().bottom;



		if (scrolled >= this._offset && !this._triggered) {
			dispatcher.dispatch({
				type: 'trigger-element',
				id: this._id
			});
		}
		if (scrolled < this._offset && this._triggered) {
			dispatcher.dispatch({
				type: 'untrigger-element',
				id: this._id
			});
		}

		// if (checkVisible(this, 200)) {
		// 	if (!this._triggered) {
		// 		dispatcher.dispatch({
		// 			type: 'trigger-element',
		// 			id: this._id
		// 		});
		// 	}
		// } else {
		// 	if (this._triggered) {
		// 		dispatcher.dispatch({
		// 			type: 'untrigger-element',
		// 			id: this._id
		// 		});
		// 	}
		// }
	}

	elementProto.handleDScroll = function() {
		var sLeft, sRight, sBottom;
		var scrolled;
		if (!dScrollStore.getData().active || !this._rootElement) return;
		if (!preloaderStore.getData().complete) return;

		scrolled = vDScrollStore.getData();
		sLeft = scrolled.left;
		sBottom = scrolled.bottom;
		sRight = scrolled.right;

		if (sBottom >= this._dOffset.top &&
			sRight >= this._dOffset.left &&
			sLeft <= this._dOffset.right) {

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

		if (this._rootElement) {
			this._dOffset = utils.offsetFrom(this, this._rootElement);
			this._dOffset.right = this._dOffset.left + this.clientWidth;
		}
	}

	elementProto.createdCallback = function() {
		triggerPrototype.createdCallback.apply(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleDScroll = this.handleDScroll.bind(this);
	}
	elementProto.attachedCallback = function() {
		triggerPrototype.attachedCallback.apply(this);

		this._rootElement = document.getElementsByClassName('transform-wrapper')[0];
		this._appearType = null;

		if (this.classList.contains('appear-up')) {
			this._appearType = 'top';
		} else if (this.classList.contains('appear-left')) {
			this._appearType = 'left';
		} else if (this.classList.contains('appear-right')) {
			this._appearType = 'right';
		}

		resizeStore.subscribe(this.handleResize);
		vScrollStore.subscribe(this.handleScroll);
		vDScrollStore.subscribe(this.handleDScroll);
		preloaderStore.subscribe(this.handleScroll);
		preloaderStore.subscribe(this.handleDScroll);

		this.handleResize();
		this.handleScroll();
		this.handleDScroll();
	}
	elementProto.detachedCallback = function() {
		triggerPrototype.detachedCallback.apply(this);

		resizeStore.unsubscribe(this.handleResize);
		vScrollStore.unsubscribe(this.handleScroll);
		vDScrollStore.unsubscribe(this.handleDScroll);
		preloaderStore.unsubscribe(this.handleScroll);
		preloaderStore.unsubscribe(this.handleDScroll);
	}

	document.registerElement('scroll-trigger', {
		prototype: elementProto,
		extends: 'div'
	});
});