const fetch = require('node-fetch');
const Joi = require('joi');
const cheerio = require('cheerio');

// VALIDATION SCHEMAS TO UPDATE AND SEARCH DATABASE
const singleDate = Joi.object({
  fromDate: Joi.date().timestamp('unix'),
});

const timeFrame = Joi.object({
  fromDate: Joi.date().timestamp('unix'),
  toDate: Joi.date().timestamp('unix')
});

const findSchema = Joi.object({
  fromDate: Joi.date().timestamp('unix'),
  toDate: Joi.date().timestamp('unix')
});

// FORMAT DATE FROM TIMESTAMP TO D(D)-month-YYYY * 3-ianuarie-2021, 10-martie-2021
const formatDate = (timestamp) => {
  const dateTime = new Date(timestamp * 1000);
  const months = ['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'];
  return (String(dateTime.getDate()) + '-' + String(months[dateTime.getMonth()]) + '-' + String(dateTime.getFullYear()));
}; 

// WAIT n MILLISECONDS BEFORE PROCEEDING
const wait = function(timeout){
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

// FROM A GIVEN INPUT WITH 2 TIMESTAMPS, RETURN THE ARRAY OF TIMESTAMPS BETWEEN THOSE 2 VALUES
const returnDateArray = (input) => {
  let dateArray = [];
  let validation =  singleDate.validate(input);

  if ( !validation.error ){
    dateArray.push(input.fromDate);
    return dateArray;
  } else{
    validation = timeFrame.validate(input);

    if ( validation.error) {
      dateArray.push('validation error');
      return dateArray;
    }
    
    dateArray.push(input.fromDate);
  
    const interval = Math.floor((input.toDate - input.fromDate) / 86400);

    let currentDate = input.fromDate
  
    let i = 1;
    while ( i < interval ){
      currentDate += 86400;
      dateArray.push(currentDate);
      i++;
    }
    
    return dateArray;
  }
}

// WEB SCRAPER FOR COVID CASES
const scrapeCovidCases = async (timestamp) => {
  const date = formatDate(timestamp);
  const URL = `https://stirioficiale.ro/informatii/buletin-de-presa-${date}-ora-13-00`;

  try {
    const response = await fetch(URL);
    const body = await response.text();

    const $ = cheerio.load(body);
    const cases = [];
    const $table = $('.my-8.break-words.rich-text');

     // CHECK IF THE TABLE EXISTS
    if ( $table.length ){                                                                                          
      $('.my-8.break-words.rich-text > table:first-of-type > tbody > tr').each((i, row) => {
        if ( i > 0 && i < 43 ) {
          const $row = $(row);
          const county = {};

          county.countyName = $row.find('td:nth-child(2) > p').text();
          county.totalCases = Number($row.find('td:nth-child(3) > p').text());

          const newCases = $row.find('td:nth-child(4) > p');

           // CHECK IF TABLE HAS NEW CASES COLUMN
          if( newCases.length ){                                                                                 
            county.newCases = Number($row.find('td:nth-child(4) > p').text());
          }

          const incidence = $row.find('td:nth-child(5) > p');

          // CHECK IF TABLE HAS INCIDENCE COLUMN
          if ( incidence.length ){                                                                                
            county.incidence = Number($row.find('td:nth-child(5) > p').text().replace(',', '.'));
          }
          cases.push(county);     
        }else if ( i == 44 || i == 45 ){
          const $row = $(row);
          const total = {};
          total.totalCases = Number($row.find('td:nth-child(2) > p').text().replace('.',''));
          total.newCases = Number($row.find('td:nth-child(3) > p').text().replace('.',''));
          cases.push(total);
        }
      });
    } else{
      return({
        error: 'Page not found', 
      });
    }

     return {
      timestamp: new Date(Number(timestamp) * 1000),
      cases: cases
    }
  } catch(error){
      return error;
  }
};

module.exports = {
  wait,
  findSchema,
  returnDateArray,
  scrapeCovidCases
}