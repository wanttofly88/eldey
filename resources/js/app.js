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
		snap: '../libs/snap'
	},
	shim: {
	}
});


require([
	'slider/tri-slider.component',
	'decor/arc-text.component',
	'tabs/tabs-switches.component',
	'tabs/tabs.component',
	'directional-scroll/directional-scroll.component',
	'directional-scroll/curve.component',
	'directional-scroll/bird.component',
	'trees/tree.component',
	'blog/post-preview.component'
]);