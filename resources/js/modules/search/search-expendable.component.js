define(['dispatcher'], function(dispatcher) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.blur = function() {
		var value = this._input.value;
		console.log(11);
		if (value) return;

		this.parentNode.classList.remove('hover');
	}
	elementProto.mouseenter = function() {
		this.parentNode.classList.add('hover');
	}

	elementProto.mouseleave = function() {
		var value = this._input.value;
		if (value || document.activeElement === this._input) return;

		this.parentNode.classList.remove('hover');
	}

	elementProto.createdCallback = function() {
		this.mouseenter = this.mouseenter.bind(this);
		this.mouseleave = this.mouseleave.bind(this);
		this.blur = this.blur.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._input = this.getElementsByClassName('input')[0];

		this.addEventListener('mouseenter', this.mouseenter);
		this.addEventListener('mouseleave', this.mouseleave);
		this._input.addEventListener('blur', this.blur);
	}
	elementProto.detachedCallback = function() {
		this.removeEventListener('mouseenter', this.mouseenter);
		this.removeEventListener('mouseleave', this.mouseleave);
		this._input.removeEventListener('blur', this.blur);
	}

	document.registerElement('search-expendable', {
		prototype: elementProto
	});
});