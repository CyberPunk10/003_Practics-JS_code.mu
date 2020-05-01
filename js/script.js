/*-------------------- Общие настройки (решение упражнений смотри в файле tasks.js) --------------------*/
'use strict'

const d 			= document,
			body 		= d.querySelector('body'),
			cLeft	  = d.getElementById('cLeft'),
			cCenter	= d.querySelector('#cCenter'),
			cRight	= d.querySelector('#cRight');

/* Работа со скоролом */
(function () {
	// взято отсюда: https://habr.com/ru/company/ruvds/blog/468405/
	//легкий простой код на проверку фиксированные ли scroll-ы у пользователя или нет
	/*
 * Scrollbar Width Test
 * Adds `layout-scrollbar-obtrusive` class to body if scrollbars use up screen real estate
 */
	
	var parent = document.createElement("div");
	parent.setAttribute("style", "width:30px; height:30px;");
	parent.classList.add('scrollbar-test');

	var child = document.createElement("div");
	child.setAttribute("style", "width:100%; height:40px");
	parent.appendChild(child);
	document.body.appendChild(parent);

	// Measure the child element, if it is not
	// 30px wide the scrollbars are obtrusive.
	var scrollbarWidth = 30 - parent.firstChild.clientWidth;
	if(scrollbarWidth) {
		document.body.classList.add("layout-scrollbar-obtrusive");
	}

	document.body.removeChild(parent);
}());

// общие мелкие функции перезаписи классов sm, md и hide (передавать cRight или cLeft)

function add_sm (cntr) {
	cntr.classList.add(`${cntr.getAttribute('id')}-sm`);
	cCenter.classList.add(`${cntr.getAttribute('id')}-sm`);
}												 			// добавляет класс sm 	
function add_md (cntr) {
	cntr.classList.add(`${cntr.getAttribute('id')}-md`);
	cCenter.classList.add(`${cntr.getAttribute('id')}-md`);
}												 			// добавляет класс md 

function remove_sm (cntr) {
	cntr.classList.remove(`${cntr.getAttribute('id')}-sm`);
	cCenter.classList.remove(`${cntr.getAttribute('id')}-sm`);
}													// удаляет класс sm 
function remove_md (cntr) {
	cntr.classList.remove(`${cntr.getAttribute('id')}-md`);
	cCenter.classList.remove(`${cntr.getAttribute('id')}-md`);
}													// удаляет класс md 

function set_sm (cntr) {
	add_sm (cntr);
	remove_md (cntr);
}															// заменяет класс на sm
function set_md (cntr) {
	add_md (cntr);
	remove_sm (cntr);
}															// заменяет класс на md

function add_hide(cntr) {
	cntr.classList.add(`${cntr.getAttribute('id')}-hide`); 								
	cCenter.classList.add(`${cntr.getAttribute('id')}-hide`);
}														// добавляет класс скрытия боковой панели 			
function remove_hide(cntr) {
	cntr.classList.remove(`${cntr.getAttribute('id')}-hide`); 								
	cCenter.classList.remove(`${cntr.getAttribute('id')}-hide`);
}													// удаляет класс скрытия боковой панели 

