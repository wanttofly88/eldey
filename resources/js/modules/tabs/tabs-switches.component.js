define(['dispatcher', 'tabs/tabs.store'], function(dispatcher, tabsStore) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.handleStore = function() {
		var storeData = tabsStore.getData().items;
		var storeIndex;

		if (!storeData[this._id]) return;
		storeIndex = storeData[this._id].index;

		Array.prototype.forEach.call(this._elements, function(el, index) {
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
		var sw = this.getElementsByClassName('sw');

		this._id = this.getAttribute('data-id');
		this._index = 0;
		this._elements = sw;

		Array.prototype.forEach.call(this._elements, function(el, index) {
			el.addEventListener('click', function(e) {
				dispatcher.dispatch({
					id: self._id,
					type: 'tabs:switch',
					index: index
				});				
			});
			if (el.classList.contains('active')) {
				self._index = index;
			};
		});

		dispatcher.dispatch({
			type: 'tabs:add',
			id: this._id,
			index: this._index
		});
		tabsStore.subscribe(this.handleStore);
	}
	elementProto.detachedCallback = function() {
		dispatcher.dispatch({
			type: 'tabs:remove',
			id: this._id
		});

		tabsStore.unsubscribe(this.handleStore);
	}

	document.registerElement('tabs-switches', {
		prototype: elementProto
	});
});