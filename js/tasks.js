/*--------------- 21-26. Чеклист на JavaScript ---------------*/
(function () {
	let exs  	 = d.querySelector('#exercises-21-26'),		// контейнер с нашей задачей
			input  = exs.querySelector('#input'),  					// input для ввода новых записей
			list   = exs.querySelector('#list');  					// наш список ul

	// создаём запись по нажатию на Enter
	input.addEventListener('keypress', function(event) {
		if(event.key == 'Enter') {
			list.insertAdjacentHTML('afterBegin', '<li></li>'); // добавляем li в ul

			let task = d.createElement('span');

			task.classList.add('task');
			task.innerHTML = this.value;
			
			// добавляем созданную запись (найдёт только первый (верхний) li, в него и добавляем)
			list.querySelector('li').appendChild(task);		
			
			input.value = '';		// очищаем инпут
			
			editNote(task);		// функция редактирования записи при двойном клике по созданной записи
			
			createBtnRemove ();		// создаем кнопку 'удалить'
			
			createBtnMark ();		// создаем кнопку 'сделано'
		};
	});

	function editNote(task) {
		task.addEventListener('dblclick', function(event) {
			if (this.parentElement.querySelector('span > input') != null) {
				return false; // условие, при котором не будет повторно создаваться input при повторном dblclick на уже созданном инпуте
			} else {

				let thisSpan  = this.parentElement.querySelector('span'),
						tempInput = d.createElement('input'),
						tempValue = tempInput.value = thisSpan.innerText;

				thisSpan.innerText = "";
				thisSpan.appendChild(tempInput);
				tempInput.focus(); // в созданный инпут можно сразу вводить текст (фокус уже на нем)

				// сохраняем изменения по нажатию на Enter
				tempInput.addEventListener('keypress', function(event) {
					if(event.key == 'Enter') {
						tempValue = this.value;
						this.parentElement.removeChild(tempInput);
						thisSpan.innerText = tempValue;
					};
				});
			};
		});	
	}
	
	function createBtnRemove () {
		let remove = d.createElement('span');

		remove.classList.add('btn');
		remove.innerHTML = 'удалить';
		list.querySelector('li').appendChild(remove); // найдёт только первый li, в него и добавляем новую кнопку

		remove.addEventListener('click', function() {
			list.removeChild(this.parentElement);
		});
	}	
	
	function createBtnMark () {
		let mark = d.createElement('span');

		mark.classList.add('btn');
		mark.innerHTML = 'сделано';
		list.querySelector('li').appendChild(mark); // найдёт только первый li, в него и добавляем новую кнопку

		mark.addEventListener('click', function() {
			this.parentElement.querySelector('span').classList.toggle('done');
		});
	}
	
	/*---- Что можно доработать ----*/

	// 1. При редактировании, если добавлен класс "сделано", то редактируется со соответвующими стилями (с зачеркнутым текстом);
	// 
	// 2. При редактировании можно сохранять не по нажатию на Enter, а при событии увода фокуса с инпута.
	// 
	// 3.

}());



