define(['dispatcher'], function(dispatcher) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.showTooltip = function(id, coordinates, parent, text) {
		var tooltip = document.createElement('tooltip-component');
		var dataElement = this.querySelector('.data[data-id="' + id + '"]');
		var pw = document.getElementsByClassName('page-wrapper')[0];

		parent = parent || pw;

		if (!text) {
			tooltip.innerHTML = dataElement.innerHTML;
		} else {
			tooltip.innerHTML = text;
		}

		parent.appendChild(tooltip);

		tooltip.style.position = 'absolute';
		tooltip.style.left = (coordinates.left - tooltip.clientWidth/2) + 'px';
		tooltip.style.top = (coordinates.top - tooltip.clientHeight - 10) + 'px';
		tooltip.style.zIndex = 2000;

		this._tooltips[id] = tooltip;

		setTimeout(function() {
			tooltip.classList.add('active');
		}, 20);
	}
	elementProto.hideTooltip = function(id) {
		var tooltip = this._tooltips[id];

		delete this._tooltips[id];

		tooltip.classList.remove('active');

		setTimeout(function() {
			tooltip.parentNode.removeChild(tooltip);
		}, 320);
	}
	elementProto.handleDispatcher = function(e) {
		if (e.type === 'show-tooltip') {
			console.log(e);
			if (this._tooltips.hasOwnProperty(e.id)) {
				this.hideTooltip(e.id);
			}
			this.showTooltip(e.id, e.coordinates, e.parent, e.text);
		}
		if (e.type === 'hide-tooltip') {
			if (!this._tooltips.hasOwnProperty(e.id)) return;
			this.hideTooltip(e.id);
		}
		if (e.type === 'hide-tooltips-all') {
			for (var id in this._tooltips) {
				if (!this._tooltips.hasOwnProperty(id)) return;
				this.hideTooltip(id);
			}
		}
	}

	elementProto.createdCallback = function() {
		this.handleDispatcher = this.handleDispatcher.bind(this);
		this.showTooltip = this.showTooltip.bind(this);
		this.hideTooltip = this.hideTooltip.bind(this);
		this._tooltips = {};
	}
	elementProto.attachedCallback = function() {
		dispatcher.subscribe(this.handleDispatcher);
	}
	elementProto.detachedCallback = function() {
		dispatcher.unsubscribe(this.handleDispatcher);
	}

	document.registerElement('tooltip-helper', {
		prototype: elementProto
	});
});