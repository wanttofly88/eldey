define(['dispatcher'], function(dispatcher) {
	"use strict";

	var elementProto = Object.create(HTMLAnchorElement.prototype);

	var getMobileOperatingSystem = function() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;

		if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
			return 'iOS';
		} else if (userAgent.match(/Android/i)) {
			return 'Android';
		} else {
			return 'unknown';
		}
	}

	elementProto.createdCallback = function() {
	}
	elementProto.attachedCallback = function() {
		var lat  = this.getAttribute('data-lat')  || 0;
		var lng  = this.getAttribute('data-lng')  || 0;
		var operatingSystem = getMobileOperatingSystem();

		if (operatingSystem.toLowerCase() === 'android') {
			this.setAttribute('href', 'https://maps.google.com/?q=' + lat + ',' + lng);
		} else if (operatingSystem.toLowerCase() === 'ios') {
			this.setAttribute('href', 'https://maps.apple.com/?q=' + lat + ',' + lng);
		} else {
			this.setAttribute('href', 'https://maps.google.com/?q=' + lat + ',' + lng);
		}
	}
	elementProto.detachedCallback = function() {
	}

	document.registerElement('map-link', {
		prototype: elementProto,
		extends: 'a'
	});
});