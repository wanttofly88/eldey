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


	elementProto.handleResize = function() {
		var ww = self.clientWidth;
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
	}

	elementProto.disable = function() {
		if (!this._enabled) return;
		this._enabled = false;
		this._position = 0;

		translate(this._wrapper, 0, 0);
	}

	elementProto.handleClick = function(arr) {
		var way;
		var self = this;

		if (arr.classList.contains('arr-l')) {
			way = 'left';
		}
		if (arr.classList.contains('arr-r')) {
			way = 'right';
		}

		arr.addEventListener('click', function(e) {
			var ww = self.clientWidth;

			if (way === 'left') {
				self._position--;
			}
			if (way === 'right') {
				self._position++;
			}

			self._position = Math.max(self._position, -1);
			self._position = Math.min(self._position, 1);

			translate(self._wrapper, ww*self._position, 600);
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
	}

	document.registerElement('compare-slider', {
		prototype: elementProto
	});
});