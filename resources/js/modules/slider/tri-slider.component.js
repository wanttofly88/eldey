define(['dispatcher', 'resize/resize.store'], function(dispatcher, resizeStore) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.next = function() {
		var n1, n2, n3;
		var self = this;

		var change = function(i, n) {
			self._containers[i].classList.add('hidden');

			clearTimeout(self._timers[i]);
			self._timers[i] = setTimeout(function() {
				self._containers[i].innerHTML = self._slides[n].innerHTML;
				setTimeout(function() {
					self._containers[i].classList.remove('hidden');
				}, 20);
			}, 300);
		}

		this._current += 3;

		n1 = (this._current) % this._total;
		n2 = (this._current + 1) % this._total;
		n3 = (this._current + 2) % this._total;

		setTimeout(function() {
			change(2, n3);
		}, 0);
		setTimeout(function() {
			change(1, n2);
		}, 100);
		setTimeout(function() {
			change(0, n1);
		}, 200);
	}
	elementProto.handleResize = function() {
		var self = this;

		this._maxH = 0;
		this._slidesContainer.style.display = 'block';
		this._slides.forEach(function(slide) {
			if (slide.clientHeight > self._maxH) {
				self._maxH = slide.clientHeight;
			}
		});
		this._containers.forEach(function(cont) {
			cont.style.height = self._maxH + 'px';
		});
		this._slidesContainer.style.display = 'none';
	}

	elementProto.createdCallback = function() {
		this.next = this.next.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}
	elementProto.attachedCallback = function() {
		var self = this;
		this._containers = this.querySelectorAll('.item');
		this._slidesContainer = this.querySelector('.slides-data');
		this._slides = this.querySelectorAll('.slides-data .slide');
		this._nextArrow = this.querySelector('.next-arrow');
		this._total = this._slides.length;
		this._current = 0;
		this._timers = [null, null, null];

		this.handleResize();
		resizeStore.subscribe(this.handleResize);
		this._nextArrow.addEventListener('click', this.next);
	}
	elementProto.detachedCallback = function() {
		resizeStore.unsubscribe(this.handleResize);
		this._nextArrow.removeEventListener('click', this.next);
	}

	Object.setPrototypeOf(elementProto, HTMLElement.prototype);
	document.registerElement('tri-slider', {
		prototype: elementProto
	});
});