/*----------- 27-30. Записная книжка на JavaScript -----------*/
(function () {
	let exs  	 		 = d.querySelector('#exercises-27-30'),
		textAria   	 = exs.querySelector('#text > textarea'),
		saveBtn  	 	 = exs.querySelector('#text > button'),
		newNoteBtn   = exs.querySelector('#create > button'),
		notes 		 	 = exs.querySelector('#notes'),
		texts 			 = {},
		counterNotes = 0,
		activeNote   = newNoteBtn,
		popupSaveNoteArr = [];
	
	saveBtn.addEventListener('click', function() {
		if(saveBtn.getAttribute('data-mode') == "create") {
			createNewNote();
		} else {
			editActiveNote();
		}
	});

	function createNewNote () {
		texts[counterNotes+1] = textAria.value;
		counterNotes++;
		textAria.value = '';

		let note 			 = d.createElement('li'),
				firstSpan  = d.createElement('span'),
				secondSpan = d.createElement('span');

		firstSpan.classList.add('first-span');
		secondSpan.classList.add('second-span');
		firstSpan.setAttribute('data-key', counterNotes);
		firstSpan.innerText = 'запись ' + counterNotes;
		secondSpan.innerText = '+';
		notes.appendChild(note);
		note.appendChild(firstSpan);
		note.appendChild(secondSpan);

		firstSpan.addEventListener('click', function() {
			saveBtn.setAttribute('data-mode', "update");
			textAria.value = texts[this.getAttribute('data-key')];
			firstSpan.classList.add('active');
			if(activeNote != this) {
				activeNote.classList.remove('active');
			}
			activeNote = this;
		});

		secondSpan.addEventListener('click', function() {
			note.parentElement.removeChild(note);
			if (activeNote == this.parentElement.querySelector('.first-span')){
				activeNote = newNoteBtn;
				newNoteBtn.classList.add('active');
				saveBtn.setAttribute('data-mode', "create");
			}
		});
	};

	function editActiveNote () {
			texts[activeNote.getAttribute('data-key')] = textAria.value;
	};

	newNoteBtn.addEventListener('click', function() {
		saveBtn.setAttribute('data-mode', "create");
		this.classList.add('active');
			if(activeNote != this) {
				activeNote.classList.remove('active');
			}
			activeNote = this;
		textAria.value = '';
	});

	/* Усовершенствование: теперь не обязательно нажимать "Сохранить" при редактировании, данные сохранются при уходе с textaria */
	textAria.addEventListener('blur', function () {
		if (activeNote != newNoteBtn) {
			texts[activeNote.getAttribute('data-key')] = textAria.value;
			showPopupSaveNote()
		}
	});

	function showPopupSaveNote () {
		let popupSaveNote = d.createElement('span');
		popupSaveNote.innerText = 'сохранено';
		activeNote.appendChild(popupSaveNote);
		popupSaveNote.classList.add('popup-save-note');
		popupSaveNoteArr.push(popupSaveNote);

		setTimeout(closePopupSaveNote, 3000);
	}

	function closePopupSaveNote () {
		let popupSaveNote = popupSaveNoteArr[0];
		popupSaveNote.parentElement.removeChild(popupSaveNote);
		popupSaveNoteArr.shift();
	}

	/*---- Что можно доработать ----*/

	// 1. После добавления автосохранения (событие 'blur' на textarea), можно убирать кнопку "сохранить", и вместо неё логичнее и более интуитивнее теперь встанет кнопка "новая запись".
	// 
	// 2. Если убрать кнопку "сохранить", то нужна кнопка очищения textaria, чтобы проще создавать новую запись.
	// 
	// 3. В название записей можно в скобках добавлять кусочек самой записи, чтобы визуально проще было ориентироваться между записяпи.


}());



/*--------------------------- ТЕСТЫ ---------------------------*/
/*-------- 37. Тест с вопросами и ответами в HTML коде --------*/
(function () {
	let exs    = d.querySelector('#exercise-37'),
		inputs 	 = exs.querySelectorAll('input[data-right]');

	inputs.forEach((el) => el.addEventListener('keypress', function (event) {
		if(event.key == 'Enter') {
			checkoutAfterEvent (this) 
		};
	}));

	inputs.forEach((el) => el.addEventListener('blur', function (event) {
		checkoutAfterEvent (this) 
	}));

	function checkoutAfterEvent (elem) {
		if (elem.getAttribute('data-right') == elem.value) {
			elem.classList.remove('wrong');
			elem.classList.add('right');
		} else {
			elem.classList.remove('right');
			elem.classList.add('wrong');
		}
	};

}());

