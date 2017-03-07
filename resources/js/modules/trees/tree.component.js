define(['dispatcher', 'snap'], function(dispatcher, Snap) {
	"use strict";

	var obj = {
		text: '',
		childs: [
			{
				text: 'Рост доходов',
				childs: [
					{
						text: 'Объем продаж',
						childs: [
							{
								text: 'приобретение новых клиентов',
								childs: [
									{
										text: 'Маркетинг и продажи',
										childs: [
										]
									},
									{
										text: 'Маркетинг и продажи',
										childs: [
										]
									}
								]
							},
							{
								text: 'Удержание и рост спроса со стороны текущих клиентов',
								childs: [
								]
							},
							{
								text: 'Развитие активов, приносящих прибыль',
								childs: [
								]
							}
						]
					},
					{
						text: 'Цена реализации',
						childs: [
						]
					}
				]
			},
			{
				text: 'Операционная рентабельность',
				childs: [
				]
			},
			{
				text: 'Эффективность управления активами',
				childs: [
				]
			},
			{
				text: 'Ожидания',
				childs: [
				]
			},
			{
				text: 'Ожидания',
				childs: [
				]
			},
			{
				text: 'Ожидания',
				childs: [
				]
			}
		]
	}
	obj = JSON.stringify(obj);

	var elementProto = Object.create(HTMLElement.prototype);

	elementProto.multiply = function(vec, mat) {
		// var aNumRows = a.length, aNumCols = a[0].length,
		// 	bNumRows = b.length, bNumCols = b[0].length,
		// 	m = new Array(aNumRows);
		// for (var r = 0; r < aNumRows; ++r) {
		// 	m[r] = new Array(bNumCols);
		// 	for (var c = 0; c < bNumCols; ++c) {
		// 		m[r][c] = 0;
		// 		for (var i = 0; i < aNumCols; ++i) {
		// 			m[r][c] += a[r][i] * b[i][c];
		// 		}
		// 	}
		// }
		// return m;
		var res = [];
		mat.forEach(function(line) {
			var sum = 0;
			line.forEach(function(val, index) {
				sum += val*vec[index];
			});
			res.push(sum);
		});

		return res;
	}

	elementProto.transform = function(vec, R, S, T) {
		var r00 = Math.cos(R);
		var r01 = Math.sin(R);
		var r10 = -r01;
		var r11 = r00;
		var mat = [
			[S.x*r00, S.y*r10, T.x*S.y*r00 - T.y*S.y*r01],
			[S.x*r01, S.y*r11, T.x*S.x*r01 + T.y*S.y*r00],
			[0, 0, 1]
		]

		return this.multiply(vec, mat);
	}

	elementProto.build = function() {
		var data = JSON.parse(obj);
		var w = this.clientWidth;
		var h = this.clientHeight;
		var s = this.svg;
		var self = this;

		var rootNode = data;
		var rootChilds = data.childs;
		var total = rootChilds.length;
		var angle = 2*Math.PI/total;
		var startAngle = 0;

		var cw = w/2;
		var ch = h/2;
		var distance = 150;
		var rootW = 60;

		var circ = s.circle(cw, ch, rootW);

		circ.attr({
			fill: "#d6dddf",
			stroke: "#929191",
			strokeWidth: 1
		});

		if (total > 0) {
			circ.attr({
				class: 'clickable'
			});
		}

		rootChilds.forEach(function(child, index) {
			var R = angle*index;
			var S = {
				x: 1,
				y: 1
			};
			var T = {
				x: 0,
				y: 0
			};
			var childs = child.childs;
			var total = childs.length;
			var vec = [0, -distance, 1];
			
			var resVec = self.transform(vec, R, S, T);
			var circ = s.circle(cw + resVec[0], ch + resVec[1], rootW/3*2);

			circ.attr({
				fill: "#d6dddf",
				stroke: "#929191",
				strokeWidth: 1
			});
			if (total > 0) {
				circ.attr({
					class: 'clickable'
				});
			}
		});
	}

	elementProto.createdCallback = function() {
		this.build = this.build.bind(this);
	}
	elementProto.attachedCallback = function() {
		var svgElement = this.getElementsByClassName('svg')[0];

		this.svg = Snap(svgElement);
		this.build();
	}
	elementProto.detachedCallback = function() {
	}

	Object.setPrototypeOf(elementProto, HTMLElement.prototype);
	document.registerElement('tree-component', {
		prototype: elementProto
	});
});