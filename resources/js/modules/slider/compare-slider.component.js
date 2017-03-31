define([
	'dispatcher',
	'resize/resize.store',
	'resize/breakpoint.store'
], function(
	dispatcher,
	resizeStore,
	bpStore
) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);


	var translate = function(element, position, speed) {
		element.style.transitionDuration = speed + 'ms';
		element.style.transform = 'translateX(' + position + 'px) translateZ(0)';
	}

	elementProto.TouchHandler = function(component) {
		this.component = component;
		this._start = {};
		this._delta = {};
		this._vertical = undefined;

		this.ontouchstart = function(e) {
			var touches = e.touches[0];

			this.ww = this.component.clientWidth;

			this._start = {
				x: touches.pageX,
				y: touches.pageY,
				time: +new Date
			}
			this._delta = {}
			this._vertical = undefined;

			this.component._wrapper.addEventListener('touchmove', this.ontouchmove);
			this.component._wrapper.addEventListener('touchend',  this.ontouchend);
		}.bind(this);

		this.ontouchmove = function(e) {
			var touches;
			var move = 0;
			var touchMoveEvent;

			if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
			touches = event.touches[0];

			this.touches = event.touches[0];

			this._delta = {
				x: this.touches.pageX - this._start.x,
				y: this.touches.pageY - this._start.y
			}

			if (typeof this._vertical === undefined) {
				this._vertical = !!(this._vertical || Math.abs(this._delta.x) < Math.abs(this._delta.y));
			}

			if (this._vertical) return;

			move = this._delta.x/3;

			if (this._delta.x > 0 && this.component._position === 1) {
				move /= 3;
			} else if (this._delta.x < 0 && this.component._position === -1) {
				move /= 3;
			}

			move += this.component._position*this.ww;

			translate(this.component._wrapper, move, 0);
		}.bind(this);

		this.ontouchend =  function(e) {
			var duration = +new Date - this._start.time;
			var check = parseInt(duration) < 250 && Math.abs(this._delta.x) > 20 || Math.abs(this._delta.x) > 170;
			var returnSpeed = 250;
			var touchEndEvent;
			var self = this;

			this.component._wrapper.removeEventListener('touchmove', this.ontouchmove, false);
			this.component._wrapper.removeEventListener('touchend',  this.ontouchend, false);

			if (this._vertical) return;

			if (check) {
				if (this._delta.x > 0) {
					this.component.slide('right');
				} else {
					this.component.slide('left');
				}
			} else {
				translate(this.component._wrapper, this.component._position*this.ww, returnSpeed);
			}
		}.bind(this);

		this.set = function() {
			this.component.addEventListener('touchstart', this.ontouchstart);
		}

		this.remove = function() {
			this.component._wrapper.removeEventListener('touchstart', this.ontouchstart);
			this.component._wrapper.removeEventListener('touchmove', this.ontouchmove);
			this.component._wrapper.removeEventListener('touchend',  this.ontouchend);
		}
	}

	elementProto.slide = function(way) {
		var ww = this.clientWidth;
		var self = this;

		if (way === 'left') {
			this._position--;
		}
		if (way === 'right') {
			this._position++;
		}

		this._position = Math.max(this._position, -1);
		this._position = Math.min(this._position, 1);

		Array.prototype.forEach.call(this._arrs, function(arr) {

			if (arr.classList.contains('arr-l')) {
				if (self._position === 1) {
					arr.classList.add('disabled');
				} else {
					arr.classList.remove('disabled');
				}
			}
			if (arr.classList.contains('arr-r')) {
				if (self._position === -1) {
					arr.classList.add('disabled');
				} else {
					arr.classList.remove('disabled');
				}
			}
		});

		translate(this._wrapper, ww*this._position, 600);
	}

	elementProto.handleResize = function() {
		var ww = this.clientWidth;
		if (!this._enabled) return;
		translate(this._wrapper, ww*this._position, 0);
	}

	elementProto.handleBP = function() {
		var name = bpStore.getData().name;
		if (name === 'desktop') {
			this.disable();
		} else {
			this.enable();
		}
	}

	elementProto.enable = function() {
		if (this._enabled) return;
		this._enabled = true;
		this._position = 0;

		this.handleResize();
		this.touchHandler.set();
	}

	elementProto.disable = function() {
		if (!this._enabled) return;
		this._enabled = false;
		this._position = 0;

		translate(this._wrapper, 0, 0);
		this.touchHandler.remove();
	}

	elementProto.handleClick = function(arr) {
		var way;
		var self = this;

		if (arr.classList.contains('arr-l')) {
			way = 'right';
		}
		if (arr.classList.contains('arr-r')) {
			way = 'left';
		}

		arr.addEventListener('click', function(e) {
			if (this.classList.contains('disabled') || self._animating) return;

			self._animating = true;

			self.slide(way);

			setTimeout(function() {
				self._animating = false;
			}, 600);
		});
	}

	elementProto.createdCallback = function() {
		this._enabled = false;
		this._position = 1;

		this.enable = this.enable.bind(this);
		this.disable = this.disable.bind(this);
		this.handleBP = this.handleBP.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.touchHandler  = new this.TouchHandler(this);
		this.slide = this.slide.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._wrapper = this.getElementsByClassName('wrapper')[0];
		this._arrs = this.getElementsByClassName('arr');

		Array.prototype.forEach.call(this._arrs, this.handleClick);

		this.handleBP();
		this.handleResize();
		bpStore.subscribe(this.handleBP);
		resizeStore.subscribe(this.handleResize);
	}
	elementProto.detachedCallback = function() {
		bpStore.unsubscribe(this.handleBP);
		resizeStore.unsubscribe(this.handleResize);
		this.touchHandler.remove();
	}

	document.registerElement('compare-slider', {
		prototype: elementProto
	});
});