/*--------------- 38. Тест с ответами в массиве ---------------*/
(function () {
	let exs 	= d.querySelector('#exercise-38'),
		inputs  = exs.querySelectorAll('input'),
		answers = [
			'21',
			'11',
			'10',
		];

	inputs.forEach((el, i) => el.addEventListener('keypress', function (event) {
		if(event.key == 'Enter') {
			checkoutAfterEvent (this, answers, i)
		};
	}));

	inputs.forEach((el, i) => el.addEventListener('blur', function (event) {
		checkoutAfterEvent (this, answers, i) 
	}));

}());

// общая функция проверки теста (используется в упражнениях 38-39)
function checkoutAfterEvent (elem, arrAnswers, i) {
	//подсовываем индекс элемента из коллекции forEach в массив answers
	if (arrAnswers[i] == elem.value) {
		elem.classList.remove('wrong')
		elem.classList.add('right')
	} else {
		elem.classList.remove('right')
		elem.classList.add('wrong')
	}
};

/*--------- 39. Тест с вопросами и ответами в массиве ---------*/
(function () {
	let exs 	  = d.getElementById('exercise-39-body'),
		btnTest	  = exs.querySelector('#btn-test-39'),
		inputs,
		questions = [
			'Вопрос 1? Правильный ответ: 21',
			'Вопрос 2? Правильный ответ: 11',
			'Вопрос 3? Правильный ответ: 10',
		],
		answers 	= [
			'21',
			'11',
			'10',
		];

	btnTest.addEventListener('click', createTest);

	function createTest () {
		if (!exs.contains(exs.querySelector('div'))) {

			questions.forEach(function(el, i) {
				let temp = exs.appendChild(d.createElement('div'));	
				temp.appendChild(d.createElement('span')).innerText = questions[i];
				temp.appendChild(d.createElement('input'));
			});

			inputs = exs.querySelectorAll('input');

			inputs.forEach((el, i) => el.addEventListener('keypress', function (event) {
				if(event.key == 'Enter') {
					checkoutAfterEvent (this, answers, i)
				};
			}));

			inputs.forEach((el, i) => el.addEventListener('blur', function (event) {
				checkoutAfterEvent (this, answers, i)
			}));

		} else {
			resetInputs(inputs);
		};	
	};

}());

// общая функция (используется в упражнениях 39-40)
function resetInputs(inputs) {
	inputs.forEach(function (el) {
		el.value = '';
		el.classList.remove('right');
		el.classList.remove('wrong');
	}); 
}

/*--------- 40. Тест с вопросами и ответами в объекте ---------*/
(function () {
	let exs 	= d.getElementById('exercise-40-body'),
		btnTest	= exs.querySelector('#btn-test-40'),
		inputs,
		obj			= {
			'Вопрос 1? Правильный ответ: 21' : '21',
			'Вопрос 2? Правильный ответ: 11' : '11',
			'Вопрос 3? Правильный ответ: 10' : '10',
		};

	btnTest.addEventListener('click', createTest);

	function createTest () {
		if (!exs.contains(exs.querySelector('div'))) {

			for (let key in obj) {
				let temp = exs.appendChild(d.createElement('div'));	
				temp.appendChild(d.createElement('span')).innerText = key;
				temp.appendChild(d.createElement('input'));
			};

			inputs = exs.querySelectorAll('input');

			inputs.forEach(el => el.addEventListener('keypress', function (event) {
				if(event.key == 'Enter') {
					checkoutAfterEvent(this);
				};
			}));

			inputs.forEach(el => el.addEventListener('blur', function (event) {
				checkoutAfterEvent(this);
			}));

		} else {
			resetInputs(inputs);
		}
	}

	function checkoutAfterEvent(elem) {
		let key = elem.previousElementSibling.innerText;		// это ключ объекта с вопросами и ответами
		
		if (elem.value == obj[key]) {												// находим правильное значение по ключу в объекте
			elem.classList.remove('wrong')
			elem.classList.add('right')
		} else {
			elem.classList.remove('right')
			elem.classList.add('wrong')
		}

	}

}());

