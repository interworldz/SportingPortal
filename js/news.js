const NEWS_PER_PAGE = 3;

fetch('/api/news')
    .then(response => response.json())
    .then(data => {
        const selectedCategory = getSelectedCategory();
        const filteredNews = getFilteredNews(data, selectedCategory);
        const currentPage = getCurrentPage(filteredNews.length);

        updateNewsHeader(selectedCategory);
        renderCategoryFilters(data, selectedCategory);
        renderNewsList(filteredNews, currentPage);
        renderPagination(filteredNews.length, currentPage, selectedCategory);
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

function getCurrentPage(totalItems) {
    const params = new URLSearchParams(window.location.search);
    const requestedPage = Number.parseInt(params.get('page'), 10);
    const totalPages = Math.max(1, Math.ceil(totalItems / NEWS_PER_PAGE));

    if (!Number.isInteger(requestedPage) || requestedPage < 1) {
        return 1;
    }

    return Math.min(requestedPage, totalPages);
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

function getFilteredNews(data, selectedCategory) {
    return data
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !selectedCategory || item.category === selectedCategory);
}

function renderNewsList(filteredNews, currentPage) {
    const container = document.getElementById('news-list');
    const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
    const pageNews = filteredNews.slice(startIndex, startIndex + NEWS_PER_PAGE);

    container.innerHTML = '';

    if (filteredNews.length === 0) {
        container.innerHTML = '<p class="text-muted">Для цього розділу поки немає новин.</p>';
        return;
    }

    pageNews.forEach(({ item, index }) => {
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

function renderPagination(totalItems, currentPage, selectedCategory) {
    const container = document.getElementById('news-pagination');
    const totalPages = Math.ceil(totalItems / NEWS_PER_PAGE);

    container.innerHTML = '';

    if (totalPages <= 1) {
        return;
    }

    const list = document.createElement('ul');
    list.className = 'pagination justify-content-center mb-0';

    list.appendChild(createPageItem('Назад', currentPage - 1, selectedCategory, currentPage === 1));

    for (let page = 1; page <= totalPages; page += 1) {
        list.appendChild(createPageItem(String(page), page, selectedCategory, false, page === currentPage));
    }

    list.appendChild(createPageItem('Далі', currentPage + 1, selectedCategory, currentPage === totalPages));
    container.appendChild(list);
}

function createPageItem(label, page, selectedCategory, isDisabled, isActive = false) {
    const item = document.createElement('li');
    item.className = `page-item${isDisabled ? ' disabled' : ''}${isActive ? ' active' : ''}`;

    const link = document.createElement('a');
    link.className = 'page-link';
    link.href = isDisabled ? '#' : buildNewsUrl(selectedCategory, page);
    link.textContent = label;

    item.appendChild(link);
    return item;
}

function buildNewsUrl(selectedCategory, page) {
    const params = new URLSearchParams();

    if (selectedCategory) {
        params.set('category', selectedCategory);
    }

    if (page > 1) {
        params.set('page', page);
    }

    const query = params.toString();
    return query ? `news.html?${query}` : 'news.html';
}
