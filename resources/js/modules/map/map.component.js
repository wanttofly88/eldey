define(['dispatcher'], function(dispatcher) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);
	var lang;

	var loadAPI = function() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://www.google.com/jsapi?key=AIzaSyCIuYnYUScrpSJwCMtCUKM-9yVn8wT_QoM&callback=_loaderReady';
		script.setAttribute('async', '');
		document.body.appendChild(script);
	}

	window._loaderReady = function() {
		window.google.load("maps", "3", {
			"callback": _initMaps,
			"other_params": "key=AIzaSyCIuYnYUScrpSJwCMtCUKM-9yVn8wT_QoM&language=" + lang
		});
	}

	var _initMaps = function() {
		dispatcher.dispatch({
			type: 'google-maps-ready'
		});
	}

	elementProto.build = function() {
		var lat, lng, zoom;
		var id;
		var config, styles;

		if (this._ready) return;
		this._ready = true;

		id =   this.id;
		lat  = this.getAttribute('data-lat')  || 0;
		lng  = this.getAttribute('data-lng')  || 0;
		zoom = parseInt(this.getAttribute('data-zoom')) || 2;

		styles = [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}]

		config = {
			zoom: zoom,
			scrollwheel: false,
			center: new google.maps.LatLng(lat, lng)
		}

		this._map = new google.maps.Map(this, config);		
		this._map.setOptions({styles: styles});
		this.style.background = '#f7f7f7';
	}

	elementProto.handleDispatcher = function(e) {
		if (e.type === 'google-maps-ready') {
			this.build();
		}
	}

	elementProto.createdCallback = function() {
		this.build = this.build.bind(this);
		this.handleDispatcher = this.handleDispatcher.bind(this);
	}
	elementProto.attachedCallback = function() {
		var html = document.getElementsByTagName('html')[0];
		lang = html.getAttribute('lang');

		dispatcher.subscribe(this.handleDispatcher);

		if (!lang) lang = 'ru';

		if (window.google &&  window.google.maps) {
			this.build();
		} else {
			loadAPI();
		}
	}
	elementProto.detachedCallback = function() {
		dispatcher.unsubscribe(this.handleDispatcher);
	}

	document.registerElement('map-component', {
		prototype: elementProto
	});
});