/*--------- 41. Тест с ВАРИАНТАМИ ответов в HTML коде ---------*/
(function () {
	
	/* Задача 1
	Сделайте так, чтобы при выборе одного из ответов вопроса этот ответ сразу проверялся на правильность. */
	(function () {
		let exs  = d.getElementById('exercise-41-1'),
			inputs = exs.querySelectorAll('input');

		inputs.forEach((el) => el.addEventListener('change', function() {
			if (el.getAttribute('data-right') !== null) {
				el.parentElement.classList.remove('wrong')
				el.parentElement.classList.add('right')		
			} else {
				el.parentElement.classList.remove('right')
				el.parentElement.classList.add('wrong')	
			}
		}));
	}());
	
	/* Задача 2
	Модифицируйте ваш код так, чтобы проверка ответов выполнялась по нажатию на кнопку. */
	(function () {
		let exs   = d.getElementById('exercise-41-2'),
			inputs  = exs.querySelectorAll('input'),
			btnTest = exs.querySelector('#btn-test-41');

		btnTest.addEventListener('click', resultTest);

		function resultTest() {
			//проверка на заполненность inputs
			let arrChecked = [];
			inputs.forEach((el) => { 
				if (el.checked) {
					arrChecked.push(el.checked);
				};
			});
			if (arrChecked.length < 3) {
				//если не заполнено, то выводим сообщение об этом и сначала найдём куда именно его выводить
				let parent = exs.querySelector('.wrap-btn');
				return showPopupNotFilledIn(parent);
			}
			//если на кнопке 'Результат теста', то узнаем результат
			if (btnTest.innerText == 'Результат теста') {
				inputs.forEach(function(el) {
				if (el.checked) {
					if (el.getAttribute('data-right') !== null) {
						el.parentElement.classList.add('right')		
					} else {
						el.parentElement.classList.add('wrong');
						let currentInputName = el.name;
						inputs.forEach((elem) => {
							if (elem.name == currentInputName && elem.getAttribute('data-right') !== null) {
								elem.parentElement.classList.add('right');
							};
						});
					};
				};
			});

			btnTest.innerText = 'Начать сначала';
			//иначе очищаем результат
			} else {
				resetTest(btnTest, inputs);
			}
		}

	}());
	
}());

// общая функция используется в нескольких упражнениях начиня с 41
function showPopupNotFilledIn (parent) {
	if(!parent.contains(parent.querySelector('.popup-test'))) { // Запускать только если уже не создан popup
		let popupSpan = d.createElement('span');
		popupSpan.innerText = 'Ответте на все вопросы';
		parent.appendChild(popupSpan);
		popupSpan.classList.add('popup-test');		

		setTimeout(function(){delPopupNotFilledIn(popupSpan)}, 3000); //т.к. нам нужно передать функцию с параметром, а setTimeout по умолчанию не даёт этого сделать, то вкладываем анонимную функцию, которая вызывает нужную нам фукцию с нужным нам параметром.
	}; 
};
// общая функция используется в нескольких упражнениях начиня с 41
function delPopupNotFilledIn (popup) {
	popup.parentElement.removeChild(popup);
}
// общая функция используется в нескольких упражнениях начиня с 41
function resetTest(btn, inputs) { 
	btn.innerText = 'Результат теста';
	inputs.forEach((el) => {
		el.parentElement.classList.remove('right', 'wrong');
		el.checked = false;
	});
}

