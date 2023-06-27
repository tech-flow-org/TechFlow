const express = require('express');

const app = express();
app.use(express.json());
app.post('/api/data', (req, res) => {
  console.log('api/data', req.body);
  res.json({ name: '服务发送成功' });
});

app.listen(8001, () => {
  console.log('listening on port 8001');
});