/* close/open cLeft, cRight + изменяем ширину */
(function () {	

	/* изменяем на лету ширину для cLeft и cRight */
	(function () {

		// Общая функция + пояснения
		function buttonPressed(event) {
			if (event.buttons == null)
				return event.which != 0;
			else
				return event.buttons != 0;
		}	
		/* Обратите внимание, что обработчик «mousemove» зарегистрирован для всего окна. Даже если во время изменения размеров мышь выходит за пределы панели, мы все равно обновляем ширину панели и прекращаем JavaScript touch events, когда клавиша мыши была отпущена. 

		Мы должны прекратить изменение размера панели, когда пользователь отпускает клавишу мыши. К сожалению, не все браузеры устанавливают для событий «mousemove» свойство which. Существует стандартное свойство buttons, которое предоставляет аналогичную информацию, но оно также поддерживается не во всех браузерах. К счастью, все основные браузеры поддерживают что-то одно: либо buttons, либо which. Функция buttonPressed в приведенном выше примере сначала пытается использовать свойство buttons, и, если оно не доступно, переходит к which.	

		//инфа отсюда:
		https://yandex.ru/turbo?text=https%3A%2F%2Fwww.internet-technologies.ru%2Farticles%2Fobrabotka-sobytiy.html
		*/	/* пояснения */

		// resizeLeft
		(function () {
			const resizeLeft = d.querySelector('#resize-left');
			
			let minWidth 		 = (getComputedStyle(cLeft).minWidth).slice(0,-2),
					maxWidth 		 = (getComputedStyle(cLeft).maxWidth).slice(0,-2),
					offsetX; 			//отступ курсора мыши по оси X от левого края target

			// (1) отследить нажатие
			resizeLeft.addEventListener("mousedown", function(event) {
				if (event.which == 1) { //если нажатие левой КМ
					// меняем стили
					cLeft.style.transition = cCenter.style.transition = '0s';
					event.preventDefault(); // Предотвращает выделение
					resizeLeft.classList.add('onmousedown');
					body.style.cursor = 'e-resize';

					// (2) отследить позиционирование на элементе
					offsetX = event.offsetX;

					// (3) добавляем событие движения мыши
					addEventListener("mousemove", moved);
				}
			});

			function moved(event) {
				// (4) если зажатой кнопки НЕ найдено, то удаляем ненужные обработчики событий
				if (!buttonPressed(event)) { 
					// восстанавливаем стили
					cLeft.style.transition = cCenter.style.transition = '';
					resizeLeft.classList.remove('onmousedown');
					resizeLeft.style.left = '';
					body.style.cursor = '';

					removeEventListener("mousemove", moved);
				} else {
				// (5) если зажатая кнопка найдена, то обрабатываем событие
					let currentPageX = event.pageX;

					// из расстояния от левого края страницы до курсора отнимаем расстояние между курсором и левым краем блока
					if (minWidth > 1 && (currentPageX - offsetX) < minWidth) {
						cLeft.style.width = cCenter.style.left = minWidth + 'px';
						resizeLeft.style.left = '';
						set_sm(cLeft);																	// заменяет класс на sm
					} else if (maxWidth > 1 && (currentPageX - offsetX) > maxWidth) {
						cLeft.style.width = cCenter.style.left = maxWidth + 'px';
						resizeLeft.style.left = '';
						set_md(cLeft);																	// заменяет класс на md
					} else {
						resizeLeft.style.left = currentPageX - offsetX + 'px';
						cLeft.style.width = cCenter.style.left = currentPageX - offsetX + 'px';

						if (getComputedStyle(cLeft).width.slice(0,-2) < 250) {
							cLeft.classList.add('cLeft-xs');							// add xs
						} else {
							cLeft.classList.remove('cLeft-xs');						// remove xs
						}		

						if (getComputedStyle(cLeft).width.slice(0,-2) < 340) {
							set_sm(cLeft);																// заменяет класс на sm
						} else {
							set_md(cLeft);																// заменяет класс на md
						}		

					}
				}
			}
		}());

		// resizeRight
		(function () {
			const resizeRight = d.querySelector('#resize-right');
			
			let minWidth 			= (getComputedStyle(cRight).minWidth).slice(0,-2),
					maxWidth 			= (getComputedStyle(cRight).maxWidth).slice(0,-2),
					offsetX,
					offsetXcRight,
					clientWidth;
			
			resizeRight.addEventListener("mousedown", function(event) {
				if (event.which == 1) { //если нажатие левой КМ
					// меняем стили
					cRight.style.transition = cCenter.style.transition = '0s';
					event.preventDefault(); // Предотвращает выделение
					resizeRight.classList.add('onmousedown');
					body.style.cursor = 'e-resize';

					// (2) отследить позиционирование на элементе
					offsetX 			= event.offsetX;
					offsetXcRight = event.clientX - resizeRight.getBoundingClientRect().left;
					clientWidth 	= d.body.clientWidth; //текущая ширина браузера

					// (3) добавляем событие движения мыши
					addEventListener("mousemove", moved);
				}
			});

			function moved(event) {
				// (4) если зажатой кнопки НЕ найдено, то удаляем ненужные обработчики событий
				if (!buttonPressed(event)) { 
					// восстанавливаем стили
					cRight.style.transition = cCenter.style.transition = '';
					resizeRight.classList.remove('onmousedown');
					resizeRight.style.left = '';
					body.style.cursor = '';

					removeEventListener("mousemove", moved);
				} else {
				// (5) если зажатая кнопка найдена, то обрабатываем событие
					let currentPageX = event.pageX;

					// из ширины окна отнимаем расстояние слева до курсора и прибавляем разницу между курсором и левым краем блока
					if (minWidth > 1 && (clientWidth - currentPageX + offsetXcRight) < minWidth) {

						cRight.style.width = cCenter.style.right = minWidth + 'px';
						resizeRight.style.left = '';
						set_sm (cRight);																// заменяет класс на sm

					} else if (maxWidth > 1 && (clientWidth - currentPageX + offsetXcRight) > maxWidth) {

						cRight.style.width = cCenter.style.right = maxWidth + 'px';
						resizeRight.style.left = '';
						set_md (cRight)																	// заменяет класс на md
						
					} else {

						resizeRight.style.right = currentPageX - offsetX + 'px';
						cRight.style.width = cCenter.style.right = clientWidth - currentPageX + offsetXcRight + 'px';

						if(getComputedStyle(cRight).width.slice(0,-2) < 380) { // важно сравнивать именно числа, а не строки!
							set_sm (cRight);															// заменяет класс на sm						
						} else {
							set_md (cRight)																// заменяет класс на md
						}
					}
				}
			};
			
		}());

	}());

	/* close/open contaner-left */
	(function () { 
		let	closeCntrLeft	= cLeft.querySelector('#close-cLeft'),
				openCntrLeft  = d.querySelector('#open-cLeft-wrap');
		
		function mouseenterHover () {
			if (cLeft.style.width != '') {		
				// если ширина не была очищена с помощью изменения на стандартную ширину, то продолжаем воссоздавать hover
				cLeft.style.left = 0;			
			} else {
				// иначе удаляем поведение воссозданного hover-эффекта
				cLeft.removeEventListener('mouseenter', mouseenterHover);
				cLeft.removeEventListener('mouseleave', mouseleaveHover);
			};
		};										//воссоздает поведение hover-эффекта (наведение)
		function mouseleaveHover () {
			if (cLeft.style.width != '') {		
				// если ширина не была очищена с помощью изменения на стандартную ширину, то продолжаем воссоздавать hover
				cLeft.style.left = "-" + getComputedStyle(cLeft).width;		
			} else {
				// иначе удаляем поведение воссозданного hover-эффекта
				cLeft.removeEventListener('mouseenter', mouseenterHover);
				cLeft.removeEventListener('mouseleave', mouseleaveHover);
			}
		};										//воссоздает поведение hover-эффекта (уход)
		
		closeCntrLeft.addEventListener('click', function() {

			add_hide(cLeft);																		// добавляем класс скрытия боковой панели 
			
			// 1. боковая панель должна уехать, но не уезжает из-за hover-эффекта, поэтому прописываем стиль
			cLeft.style.left = "-" + getComputedStyle(cLeft).width; 
			
			if (cLeft.style.width == '') {											// если ширина не была присвоена JS-ом

				// 2. спустя .3s обнуляем значение, чтобы работало выезжание cntr при hover
				setTimeout(function(){
					cLeft.style.width = cLeft.style.left = '';
				}, 300);
				
			} else {																						// если ширина была присвоена JS-ом

				cCenter.style.left = 0;														// иначе не уедет влево cCenter
				
				// 2. воссоздаем поведение hover-эффекта, так как теперь он не может выехать из-за width заданной в JS
				cLeft.addEventListener('mouseenter', mouseenterHover);
				cLeft.addEventListener('mouseleave', mouseleaveHover);
			}
		});

		openCntrLeft.addEventListener('click', function() {
			
			remove_hide(cLeft);																	// удаляем класс скрытия боковой панели 
			
			if (cLeft.style.width != '') {											// если ширина была присвоена JS-ом

				cCenter.style.left = getComputedStyle(cLeft).width;	// иначе не будет выезжать cCenter
				cLeft.style.left = 0;															// иначе не будет выезжать cLeft

				// 2. удаляем поведение воссозданного hover-эффекта
				cLeft.removeEventListener('mouseenter', mouseenterHover);
				cLeft.removeEventListener('mouseleave', mouseleaveHover);
			}
		});
	}());

	/* close/open contaner-right */
	(function () { 
		let	close_cRight = cRight.querySelector('#close-cRight'),
				open_cRight  = d.querySelector('#open-cRight-wrap');

		function mouseenterHover () {
			if (cRight.style.width != '') {		
				// если ширина не была очищена с помощью изменения на стандартную ширину, то продолжаем воссоздавать hover
				cRight.style.right = 0;			
			} else {
				// иначе удаляем поведение воссозданного hover-эффекта
				cRight.removeEventListener('mouseenter', mouseenterHover);
				cRight.removeEventListener('mouseleave', mouseleaveHover);
			};
		};										//воссоздает поведение hover-эффекта (наведение)
		function mouseleaveHover () {
			if (cRight.style.width != '') {		
				// если ширина не была очищена с помощью изменения на стандартную ширину, то продолжаем воссоздавать hover
				cRight.style.right = "-" + getComputedStyle(cRight).width;		
			} else {
				// иначе удаляем поведение воссозданного hover-эффекта
				cRight.removeEventListener('mouseenter', mouseenterHover);
				cRight.removeEventListener('mouseleave', mouseleaveHover);
			}
		};										//воссоздает поведение hover-эффекта (уход)
		
		close_cRight.addEventListener('click', function() {
			
			add_hide(cRight);																		// добавляем класс скрытия боковой панели 

			// 1. боковая панель должна уехать, но не уезжает из-за hover-эффекта, поэтому прописываем стиль
			cRight.style.right = "-" + getComputedStyle(cRight).width; 
			
			if (cRight.style.width == '') {											// если ширина не была присвоена JS-ом

				// 2. спустя .3s обнуляем значение, чтобы работало выезжание cntr при hover
				setTimeout(function(){
					cRight.style.width = cRight.style.right = '';
				}, 400);
				
			} else {																						// если ширина была присвоена JS-ом

				cCenter.style.right = 0;													// иначе не уедет влево cCenter
				
				// 2. воссоздаем поведение hover-эффекта, так как теперь он не может выехать из-за width заданной в JS
				cRight.addEventListener('mouseenter', mouseenterHover);
				cRight.addEventListener('mouseleave', mouseleaveHover);
			}
		});

		open_cRight.addEventListener('click', function() {
			
			remove_hide(cRight);																// удаляем класс скрытия боковой панели 
			
			if (cRight.style.width != '') {											// если ширина была присвоена JS-ом

				cCenter.style.right = getComputedStyle(cRight).width;	// иначе не будет выезжать cCenter
				cRight.style.right = 0;														// иначе не будет выезжать cRight

				// 2. удаляем поведение воссозданного hover-эффекта
				cRight.removeEventListener('mouseenter', mouseenterHover);
				cRight.removeEventListener('mouseleave', mouseleaveHover);
			}
		});
	}());

	/* меняем ширину на стандартные значения cLeft (xs, sm, md) / cRight (sm, md) */
	(function () {
		
		// cLeft (xs, sm, md)
		(function () {
			const toggleWidth_cLeft  = cLeft.querySelector('#toggle-width-cLeft'),
						btn_cLeftSM 			 = cLeft.querySelector('#cLeft-sm');
			
			function resetWidth () {
				cLeft.style.width = cCenter.style.width = '';
				cLeft.style.left 	= cCenter.style.left 	= '';
			}												// функция сброса width и left  для cLeft  & cCenter
			
			toggleWidth_cLeft.addEventListener('click', function () {
				
				resetWidth();																			//сбрасываем width для cLeft & cCenter
				
				cLeft.classList.remove('cLeft-xs');								//удаляем класс XS (если есть)
				
				if (getComputedStyle(btn_cLeftSM).display != 'none') { 
					set_sm (cLeft)																	// заменяет класс на sm
				} else {
					set_md (cLeft)																	// заменяет класс на md
				}
			});
		}());

		// cRight (sm, md)
		(function () {
			const toggleWidth_cRight = cRight.querySelector('#toggle-width-cRight'),
						btn_cRightSM = cRight.querySelector('#cRight-sm');
			
			function resetWidth () {
				cRight.style.width = cCenter.style.width = '';
				cRight.style.right = cCenter.style.right = '';
			}												// функция сброса width и right для cRight & cCenter
			
			toggleWidth_cRight.addEventListener('click', function () {
				
				resetWidth();																			// сбрасываем width и right для cRight & cCenter

				if (getComputedStyle(btn_cRightSM).display != 'none') { 	
					set_sm (cRight)																	// заменяет класс на sm
				} else {															
					set_md (cRight)																	// заменяет класс на md
				}
			});
		}());
	
}());
	
}());

