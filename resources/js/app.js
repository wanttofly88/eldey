"use strict";

var __path;
var pathElements =  document.getElementsByName('resources-path');
if (pathElements && pathElements.length) {
	__path = pathElements[0].content;
} else {
	__path = document.getElementsByTagName('head')[0].getAttribute('data-path');
}

if (__path.slice(-1) !== '/') __path += '/';

require.config({
	baseUrl: __path + 'js/modules',
	paths: {
		snap: '../libs/snap',
		d3: '../libs/d3'
	},
	shim: {
	}
});


require([
	'slider/tri-slider.component',
	'slider/compare-slider.component',
	'decor/arc-text.component',
	'tabs/tabs-switches.component',
	'tabs/tabs.component',
	'directional-scroll/directional-scroll-2.component',
	'directional-scroll/curve-2.component',
	'directional-scroll/bird.component',
	'trees/tree.component',
	'blog/post-preview.component',
	'img/img.component',
	'img/div.component',
	'preloader/preloader-helper.component',
	'trigger/scroll-trigger.component',
	'trigger/timer-trigger.component',
	'trigger/simple-trigger.component',
	'form/form.component',
	'form/response.component',
	'form/input-wrapper.component',
	'popup/popup-toggle.component',
	'popup/popup.component',
	'popup/popup.helper',
	'tooltip/tooltip-helper.component',
	'tooltip/tooltip.component',
	'tooltip/tooltip-hover.component',
	'map/map.component'
]);