const { wait, findSchema, returnDateArray, scrapeCovidCases } = require('../util');
const { infections }  = require('../db');

const getCasesByInterval = (req, res) => {
  console.log(req.body);
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
};

let cachedData = null;
let cachedTime = null;

const getAllCases = (req,res) => {
  if (cachedTime && cachedTime > Date.now() - 30 * 60 * 1000){
    return res.json(cachedData);
  }
  infections.find({}).sort({timestamp: 1}).exec((err, data) => {
    if (err){
      res.status(422);
      res.json('Database error');
      return;
    }
    cachedData = data;
    cachedTime = Date.now();
    res.json(cachedData);
  });
}

const updateCovidDb = (req,res) => {
  let insertedElements = 0;
  let scrapeErrors = [];
  let insertErrors = [];

  infections.find({}).sort({timestamp: -1}).limit(1).exec(async (error, data) => {
    const lastStamp = Math.floor(Date.parse(data[0].timestamp) / 1000);
    const thisStamp = Math.floor(Date.now() / 1000);

    if ( lastStamp < thisStamp - 86400 ){
      // SCRAPE AND INSERT DATA INTO DB
      const interval = {
        fromDate: lastStamp,
        toDate: thisStamp
      };

      const dates = returnDateArray(interval);

      for( date of dates ){
        const result = await scrapeCovidCases(date);
        if(!result.error){
          infections.insert(result ,(err, data) => {
            if (!err){
              insertedElements = insertedElements + 1; 
            } else{
                const insertError = {};
                insertError.date = date;
                insertError.messag = `Error inserting data for ${date}`
                insertErrors.push(insertError);  
            }
          });
          await wait(1000);
        }else{
          const scrapeError = {};
          scrapeError.date = date;
          scrapeError.message = 'Page not found'
          scrapeErrors.push(scrapeError);
          await wait(1000);
        }
      }

      if ( !scrapeErrors.length ){
        if ( insertedElements == dates.length ){
          return res.json({
            status: 'OK',
            message: 'Database updated 🧫'
          });
        }

        return res.json({
          status: 'WARN',
          message: 'Databases update with errors',
          errors: insertErrors
        });
      }
    }

    return res.json({
      message: 'Database up to date 🧫'
    });

  });
}

module.exports = { 
  getCasesByInterval,
  getAllCases,
  updateCovidDb 
};