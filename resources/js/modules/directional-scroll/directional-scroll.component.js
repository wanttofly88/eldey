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
		var sw = this._sections[0].element.clientWidth;
		var self = this;

		if (ww > 1200 && wh > 500) {
			this.activate();
		} else {
			this.deactivate();
		}

		this._sections.forEach(function(section) {
			if (section.pivot) {
				section.wrapper.style.width = ww + 'px';
				
				if (self._active) {
					section.wrapper.style.height = wh + 'px';
					section.fake.style.height = section.element.clientHeight + 'px';
				} else {
					section.wrapper.style.height = 'auto';
				}
			}
		});

		this._sw = sw;
		this._ww = ww;
		this._sidePadding = (ww - sw)/2;

		if (this._active) {
			this.handleScroll();
			setTimeout(function() {
				self.handleScroll();
			}, 60);
		}
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

		if (!this._active) return;
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

				if (section.element.id === 'focus') {
					c = -c;
				}

				if (direction !== self._prevDirection) {
					self._prevDirection = direction;

					if (direction === 'horizontal') {
						dispatcher.dispatch({
							type: 'trigger-element',
							id: section.element.getAttribute('data-trigger-id')
						});
					} else {
						dispatcher.dispatch({
							type: 'untrigger-element',
							id: section.element.getAttribute('data-trigger-id')
						});
					}
				}


				if (Math.abs(c) < 1) {
					if (section.mode !== 'fixed') {
						section.mode = 'fixed';
						section.wrapper.style.position = 'fixed';
					}
					section.wrapper.style.transform = 'translateX(' + offs*c + 'px) translateY(' + ((p1 - y)/(p3 - p1) + 0.5)*RADIUS*5 + 'px)';
				} else {
					if (section.mode !== 'relative') {
						section.mode = 'relative';
						section.wrapper.style.position = 'relative';
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

	elementProto.activate = function() {
		if (this._active) return;
		this._active = true;
		this.handleScroll();
		scrollStore.subscribe(this.handleScroll);
	}

	elementProto.deactivate = function() {
		if (!this._active) return;
		this._active = false;

		this._sections.forEach(function(section) {
			if (section.fake) {
				section.fake.style.height = '0px';
			}
			if (section.pivot) {
				section.wrapper.style.position = 'relative';
				section.wrapper.style.transform = 'translateX(0px) translateY(0px)';
			} else {
				section.element.style.transform = 'translateX(0px) translateY(0px)';
			}
		});

		scrollStore.unsubscribe(this.handleScroll);
	}

	elementProto.createdCallback = function() {
		this.handleResize = this.handleResize.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.activate = this.activate.bind(this);
		this.deactivate = this.deactivate.bind(this);
		this._active = false;
		this._prevDirection = false;
	}
	elementProto.attachedCallback = function() {
		var elements = this.getElementsByTagName('section');
		if (!elements) return;

		this._mainContainer = document.getElementsByTagName('main')[0];

		this._sections = Array.prototype.map.call(elements, function(section) {
			var fake = document.createElement('div');
			var pivot = section.classList.contains('pivot-section');

			// section.parentNode.insertBefore(fake1, section);

			if (pivot) {
				section.parentNode.insertBefore(fake, section.nextSibling);
			}

			return {
				mode: 'staic',
				element: section,
				fake: fake,
				bRect: section.getBoundingClientRect(),
				wrapper: section.getElementsByClassName('transform-wrapper')[0],
				pivot: pivot
			}
		});

		this.handleResize();
		resizeStore.subscribe(this.handleResize);
	}
	elementProto.detachedCallback = function() {
		this.deactivate();
		resizeStore.unsubscribe(this.handleResize);
	}

	document.registerElement('directional-scroll', {
		prototype: elementProto,
		extends: 'main'
	});
});