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
		var pathData = this.buildPath();
		var self = this;

		var ww = resizeStore.getData().width;
		var wh = resizeStore.getData().height;
		if (ww < 1450 || wh < 500) return;

		this.style.width = resizeStore.getData().width * 5 + 'px';
/*		this.style.height = pw.clientHeight + 'px';
*/
		clearTimeout(this.resizeTo);

		this.resizeTo = setTimeout(function() {
			if (self._path) {
				self._path.attr({
					d: pathData.string,
				});
			}

			if (self._visiblePath) {
				self._visiblePath.attr({
					d: self.buildVisiblePath().string,
				});
			}

			dispatcher.dispatch({
				type: 'dScroll:path-change',
				path: self._path,
				visiblePath: self._visiblePath,
				curvePoints: pathData.curvePoints,
				scrollPoints: pathData.scrollPoints
			});

			self.handleScroll();
		}, 50);
	}

	elementProto.handleScroll = function() {
		// var wh = resizeStore.getData().height;
		// var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		// var TOP_SHIFT = dScrollStore.getData().TOP_SHIFT;

		// var x = dScrollStore.getData().x;
		// var y = dScrollStore.getData().y;

		// this.style.transform = 'translateX(' + -(x - LEFT_SHIFT) + 'px) translateY(' + -(y - TOP_SHIFT - wh) + 'px)';
	}

	elementProto.curveTo = function(points, l, t, w, direction, noStart) {
		var mult = direction === 'right' ? 1 : -1;
		var t1, t2, l1, l2;
		var RADIUS = dScrollStore.getData().RADIUS;
		var startLength = 0;
		var endLength = 0;
		var curve;

		t1 = t2 = t;

		// top to horisontal
		if (noStart !== true) {
			t1 = t + RADIUS;
			t2 = t1 + RADIUS;
			l1 = l + mult*RADIUS;
			l2 = l1 + mult*RADIUS;
			points.push('L' + l + ' ' + t);
			points.push('C' + l + ' ' + t1 + ' ,' + l + ' ' + t2 + ' ,' + l2 + ' ' + t2);
			curve = this._svg.path(points.join(' '));
			startLength = curve.getTotalLength();
			curve.remove();
		}

		l = l + w;
		points.push('L' + l + ' ' + t2);

		if (noStart !== true) {
			t = t2;
		}

		l1 = l + mult*RADIUS;
		l2 = l1 + mult*RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		// horisontal to bottom
		points.push('C' + l2 + ' ' + t + ' ,' + l2 + ' ' + t1 + ' ,' + l2 + ' ' +  t2);

		curve = this._svg.path(points.join(' '));
		endLength = curve.getTotalLength();
		curve.remove();

		return {
			l: l2, 
			t: t2,
			startLength: startLength,
			endLength: endLength
		}
	}

	elementProto.buildPath = function() {
		var sec;
		// var ww = resizeStore.getData().width;
		var wh = resizeStore.getData().height;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		var TOP_SHIFT = dScrollStore.getData().TOP_SHIFT;
		var RADIUS = dScrollStore.getData().RADIUS;
		var SECTION_PADDING = dScrollStore.getData().SECTION_PADDING;
		var intermediateResult;
		var pw = document.getElementsByClassName('page-wrapper')[0];
		var ww = pw.clientWidth;
		var previousLength = 0;

		var l = LEFT_SHIFT;
		var t;
		var points = [];
		var t1, t2, l1, l2;

		var curvePoints = {};
		var offs;
		var footer = document.getElementsByTagName('footer')[0];
		var scrollPoints = [];

		t = wh;

		points.push('M' + l + ' ' + wh);

		intermediateResult = this.curveTo(points, l, t, ww - RADIUS*2, 'right', true);
		scrollPoints.push([
			intermediateResult.startLength,
			intermediateResult.endLength,
			intermediateResult.startLength,
			intermediateResult.endLength - 400
		]);

 
		sec = document.getElementById('analisys');


		if (sec) {
			offs = sec.offsetTop + sec.clientHeight -  RADIUS*4;

			l = intermediateResult.l;
			t = offs + RADIUS*2;
			intermediateResult = this.curveTo(points, l, t, ww*2 - RADIUS*2, 'right');
		}

		scrollPoints.push([
			intermediateResult.startLength,
			intermediateResult.endLength - ww - 135,
			intermediateResult.startLength - 400,
			intermediateResult.endLength - ww - 135
		]);

		scrollPoints.push([
			intermediateResult.endLength - ww - 125,
			intermediateResult.endLength,
			intermediateResult.endLength - ww - 125,
			intermediateResult.endLength - 400,
		]);


		sec = document.getElementById('focus');

		if (sec) {
			offs = sec.offsetTop + sec.clientHeight  - RADIUS*4;

			l = intermediateResult.l;
			t = offs  + RADIUS*2;
			intermediateResult = this.curveTo(points, l, t, - ww + RADIUS*2, 'left');
		}

		scrollPoints.push([
			intermediateResult.startLength,
			intermediateResult.endLength - 505,
			intermediateResult.startLength - 400,
			intermediateResult.endLength - 505
		]);

		scrollPoints.push([
			intermediateResult.endLength - 495,
			intermediateResult.endLength + wh - 300,
			intermediateResult.endLength - 495,
			intermediateResult.endLength + wh - 700,
		]);

		sec = document.getElementById('result');

		if (sec) {
			offs = sec.offsetTop - RADIUS*4 + sec.clientHeight;

			l = intermediateResult.l;
			t = offs + RADIUS*2;
			intermediateResult = this.curveTo(points, l, t, ww*2 - RADIUS*2, 'right');
		}


		scrollPoints.push([
			intermediateResult.startLength,
			intermediateResult.endLength - ww - 135,
			intermediateResult.startLength - 400,
			intermediateResult.endLength - ww - 135
		]);

		scrollPoints.push([
			intermediateResult.endLength - ww - 125,
			intermediateResult.endLength,
			intermediateResult.endLength - ww - 125,
			intermediateResult.endLength - 400
		]);

		sec = document.getElementById('feedback');

		offs = sec.offsetTop - RADIUS*4 + sec.clientHeight + wh + footer.clientHeight + 355;
		l = l = intermediateResult.l;
		points.push('L' + l + ' ' + offs);

		// sec = document.getElementsByClassName('page-wrapper')[0];
		// offs = sec.clientHeight;
		// l = l = intermediateResult.l;
		// points.push('L' + l + ' ' + offs);

		return {
			string: points.join(' '),
			curvePoints: curvePoints,
			scrollPoints: scrollPoints
		};
	}

	elementProto.buildVisiblePath = function() {
		var sec;
		// var ww = resizeStore.getData().width;
		var wh = resizeStore.getData().height;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT + 2;
		var TOP_SHIFT = dScrollStore.getData().TOP_SHIFT;
		var RADIUS = dScrollStore.getData().RADIUS;
		var SECTION_PADDING = dScrollStore.getData().SECTION_PADDING;
		var intermediateResult;
		var pw = document.getElementsByClassName('page-wrapper')[0];
		var ww = pw.clientWidth;

		var l = ww/2;
		var t;
		var points = [];
		var t1, t2, l1, l2;
		var fromCenter = 200;
		var fromBottom = 100;

		var l = ww/2;
		var t;
		var points = [];
		var t1, t2, l1, l2;
		var offs;

		t = wh/2 + fromCenter;

		points.push('M' + l + ' ' + t);

		intermediateResult = this.curveTo(points, l, t, ww/2 - RADIUS*2 + LEFT_SHIFT, 'right', true);

		sec = document.getElementById('analisys');


		if (sec) {
			offs = sec.offsetTop  + sec.clientHeight -  RADIUS*4;

			l = intermediateResult.l;
			t = offs + RADIUS*2- fromBottom;
			intermediateResult = this.curveTo(points, l, t, ww*2 - RADIUS*2, 'right');
		}

		sec = document.getElementById('gain-point');

		if (sec) {
			offs = (sec.offsetTop + sec.parentNode.parentNode.offsetTop) - RADIUS*2;
			t = offs - 100;
			l = intermediateResult.l;

			intermediateResult = this.curveTo(points, l, t, ww - 2*LEFT_SHIFT - 2*RADIUS, 'right');
		}

		sec = document.getElementById('focus');

		if (sec) {
			offs = sec.offsetTop + sec.clientHeight - RADIUS*2;

			l = intermediateResult.l;
			t = offs - fromBottom;
			intermediateResult = this.curveTo(points, l, t, - ww + RADIUS*2 - ww + 2*LEFT_SHIFT, 'left');
		}

		sec = document.getElementById('result');

		if (sec) {
			offs = sec.offsetTop + sec.clientHeight -  RADIUS*2;

			l = intermediateResult.l;
			t = offs - fromBottom;
			intermediateResult = this.curveTo(points, l, t, ww*2 - RADIUS*2, 'right');
		}

		sec = document.getElementById('feedback');

		offs = sec.offsetTop + sec.clientHeight - 100;
		l = intermediateResult.l;
		t = offs;
		l1 = l + RADIUS/2;
		// l2 = l1 + RADIUS/2;
		l2 = l1 + ww/20;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS/2;
		// t2 = t1 + ww/10;
		// points.push('L' + l + ' ' + t);
		points.push('C' + l + ' ' + t1 + ', ' + l +  ' ' + t2 + ', ' + l2 + ' ' + t2);
		l = l2 - ww/20 + RADIUS/2;
		l1 = l + ww/3 - RADIUS - LEFT_SHIFT;
		l2 = l + ww/2 - 100 - RADIUS - LEFT_SHIFT;
		t = t2;
		t1 = t - ww/10 + 90;
		points.push('C' + l1 + ' ' + t + ', ' + l1 +  ' ' + t1 + ', ' + l2 + ' ' + t1);
		l = l2;
		t = t1;
		l1 = l;
		l2 = l + 90;
		t1 = t + 90;
		points.push('C' + l1 + ' ' + t + ', ' + (l2 - 10) +  ' ' + t + ', ' + l2 + ' ' + t1);

		return {
			string: points.join(' ')
		};
	}

	elementProto.createdCallback = function() {
		this.handleScroll = this.handleScroll.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.buildPath = this.buildPath.bind(this);
		this.buildVisiblePath = this.buildVisiblePath.bind(this);
		this.curveTo = this.curveTo.bind(this);
		this.resizeTo;
	}
	elementProto.attachedCallback = function() {
		var svg = Snap("#svg");
		var pathData;
		var self = this;

		this._svg = svg;
		this._lines = [];

		pathData = this.buildPath();

		this.handleResize();

		this._path = svg.path(pathData.string);
		this._path.attr({
			fill: 'none',
			stroke: 'none',
			strokeWidth: 1.5,
		});

		this._visiblePath = svg.path(this.buildVisiblePath().string);
		this._visiblePath.attr({
			stroke: '#929191',
			strokeWidth: 1.5,
			strokeDasharray: '1.5, 3.5',
			fill: 'none'
		});

		dispatcher.dispatch({
			type: 'dScroll:path-change',
			path: self._path,
			curvePoints: pathData.curvePoints,
			scrollPoints: pathData.scrollPoints
		});

		dScrollStore.subscribe(this.handleScroll);
		resizeStore.subscribe(this.handleResize);
	}

	elementProto.detachedCallback = function() {
		dScrollStore.unsubscribe(this.handleScroll);
		resizeStore.unsubscribe(this.handleResize);
	}

	document.registerElement('curve-container', {
		prototype: elementProto
	});
});