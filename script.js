const translations = {
  quenya: {
    'the stars are beautiful tonight.': 'I eleni ná quanta',
    'i love you.': 'Melinyel.',
    'a friend is a gift.': 'Mellon ná anna.',
    'hello': 'Elen sila lumenn’ omentielvo',
    'good morning': 'Aiya arëa',
    'thank you': 'Hantanyel',
  },
  sindarin: {
    'the stars are beautiful tonight.': 'I ithil lín síla.',
    'i love you.': 'Gi melin.',
    'a friend is a gift.': 'Mellon na annas.',
    'hello': 'Suilad',
    'good morning': 'Arëa aurë',
    'thank you': 'Hannon le',
  },
};

const sourceText = document.querySelector('#source-text');
const resultText = document.querySelector('#result-text');
const resultLanguage = document.querySelector('#result-language');
const characterCount = document.querySelector('#character-count');
const translateButton = document.querySelector('#translate-button');
const clearButton = document.querySelector('#clear-button');
const copyButton = document.querySelector('#copy-button');
const languageButtons = document.querySelectorAll('.language-button');
const phraseCards = document.querySelectorAll('.phrase-card');
let selectedLanguage = 'quenya';

function translate() {
  const original = sourceText.value.trim();
  const normalized = original.toLowerCase();
  const knownTranslation = translations[selectedLanguage][normalized];
  resultText.textContent = original ? knownTranslation || createIllustrativeTranslation(original) : 'Your translation will appear here';
}

function createIllustrativeTranslation(text) {
  const words = text.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
  const stems = selectedLanguage === 'quenya' ? ['Lúmë', 'silmë', 'melmë', 'elen', 'calma'] : ['Aurë', 'galad', 'meleth', 'annon', 'gil'];
  const suffix = selectedLanguage === 'quenya' ? 'va' : 'en';
  return words.map((word, index) => `${stems[index % stems.length]}${word.length > 5 ? suffix : ''}`).join(' ');
}

function updateCount() {
  characterCount.textContent = `${sourceText.value.length} / 240`;
}

sourceText.addEventListener('input', updateCount);
sourceText.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') translate();
});
translateButton.addEventListener('click', translate);
clearButton.addEventListener('click', () => {
  sourceText.value = '';
  resultText.textContent = 'Your translation will appear here';
  updateCount();
  sourceText.focus();
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedLanguage = button.dataset.language;
    languageButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    resultLanguage.textContent = button.textContent.trim().split(' ')[0];
    translate();
  });
});

phraseCards.forEach((card) => {
  card.addEventListener('click', () => {
    sourceText.value = card.dataset.phrase;
    updateCount();
    translate();
  });
});

copyButton.addEventListener('click', async () => {
  if (!resultText.textContent || resultText.textContent === 'Your translation will appear here') return;
  try {
    await navigator.clipboard.writeText(resultText.textContent);
    copyButton.innerHTML = 'Copied <span aria-hidden="true">&#10003;</span>';
    setTimeout(() => { copyButton.innerHTML = 'Copy <span aria-hidden="true">&#8599;</span>'; }, 1400);
  } catch { copyButton.textContent = 'Select to copy'; }
});

updateCount();
