define([
	'dispatcher',
	'trigger/trigger.prototype'
], function(
	dispatcher,
	triggerPrototype
) {
	"use strict";

	var elementProto = Object.create(triggerPrototype);

	elementProto.createdCallback = function() {
		triggerPrototype.createdCallback.apply(this);
	}
	elementProto.attachedCallback = function() {
		triggerPrototype.attachedCallback.apply(this);
	}
	elementProto.detachedCallback = function() {
		triggerPrototype.detachedCallback.apply(this);
	}

	document.registerElement('simple-trigger', {
		prototype: elementProto,
		extends: 'div'
	});
});