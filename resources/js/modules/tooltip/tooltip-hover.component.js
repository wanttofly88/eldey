define(['dispatcher', 'utils'], function(dispatcher, utils) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.handleMouseenter = function() {
		var coordinates = utils.offset(this);
		var self = this;

		dispatcher.dispatch({
			type: 'show-tooltip',
			id: self._id,
			coordinates: {
				left: coordinates.left + self.clientWidth/2,
				top : coordinates.top
			}
		});
	}
	elementProto.handleMouseleave = function() {
		var self = this;
		dispatcher.dispatch({
			type: 'hide-tooltip',
			id: self._id
		});
	}

	elementProto.createdCallback = function() {
		this.handleMouseenter = this.handleMouseenter.bind(this);
		this.handleMouseleave = this.handleMouseleave.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._id = this.getAttribute('data-id');
		this.addEventListener('mouseenter', this.handleMouseenter);
		this.addEventListener('mouseleave', this.handleMouseleave);
	}
	elementProto.detachedCallback = function() {
		this.removeEventListener('mouseenter', this.handleMouseenter);
		this.removeEventListener('mouseleave', this.handleMouseleave);
	}

	document.registerElement('tooltip-hover', {
		prototype: elementProto
	});
});