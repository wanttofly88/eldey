define([
	'dispatcher',
	'snap',
	'resize/resize.store',
	'scroll/scroll.store',
	'directional-scroll/directional-scroll.store',
	'utils'
], function(
	dispatcher,
	Snap,
	resizeStore,
	scrollStore,
	dScrollStore,
	utils
) {
	"use strict";

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.handleResize = function() {
		var pw = document.getElementsByClassName('page-wrapper')[0];
		this.style.width = resizeStore.getData().width * 8 + 'px';
		this.style.height = pw.clientHeight + 'px';
	}
	elementProto.handleScroll = function() {
		var wh = resizeStore.getData().height;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		var TOP_SHIFT = dScrollStore.getData().TOP_SHIFT;

		var x = dScrollStore.getData().x;
		var y = dScrollStore.getData().y;

		this.style.transform = 'translateX(' + -(x - LEFT_SHIFT) + 'px) translateY(' + -(y - TOP_SHIFT - wh) + 'px)';
	}

	elementProto.buildPath = function() {
		var sec;
		var ww = resizeStore.getData().width;
		var wh = resizeStore.getData().height;

		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		var TOP_SHIFT = dScrollStore.getData().TOP_SHIFT;
		var RADIUS = dScrollStore.getData().RADIUS;
		var SECTION_PADDING = dScrollStore.getData().SECTION_PADDING;

		var l = LEFT_SHIFT;
		var points = [];
		var t1, t2, l1, l2;

		var curvePoints = {};
		var offs;

		sec = document.getElementById('analisys');
		offs = utils.offset(sec).top;

		points.push('M' + l + ' ' + TOP_SHIFT);
		points.push('L' + l + ' ' + offs);

		t1 = (offs + RADIUS - TOP_SHIFT);
		t2 = t1 + RADIUS;
		// top to right
		points.push('C' + l + ' ' + t1 + ' ,' + l + ' ' + t2 + ' ,' + (l + RADIUS*2) + ' ' + t2);
		l = l + sec.clientHeight*2 - RADIUS*2;
		points.push('L' + l + ' ' + t2);
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		// // left to bottom
		points.push('C' + l1 + ' ' + t2 + ' ,' + l2 + ' ' + (t2 + RADIUS) + ' ,' + l2 + ' ' +  (t2 + RADIUS*2));
		curvePoints['analisys'] = {
			id: 'analisys',
			p1: offs,
			p2: t2,
			p3: offs + RADIUS*5,
			x: 0
		}

		sec = document.getElementById('focus');
		offs = utils.offset(sec).top - (wh*2 - RADIUS*2);

		l = l2;
		points.push('L' + l + ' ' + offs);
		t1 = (offs + RADIUS - TOP_SHIFT);
		t2 = t1 + RADIUS;
		points.push('C' + l + ' ' + t1 + ' ,' + l + ' ' + t2 + ' ,' + (l + RADIUS*2) + ' ' + t2);
		l = l + sec.clientHeight*2 - RADIUS*2;
		points.push('L' + l + ' ' + t2);
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		// // left to bottom
		points.push('C' + l1 + ' ' + t2 + ' ,' + l2 + ' ' + (t2 + RADIUS) + ' ,' + l2 + ' ' +  (t2 + RADIUS*2));
		curvePoints['focus'] = {
			id: 'focus',
			p1: offs,
			p2: t2,
			p3: offs + RADIUS*4,
			x: wh*2
		}

		return {
			string: points.join(' '),
			curvePoints: curvePoints
		};
	}

	elementProto.createdCallback = function() {
		this.handleScroll = this.handleScroll.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}
	elementProto.attachedCallback = function() {
		var svg = Snap("#svg");
		var pathData = this.buildPath();

		this._svg = svg;
		this._lines = [];

		this.handleResize();

		this._path = svg.path(pathData.string);
		this._path.attr({
			stroke: "#929191",
			strokeWidth: 1.5,
			strokeDasharray: "1.5, 3.5",
			fill: 'none'
		});

		dispatcher.dispatch({
			type: 'dScroll:path-change',
			path: this._path,
			curvePoints: pathData.curvePoints
		});

		dScrollStore.subscribe(this.handleScroll);
	}
	elementProto.detachedCallback = function() {
		dScrollStore.unsubscribe(this.handleScroll);
	}

	Object.setPrototypeOf(elementProto, HTMLElement.prototype);
	document.registerElement('curve-container', {
		prototype: elementProto
	});
});