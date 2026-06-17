const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

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
    { title: "Новини", url: "index.html#news-container" },
    { title: "Контакти", url: "contact.html" }
  ]);
});

app.get('/api/news', (req, res) => {
  res.json(news);
});

app.get('/api/news/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id < 0 || id >= news.length) {
    return res.status(404).json({ error: 'Новину не знайдено' });
  }

  return res.json(news[id]);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Сервер працює на http://localhost:${port}`);
  });
}

module.exports = { app, news };
