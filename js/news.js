fetch('/api/news')
    .then(response => response.json())
    .then(data => {
        const selectedCategory = getSelectedCategory();
        updateNewsHeader(selectedCategory);
        renderCategoryFilters(data, selectedCategory);
        renderNewsList(data, selectedCategory);
    })
    .catch(error => {
        console.error('Помилка:', error);
        const container = document.getElementById('news-list');
        container.innerHTML = '<p class="text-muted">Не вдалося завантажити новини.</p>';
    });

function getSelectedCategory() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
}

function updateNewsHeader(selectedCategory) {
    const title = document.getElementById('news-page-title');
    const description = document.getElementById('news-page-description');

    if (selectedCategory) {
        title.textContent = selectedCategory;
        description.textContent = 'Матеріали порталу, відфільтровані за вибраним видом спорту.';
    } else {
        title.textContent = 'Новини спорту';
        description.textContent = 'Усі матеріали порталу зібрані в одному розділі.';
    }
}

function renderCategoryFilters(data, selectedCategory) {
    const container = document.getElementById('category-filters');
    const categories = [...new Set(data.map(item => item.category))];

    container.innerHTML = '';
    container.appendChild(createFilterLink('Усі', 'news.html', !selectedCategory));

    categories.forEach(category => {
        const url = `news.html?category=${encodeURIComponent(category)}`;
        container.appendChild(createFilterLink(category, url, selectedCategory === category));
    });
}

function createFilterLink(label, href, isActive) {
    const link = document.createElement('a');
    link.className = `category-filter${isActive ? ' active' : ''}`;
    link.href = href;
    link.textContent = label;
    return link;
}

function renderNewsList(data, selectedCategory) {
    const container = document.getElementById('news-list');
    const filteredNews = data
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !selectedCategory || item.category === selectedCategory);

    container.innerHTML = '';

    if (filteredNews.length === 0) {
        container.innerHTML = '<p class="text-muted">Для цього розділу поки немає новин.</p>';
        return;
    }

    filteredNews.forEach(({ item, index }) => {
        const column = document.createElement('div');
        column.className = 'col-md-6 col-xl-4';

        const card = document.createElement('a');
        card.className = 'news-list-card text-decoration-none text-dark';
        card.href = `news-detail.html?id=${index}`;

        const image = document.createElement('img');
        image.className = 'news-list-image';
        image.src = item.image;
        image.alt = item.title;

        const body = document.createElement('div');
        body.className = 'news-list-body';

        const meta = document.createElement('p');
        meta.className = 'news-list-meta';
        meta.textContent = `${item.category} | ${item.date}`;

        const title = document.createElement('h2');
        title.textContent = item.title;

        const text = document.createElement('p');
        text.textContent = item.text;

        body.append(meta, title, text);
        card.append(image, body);
        column.appendChild(card);
        container.appendChild(column);
    });
}
