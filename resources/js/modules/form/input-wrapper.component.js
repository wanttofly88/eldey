define(['dispatcher', 'utils'], function(dispatcher, utils) {
	"use strict";

	var elementProto = Object.create(HTMLLabelElement.prototype);
	var idNum = 1;
	var idName = 'input-wrapper-';

	elementProto.showError = function(type) {
		var text;
		var self = this;

		var coordinates = {
			left: this.clientWidth/2,
			top: this.parentNode.offsetTop - 10
		}

		if (type === 'required') {
			text = this._requiredError;
		} else if (type === 'invalid') {
			text = this._invalidError;
		}

		dispatcher.dispatch({
			type: 'show-tooltip',
			id: self._id,
			coordinates: coordinates,
			text: text,
			parent: this.parentNode.parentNode.getElementsByClassName('tooltips')[0]
		});
	}

	elementProto.handleDispatcher = function(e) {
		var errorType = null;

		if (e.type === 'form-validate') {
			if (e.id !== this._formId) return;
		
			if (this._input.type === 'checkbox') {
				if (this._input.getAttribute('required') !== null) {
					if (!this._input.checked) {
						this._input.value === 'off';
						this._form.invalidate();
						this.classList.add('error');

						errorType = 'required';
					} else {
						this._input.value === 'on';
					}
				}
			} else {
				if (this._input.getAttribute('required') !== null) {
					if (!this._input.value) {
						this._form.invalidate();
						this.classList.add('error');

						errorType = 'required';
					}
				}

				if (this._input.getAttribute('pattern') !== null) {

				}
			}

			if (errorType) {
				this.showError(errorType);
			}
		}
	}

	elementProto.handleInput = function() {
		var self = this;
		this.classList.remove('error');
		dispatcher.dispatch({
			type: 'hide-tooltips-all'
		});
	}

	elementProto.handleChange = function() {
		var self = this;
		this.classList.remove('error');
		dispatcher.dispatch({
			type: 'hide-tooltips-all'
		});
	}

	elementProto.handleFocus = function() {
		var self = this;
		this.classList.remove('error');
		this.classList.add('focus');
		dispatcher.dispatch({
			type: 'hide-tooltips-all'
		});
	}

	elementProto.handleBlur = function() {
		this.classList.remove('focus');
	}

	elementProto.createdCallback = function() {
		this.handleDispatcher = this.handleDispatcher.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.showError = this.showError.bind(this);
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

		this._id = this.getAttribute('data-id');
		if (!this._id) {
			this._id = idName + idNum;
			idNum++;
		}

		this._requiredError = this._input.getAttribute('data-required-error');
		this._invalidError = this._input.getAttribute('data-invalid-error');

		console.log(this._requiredError);

		this._form = this.closest('form');
		this._formId = this._form.getAttribute('data-id');

		if (this._input.type === 'checkbox') {
			this._input.addEventListener('change', this.handleChange);
		} else {
			this._input.addEventListener('input', this.handleInput);
			this._input.addEventListener('focus', this.handleFocus);
			this._input.addEventListener('blur', this.handleBlur);
		}

		dispatcher.subscribe(this.handleDispatcher);
	}
	elementProto.detachedCallback = function() {
		if (this._input.type === 'checkbox') {
			this._input.removeEventListener('change', this.handleChange);
		} else {
			this._input.removeEventListener('input', this.handleInput);
			this._input.removeEventListener('focus', this.handleFocus);
			this._input.removeEventListener('blur', this.handleBlur);
		}
		dispatcher.unsubscribe(this.handleDispatcher);
	}

	document.registerElement('input-wrapper', {
		prototype: elementProto,
		extends: 'label'
	});
});