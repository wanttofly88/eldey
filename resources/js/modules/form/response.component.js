define(['dispatcher'], function(dispatcher) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.handleForm = function(e) {
		var inner;
		if (e.type === 'form-response') {
			if (e.id !== this._id) return;
			inner = this.getElementsByClassName('response-inner')[0];

			if (e.response.hasOwnProperty('response') && e.response.response !== '') {
				inner.innerHTML = e.response.response;

				if (e.response.status === 'success') {
					this.classList.remove('status-error');
					this.classList.add('status-success');
					this.classList.add('active');
				}
				if (e.response.status === 'error') {
					inner.innerHTML = e.response.response;
					this.classList.add('status-error');
					this.classList.remove('status-success');
					this.classList.add('active');
				}
			} else {
				inner.innerHTML = '';
				this.classList.remove('active');
			}
		}
		if (e.type === 'form-reset') {
			if (e.id !== this._id) return;
			inner.innerHTML = '';
			this.classList.remove('active');
		}
	}

	elementProto.createdCallback = function() {
		this.handleForm = this.handleForm.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._id = this.getAttribute('data-id');
		if (!this._id) {
			console.warn('data-id attribute is missing on form-response');
			return;
		}
		dispatcher.subcribe(this.handleForm);
	}
	elementProto.detachedCallback = function() {
		dispatcher.unsubcribe(this.handleForm);
	}

	document.registerElement('form-response', {
		prototype: elementProto
	});
});