/* слушаем изменение ширины экрана для добавления классов в cLeft, cCenter и cRight */
(function () {
	/* 
	//document.body.clientWidth - Ширина браузера
	//document.body.clientHeight - Высота браузера
	
	//let cLeftStyle  = getComputedStyle(cLeft); // в cLeftStyle лежат CSS свойства
	//console.log(cLeftStyle.width);
	//console.log(cLeft.offsetWidth);
	
	// Но есть вот такой объект, который позволяет слушать изменения
	// Объект MediaQueryList:
	// Media — атрибут readonly (строка).
	// Matches — атрибут readonly (true/false). Определяет, совпал ли заданный media query с текущим размером экрана
	// addListener — метод, «включающий» прослушку на изменение ширины экрана
	// removeListener — метод, «выключающий» прослушку.
	
	// пример:
	
	var mql = window.matchMedia("screen and (min-width: 768px)");

	mql.addListener(setup_for_width); // Добавим прослушку на смену результата
	
	function setup_for_width(mql) {
		if (mql.matches) {
		div.addClass("some-class");
		} else {
		div.removeClass("some-class");
		}
	}

setup_for_width(mql); // Вызовем нашу функцию

	*/		//для справки
		
	let mql_maxW_399  = window.matchMedia("screen and (max-width: 399px)"),
			mql_minW_400  = window.matchMedia("screen and (min-width: 400px)"), 
			mql_maxW_479  = window.matchMedia("screen and (max-width: 479px)"),
			mql_minW_480  = window.matchMedia("screen and (min-width: 480px)"),
			mql_maxW_991  = window.matchMedia("screen and (max-width: 991px)"),
			mql_minW_992  = window.matchMedia("screen and (min-width: 992px)"),
			mql_maxW_1299 = window.matchMedia("screen and (max-width: 1299px)"),
			mql_minW_1300 = window.matchMedia("screen and (min-width: 1300px)"),
			mql_maxW_1399 = window.matchMedia("screen and (max-width: 1399px)"),
			mql_minW_1400 = window.matchMedia("screen and (min-width: 1400px)");

	/* общие функции для 399/400 и 479/480 (просто меняются местами) */
	function set_md_ctnrs (mql) {
		if (mql.matches) {
			set_md(cLeft);																			// заменяет класс на md
			set_md(cRight);																			// заменяет класс на md
		}
	}											// заменяет класс на md у cLeft & cRight
	function set_sm_ctnrs (mql) {
		if (mql.matches) {
			set_sm(cLeft);																			// заменяет класс на sm
			set_sm(cRight);																			// заменяет класс на sm
		}
	}											// заменяет класс на sm у cLeft & cRight

	/* ---- при уменьшении экрана меньше 400px добавляем класс sm обоим боковым панелям (они растянуты на весь экран) ---- */
	mql_maxW_399.addListener(set_sm_ctnrs); // Добавим прослушку на смену результата
	mql_minW_400.addListener(set_md_ctnrs); // Добавим прослушку на смену результата

	
	/* ---- при уменьшении экрана меньше 480px добавляем класс md обоим боковым панелям (они растянуты на весь экран) ---- */
	mql_maxW_479.addListener(set_md_ctnrs); // Добавим прослушку на смену результата
	mql_minW_480.addListener(set_sm_ctnrs); // Добавим прослушку на смену результата

	
	/* ---- при уменьшении экрана меньше 992px добавляем классы hide и sm (скрываем левую боковую панель) ---- */
		
	function set_cLeftHide (mql) {
		if (mql.matches) {
			add_hide(cLeft);																		// добавляет класс скрытия боковой панели 
			set_sm(cLeft);																			// заменяет класс на sm
		}
	}											// добавляет классы hide и sm у cLeft

	function del_cLeftHide (mql) {
		if (mql.matches) {
			remove_hide(cLeft);																	// удаляет класс скрытия боковой панели 
			remove_sm(cLeft);																		// удаляет класс sm
		}
	}											// удаляет классы hide и sm у cLeft

	mql_maxW_991.addListener(set_cLeftHide); // Добавим прослушку на смену результата
	mql_minW_992.addListener(del_cLeftHide); // Добавим прослушку на смену результата

	
	/* ---- при уменьшении экрана меньше 1300px добавляем классы hide и sm (скрываем правую боковую панель)  ---- */
		
	function set_cRightHide (mql) {
		if (mql.matches) {
			add_hide(cRight);																		// добавляет класс hide
			set_sm (cRight);																		// заменяет класс на sm
		}
	}										// добавляет классы hide и sm	у cRight

	function del_cRightHide (mql) {
		if (mql.matches) {
			remove_hide(cRight);																// удаляет класс скрытия боковой панели 
			remove_sm(cRight);																	// удаляет класс sm
		}
	}										// удаляет классы hide и sm	у cRight

	mql_maxW_1299.addListener(set_cRightHide); // Добавим прослушку на смену результата
	mql_minW_1300.addListener(del_cRightHide); // Добавим прослушку на смену результата

	
	/* ---- добавляем класс cRight-sm, если экран < 1400px ---- */
		
	function set_cRightSmall (mql) {
		if (mql.matches) {
			set_sm (cRight);																		// заменяет класс на sm
		}
	}										// заменяет класс на sm	у cRight
	
	function del_cRightSmall (mql) {
		if (mql.matches) {
			remove_sm(cRight);																	// удаляет класс sm
		}
	}										// удаляет класс sm	у cRight 
	
	mql_maxW_1399.addListener(set_cRightSmall); // Добавим прослушку на смену результата
	mql_minW_1400.addListener(del_cRightSmall); // Добавим прослушку на смену результата

	/* !ниже важна последовательность кода! (при парсинге приоритет за кодом, находящимся ниже, поэтому всё уложено в if) */
	//вызовем, чтобы сработала в момент первой загрузки страницы (до первого изменения media query)
	
	if(d.body.clientWidth > 1399 ) {
		del_cRightSmall (mql_minW_1400);
	} else if (d.body.clientWidth > 1299 && d.body.clientWidth < 1400) {
		del_cRightHide (mql_minW_1300);
		set_cRightSmall (mql_maxW_1399);
	} else if (d.body.clientWidth > 991  && d.body.clientWidth < 1300) {
		set_cRightHide (mql_maxW_1299);
		del_cLeftHide (mql_minW_992);	
	} else if (d.body.clientWidth > 479  && d.body.clientWidth < 992) {
		set_cLeftHide (mql_maxW_991);
		set_sm_ctnrs (mql_minW_480);
		
		add_hide(cRight);																			// добавляет класс hide
	} else if (d.body.clientWidth > 399  && d.body.clientWidth < 480) {
		set_md_ctnrs (mql_maxW_479);
		set_md_ctnrs (mql_minW_400);
		
		add_hide(cRight);																			// добавляет класс hide
		add_hide(cLeft);																			// добавляет класс скрытия боковой панели 
	} else if (d.body.clientWidth < 400) {
		set_sm_ctnrs (mql_maxW_399);
		
		add_hide(cRight);																			// добавляет класс hide
		add_hide(cLeft);																			// добавляет класс скрытия боковой панели 
	}
	
}());

