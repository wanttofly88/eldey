define(['dispatcher', 'resize/breakpoint.store', 'img/img.store'], function(dispatcher, bpStore, imgStore) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);
	var idName = 'adaptive-img-';
	var idNum = 0;

	elementProto.createdCallback = function() {
		this._listener = false;
		this._fakeImg = false;
		this.handleBP = this.handleBP.bind(this);
	}

	elementProto.attachedCallback = function() {
		var self = this;
		var desktop = this.getAttribute('data-desktop-src');
		var tablet  = this.getAttribute('data-tablet-src');
		var mobile  = this.getAttribute('data-mobile-src');

		this._id = this.getAttribute('data-id');
		if (!this._id) {
			idNum++;
			this._id = idName + idNum;
			this.setAttribute('data-id', this._id);
		}

		if (!tablet) {
			tablet = desktop;
		}
		if (!mobile) {
			mobile = tablet;
		}
		dispatcher.dispatch({
			type: 'adaptive-image-add',
			id: id
		});

		this._sources = {
			desktop: desktop,
			tablet:  tablet,
			mobile:  mobile
		}

		this._bp = false;
		bpStore.subscribe(this.handleBP);
		this.handleBP();
	}
	elementProto.detachedCallback = function() {
		bpStore.unsubscribe(this.handleBP);
	}

	return elementProto
});