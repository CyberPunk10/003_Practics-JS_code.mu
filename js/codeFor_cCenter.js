"use strict";

let objTasks = { 
	
	['41. Варианты ответов в HTML коде'] : 
	
	`<div class="cCenter-task" data-task="exercise-41">
					<p><span>Задача 1</span>Сделайте так, чтобы при выборе одного из ответов вопроса этот ответ сразу проверялся на правильность.</p>
					<div class="block">
						<code class="highlight" data-module="highlight" data-lang="javascript">let exs  = d.getElementById('exercise-41-1'),
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
						</code>
					</div>

					<p><span>Задача 2</span>Модифицируйте ваш код так, чтобы проверка ответов выполнялась по нажатию на кнопку.</p>
					<div class="block">
						<code class="highlight" data-module="highlight" data-lang="javascript">let exs   = d.getElementById('exercise-41-2'),
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
			if (arrChecked.length &lt; 3) {
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
							if (elem.name == currentInputName &amp;&amp; elem.getAttribute('data-right') !== null) {
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
						</code>
					</div>
				</div>`,
	
	['42. Варианты ответов в массиве'] :	
	
	`let exs 			= d.getElementById('exercise-42'),
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
	}`
}