/* Открываем задачи по навигации cLeft + Разворачиваем и сворачиваем tasks в cRight + делаем задачу активной */
(function () {
	const $a 				 						 = cLeft.querySelectorAll('#left-navigation ul li a'),
				$tasks  							 = cRight.querySelectorAll('.exercise'),
				$btn_h3 							 = cRight.querySelectorAll('.btn-h3'), 				// заголовки
				$exercises 					 	 = cRight.querySelectorAll('.exercise'), 			// tasks-containers,
				codeGuide		 					 = cCenter.querySelector('#code-guide'),
				btnExpandTasks  		   = cRight.querySelector('#expand-tasks'),			// кнопка свернуть/развернуть всё
				btnCollapseTasks  	 	 = cRight.querySelector('#collapse-tasks'),		// кнопка свернуть/развернуть всё
				objTasksCollapseExpand = {}; // объект для отслеживания все ли tasks свернуты/развернуты и если да, то меняем кнопку 'свернуть/развернуть всё'

	//add key & value in objTasksCollapseExpand (стартовое состояние свернутости/развернутости tasks)
	$exercises.forEach(function(el) {
		let keyObj 	 = el.getAttribute('id'),
				keyValue;
		
		if (el.classList.contains('collapse')) {
			keyValue = 'collapse';
		} else {
			keyValue = 'expand';
		}
		
		objTasksCollapseExpand[keyObj] = keyValue;	
	});
	
	/* ---- Разворачиваем и сворачиваем tasks в cRight ---- */
	(function () { 
		let svgCollapseExpandAll = cRight.querySelectorAll('.collapse-expand');

		// Разворачиваем и сворачиваем tasks по одиночке
		(function () {

			// общая функция, которая по клику на задаче делает её активной, добавляя класс .active
			function activedTask (elem) {
				claerActivedTask ();
				if (elem.parentElement.parentElement.classList.contains('exercise')) {
					elem.parentElement.parentElement.classList.add('active');
				} else {
					console.log(false);
				}
			}
			
			//вешаем на заголовки функцию сворачивания и разворачивания
			$btn_h3.forEach(function(el) {
				el.addEventListener('click', function() {
					let keyObj = el.getAttribute('data-parent').substr(1),
							exs		 = cRight.querySelector(el.getAttribute('data-parent'));

					if (exs.classList.contains('collapse')) {				// если свёрнуто - разворачиваем
						exs.classList.remove('collapse');
						objTasksCollapseExpand[keyObj] = 'expand'; 		// обновляем значение у текущего ключа в созданном при старте объекте (текущее состояние для отслеживания изменения и в случае, если все задачи станут свернутыми или развернутыми, то поменяется кнопка 'свернуть/развернуть всё')
					} else {																				// иначе ничего не делаем (если нужно сворачивать, то разкоментировать код ниже)
						//exs.classList.add('collapse');
						//objTasksCollapseExpand[keyObj] = 'collapse'; // обновляем значение у текущего ключа в созданном при старте объекте (текущее состояние для отслеживания изменения и в случае, если все задачи станут свернутыми или развернутыми, то поменяется кнопка 'свернуть/развернуть всё')
					}
					
					//если всё свернуто/развёрнуто, то меняем кнопку сворачивания/разворачивания всех tasks
					changeBtnsCollapseExpand(checkObjValue());

					//делаем task активной (add .active), сначала удалив этот класс у другой задачи
					activedTask (el);		

				});
			});

			//вешаем на svg (рядом с заголовками) функцию сворачивания и разворачивания
			for (let el of svgCollapseExpandAll) {
				el.addEventListener('click', function() {

					let keyObj = el.parentElement.parentElement.getAttribute('id'),
							exs 	 = cRight.querySelector(el.previousElementSibling.getAttribute('data-parent'));

					if (exs.classList.contains('collapse')) {				// если свёрнуто - разворачиваем
						
						exs.classList.remove('collapse');
						objTasksCollapseExpand[keyObj] = 'expand'; 		// обновляем значение у текущего ключа в созданном при старте объекте (текущее состояние для отслеживания изменения и в случае, если все задачи станут свернутыми или развернутыми, то поменяется кнопка 'свернуть/развернуть всё')
						
						activedTask (el);															// делаем task активной (add .active)
						
					} else {																				// иначе сворачиваем
						
						exs.classList.add('collapse');
						objTasksCollapseExpand[keyObj] = 'collapse'; 	// обновляем значение у текущего ключа в созданном при старте объекте (текущее состояние для отслеживания изменения и в случае, если все задачи станут свернутыми или развернутыми, то поменяется кнопка 'свернуть/развернуть всё')
						
					}

					//если всё свернуто/развёрнуто, то меняем кнопку сворачивания/разворачивания всех tasks
					changeBtnsCollapseExpand(checkObjValue());

				});
			};
			
			// делаем активной задачу, если кликаем на любое место задачи (не только заголовок и svg)
			// + покажем решение задачи в cCenter +	делаем task активной в cLeft. Всё это только если task НЕ свернута
			(function(){
				$exercises.forEach(function(el) {
					el.addEventListener('click', function() {
						
						if (!el.classList.contains('collapse')) { 		// если task НЕ свернута
							
							claerActivedTask (); 												// удаляем класс .active у другой задачи
							el.classList.add('active');									// add класс .active к текущей задачи
						
							showContent (el);														// тут же при клике покажем решение задачи в cCenter

							// делаем task активной в cLeft (передаём не .exercise в cRight, а элемент 'a' в cLeft)
							addClassActive_cLeft(cLeft.querySelector('#left-navigation ul li a[href="#' + el.getAttribute('id') + '"]'));
						}
					});
				});
			}());
			
		}());

		// Разворачиваем и сворачиваем все tasks одной кнопкой (collapseExpandTasks)
		(function () {
			let collapseExpandTasks = cRight.querySelector('#collapse-expand-tasks');

			collapseExpandTasks.addEventListener('click', function() {
			if (getComputedStyle(btnCollapseTasks).display != 'none') {
				collapseTasksAll();
			} else {
				expandTasksAll();
			}
		});

			function collapseTasksAll() {
				$exercises.forEach(el => el.classList.add('collapse'));				
				btnCollapseTasks.style.display = "none";
				btnExpandTasks.style.display = "block";

				for (let key in objTasksCollapseExpand) {
					objTasksCollapseExpand[key] = 'collapse';
				}; 		
			}

			function expandTasksAll() {
				$exercises.forEach(el => el.classList.remove('collapse'));
				btnCollapseTasks.style.display = "block";
				btnExpandTasks.style.display = "none";

				for (let key in objTasksCollapseExpand) {
					objTasksCollapseExpand[key] = 'expand';
				};
			}
		}());
		
	}());
	
	
	/* ---- Открываем задачи по навигации cLeft ---- */
	(function () {
		const mainRight  = cRight.querySelector('#main-right');  // для скроллинга cRight

		$a.forEach(el => {
			el.addEventListener('click', function (event) {
				event.preventDefault();

				if (el.hash) { 	// проверка привязана ли ссылка
					
					// находим элемент, который нужно поднять
					let target = cRight.querySelector(el.hash);

					// прокрутить с отступом сверху в cRight
					scrollTop(target);

					// выделить заголовок выбранной задачи в cRight (тут НЕ общая функция, а СВОЯ!)
					activedTask(target);

					// в cCenter отобразить контент выбранной темы
					showContent(target, el);	
					
					// добавить класс .active (для отображения текущей ссылки) в cLeft
					addClassActive_cLeft(el);
					
				} else {
					false // иначе ничего не делаем (без проверки будут ошибки)
				}
			});
		})

		function scrollTop (elem) {		
			// задаем контейнеру, который нужно прокрутить, scrollTop == offsetTop элемента, который нужно поднять (содержат координаты Y относительно верхнего левого угла) от которого отнимаем 52px
			mainRight.scrollTop = elem.offsetTop - 52;
		};

		function activedTask (elem) {

			claerActivedTask (); // очищаем активную задачу от класса .active

			if (elem.classList.contains('exercise')) {
				
				// вешаем класс active на текущий elem (на который кликнули через навинационное меню)
				elem.classList.add('active');
				
				// разворачиваем задачу, если она была свернута (удаляя класс .collapse)
				if (elem.classList.contains('collapse')) {
					elem.classList.remove('collapse');

					// обновляем объект, который содержит состояния развернутости/свернутости tasks
					objTasksCollapseExpand[elem.getAttribute('id')] = 'expand';			
					
					// если всё развёрнуто, то меняем кнопку разворачивания всех tasks на сворачивание всех tasks (#collapse-tasks / btnCollapseTasks)
					changeBtnsCollapseExpand(checkObjValue());
				}
			}
		};
		
	}());
	
	
	// общие функци
	
	function claerActivedTask () {			
		// очищаем активный элемент от класса active, перебирая все tasks 
		for (let el of $tasks) {
			if (el.classList.contains('exercise') && el.classList.contains('active')) {
				el.classList.remove('active');
				break; // выходим не дожидаясь окончания цикла, если нашли активный элемент
			}
		};
		
		/*---- Что можно доработать ----*/

		// 1. можно завести счётчик (для определения первый ли клик был произведен по task или второй) и отслеживать какой элемент активен, после чего очищать последний активный без цикла. Думаю, с большим количеством данных это может быть существенно.
	}											// очищает активный task в cRight (удаляем класс .active)
	
	function showContent (elem, a) {
		let dataAtrb 		 = elem.getAttribute('id'),
				target   		 = cCenter.querySelector('[data-task="' + dataAtrb +'"]'),
				cCenterTasks = cCenter.querySelectorAll('.cCenter-task'),
				h3			 		 = cCenter.querySelector('#code-guide>h3'),
				codeGuide			 		 = cCenter.querySelector('#code-guide'),
				mainCenter 	 = cCenter.querySelector('#main-center'); // для скроллинга cCenter

		if (target) {		// если не null, то продолжаем

			// очищаем от класса active
			for (let el of cCenterTasks) {
				if (el.classList.contains('active')) {
					el.classList.remove('active');
					break;
				}
			}
			
			// перезаписываем заголовок, который берём из навигационного меню
			h3.innerHTML = elem.querySelector('h3').innerHTML;

			// показываем content, добавляя класс active
			target.classList.add('active');
			
			/* открываемый контент прокручиваем наверх, если контент находится НЕ наверху или высота контента БОЛЬШЕ высоты окна просмотра */
			if (mainCenter.scrollTop != 0 || target.offsetHeight > (mainCenter.offsetHeight - 93.6)) { 
				mainCenter.scrollTop = target.offsetTop - 93.6; 	/* 4rem - это header + высота заголовка h3 (53.6px) */
			}
			
			
			//codeGuide.innerHTML = `<a href='#'>sldfj<a/>`;
			//codeGuide.innerHTML = ``+ objTasks[a.innerHTML] +``;
			
			
			
			
			
		}
		
		/* что улучшить */
		// вместо жестко заданных размеров можно вычислить их и тогда функция станет универсальней
		
	};											// показывает контент выбранной темы в cCenter
	
	function addClassActive_cLeft (elem) {
		// очищаем активный элемент от класса active, перебирая все tasks 
		for (let el of $a) {
			if (el.classList.contains('active')) {
				el.classList.remove('active');
				break; // выходим не дожидаясь окончания цикла, если нашли активный элемент
			}
		};

		elem.classList.add('active');
	}							// показывает активную задачу в cLeft
	
	// вспомогательная функция, проверяет все ли значения в объекте равны одному и тому же значению (равны ли друг другу), 
	// возвращает 'expand' || 'collapse' - если равны и false, если не равны.
	function checkObjValue() {
		for (let key in objTasksCollapseExpand) {
			for(let key2 in objTasksCollapseExpand) {
				if(objTasksCollapseExpand[key] != objTasksCollapseExpand[key2]) {
					return false //разное состояние - ничего не делаем
				}
			}
		};

		//одинаковое состояние - значит меняем кнопку, возвращаем значение первого ключа в objTasksCollapseExpand
		if ($exercises[0].classList.contains('collapse')) {
			return 'collapse'
		} else {
			return 'expand'
		}
	};

	function changeBtnsCollapseExpand(value) {
		if(value != false) {
			if (value == "collapse") { 			// если всё свернуто (collapse), то отображаем кнопку развернуть (btnExpandTasks)
				btnCollapseTasks.style.display = "none";
				btnExpandTasks.style.display = "block"
			} else {
				btnCollapseTasks.style.display = "block";
				btnExpandTasks.style.display = "none"
			}
		}
	} 				// меняет кнопку collapseExpandTasks
	
}());

