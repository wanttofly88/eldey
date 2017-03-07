define([
	'dispatcher',
	'scroll/scroll.store',
	'resize/resize.store',
	'directional-scroll/directional-scroll.store',
], function(
	dispatcher,
	scrollStore,
	resizeStore,
	dScrollStore
) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.handleScroll = function() {
		var scrolled = scrollStore.getData().top;
		var path = dScrollStore.getData().visiblePath;
		var p1, p2, x1, x2;
		var p;
		var dx, dy;
		var angle;
		var w = this._w;
		var h = this._h;
		var total = this._total;
		var length;
		var coef;

		if (!path) return;


		length = path.getTotalLength();

		coef = total/length;
		
		scrolled = scrolled/coef;

		p = path.getPointAtLength(scrolled);

		x1 = scrolled - 10 < 0 ? 0 : scrolled - 10;
		x2 = scrolled + 10;

		p1 = path.getPointAtLength(x1);
		p2 = path.getPointAtLength(x2);

		dx = p2.x - p1.x;
		dy = p2.y - p1.y;

		angle = Math.atan2(dy, dx);

		this.style.transform = 'translateX(' + (p.x - w/2) + 'px) translateY(' + (p.y - h) + 'px) rotate(' + angle + 'rad)';
		console.log(coef);
	}
	elementProto.handleResize = function() {
		var pw = document.getElementsByClassName('page-wrapper')[0];
		var wh = resizeStore.getData().height;
		this._total = pw.clientHeight - wh;
	}

	elementProto.createdCallback = function() {
		this.handleScroll = this.handleScroll.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._w = this.clientWidth;
		this._h = this.clientHeight;

		this.handleResize();
		resizeStore.subscribe(this.handleResize);
		dScrollStore.subscribe(this.handleScroll);
	}
	elementProto.detachedCallback = function() {
		resizeStore.unsubscribe(this.handleResize);
		dScrollStore.unsubscribe(this.handleScroll);
	}

	Object.setPrototypeOf(elementProto, HTMLElement.prototype);
	document.registerElement('bird-component', {
		prototype: elementProto
	});
});