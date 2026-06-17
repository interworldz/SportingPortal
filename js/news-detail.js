const params = new URLSearchParams(window.location.search);
const newsId = Number.parseInt(params.get('id'), 10);
const titleElement = document.getElementById('news-title');
const metaElement = document.getElementById('news-meta');
const imageElement = document.getElementById('news-image');
const summaryElement = document.getElementById('news-summary');
const contentElement = document.getElementById('news-content');
const sourceElement = document.getElementById('news-source');
const latestNewsElement = document.getElementById('latest-news');

function showError(message) {
    titleElement.textContent = 'Новину не знайдено';
    metaElement.textContent = '';
    imageElement.classList.add('d-none');
    summaryElement.textContent = message;
    contentElement.innerHTML = '';
    sourceElement.classList.add('d-none');
    sourceElement.innerHTML = '';
}

function renderNews(item) {
    titleElement.textContent = item.title;
    metaElement.textContent = `${item.category} | ${item.date}`;
    summaryElement.textContent = item.text;
    document.title = item.title;

    if (item.image) {
        imageElement.src = item.image;
        imageElement.alt = item.title;
        imageElement.classList.remove('d-none');
    }

    contentElement.innerHTML = '';
    const paragraphs = Array.isArray(item.content) ? item.content : [];
    paragraphs.forEach(paragraphText => {
        const paragraph = document.createElement('p');
        paragraph.textContent = paragraphText;
        contentElement.appendChild(paragraph);
    });

    sourceElement.innerHTML = '';
    if (item.sourceUrl) {
        const sourceLabel = document.createTextNode('Джерело: ');
        const sourceLink = document.createElement('a');
        sourceLink.href = item.sourceUrl;
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';
        sourceLink.textContent = item.sourceTitle || item.sourceUrl;

        sourceElement.append(sourceLabel, sourceLink);
        sourceElement.classList.remove('d-none');
    } else {
        sourceElement.classList.add('d-none');
    }
}

if (Number.isInteger(newsId) && newsId >= 0) {
    fetch(`/api/news/${newsId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Новину не знайдено');
            }
            return response.json();
        })
        .then(renderNews)
        .catch(() => showError('Перевірте посилання або поверніться на головну сторінку.'));
} else {
    showError('Відсутній або неправильний ідентифікатор новини.');
}

fetch('/api/news')
    .then(response => response.json())
    .then(data => {
        latestNewsElement.innerHTML = '';
        data.forEach((item, index) => {
            const column = document.createElement('div');
            column.className = 'col';

            const card = document.createElement('a');
            card.className = 'card h-100 text-decoration-none text-dark';
            card.href = `news-detail.html?id=${index}`;

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = item.title;

            const text = document.createElement('p');
            text.className = 'card-text';
            text.textContent = item.text;

            cardBody.append(title, text);
            card.appendChild(cardBody);

            column.appendChild(card);
            latestNewsElement.appendChild(column);
        });
    })
    .catch(() => {
        latestNewsElement.innerHTML = '<p class="text-muted">Не вдалося завантажити список новин.</p>';
    });
