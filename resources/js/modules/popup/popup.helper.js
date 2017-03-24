define(['dispatcher', 'popup/popup.store'], function(dispatcher, popupStore) {

	"use strict";

	var _handleStore = function() {
		var active = popupStore.getData().active;
		var body = document.getElementsByTagName('body')[0];
		var pw = document.getElementsByClassName('page-wrapper')[0];
		var fixedElements = document.getElementsByClassName('fixed');
		var dw1 = pw.clientWidth;
		var diff;

		if (active) {
			body.classList.add('prevent-scroll');
			diff = pw.clientWidth - dw1;
		} else {
			body.classList.remove('prevent-scroll');
			diff = 0;
		}

		Array.prototype.forEach.call(fixedElements, function(el) {
			el.style.marginRight = diff + 'px';
		});
	}

	var _init = function() {
		popupStore.eventEmitter.subscribe(_handleStore);
	}

	_init()
});