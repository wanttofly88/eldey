define(['dispatcher', 'resize/breakpoint.store', 'img/img.prototype'], function(dispatcher, bpStore, imgProptotype) {
	"use strict";

	var elementProto = Object.create(imgProptotype);

	elementProto.handleBP = function() {
		var bpName = bpStore.getData().name;
		var self = this;

		if (this._bp === bpName) return;

		if (!this._sources.hasOwnProperty(bpName)) {
			console.warn('no source image for breakpoint ' + bpName);
			return;
		}

		this._bp = bpName;

		if (!this._img) {
			this._img = document.createElement('img');
		}
		if (!this._listener) {
			this._listener = true;
			this._img.addEventListener('load', function() {
				dispatcher.dispatch({
					type: 'adaptive-image-load',
					element: self
				});
				self.style.backgroundImage = 'url(' + self.sources[bpName] + ')';
			});
		}

		this._img.setAttribute('src', this._sources[bpName]);
	}

	elementProto.createdCallback = function() {
		imgProptotype.createdCallback.apply(this);
	}
	elementProto.attachedCallback = function() {
		imgProptotype.attachedCallback.apply(this);
	}
	elementProto.detachedCallback = function() {
		imgProptotype.detachedCallback.apply(this);
	}

	document.registerElement('img-div-component', {
		prototype: elementProto,
		extends: 'div'
	});
});