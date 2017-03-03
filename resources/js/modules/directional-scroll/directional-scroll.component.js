define([
	'dispatcher',
	'resize/resize.store',
	'scroll/scroll.store',
	'directional-scroll/directional-scroll.store'
], function(
	dispatcher,
	resizeStore,
	scrollStore,
	dScrollStore
) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);


	elementProto.handleResize = function() {
		var ww = resizeStore.getData().width;
		var wh = resizeStore.getData().height;
		var sw = this._pivotSections[0].clientWidth;
		this._sw = sw;
		this._ww = ww;
		this._sidePadding = (ww - sw)/2;

		this._sections.forEach(function(section) {
			if (section.pivot) {
				section.wrapper.style.width = ww + 'px';
				section.wrapper.style.height = wh + 'px';
				section.fake2.style.height = section.element.clientHeight + 'px';
			}
		});

		this.handleScroll();
	}

	elementProto.handleScroll = function() {
		var wh = resizeStore.getData().width;
		var scroll = scrollStore.getData().top;
		var self = this;
		var x = dScrollStore.getData().x;
		var y = dScrollStore.getData().y;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		var RADIUS = dScrollStore.getData().RADIUS;
		var curvePoints = dScrollStore.getData().curvePoints;
		var main = this._mainContainer;
		var direction = 'vertical';
		var activeXShift = 0;
		// this._offsets = Array.prototype.map.call(this._pivotSections, function(section) {
		// 	return {
		// 		section: section,
		// 		bRect: section.getBoundingClientRect()
		// 	}
		// });

		//main.style.transform = 'translateX(' + -(x - LEFT_SHIFT) + 'px)';

		if (!curvePoints) return;

		this._sections.forEach(function(section, index) {
			var offs = self._sw + self._sidePadding;
			var c;
			var points = curvePoints[section.element.id];
			var p1, p2, p3;

			if (points) {
				p1 = points.p1;
				p2 = points.p2;
				p3 = points.p3;

				if (y < p1) {
					c = 1;
				} else if (y > p1 && y < p2) {
					direction = 'curve-up';
					activeXShift = points.x;
					c = 1 - (y - p1)/(p2 - p1);
				} else if (y === p2) {
					direction = 'horizontal';
					activeXShift = points.x;
					c = 0;
				} else if (y > p2 && y < p3) {
					direction = 'curve-down';
					activeXShift = points.x;
					c = -(y - p2)/(p3 - p2);
				} else if (y > p3) {
					c = -1;
				}

				if (Math.abs(c) < 1) {
					if (section.mode !== 'fixed') {
						section.mode = 'fixed';
						section.wrapper.style.position = 'fixed';
					}
					section.wrapper.style.transform = 'translateX(' + offs*c + 'px) translateY(' + ((p1 - y)/(p3 - p1) + 0.5)*RADIUS*5 + 'px)';
				} else {
					if (section.mode !== 'static') {
						section.mode = 'static';
						section.wrapper.style.position = 'static';
						section.wrapper.style.transform = 'translateX(' + offs*c + 'px) translateY(0px)';
					}
				}
			}
		});

		this._sections.forEach(function(section) {
			var points = curvePoints[section.element.id];
			if (!points) {
				if (direction === 'curve-up' || direction === 'horizontal') {
					section.element.style.transform = 'translateX(' + (LEFT_SHIFT - x + activeXShift) + 'px)';
				} else {
					section.element.style.transform = 'translateX(0px)';
				}
			}
		});
	}

	elementProto.createdCallback = function() {
		this.handleResize = this.handleResize.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._pivotSections = this.getElementsByTagName('section');
		if (!this._pivotSections) return;

		this._mainContainer = document.getElementsByTagName('main')[0];

		this._sections = Array.prototype.map.call(this._pivotSections, function(section) {
			var fake2 = document.createElement('div');
			var pivot = section.classList.contains('pivot-section');

			// section.parentNode.insertBefore(fake1, section);

			if (pivot) {
				section.parentNode.insertBefore(fake2, section.nextSibling);
				fake2.style.height = section.clientHeight + 'px';
			}

			return {
				mode: 'staic',
				element: section,
				fake2: fake2,
				bRect: section.getBoundingClientRect(),
				wrapper: section.getElementsByClassName('transform-wrapper')[0],
				pivot: pivot
			}
		});

		this.handleResize();
		this.handleScroll();
		resizeStore.subscribe(this.handleResize);
		scrollStore.subscribe(this.handleScroll);
	}
	elementProto.detachedCallback = function() {
		resizeStore.unsubscribe(this.handleResize);
		scrollStore.unsubscribe(this.handleScroll);
	}

	Object.setPrototypeOf(elementProto, HTMLElement.prototype);
	document.registerElement('directional-scroll', {
		prototype: elementProto,
		extends: 'main'
	});
});