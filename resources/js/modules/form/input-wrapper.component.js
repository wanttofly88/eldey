define(['dispatcher', 'utils'], function(dispatcher, utils) {
	"use strict";

	var elementProto = Object.create(HTMLLabelElement.prototype);

	elementProto.handleDispatcher = function(e) {
		if (e.type === 'form-validate') {
			if (e.id !== this._formId) return;
		
			if (this._input.type === 'checkbox') {
				if (this._input.getAttribute('required') !== null) {
					if (!this._input.checked) {
						this._input.value === 'off';
						this._form.invalidate();
						this.classList.add('error');
					} else {
						this._input.value === 'on';
					}
				}
			} else {
				if (this._input.getAttribute('required') !== null) {
					if (!this._input.value) {
						this._form.invalidate();
						this.classList.add('error');
					}
				}

				if (this._input.getAttribute('pattern') !== null) {

				}
			}

		}
	}

	elementProto.handleInput = function() {
		this.classList.remove('error');
	}

	elementProto.handleChange = function() {
		console.log(111);
		this.classList.remove('error');
	}

	elementProto.handleFocus = function() {
		this.classList.remove('error');
		this.classList.add('focus');
	}

	elementProto.handleBlur = function() {
		this.classList.remove('focus');
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
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
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