/*-------------- 42. Тест с ВАРИАНТАМИ ответов в массиве --------------*/
(function () {
	//В условии задачи ничего не говорилось про указание атрибута value в HTML, без которого решить задачу было бы трудно, поэтому я добавил этот атрибут. Если же нужно было обойтись без него, то любопытно универсальное решение.
	let exs 		= d.getElementById('exercise-42'),
		inputs  	= exs.querySelectorAll('input'),
		btnTest   = exs.querySelector('#btn-test-42'),
		answerArr = ['1','2','3'];

	btnTest.addEventListener('click', resultTest);

	function resultTest() {
		//проверка на заполненность inputs
		let arrChecked = [];

		inputs.forEach((el) => { 
			if (el.checked) {
				arrChecked.push(el);
			};
		});
		if (arrChecked.length < 3) {
			//если не заполнено, то выводим сообщение об этом и сначала найдём куда именно его выводить
			let parent = exs.querySelector('.wrap-btn');
			return showPopupNotFilledIn(parent);
		}
		//если на кнопке 'Результат теста', то узнаем результат
		if (btnTest.innerText == 'Результат теста') {
			//перебираем "чекнутые" inputs и подставляем индекс массива "arrChecked" в массив с правильными ответами
			for (let i = 0; i < arrChecked.length; i++) {
				if(arrChecked[i].value == answerArr[i])	{
					arrChecked[i].parentElement.classList.add('right');
				} else {
					arrChecked[i].parentElement.classList.add('wrong');
				}
			}
			//ищем и показываем все правильные варианты
			inputs.forEach(function(elem) { 

				switch (elem.name) {
					case 'name-1_42':
						if(elem.value == answerArr[0]) {
							elem.parentElement.classList.add('right');
						}
						break;
					case 'name-2_42':
						if(elem.value == answerArr[1]) {
							elem.parentElement.classList.add('right');
						}
						break;
					case 'name-3_42':
						if(elem.value == answerArr[2]) {
							elem.parentElement.classList.add('right');
						}
						break;
				}
	//закоментированный код делает тоже самое, что и switch выше, но в исполнении if-ов
	//			if (elem.name == 'name-1_42' && elem.value == answerArr[0]) {
	//				elem.parentElement.classList.add('right');
	//			} 
	//			if (elem.name == 'name-2_42' && elem.value == answerArr[1]) {
	//				elem.parentElement.classList.add('right');
	//			} 
	//			if (elem.name == 'name-3_42' && elem.value == answerArr[2]) {
	//				elem.parentElement.classList.add('right');
	//			} 
			});
			btnTest.innerText = 'Начать сначала';
		//иначе очищаем результат
		} else {
			resetTest(btnTest, inputs);
		}
	}
}());

