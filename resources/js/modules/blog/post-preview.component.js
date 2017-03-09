define(['dispatcher'], function(dispatcher) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.handleMouseEnter = function() {
		this._hd.classList.add('hover');
		this._img.classList.add('hover');
	}

	elementProto.handleMouseLeave = function() {
		this._hd.classList.remove('hover');
		this._img.classList.remove('hover');
	}


	elementProto.createdCallback = function() {
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._img = this.getElementsByClassName('img')[0];
		this._hd = this.getElementsByClassName('hd')[0];

		this._img.addEventListener('mouseenter', this.handleMouseEnter);
		this._hd.addEventListener('mouseenter', this.handleMouseEnter);
		this._img.addEventListener('mouseleave', this.handleMouseLeave);
		this._hd.addEventListener('mouseleave', this.handleMouseLeave);
	}
	elementProto.detachedCallback = function() {
	}

	Object.setPrototypeOf(elementProto, HTMLElement.prototype);
	document.registerElement('post-preview', {
		prototype: elementProto
	});
});