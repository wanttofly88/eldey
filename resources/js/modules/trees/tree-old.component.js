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
											{
												text: 'Сфокусироваться на перспективных и/или прибыльных клиентах',
												childs: []
											}, {
												text: 'Сфокусироваться на самых выгодных продуктах / услугах',
												childs: []
											}, {
												text: 'Сфокусироваться на наиболее  эффективных каналах продаж и рекламы',
												childs: []
											}, {
												text: 'Выйти в новые географические сегменты',
												childs: []
											}, {
												text: 'Найти новые сегменты в текущей географии',
												childs: []
											}, {
												text: 'Расширить каналы продаж и привлечения клиентов',
												childs: []
											}, {
												text: 'Улучшение общего опыта клиента (покупка, доставка, использование, поддержка и т.п.)',
												childs: []
											}, {
												text: 'Увеличение ценности для клиента / снижение цен',
												childs: []
											}, {
												text: 'Повышение эффективности маркетинга, рекламы и процесса продаж',
												childs: []
											}, {
												text: 'Увеличение ресурсов на процесс продаж',
												childs: []
											}, {
												text: 'Адаптация маркетинга и продаж к клиентским сегментам',
												childs: []
											}, {
												text: 'Улучшать доступ к информации и аналитике',
												childs: []
											}, {
												text: 'Повышать качество лидов',
												childs: []
											}, {
												text: 'Повышать силу брэнда и деловой репутации',
												childs: []
											}, {
												text: 'Доводить продукты и услуги до новых потребительских сегментов',
												childs: []
											}, {
												text: 'Сократить время цикла заказ - поставка, повысить доступность услуг',
												childs: []
											}, {
												text: 'Улучшение навыков продаж и маркетинга ',
												childs: []
											}, {
												text: 'Рост согласованности мотивации сотрудников  со стратегическими целями',
												childs: []
											}, {
												text: 'Приобретение компаний со связями в целевых клиентских сегментах',
												childs: []
											}, {
												text: 'Приобретение компаний в целевых географиях',
												childs: []
											}, {
												text: 'Совершенствование методов  продаж и маркетинга ',
												childs: []
											}

										]
									},
									{
										text: 'Инновации в продукте / услуге',
										childs: [
											{
												text: 'Расширение линейки продуктов / сервисов',
												childs: []
											}, {
												text: 'Фокус на R&D, инновациях и технологическом лидерстве',
												childs: []
											}, {
												text: 'Акцент на дизайн, юзабилити, кастомизацию ',
												childs: []
											}, {
												text: 'Улучшать платформу и стратегические портфели для продуктов и услуг',
												childs: []
											}, {
												text: 'Контроль сроков внедрения и выхода на рынок',
												childs: []
											}, {
												text: 'Увеличить число и качество продуктовой линейки',
												childs: []
											}, {
												text: 'Использование модульного, широко применимого дизайна',
												childs: []
											}, {
												text: 'Улучшать сотрудничество с проектными  и производственными партнерами',
												childs: []
											}, {
												text: 'Повторное использование продуктов и компонентов ',
												childs: []
											}, {
												text: 'Разработка новых предложений (продукты и услуги)',
												childs: []
											}, {
												text: 'Инвестиции в R&D ',
												childs: []
											}, {
												text: 'Адаптировать существующие продукты и услуги для новых сегментов ',
												childs: []
											}, {
												text: 'Создание СП, OEM, Партнерств',
												childs: []
											}, {
												text: 'Совершенствовать системы управления жизненным циклом продукта',
												childs: []
											}, {
												text: 'Развивать   характеристики продуктов и услуг, разрабатывать добавочную ценность',
												childs: []
											}
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

	document.registerElement('tree-component', {
		prototype: elementProto
	});
});