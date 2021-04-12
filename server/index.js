const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares');
const { getCasesByInterval, getAllCases, updateCovidDb } = require('./controllers');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:8080'
}));
app.use(morgan('tiny'));

app.get('/', (req,res) => {
  res.json({
    message: 'Bucharest COVID-19 Tracking App 🦠'
  });
});

app.post('/cases/get/interval', getCasesByInterval);
app.get('/cases/get/all', getAllCases);
app.get('/cases/update', updateCovidDb);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.APP_PORT || 5000, () => {
  console.log(`App running on port ${process.env.APP_PORT}`);
});





