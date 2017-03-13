define(['dispatcher', 'form/form.store', 'utils'], function(dispatcher, formStore, utils) {
	"use strict";

	var elementProto = Object.create(HTMLFormElement.prototype);
	var idName = 'form-';
	var idNum = 0;

	elementProto.handleStore = function() {
		var storeData = formStore.getData().items[this._id];

		if (!storeData) return;
		if (storeData.status === this._status) return;

		this._status = storeData.status;
		this.classList.remove('waiting');
		this.classList.remove('sending');
		this.classList.remove('submitted');
		this.classList.add(this._status);
	}

	elementProto.handleSubmit = function(e) {
		var data;
		var action = this.action;
		var self = this;

		if (!FormData) return;

		e.preventDefault();

		this.validate();

		if (this._status !== 'waiting') {
			return;
		}

		data = new FormData(this);

		dispatcher.dispatch({
			type: 'form-validate',
			id: this._id
		});

		if (!this._valid) return;

		dispatcher.dispatch({
			type: 'form-send',
			id: this._id
		});


		utils.http.post(data).then(function(response) {
			var json = JSON.parse(response);
			dispatcher.dispatch({
				type: 'form-submit',
				id: self._id,
				response: json
			});
			dispatcher.dispatch({
				type: 'form-responce',
				response: json,
				id: self._id
			});

			if (json.hasOwnProperty('status') && json.status === 'success') {
				self.classList.add('hidden');
			} else if (!json.hasOwnProperty('status') || json.status === 'error' || json.status === 'success-reset') {
				self.classList.add('hidden');
				setTimeout(function() {
					self.classList.remove('hidden');
					dispatcher.dispatch({
						type: 'form-reset',
						id: self._id
					});
				}, 3000);
			}
		});
	}

	elementProto.validate = function() {
		this._valid = true;
	}
	elementProto.invalidate = function() {
		this._valid = false;
	}

	elementProto.createdCallback = function() {
		this._status = null;
		this._valid = true;

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleStore = this.handleStore.bind(this);
		this.validate = this.validate.bind(this);
		this.invalidate = this.invalidate.bind(this);
	}
	elementProto.attachedCallback = function() {
		this._id = this.getAttribute('data-id');
		if (!this._id) {
			idNum++;
			this._id = idName + idNum;
			this.setAttribute('data-id', this._id);
		}

		dispatcher.dispatch({
			type: 'form-add',
			id: this._id
		});

		this.handleStore();

		this.addEventListener('submit', this.handleSubmit);
		formStore.subscribe(this.handleStore);
	}
	elementProto.detachedCallback = function() {
		this.removeEventListener('submit', this.handleSubmit);
		formStore.unsubscribe(this.handleStore);
	}

	document.registerElement('form-component', {
		prototype: elementProto,
		extends: 'form'
	});
});