/*-------------- 43. Вопросы и варианты ответов в объекте --------------*/
(function () {
	
	let exs 		= d.getElementById('exercise-43'),
		btnTest   = exs.querySelector('#btn-test-43'),
		questions = [
			{
				text: 'вопрос 1?',
				right: 0,
				variants: [
					'ответ 1',
					'ответ 2',
					'ответ 3'
				]
			},
			{
				text: 'вопрос 2?',
				right: 1,
				variants: [
					'ответ 1',
					'ответ 2',
					'ответ 3'
				]
			},
			{
				text: 'вопрос 3?',
				right: 2,
				variants: [
					'ответ 1',
					'ответ 2',
					'ответ 3'
				]
			},
		],
		cntr = btnTest.parentElement.parentElement;											// контейнер в котором будем создавать тест

	/* Так как при создании div-ов мы будем вставлять их в тот же контейнер, что и кнопку, но перед ней, то метод appendChild нам не подходит. Можно было бы создать контейнер в контейнере, но в моём случае уже подвязаны стили, которые влияют на несколько упражнений выше, поэтому будем пробовать другим способом. Вместе с тем, так как каждый новый div будет вставляться в начало, то значения, записанные из массива должны сначала браться с конца массива. Поэтому, первым делом переворачиваем массив. */
	
	/* правильным будем считать только тот input, которому присвоим data-атрибут right (неважно с каким значением) */
	
	questions = questions.reverse();
	
	btnTest.addEventListener('click', resultTest);										// вешаем событие на кнопку

	function createTest () {																					// создаем тест
		
		/* Чуть позже нам нужно будет создать input с типом 'radio', а это значит, что необходимо добавить атрибут 'name', который будет связывать inputs для возможности выбора только одного из них. Чтобы для каждого вопроса был свой 'name', заведём счётчик. */
			
		let counter1 = makeCounterForName();														// счётчик для атрибута inputs 'name'
		
		questions.forEach(function(el) {																// перебираем наш массив с объектами и формируем HTML
			
			//let childDiv = cntr.appendChild(d.createElement('div'));		// appendChild нам не подходит
			
			let childDiv = cntr.insertBefore(d.createElement('div'), cntr.firstChild);	// создаем div
			
			childDiv.appendChild(d.createElement('span')).innerText = el.text;	// создаем span с вопросом внутри div		

			let currentCount1 = counter1(),
					counter2 			= makeCounterForData();											// счётчик для атрибута inputs 'data-count'
			
			el.variants.forEach(function(elem) {
				
				let label = childDiv.appendChild(d.createElement('label'));	// создаем label с вариантом ответа внутри div	
				
				label.innerText = elem;																			// вписываем вариант ответа
				
				let input = label.insertBefore(d.createElement('input'), label.firstChild);		// вставляем в начало (перед текстом ответа)
				
				input.setAttribute('type', "radio");												// указываем тип input
				input.setAttribute('name', `name-${currentCount1}_43`);			// подставляем в название счётчик	1	
				
				if(el.right == counter2()) {
					input.setAttribute('data-right', el.right);								// сохраняем в data-атибуте номер правильного ответа
				}
				
			});
		});
	}
	
	function makeCounterForName() {																					// функция создания счётчика
		function counter() {
			return counter.currentCounter--;																		// отнимаем -1
		}
		counter.currentCounter = questions.length;														// длина массива, который будем перебирать 
		
		return counter;
	}
	
	function makeCounterForData() {																					// функция создания счётчика
		function counter() {
			return counter.currentCounter++;																		// прибавляем +1
		}
		counter.currentCounter = 0;																						
		
		return counter;
	}
	
	function resultTest() {
		
		// проверяем создан ли уже тест, узнавая наличие input в div для нашего теста
		if(!cntr.querySelector('input')) { 								// null - нет input - значит создаем HTML и на этом пока всё
			createTest();
		} else {																					// иначе проверяем заполненность inputs
			
			let	inputs   = exs.querySelectorAll('input'),
				arrChecked = [];															// здесь будем хранить чекнутые input для последующей проверки

			inputs.forEach((el) => { 
				if (el.checked) {
					arrChecked.push(el);
				};
			});

			if (arrChecked.length < questions.length) {			// если не заполнены, то выводим сообщение об этом
				 
				let parent = exs.querySelector('.wrap-btn');	// и сначала найдём куда именно его выводить
				
				return showPopupNotFilledIn(parent);					// выводим сообщение и выходим из функции
			}
			
			// если же тест заполнен, то проверяем его
			
			if (btnTest.innerText == 'Результат теста') {		// если на кнопке 'Результат теста', то узнаем результат
				getResult(arrChecked, inputs);
			} else {
				resetTest(btnTest, inputs);										// иначе очищаем результат
			}
		}
	}
	
	function getResult(arrChecked, inputs) {
	
		arrChecked = arrChecked.reverse(); 								// реверсируем массив, т.к. сравнивать будем также с реверсивным массивом
		
		//перебираем "чекнутые" inputs и подставляем индекс массива "arrChecked" в массив с правильными ответами
		for (let i = 0; i < arrChecked.length; i++) {
			if(arrChecked[i].hasAttribute('data-right'))	{	// если содержит атрибут data-right, то..
				arrChecked[i].parentElement.classList.add('right');
			} else {
				arrChecked[i].parentElement.classList.add('wrong');
			}
		}
		
		//ищем и показываем все правильные варианты
		inputs.forEach(function(elem) { 
			if(elem.hasAttribute('data-right'))	{			  		// если содержит атрибут data-right, то..
				elem.parentElement.classList.add('right');
			}
		});
		
		btnTest.innerText = 'Начать сначала';
	}
}());



