define([
	'dispatcher',
	'img/img.store',
	'preloader/preloader.store',

], function(
	dispatcher,
	imgStore,
	preloaderStore
) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.handleStore = function() {
		var storeData = preloaderStore.getData();
		var pageWrapper;

		if (this._complete === storeData.complete) return;
		this._complete = storeData.complete;

		pageWrapper = document.getElementsByClassName('page-wrapper')[0];

		if (this._complete) {
			pageWrapper.classList.add('load-complete');
			pageWrapper.classList.add('load-complete-once');
		} else {
			pageWrapper.classList.remove('load-complete');
		}

		// dispatcher.dispatch({
		// 	type: 'transition-step-2'
		// });
	}

	elementProto.loaded = function() {
		var delay;
		var time;

		time = Date.now();
		delay = time - this._startTime + this._minTimeout;

		if (delay < 0) delay = 0;

		setTimeout(function() {
			dispatcher.dispatch({
				type: 'preload-complete'
			});
		}, delay);
	}

	elementProto.handleDispatcher = function(e) {
		var pw;
		if (e.type === 'page-mutated') {
			pw = document.getElementsByClassName('page-wrapper')[0];
			this._startTime = Date.now();

			dispatcher.dispatch({
				type: 'preload-reset'
			});

			this.handleImgStore();
		}
	}

	elementProto.handleImgStore = function() {
		var items = imgStore.getData().items;
		var allLoded = true;

		items.forEach(function(item) {
			if (!item.loaded) allLoded = false;
		});

		if (allLoded) this.loaded();
	}

	elementProto.createdCallback = function() {
		this._minTimeout = 0;
		this._startTime = false;
		this._complete = false;
		this.handleDispatcher = this.handleDispatcher.bind(this);
		this.handleStore = this.handleStore.bind(this);
		this.handleImgStore = this.handleImgStore.bind(this);
		this.loaded = this.loaded.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._startTime = Date.now();

		dispatcher.subscribe(this.handleDispatcher);
		imgStore.subscribe(this.handleImgStore);
		preloaderStore.subscribe(this.handleStore);

		this.handleImgStore();
		this.handleStore();
	}
	elementProto.detachedCallback = function() {
		dispatcher.unsubscribe(this.handleDispatcher);
		imgStore.unsubscribe(this.handleImgStore);
		preloaderStore.unsubscribe(this.handleStore);
	}

	document.registerElement('preloader-helper', {
		prototype: elementProto
	});
});