/* Подсветка кода */
(function() {
	let highlighter = new Highlighter();
	let elems = document.querySelectorAll('code[data-module="highlight"]');

	if (elems) {
		for (let elem of elems) {
			elem.innerHTML = highlighter.handle(elem.innerHTML, elem.dataset.lang);
		}
	}
}());

/* ---- popup (модальные окна) ---- */
(function () {
	const popupBG  = d.querySelector('#bg-popup'),
				popupAll = popupBG.querySelectorAll('#bg-popup>div');
	
	// Вешаем на все кнопки с классом .popup-btn функцию показа модального окна
	d.querySelectorAll('.popup-btn').forEach(function(elem){
		elem.addEventListener('click', function () {
			showModal.bind(elem)();															//  привязываем this к функции и вызываем
		});
	});
	
	// Вешаем на все кнопки с классом .popup-close функцию закрытия модального окна (крестик)
	popupBG.querySelectorAll('.popup-close').forEach(function(elem){
		elem.addEventListener('click', function () {
			closeModal.bind(elem)();														//  привязываем this к функции и вызываем
		});
	});
	
	// Закрываем модальное окно по нажатию на фон
	popupBG.addEventListener('click', closeModal);
	
	// При этом по нажатию на само модальное окно, оно не должно исчезать
	popupAll.forEach(function(elem){
		elem.onclick = function(event) {
			event.stopPropagation();   //при клике на modal, теперь останавливается всплытие событий и modal-wrap не исчезнет
		}
	});

	function showModal() {
		
		d.onkeydown = function (event) {
			if (event.keyCode == 27) closeModal();
		}									// вешаем оброботчик события на клавишу ESC

		popupBG.classList.add('active');

		if(this.dataset.popup == '#popup-author') {
			popupBG.querySelector('#popup-author').classList.add('active');	
		
			cLeft.style.top = cCenter.style.top = cRight.style.top = '100vh';
			
			body.classList.add('gradient-animated');

		} else if(this.dataset.popup == '#popup-cube') {
			popupBG.querySelector('#popup-cube').classList.add('active');	
			
			body.classList.add('gradient-animated');
			cLeft.classList.add('opacity-cntrs');	
			cCenter.classList.add('opacity-cntrs');	
			cRight.classList.add('opacity-cntrs');	
			
		} else {
			popupBG.querySelector(this.dataset.popup).classList.add('active');		
		}
		
	}
	
	function closeModal() {
		
		if(this !== undefined && this.classList.contains('popup-close')) {
			
			popupBG.querySelector(this.dataset.popup).classList.remove('active');		// удаляем класс 'active' у текущего popup
			
			if(this.dataset.popup == '#popup-author') closeModalAuthor();
			if(this.dataset.popup == '#popup-cube') closeModalCube();
			
		} else {
			for (let elem of popupAll) {
				if (elem.classList.contains('active')) {
					elem.classList.remove('active');								// удаляем класс 'active'
				
					if(elem.getAttribute('id') == 'popup-author') closeModalAuthor();
					if(elem.getAttribute('id') == 'popup-cube') closeModalCube();
					
					break; // выходим не дожидаясь окончания цикла, если нашли активный элемент
				}
			}
		}
		
		d.onkeydown = null;																		// удаляем оброботчик события с клавиши ESC
		
		setTimeout(function() {
			popupBG.classList.remove('active');									// удаляем класс 'active' у фона
		}, 300);
	}
	
	function closeModalAuthor () {		
		
		cLeft.style.top = cCenter.style.top = cRight.style.top = '';
				
		setTimeout(function() {
			body.classList.remove('gradient-animated');
		}, 300);
	}	
	function closeModalCube () {
		
		cLeft.classList.remove('opacity-cntrs');	
		cCenter.classList.remove('opacity-cntrs');	
		cRight.classList.remove('opacity-cntrs');	
		
		setTimeout(function() {
			body.classList.remove('gradient-animated');
		}, 300);
	}
	
}());				


