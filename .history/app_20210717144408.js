const express = require('express')
const app = express()
const port = 3000


app.use('/', express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

app.get('/api/level1', (req, res) => {
    res.send([1,2,3,4]);
})
