'use strict';

// DOM=========================================================================
const bodyElement = document.body;
const progressValueElement = document.querySelector(
	'[data-js-progress-value-element]',
);
const progressPercentsElement = document.querySelector(
	'[data-js-progress-percents-element]',
);
const techBlockBodyElement = document.querySelector(
	'[data-js-tech-block-body-element]',
);
const formElement = document.querySelector('[data-js-form-element]');
const inputTechTitleElement = document.querySelector(
	'[data-js-input-tech-title-element]',
);
const textareaDescriptionElement = document.querySelector(
	'[data-js-textarea-description-element]',
);
const modalElement = document.querySelector('[data-js-modal-element');
const modalBackdropElement = document.querySelector(
	'[data-js-modal-backdrop-element]',
);

const LS_KEY = 'technologies array';

// Functions===================================================================
const formAction = event => {
	event.preventDefault();
	const title = inputTechTitleElement.value.trim();
	const description = textareaDescriptionElement.value.trim();
	if (title.length === 0) return;
	const newTechnologyItem = {
		id: Date.now(),
		title,
		description,
		done: false,
	};
	technologiesArray.push(newTechnologyItem);

	renderTechnologiesList();
	renderValueProgressBar();

	inputTechTitleElement.value = '';
	textareaDescriptionElement.value = '';

	inputTechTitleElement.focus();
	saveToLS();
};

const openModal = event => {
	if (event.target.closest('article')) {
		if (!modalElement.classList.contains('open')) {
			modalElement.classList.add('open');
		}
	}
	const dataID = Number(event.target.closest('article')?.dataset.id);
	const neededTech = technologiesArray.find(item => item.id === dataID);
	if (!neededTech) return;
	modalElement.innerHTML = getTechnogyModalItemTemplate(neededTech);
};

const closeModal = () => {
	if (modalElement.classList.contains('open')) {
		modalElement.classList.remove('open');
	}
};

const getTechnogyItemTemplate = ({ done, id, title, description }) => {
	return `
		<article class="tech-block__card-tech card-tech ${
			done ? 'done' : ''
		}" data-id="${id}">
			<h3 class="card-tech__title">${title}</h3>
			<div class="card-tech__text">
				<p>
					${description}
				</p>
			</div>
		</article>
	`;
};
const getTechnologiesEmptyList = () => {
	return `
		<div class="tech-block__empty-list">
			Список технологій пустий
		</div>
	`;
};

const getTechnogyModalItemTemplate = ({ title, description, done, id }) => {
	return `
	<h2 class="modal__title">${title}</h2>
	<div class="modal__text-block">
		<p>${description}</p>
	</div>
	<hr />
	<div class="modal__learnt-input" data-id="${id}">
		<label for="learnt">Вивчив/ла</label>
		<input type="checkbox" id="learnt" ${done ? 'checked' : ''}  />
		<button type="button">Видалити скіл</button>
	</div>
	`;
};

const renderTechnologiesList = () => {
	techBlockBodyElement.innerHTML = '';
	if (technologiesArray.length !== 0) {
		for (const technologyItem of technologiesArray) {
			techBlockBodyElement.insertAdjacentHTML(
				'beforeend',
				getTechnogyItemTemplate(technologyItem),
			);
		}
	} else {
		techBlockBodyElement.insertAdjacentHTML(
			'beforeend',
			getTechnologiesEmptyList(),
		);
	}
};

const calculateValueProgressBar = () => {
	return (
		(100 * technologiesArray.filter(item => item.done === true).length) /
			technologiesArray.length || 0
	);
};

const renderValueProgressBar = () => {
	const result = calculateValueProgressBar();
	progressValueElement.style.width = result + '%';
	progressPercentsElement.textContent = result.toFixed(2) + '%';
	progressValueElement.style.backgroundColor = 'green';
};

const toggleTech = event => {
	const techID = Number(event.target.closest('div[data-id]').dataset.id);
	const neededTech = technologiesArray.find(item => item.id === techID);
	neededTech.done = event.target.checked;
	renderTechnologiesList();
	renderValueProgressBar();
	saveToLS();
};

const deleteTech = event => {
	if (event.target.closest('button')) {
		const dataIDElement = Number(
			event.target.closest('div[data-id]')?.dataset.id,
		);
		if (dataIDElement) {
			const findedItemIndex = technologiesArray.findIndex(
				value => value.id === dataIDElement,
			);
			technologiesArray.splice(findedItemIndex, 1);
			renderTechnologiesList();
			renderValueProgressBar();
			saveToLS();
		}
	}
	closeModal();
};

const saveToLS = () => {
	localStorage.setItem(LS_KEY, JSON.stringify(technologiesArray));
};

// Data========================================================================
const technologiesArray = JSON.parse(localStorage.getItem(LS_KEY)) || [];

// Functions Call==============================================================
renderTechnologiesList();
renderValueProgressBar();

// Event Listeners=============================================================
techBlockBodyElement.addEventListener('click', openModal);
modalBackdropElement.addEventListener('click', closeModal);

formElement.addEventListener('submit', formAction);

modalElement.addEventListener('change', toggleTech);
modalElement.addEventListener('click', deleteTech);
