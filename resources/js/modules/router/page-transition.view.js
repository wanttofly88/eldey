define(['dispatcher', 'utils'], function(dispatcher, utils) {
	"use strict";

	var _basicTransition = function() {
		var start = function (e) {
			var url =  e.transitionData.url;
			var delay = 400;
			var innerTransform = document.getElementsByClassName('inner-transform')[0];
			var footer = document.getElementsByTagName('footer')[0];
			// var main = document.getElementsByTagName('main')[0];
			innerTransform.style.opacity = 0;
			footer.style.opacity = 0;
			innerTransform.style.transform = 'translateY(' + -50 + 'px)';

			dispatcher.dispatch({
				type: 'scroll-block'
			});

			setTimeout(function() {
				dispatcher.dispatch({
					type: 'popup-close-all'
				});
			}, 200);

			setTimeout(function() {
				dispatcher.dispatch({
					type: 'preloader-reset',
					step: 1
				});
				dispatcher.dispatch({
					type: 'page-transition:check',
					step: 1
				});
			}, delay);
		}

		var end = function(e) {
			window.scrollTo(0, 0);
			var footer = document.getElementsByTagName('footer')[0];
			footer.style.opacity = 1;

			setTimeout(function() {
				dispatcher.dispatch({
					type: 'scroll-unblock'
				});
				dispatcher.dispatch({
					type: 'page-transition:check',
					step: 3
				});
			}, 300);
		}

		return {
			start: start,
			end: end
		}
	}();

	var _handleDispatcher = function(e) {
		if (e.type === 'page-transition:start') {
			if (!e.transitionData) {
				e.transitionData = {}
			}
			if (!e.transitionData.animation) {
				e.transitionData.animation = 'basic';
			}
			if (e.transitionData.animation === 'basic') {
				_basicTransition.start(e);
			}
		}
		if (e.type === 'page-transition:end') {
			if (!e.transitionData) {
				e.transitionData = {}
			}
			if (!e.transitionData.animation) {
				e.transitionData.animation = 'basic';
			}
			if (e.transitionData.animation === 'basic') {
				_basicTransition.end(e);
			}
		}
	}

	var _init = function() {
		dispatcher.subscribe(_handleDispatcher);
	}

	_init();
});