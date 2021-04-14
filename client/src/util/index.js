const formatDates = (item) => {
  const timestamp = new Date(item.timestamp);
  let year = String(timestamp.getYear() - 100);

  let month = timestamp.getMonth() + 1;

  if ( month < 10 ) {
    month = '0' + String(month);
  }

  let date = timestamp.getDate();

  if ( date < 10 ) {
    date = '0' + String(date);
  }

  const result = date + '-' + month + '-' + year; 
  return result;
}

const movingAverage = (array, countBefore, countAfter) => {
  if (countAfter == undefined) countAfter = 0;
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const subArr = array.slice(Math.max(i - countBefore, 0), Math.min(i + countAfter + 1, array.length));
    const avg = Math.floor(subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length);
    result.push(avg);
  }
  return result;
};

class movingAveragePlot{
  constructor(label, data, color){
    this.plot = {
      type:'line',
      label:label,
      data: data,
      borderColor: color ,
      pointBackgroundColor : color,
      pointRadius: 1,
      pointBorderWidth: 1,
    };
  }

  getData(){
    return this.plot;
  }
}

export { formatDates, movingAverage, movingAveragePlot }