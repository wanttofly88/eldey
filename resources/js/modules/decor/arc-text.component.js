define(['dispatcher'], function(dispatcher) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.createdCallback = function() {
	}
	elementProto.attachedCallback = function() {
		var w = this.clientWidth;
		var h = this.clientHeight;
		var text = this.innerHTML;
		var letters = text.split('');
		var self = this;

		this.innerHTML = '';
		letters.forEach(function(letter, index) {
			var sp = document.createElement('span');
			var sh;
			sp.innerHTML = letter;
			self.appendChild(sp);

			sp.style.transformOrigin = '50% ' + (h/2) + 'px';
			sp.style.transform = 'rotate(' + index/letters.length*360 + 'deg)';
		});
	}
	elementProto.detachedCallback = function() {
	}

	Object.setPrototypeOf(elementProto, HTMLElement.prototype);
	document.registerElement('arc-text', {
		prototype: elementProto
	});
});