const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./treeholes.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS treeholes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
)`);

const sensitiveWords = [
  '操', '草', '妈', '逼', '傻逼', '傻B', 'SB', '靠', '日', '去死',
  '垃圾', '废物', '贱人', '婊子', '畜生', '狗日', '操你', '他妈的',
  '你妈', '你娘', '麻痹', '妈蛋', '滚蛋', '去死', '屎', '尿', '屁',
  'cao', 'ni ma', 'tmd', 'nmd', 'sb', 'fuck', 'shit', 'bitch', 'asshole'
];

function filterContent(content) {
  let filtered = content;
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/submit', (req, res) => {
  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ success: false, message: '内容不能为空' });
  }
  if (content.length > 500) {
    return res.status(400).json({ success: false, message: '内容不能超过500字' });
  }
  
  const filteredContent = filterContent(content.trim());
  const createdAt = Date.now();
  
  db.run('INSERT INTO treeholes (content, created_at) VALUES (?, ?)', 
    [filteredContent, createdAt], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: '保存失败' });
    }
    res.json({ success: true, id: this.lastID });
  });
});

app.get('/api/list', (req, res) => {
  db.all('SELECT * FROM treeholes ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: '查询失败' });
    }
    res.json({ success: true, data: rows });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});