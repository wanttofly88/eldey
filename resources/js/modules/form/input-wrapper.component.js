define(['dispatcher', 'utils'], function(dispatcher, utils) {
	"use strict";

	var elementProto = Object.create(HTMLLabelElement.prototype);

	elementProto.handleDispatcher = function(e) {
		if (e.type === 'form-send') {
			if (e.id !== this._formId) return;

			console.log(this._input);
		}
	}

	elementProto.handleInput = function() {
		console.log(111);
		var self = this;
		this._input.setCustomValidity('');
		setTimeout(function() {
			self._input.setCustomValidity('');
		}, 20);
	}

	elementProto.handleInvalid = function() {
		if (this._input.value === '') {
			this._input.setCustomValidity(this._defaultError);
		} else {
			this._input.setCustomValidity(this._invalidError || this._defaultError);
		}
	}

	elementProto.createdCallback = function() {
		this.handleDispatcher = this.handleDispatcher.bind(this);
		this.handleInvalid = this.handleInvalid.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._input = this.getElementsByTagName('input')[0];
		if (!this._input) {
			this._input = this.getElementsByTagName('textarea')[0];
		}
		if (!this._input) {
			this._input = this.parentNode.getElementsByTagName('input')[0];
		}
		if (!this._input) { // just give up already
			return;
		}

		this._form = this.closest('form');
		this._formId = this._form.getAttribute('data-id');
		this._defaultError = this._input.getAttribute('data-default-error');
		this._invalidError = this._input.getAttribute('data-invalid-error');

		this._input.addEventListener('invalid', this.handleInvalid);
		this._input.addEventListener('input', this.handleInput);
		dispatcher.subscribe(this.handleDispatcher);
	}
	elementProto.detachedCallback = function() {
		this._input.removeEventListener('invalid', this.handleInvalid);
		this._input.removeEventListener('input', this.handleInput);
		dispatcher.unsubscribe(this.handleDispatcher);
	}

	document.registerElement('input-wrapper', {
		prototype: elementProto,
		extends: 'label'
	});
});