define([
	'dispatcher',
	'directional-scroll/directional-scroll.store',
	'scroll/scroll.store',
	'utils'
], function(
	dispatcher,
	dScrollStore,
	scrollStore,
	utils
) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);
	var requestAnimationFrame = utils.getRequestAnimationFrame();

	elementProto.handleScroll = function() {
		// var storeData = dScrollStore.getData();
		// var scrollPoints;
		// var scrolled;

		// if (!storeData.active) return;

		// scrollPoints = storeData.scrollPoints;
		// scrolled = scrollStore.getData().top;


		// scrollPoints.forEach(function(point, index) {
		// 	if (scrolled > point[0] && scrolled < point[1]) {
		// 		dispatcher.dispatch({
		// 			type: 'scroll-to',
		// 			position: point[1],
		// 			speed: 0.2
		// 		});
		// 	}
		// });
	}

	elementProto.loop = function() {
		var storeData = dScrollStore.getData();
		var scrollPoints;
		var scrolled;
		var delta;
		var self = this;
		var result;

		if (!this._active) return;

		if (storeData.active) {
			scrollPoints = storeData.scrollPoints;
			scrolled = scrollStore.getData().top;

			if (scrollPoints) {
				scrollPoints.forEach(function(point, index) {
					if (scrolled > point[0] && scrolled < point[1]) {
						if (self._prevScrolled > scrolled) {
							self._prevWay = 'up';
							result = (0, scrolled + (point[0] - scrolled)/15);
						} else if ((self._prevScrolled < scrolled)) {
							self._prevWay = 'down';
							result = (0, scrolled + (point[1] - scrolled)/15);
						} else {
							if (self._prevWay === 'up') {
								result = (0, scrolled + (point[0] - scrolled)/15);
							} else {
								result = (0, scrolled + (point[1] - scrolled)/15);
							}
						}

						window.scrollTo(0, result);
					}
				});
			}
		}

		self._prevScrolled = scrolled;

		requestAnimationFrame(this.loop);
	}

	elementProto.createdCallback = function() {
		this._scrolling = false;
		this._active = true;
		this.handleScroll = this.handleScroll.bind(this);
		this.loop = this.loop.bind(this);
	}
	elementProto.attachedCallback = function() {
		window.scrollTo(0, 0);
		this._prevScrolled = 0;
		dScrollStore.subscribe(this.handleScroll);
		this.loop();
	}
	elementProto.detachedCallback = function() {
		this._active = false;
		dScrollStore.unsubscribe(this.handleScroll);
	}

	document.registerElement('dscroll-auto', {
		prototype: elementProto
	});
});