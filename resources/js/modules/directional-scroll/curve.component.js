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

		this.style.width = resizeStore.getData().width * 3 + 'px';
		this.style.height = pw.clientHeight + 'px';

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
				curvePoints: pathData.curvePoints
			});

			self.handleScroll();
		}, 50);
	}

	elementProto.handleScroll = function() {
		var wh = resizeStore.getData().height;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		var TOP_SHIFT = dScrollStore.getData().TOP_SHIFT;

		var x = dScrollStore.getData().x;
		var y = dScrollStore.getData().y;

		this.style.transform = 'translateX(' + -(x - LEFT_SHIFT) + 'px) translateY(' + -(y - TOP_SHIFT - wh) + 'px)';
	}

	elementProto.curveTo = function(points, l, t, w, direction) {
		var mult = direction === 'right' ? 1 : -1;
		var t1, t2, l1, l2;
		var RADIUS = dScrollStore.getData().RADIUS;

		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		l1 = l + mult*RADIUS;
		l2 = l1 + mult*RADIUS;
		// top to horisontal
		points.push('L' + l + ' ' + t);
		points.push('C' + l + ' ' + t1 + ' ,' + l + ' ' + t2 + ' ,' + l2 + ' ' + t2);
		l = l + w;
		points.push('L' + l + ' ' + t2);
		t = t2;
		l1 = l + mult*RADIUS;
		l2 = l1 + mult*RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		// horisontal to bottom
		points.push('C' + l2 + ' ' + t + ' ,' + l2 + ' ' + t1 + ' ,' + l2 + ' ' +  t2);


		return {
			l: l2, 
			t: t2
		}
	}

	elementProto.buildPath = function() {
		var sec;
		var ww = resizeStore.getData().width;
		var wh = resizeStore.getData().height;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT;
		var TOP_SHIFT = dScrollStore.getData().TOP_SHIFT;
		var RADIUS = dScrollStore.getData().RADIUS;
		var SECTION_PADDING = dScrollStore.getData().SECTION_PADDING;
		var intermediateResult;

		var l = LEFT_SHIFT;
		var t;
		var points = [];
		var t1, t2, l1, l2;

		var curvePoints = {};
		var offs;
		var magic = wh*2 - RADIUS*2 + 106; // I'm not sure why 106. So this is some kind of logical duct tape I gusess.

		sec = document.getElementById('analisys');

		if (sec) {
			offs = utils.offset(sec).top;

			points.push('M' + l + ' ' + 0);
			points.push('L' + l + ' ' + offs);

			t = offs;
			intermediateResult = this.curveTo(points, l, t, sec.clientHeight*2 - RADIUS*2, 'right');
			curvePoints['analisys'] = {
				id: 'analisys',
				p1: offs,
				p2: offs + RADIUS*2,
				p3: offs + RADIUS*4,
				x: 0
			}
		}

		sec = document.getElementById('focus');

		if (sec) {
			offs = utils.offset(sec).top - magic;

			l = intermediateResult.l;
			t = offs;
			intermediateResult = this.curveTo(points, l, t, - sec.clientHeight*2 + RADIUS*2, 'left');
			curvePoints['focus'] = {
				id: 'focus',
				p1: offs,
				p2: offs + RADIUS*2,
				p3: offs + RADIUS*4,
				x: wh*2
			}
		}

		sec = document.getElementById('result');

		if (sec) {
			offs = utils.offset(sec).top - magic*2;

			l = intermediateResult.l;
			t = offs;
			intermediateResult = this.curveTo(points, l, t, sec.clientHeight*2 - RADIUS*2, 'right');
			curvePoints['result'] = {
				id: 'result',
				p1: offs,
				p2: offs + RADIUS*2,
				p3: offs + RADIUS*4,
				x: 0
			}
		}

		sec = document.getElementsByClassName('page-wrapper')[0];
		offs = sec.clientHeight;
		l = l = intermediateResult.l;
		points.push('L' + l + ' ' + offs);

		return {
			string: points.join(' '),
			curvePoints: curvePoints
		};
	}

	elementProto.buildVisiblePath = function() {
		var sec;
		var ww = resizeStore.getData().width;
		var wh = resizeStore.getData().height;
		var LEFT_SHIFT = dScrollStore.getData().LEFT_SHIFT + 2;
		var TOP_SHIFT = dScrollStore.getData().TOP_SHIFT;
		var RADIUS = dScrollStore.getData().RADIUS;
		var SECTION_PADDING = dScrollStore.getData().SECTION_PADDING;
		var intermediateResult;

		var l = ww/2;
		var t = wh/2;
		var points = [];
		var t1, t2, l1, l2;
		var fromCenter = 150;
		var offs;

		var magic = wh*2 - RADIUS*2 + 106;

		t = wh/2 + fromCenter;

		l2 = ww - LEFT_SHIFT - RADIUS*2;
		l1 = LEFT_SHIFT;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;

		points.push('M' + l + ' ' + t);
		points.push('L' + l2 + ' ' + t);

		l = ww - LEFT_SHIFT;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		points.push('C' + l + ' ' + t + ', ' + l +  ' ' + t1 + ', ' + l + ' ' + t2);

		sec = document.getElementById('question-point');

		if (sec) {
			offs = utils.offset(sec).top;
			t = offs - RADIUS*2 - 100;
			l = ww - LEFT_SHIFT;

			intermediateResult = this.curveTo(points, l, t, - ww + 2*LEFT_SHIFT + 2*RADIUS, 'left');
		}

		sec = document.getElementById('analisys');

		if (sec) {
			offs = utils.offset(sec).top;
			l = LEFT_SHIFT;
			t = offs - wh/2 + fromCenter;

			intermediateResult = this.curveTo(points, l, t, sec.clientHeight*2 - RADIUS*2, 'right');
		}

		sec = document.getElementById('gain-point');

		if (sec) {
			offs = utils.offset(sec).top - magic - 100;
			t = offs - RADIUS*2;
			l = intermediateResult.l;

			intermediateResult = this.curveTo(points, l, t, ww - 2*LEFT_SHIFT - 2*RADIUS, 'right');
		}

		sec = document.getElementById('focus');

		if (sec) {
			offs = utils.offset(sec).top - magic - wh/2 + fromCenter;
			l = intermediateResult.l;
			t = offs;

			intermediateResult = this.curveTo(points, l, t, - (sec.clientHeight*2 + RADIUS*2) - (ww - (LEFT_SHIFT + 2*RADIUS)*2), 'left');
		}

		sec = document.getElementById('result');

		if (sec) {
			offs = utils.offset(sec).top - magic*2;
			l = LEFT_SHIFT;
			t = offs - 100;

			intermediateResult = this.curveTo(points, l, t, sec.clientHeight*2 - RADIUS*2, 'right');
		}

		sec = document.getElementsByTagName('footer')[0];
		offs = utils.offset(sec).top - magic*3;
		l = intermediateResult.l;
		t = offs - RADIUS*2 - 100;
		l1 = l + RADIUS/2;
		l2 = l1 + ww/10;
		t1 = t + RADIUS;
		t2 = t1 + ww/10;
		points.push('L' + l + ' ' + t);
		points.push('C' + l + ' ' + t1 + ', ' + l +  ' ' + t2 + ', ' + l2 + ' ' + t2);
		l = l2 - ww/10 + RADIUS/2;
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
		this.resizeTo;
	}
	elementProto.attachedCallback = function() {
		var svg = Snap("#svg");
		var pathData = this.buildPath();
		var self = this;

		this._svg = svg;
		this._lines = [];

		this.handleResize();

		this._path = svg.path(pathData.string);
		this._path.attr({
			stroke: 'none',
			fill: 'none'
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
			curvePoints: pathData.curvePoints
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