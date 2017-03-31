define([
	'dispatcher',
	'utils',
	'router/router.store'
], function(
	dispatcher,
	utils,
	store
) {
	"use strict";

	var isTransitioning = false;
	var tmpTransitionData = null;
	var steps = {}
	var tmpDocument = null;
	var routingByHistory = false;
	var ie = utils.getIEVersion();


	var _check = function(step) {
		steps[step].current++;
		if (steps[step].current >= steps[step].total) {
			dispatcher.dispatch({
				type: 'page-transition:step-' + step + '-complete'
			});
		}
	}

	var _fetch = function(href) {
		utils.http(href).get().then(function(responce) {
			var newTitle;

			tmpDocument = document.createElement('div');
			tmpDocument.innerHTML = responce;
			
			dispatcher.dispatch({
				type: 'page-transition:check',
				step: 1
			});
		});
	}

	var _route = function(e) {
		if (ie > -1 && ie < 11) {
			window.location.href = e.href;
			return;
		}

		tmpTransitionData = e.transitionData;

		dispatcher.dispatch({
			type: 'router-page-change',
			href: e.href
		});

		dispatcher.dispatch({
			type: 'page-transition:start',
			transitionData: e.transitionData
		});

		_fetch(e.href);
	}

	var _replace = function() {
		var title;
		var titleValue;
		var containers;
		var url = store.getData().page.href;

		var replaceConteiner = function(container) {
			var id = container.getAttribute('data-id');
			var newContainer;

			if (!id) {
				console.warn('data-id attribute is missing');
				return;
			}

			newContainer = tmpDocument.querySelector('.replaceable[data-id="' + id + '"]');
			
			if (!newContainer) {
				console.warn('unable to find container with data-id ' + id + ' on fetched document');
				return;
			}

			container.innerHTML = newContainer.innerHTML;
		}

		if (!tmpDocument) return;

		containers = document.getElementsByClassName('replaceable');
		title = tmpDocument.getElementsByTagName('title')[0];
		titleValue = title.innerHTML;

		Array.prototype.forEach.call(containers, function(container) {
			replaceConteiner(container);
		});

		document.title = titleValue;

		if (!routingByHistory && window.history) {
			window.history.pushState({url: url}, titleValue, url);
		}

		dispatcher.dispatch({
			type: 'page-transition:check',
			step: 2
		});

		setTimeout(function() {
			dispatcher.dispatch({
				type: 'page-mutated'
			});
		}, 0);
	}

	var _handleDispatcher = function(e) {
		if (e.type === 'route') {
			if (isTransitioning) return;

			if (e.byHistory) {
				routingByHistory = true;
			} else {
				routingByHistory = false;
			}

			isTransitioning = true;
			_route(e);
		}
		if (e.type === 'page-transition:check') {
			_check(e.step);
		}
		if (e.type === 'page-transition:step-1-complete') {
			_replace();
		}
		if (e.type === 'page-transition:step-2-complete') {
			dispatcher.dispatch({
				type: 'page-transition:end',
				transitionData: tmpTransitionData
			});

			isTransitioning = false;
			_reset();
		}
		if (e.type === 'page-transition:step-3-complete') {

		}
	}

	var _handleHistory = function(e) {
		var url = e.state.url;
		e.preventDefault();
		if (!url) return;

		dispatcher.dispatch({
			type: 'route',
			href: url,
			byHistory: true
		});
	}

	var _reset = function() {
		steps = {
			1: {
				current: 0,
				total: 2
			},
			2: {
				current: 0,
				total: 1
			},
			3: {
				current: 0,
				total: 1
			}
		}
	}

	var _init = function() {
		var url = location.origin + location.pathname;

		var ie = utils.getIEVersion();

		if (ie > -1 && ie < 11) {
			return;
		}

		if (window.history) {
			window.history.replaceState({url: url}, false, url);
		}

		dispatcher.dispatch({
			type: 'router-page-change',
			href: url
		});

		window.onpopstate = _handleHistory;
		dispatcher.subscribe(_handleDispatcher);

		_reset();
	}

	_init()
});