const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares');
const { insertSchema, findSchema }  = require('./models');
const { infections }  = require('./db');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req,res) => {
  res.json({
    message: 'Bucharest COVID-19 Tracking App 🦠'
  });
});

app.get('/cases/get', (req,res) => {
  const validation = findSchema.validate(req.body);
  if( !validation.error ){
    const fromDate = new Date(Number(req.body.fromDate) * 1000);
    const toDate = new Date(Number(req.body.toDate) * 1000);

    infections.find({timestamp: { $gte: fromDate, $lte: toDate } }, (err, data) => {
      if (err){
        res.status(422);
        res.json('Database error');
        return;
      }
      res.json(data);
    });
  } else{
    res.status(422);
    res.json({
      error: validation.error.details[0].message
    });
  }
});

app.post('/cases/add', (req,res) => {
  let noUnvalidated = 0;
  req.body.forEach(day => {
    const validation = insertSchema.validate(day);
    if( !validation.error ){
      let data = {};
      data.timestamp = new Date(Number(day.timestamp) * 1000);
      data.infections = day.infections;
      infections.insert(data);
    }else{
      noUnvalidated = noUnvalidated + 1;
    }
  });
  if( noUnvalidated == 0 ){
    res.json({
      message:'Data inserted to DB 💾'
    });
  }else{
    res.status(422);
    res.json({
      error: validation.error.details[0].message
    });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.APP_PORT || 5000, () => {
  console.log(`App running on port ${process.env.APP_PORT}`);
});





