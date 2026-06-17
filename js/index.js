fetch('/api/news')
    .then(response => response.json())
    .then(data => {
        updateNewsCounter(data);
        renderCarousel(data);
    })
    .catch(error => console.error('Помилка:', error));

function updateNewsCounter(data) {
    const counter = document.getElementById('home-news-count');

    if (counter) {
        counter.textContent = data.length;
    }
}

function renderCarousel(data) {
    const carouselContainer = document.getElementById('carousel-container');
    carouselContainer.innerHTML = '';

    data.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-item${index === 0 ? ' active' : ''}`;

        const link = document.createElement('a');
        link.className = 'carousel-news-link';
        link.href = `news-detail.html?id=${index}`;

        const image = document.createElement('img');
        image.className = 'd-block w-100';
        image.src = item.image;
        image.alt = item.category || item.title;

        const caption = document.createElement('div');
        caption.className = 'carousel-caption carousel-caption-box d-none d-md-block';

        const title = document.createElement('h5');
        title.textContent = item.title;

        const text = document.createElement('p');
        text.textContent = item.text;

        caption.append(title, text);
        link.append(image, caption);
        slide.appendChild(link);
        carouselContainer.appendChild(slide);
    });

    if (window.bootstrap) {
        const carouselElement = document.getElementById('carouselExampleIndicators');
        const carousel = bootstrap.Carousel.getOrCreateInstance(carouselElement);
        carousel.to(0);
        carousel.cycle();
    }
}
