define([
	'dispatcher',
	'scroll/scroll.store',
	'scroll/virtual-d-scroll.store',
	'resize/resize.store',
	'directional-scroll/directional-scroll.store',
	'utils',
	'preloader/preloader.store'
], function(
	dispatcher,
	scrollStore,
	vDScrollStore,
	resizeStore,
	dScrollStore,
	utils,
	preloaderStore
) {
	"use strict";

	var elementProto = Object.create(HTMLImageElement.prototype);

	elementProto.handleScroll = function() {
		var scrolled;
		var wh = resizeStore.getData().height;
		var offsetCenterY;
		var shiftY;

		if (dScrollStore.getData().active) return;
		if (!preloaderStore.getData().complete) return;

		scrolled = scrollStore.getData();
		scrolled.bottom = scrolled.top + wh;

		if (scrolled + wh < this._offset.top || scrolled > this._offset.bottom) return;

		scrolled.centerY = (scrolled.top + scrolled.bottom)/2;
		offsetCenterY = (this._offset.top + this._offset.bottom)/2;
		shiftY = offsetCenterY - scrolled.centerY;

		this.style.transform = 'translateX(0px) translateY(' + -shiftY/5 + 'px) translateZ(0px)';
	}

	elementProto.handleDScroll = function() {
		var sLeft, sRight, sBottom;
		var scrolled;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		var wh = resizeStore.getData().height;
		var ww = resizeStore.getData().width;
		var offsetCenterX, offsetCenterY;
		var shiftX, shiftY;

		if (!dScrollStore.getData().active) return;
		if (!preloaderStore.getData().complete) return;

		scrolled = dScrollStore.getData();
		scrolled.x = scrolled.x - LEFT_SHIFT;
		scrolled.y = scrolled.y - wh;
		scrolled.left = scrolled.x;
		scrolled.top = scrolled.y;
		scrolled.right = scrolled.x + ww;
		scrolled.bottom = scrolled.y + wh;

		if (scrolled.bottom < this._dOffset.top ||
			scrolled.right < this._dOffset.left ||
			scrolled.left > this._dOffset.right ||
			scrolled.top > this._dOffset.bottom) {
			return;
		}

		scrolled.centerX = (scrolled.left + scrolled.right)/2;
		scrolled.centerY = (scrolled.top + scrolled.bottom)/2;
		offsetCenterX = (this._dOffset.left + this._dOffset.right)/2;
		offsetCenterY = (this._dOffset.top + this._dOffset.bottom)/2;
		shiftX = offsetCenterX - scrolled.centerX;
		shiftY = offsetCenterY - scrolled.centerY;

		this.style.transform = 'translateX(' + -shiftX/5 + 'px) translateY(' + -shiftY/5 + 'px) translateZ(0px)';
	}

	elementProto.handleResize = function() {
		this._offset = utils.offset(this);
		this._offset.right = this._offset.left + this.clientWidth;
		this._offset.bottom = this._offset.top + this.clientHeight;

		if (this._rootElement) {
			this._dOffset = utils.offsetFrom(this, this._rootElement);
			this._dOffset.right = this._dOffset.left + this.clientWidth;
			this._dOffset.bottom = this._dOffset.top + this.clientHeight;
		}
	}

	elementProto.createdCallback = function() {
		this.handleScroll = this.handleScroll.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleDScroll = this.handleDScroll.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._rootElement = document.getElementsByClassName('transform-wrapper')[0];

		resizeStore.subscribe(this.handleResize);
		scrollStore.subscribe(this.handleScroll);
		dScrollStore.subscribe(this.handleDScroll);
		preloaderStore.subscribe(this.handleScroll);
		preloaderStore.subscribe(this.handleDScroll);

		this.handleResize();
		this.handleScroll();
		this.handleDScroll();
	}
	elementProto.detachedCallback = function() {

		resizeStore.unsubscribe(this.handleResize);
		scrollStore.unsubscribe(this.handleScroll);
		dScrollStore.unsubscribe(this.handleDScroll);
		preloaderStore.unsubscribe(this.handleScroll);
		preloaderStore.unsubscribe(this.handleDScroll);
	}

	document.registerElement('parallax-element', {
		prototype: elementProto,
		extends: 'img'
	});
});