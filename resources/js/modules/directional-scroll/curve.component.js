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
		var t;
		var points = [];
		var t1, t2, l1, l2;

		var curvePoints = {};
		var offs;
		var magic = wh*2 - RADIUS*2 + 106;

		sec = document.getElementById('analisys');
		offs = utils.offset(sec).top;

		points.push('M' + l + ' ' + 0);
		points.push('L' + l + ' ' + offs);

		t = offs;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		// top to right
		points.push('C' + l + ' ' + t1 + ' ,' + l + ' ' + t2 + ' ,' + l2 + ' ' + t2);
		l = l + sec.clientHeight*2 - RADIUS*2;
		points.push('L' + l + ' ' + t2);
		t = t2;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		// // left to bottom
		points.push('C' + l2 + ' ' + t + ' ,' + l2 + ' ' + t1 + ' ,' + l2 + ' ' +  t2);
		curvePoints['analisys'] = {
			id: 'analisys',
			p1: offs,
			p2: offs + RADIUS*2,
			p3: offs + RADIUS*4,
			x: 0
		}

		sec = document.getElementById('focus');
		offs = utils.offset(sec).top - magic;

		l = l2;
		t = offs;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		l1 = l - RADIUS;
		l2 = l1 - RADIUS;
		points.push('L' + l + ' ' + offs);
		points.push('C' + l + ' ' + t1 + ' ,' + l + ' ' + t2 + ' ,' + l2 + ' ' + t2);
		l = l - sec.clientHeight*2 + RADIUS*2;
		points.push('L' + l + ' ' + t2);
		t = t2;
		l1 = l - RADIUS;
		l2 = l1 - RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('C' + l2 + ' ' + t + ' ,' + l2 + ' ' + t1 + ' ,' + l2 + ' ' +  t2);
		curvePoints['focus'] = {
			id: 'focus',
			p1: offs,
			p2: offs + RADIUS*2,
			p3: offs + RADIUS*4,
			x: wh*2
		}

		sec = document.getElementById('result');
		offs = utils.offset(sec).top - magic*2;
		l = l2;
		t = offs;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		points.push('L' + l + ' ' + offs);
		points.push('C' + l + ' ' + t1 + ' ,' + l + ' ' + t2 + ' ,' + l2 + ' ' + t2);
		l = l + sec.clientHeight*2 - RADIUS*2;
		points.push('L' + l + ' ' + t2);
		t = t2;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('C' + l2 + ' ' + t + ' ,' + l2 + ' ' + t1 + ' ,' + l2 + ' ' +  t2);
		curvePoints['result'] = {
			id: 'result',
			p1: offs,
			p2: offs + RADIUS*2,
			p3: offs + RADIUS*4,
			x: 0
		}

		sec = document.getElementsByClassName('page-wrapper')[0];
		offs = sec.clientHeight;
		l = l2;
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

		var l = ww/2;
		var t = wh/2;
		var points = [];
		var t1, t2, l1, l2;
		var fromCenter = 150;
		var offs;

		var magic = wh*2 - RADIUS*2 + 106;

		t = wh/2 + fromCenter;

		l2 = LEFT_SHIFT + RADIUS*2;
		l1 = LEFT_SHIFT;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;

		points.push('M' + l + ' ' + t);
		points.push('L' + l2 + ' ' + t);

		l = LEFT_SHIFT;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		points.push('C' + l + ' ' + t + ', ' + l +  ' ' + t1 + ', ' + l + ' ' + t2);

		sec = document.getElementById('analisys');
		offs = utils.offset(sec).top;
		l = LEFT_SHIFT;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		t = offs - wh/2 + fromCenter;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('L' + l + ' ' + t);
		points.push('C' + l + ' ' + t1 + ', ' + l +  ' ' + t2 + ', ' + l2 + ' ' + t2);

		l = l + sec.clientHeight*2 - RADIUS*2;
		t = t2;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('L' + l + ' ' + t);
		points.push('C' + l2 + ' ' + t + ', ' + l2 +  ' ' + t2 + ', ' + l2 + ' ' + t2);

		sec = document.getElementById('gain-point');
		offs = utils.offset(sec).top - magic - 100;
		t = offs - RADIUS*2;
		l = l2;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		t1 =  t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('L' + l + ' ' + t);
		points.push('C' + l + ' ' + t1 + ', ' + l +  ' ' + t2 + ', ' + l2 + ' ' + t2);

		l = l2 + ww - (LEFT_SHIFT + 2*RADIUS)*2;
		t = t2;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('L' + l + ' ' + t);
		points.push('C' + l2 + ' ' + t + ', ' + l2 +  ' ' + t1 + ', ' + l2 + ' ' + t2);

		sec = document.getElementById('focus');
		offs = utils.offset(sec).top - magic - wh/2 + fromCenter;
		l = l2;
		t = offs;
		l1 = l - RADIUS;
		l2 = l1 - RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('L' + l + ' ' + t);
		points.push('C' + l + ' ' + t1 + ', ' + l +  ' ' + t2 + ', ' + l2 + ' ' + t2);
		l = l - (sec.clientHeight*2 + RADIUS*2) - (ww - (LEFT_SHIFT + 2*RADIUS)*2);
		t = t2;
		l1 = l - RADIUS;
		l2 = l1 - RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('L' + l + ' ' + t);
		points.push('C' + l2 + ' ' + t + ', ' + l2 +  ' ' + t1 + ', ' + l2 + ' ' + t2);

		sec = document.getElementById('result');
		offs = utils.offset(sec).top - magic*2;
		l = LEFT_SHIFT;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		t = offs - 100;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('L' + l + ' ' + t);
		points.push('C' + l + ' ' + t1 + ', ' + l +  ' ' + t2 + ', ' + l2 + ' ' + t2);
		l = l + sec.clientHeight*2 - RADIUS*2;
		t = t2;
		l1 = l + RADIUS;
		l2 = l1 + RADIUS;
		t1 = t + RADIUS;
		t2 = t1 + RADIUS;
		points.push('L' + l + ' ' + t);
		points.push('C' + l2 + ' ' + t + ', ' + l2 +  ' ' + t2 + ', ' + l2 + ' ' + t2);

		return {
			string: points.join(' ')
		};
	}

	elementProto.createdCallback = function() {
		this.handleScroll = this.handleScroll.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}
	elementProto.attachedCallback = function() {
		var svg = Snap("#svg");
		var pathData = this.buildPath();
		var self = this;

		this._svg = svg;
		this._lines = [];


		self.handleResize();

		self._path = svg.path(pathData.string);
		self._path.attr({
			stroke: 'none',
			fill: 'none'
		});

		self._visiblePath = svg.path(self.buildVisiblePath().string);
		self._visiblePath.attr({
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
		dScrollStore.subscribe(self.handleScroll);


		
	}
	elementProto.detachedCallback = function() {
		dScrollStore.unsubscribe(this.handleScroll);
	}

	Object.setPrototypeOf(elementProto, HTMLElement.prototype);
	document.registerElement('curve-container', {
		prototype: elementProto
	});
});