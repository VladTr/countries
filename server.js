const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const initDb = require('./db/init');
const router = require('./api');

const app = express();

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));

(async() => {
  try {
    await initDb();
    app.use(router);
    
    app.use('/', express.static(path.join(__dirname, 'public')));

    app.use((err, req, res, next) => {
      if (err) {
          if (!res.headerSent) {
              res.status(503).json({success:false});
          }
      }
    });

    const port = 4000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch(ex) {
    console.log("sever error");
  }
  
})(app);





