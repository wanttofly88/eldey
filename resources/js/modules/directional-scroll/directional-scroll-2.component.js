define([
	'dispatcher',
	'resize/resize.store',
	'scroll/scroll.store',
	'directional-scroll/directional-scroll.store',
	'utils'
], function(
	dispatcher,
	resizeStore,
	scrollStore,
	dScrollStore,
	utils
) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);


	elementProto.handleResize = function() {
		var ww = resizeStore.getData().width;
		var wh = resizeStore.getData().height;
		var coefX = 0;
		var coefY = 0;
		var self = this;
		var height;
		var offset;

		console.log(11);

		if (ww >= 1450 && wh >= 500) {
			this.activate();
		} else {
			this.deactivate();
		}

		if (this._active) {
			this._sections.forEach(function(section) {
				if (section.id === 'question') {
					coefX = 1;
					coefY = 1;
				}
				if (section.id === 'analisys') {
					coefX = 2;
					coefY = 2;
				}
				if (section.id === 'find') {
					coefX = 3;
					coefY = 3;
				}
				if (section.id === 'focus') {
					coefX = 2;
					coefY = 4;
				}
				if (section.id === 'result') {
					coefX = 3;
					coefY = 5;
				}
				if (section.id === 'feedback') {
					coefX = 4;
					coefY = 6;
				}

				if (section.id === 'focus') {
					section.style.left = Math.floor(coefX*ww + 284) + 'px';
				} else {
					section.style.left = Math.floor(coefX*ww) + 'px';
				}
				
				section.style.top = -Math.floor(coefY*wh) + 'px';
				//section.style.transform = 'translateX(' + Math.floor(coefX*100) + '%) translateY(' + -Math.floor(coefY*wh) + 'px)';
			});
		}
	}

	elementProto.handleDispatcher = function(e) {
		var path;
		var wh = resizeStore.getData().height;
		var curveContainer = document.getElementsByTagName('curve-container')[0];
		if (e.type === 'dScroll:path-change') {
			path = e.path;

			curveContainer.style.height = path.getTotalLength() - 150 + 'px';
			this._fake.style.height = path.getTotalLength() - 150 + 'px';

			dispatcher.dispatch({
				type: 'dScroll:container-changed'
			});
		}
	}

	elementProto.handleScroll = function() {
		var x = dScrollStore.getData().x;
		var y = dScrollStore.getData().y;
		var wh = resizeStore.getData().height;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		var main = this._mainContainer;

		this._transformWrapper.style.transform = 'translateX(' + -Math.floor(x - LEFT_SHIFT) +'px) translateY(' + -Math.floor(y - wh) + 'px) translateZ(0px)';
	}

	elementProto.activate = function() {
		if (this._active) return;
		this._active = true;

		this._transformWrapper.style.position = 'fixed';
		this._fake.style.height = resizeStore.getData().height*2 + 'px';

		this.handleResize();
		this.handleScroll();
		scrollStore.subscribe(this.handleScroll);
		dispatcher.subscribe(this.handleDispatcher);

		dispatcher.dispatch({
			type: 'dScroll:enable'
		});
	}

	elementProto.deactivate = function() {
		if (!this._active) return;
		this._active = false;

		this._sections.forEach(function(section) {
			section.style.transform = 'translateX(0px)';
		});

		this._fake.style.height = '0px';
		this._transformWrapper.style.position = 'relative';
		this._transformWrapper.style.transform = 'translateX(0px) translateY(0px)';

		scrollStore.unsubscribe(this.handleScroll);
		dispatcher.unsubscribe(this.handleDispatcher);

		dispatcher.dispatch({
			type: 'dScroll:disable'
		});
	}

	elementProto.createdCallback = function() {
		this.handleScroll = this.handleScroll.bind(this);
		this.activate = this.activate.bind(this);
		this.deactivate = this.deactivate.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleDispatcher = this.handleDispatcher.bind(this);
		this._active = false;
	}
	elementProto.attachedCallback = function() {
		var elements = this.getElementsByTagName('section');
		if (!elements) return;

		this._mainContainer = document.getElementsByTagName('main')[0];
		this._transformWrapper = document.getElementsByClassName('transform-wrapper')[0];
		this._fake = document.createElement('div');
		this._fake.className = 'fake';
		this._mainContainer.appendChild(this._fake);

		this._sections = Array.prototype.map.call(elements, function(section) {
			return section;
		});

		this.handleResize();
		resizeStore.subscribe(this.handleResize);
	}
	elementProto.detachedCallback = function() {
		this.deactivate();
		resizeStore.unsubscribe(this.handleResize);
	}

	document.registerElement('directional-scroll', {
		prototype: elementProto,
		extends: 'main'
	});
});