/* ---- куб ---- */
(function () {
	const cube = d.querySelector('#cube');
	
	// Общая функция + пояснения
	function buttonPressed(event) {
		if (event.buttons == null)
			return event.which != 0;
		else
			return event.buttons != 0;
	}	
	/* Обратите внимание, что обработчик «mousemove» зарегистрирован для всего окна. Даже если во время изменения размеров мышь выходит за пределы панели, мы все равно обновляем ширину панели и прекращаем JavaScript touch events, когда клавиша мыши была отпущена. 

	Мы должны прекратить изменение размера панели, когда пользователь отпускает клавишу мыши. К сожалению, не все браузеры устанавливают для событий «mousemove» свойство which. Существует стандартное свойство buttons, которое предоставляет аналогичную информацию, но оно также поддерживается не во всех браузерах. К счастью, все основные браузеры поддерживают что-то одно: либо buttons, либо which. Функция buttonPressed в приведенном выше примере сначала пытается использовать свойство buttons, и, если оно не доступно, переходит к which.	

	//инфа отсюда:
	https://yandex.ru/turbo?text=https%3A%2F%2Fwww.internet-technologies.ru%2Farticles%2Fobrabotka-sobytiy.html
	*/	/* пояснения */

	// (1) отследить нажатие
	cube.addEventListener("mousedown", function(event) {
		if (event.which == 1) { //если нажатие левой КМ
			// меняем стили
			event.preventDefault(); // Предотвращает выделение
			body.style.cursor = 'e-resize';

			// (2) отследить позиционирование на элементе
			console.log(getComputedStyle(cube).transform);
			
			// (3) добавляем событие движения мыши
			addEventListener("mousemove", moved);
		}
	});

	function moved(event) {
		
		// (4) если зажатой кнопки НЕ найдено, то удаляем ненужные обработчики событий
		if (!buttonPressed(event)) { 
			
			// восстанавливаем стили
			body.style.cursor = '';

			cube.style.transition = 'all linear 1s'
			cube.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
			
			setTimeout(function() {
						cube.style.transition = ''
				cube.style.animation = '';
			}, 1000);

			removeEventListener("mousemove", moved);
			
		} else {
			
			// (5) если зажатая кнопка найдена, то обрабатываем событие
			cube.style.animation = 'none';

			cube.style.transform = '' + getComputedStyle(cube).transform + '';
			
			//d.addEventListener('mousemove', function (event) {
				cube.style.MozTransform = 'rotateX(-' + event.pageY + 'deg) rotateY(' + event.pageX + 'deg)';
				cube.style.WebkitTransform = 'rotateX(-' + event.pageY + 'deg) rotateY(' + event.pageX + 'deg)';
			//});	

			}
		}

	/*---- Что можно доработать ----*/
	
	// 1. При хватании мышью куб хватается не за то место, на котором курсор
	// 
	// 2.
	
}());

/*---- Что можно доработать ----*/

// 1. 
// 
// 2. 
// 888








/* 
при клике на задачу в cLeft  отслежтвать ширину cCenter и центрировать контент, если есть такая возможность
*/


