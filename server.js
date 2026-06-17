// Initializes the Express application, configures middleware for CORS and static file serving from the root directory,
// and establishes API endpoints to serve JSON data to the frontend.
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

const news = [
  { title: "Чемпіонат України з футболу", text: "Найзапекліші матчі сезону..." },
  { title: "Фінал Кубка з баскетболу", text: "Боротьба найкращих команд..." },
  { title: "Київський марафон", text: "Тисячі учасників біжать..." }
];

app.get('/api/menu', (req, res) => {
  res.json([
    { title: "Про сайт", url: "about.html" },
    { title: "Галерея", url: "gallery.html" },
    { title: "Новини", url: "news-detail.html" },
    { title: "Контакти", url: "contact.html" }
  ]);
});

app.get('/api/news', (req, res) => {
  res.json(news);
});

app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`);
});