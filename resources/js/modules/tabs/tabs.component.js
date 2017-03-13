define(['dispatcher', 'tabs/tabs.store'], function(dispatcher, tabsStore) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.handleStore = function() {
		var storeData = tabsStore.getData().items;
		var storeIndex;

		if (!storeData[this._id]) return;
		storeIndex = storeData[this._id].index;

		Array.prototype.forEach.call(this._tabs, function(el, index) {
			if (index === storeIndex) {
				el.classList.add('active');
			} else {
				el.classList.remove('active');
			}
		});
	}

	elementProto.createdCallback = function() {
		this.handleStore = this.handleStore.bind(this);
	}
	elementProto.attachedCallback = function() {
		var self = this;
		var tabs = this.getElementsByClassName('tab');

		this._id = this.getAttribute('data-id');
		this._index = 0;
		this._tabs = tabs;
		tabsStore.subscribe(this.handleStore);
	}
	elementProto.detachedCallback = function() {
		tabsStore.unsubscribe(this.handleStore);
	}

	document.registerElement('tabs-container', {
		prototype: elementProto
	});
});