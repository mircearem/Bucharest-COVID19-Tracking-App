<template>
  <div>
    <mixed-chart 
      :chartData="chartData" 
      :options="chartOptions" 
      :label="chartLabel"
      :sma="sma"
    />
    <moving-averages @newSma="updateSma($event)"/>
    <county-selector @newCounty="getCasesByCounty($event)"/>
    <date-range @intervalChange="getCasesByInterval($event)"/>
  </div>
</template>

<script>

import MixedChart from '@/components/Chart.vue';
import CountySelector from '@/components/CountySelector.vue';
import DateRange from '@/components/DateRange.vue';
import MovingAverages from '@/components/MovingAverages.vue'

const API_URL_INTERVAL = 'http://localhost:3000/cases/get/interval';
const API_URL_ALL = 'http://localhost:3000/cases/get/all';

export default {
  name: 'Home',
  components: {
    MixedChart,
    CountySelector,
    DateRange,
    MovingAverages
  },

  data: () => ({
    database: null,
    countyIndex: null,
    chartLabel: null,
    chartData: [],
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false
    },
    sma:[]
  }),

  methods:{
    updateSma(sma){
      this.sma = sma;
    },

    async getCasesByCounty(countyIndex){
      this.chartData = [];
      this.sma = [];

      this.countyIndex = countyIndex.index;

      for ( let entry of this.database ){
        const date = {};
        date.timestamp = entry.timestamp;
        date.infections = entry.cases[this.countyIndex].newCases;
        this.chartData.push(date);
      }

      this.chartLabel = this.database[0].cases[this.countyIndex].countyName;
    },

    async getCasesByInterval(interval){
      if ( this.countyIndex == null ){
        this.countyIndex = 42;
      }
      if (interval == {}){
        console.log('empty');
      }else{
        try{
          const response = await fetch(API_URL_INTERVAL, {
            method: 'POST',
            body: JSON.stringify(interval),
            headers: { 
              "Content-type": "application/json" 
            }
          });
  
          this.database = await response.json();
          this.chartData = [];
          this.ema3Day = false;
          this.ema7Day = false;
          
          for ( let entry of this.database ){
            const date = {};
            date.timestamp = entry.timestamp;
            date.infections = entry.cases[this.countyIndex].newCases;
            this.chartData.push(date);
          }
  
          if ( this.database[0].cases[this.countyIndex].countyName ){
            this.chartLabel = this.database[0].cases[this.countyIndex].countyName;
          }else{ 
            this.chartLabel = 'Infectii Romania';
          }
  
          return;
        } catch(error){
          console.error(error);
          return;
        }
      }
    },
  },

  // LIFECYCLE HOOKS
  async mounted(){
    const response = await fetch(API_URL_ALL);
    if (!response.ok) {
      return
    }
 
    this.database = await response.json();

    for (let entry of this.database){
      const date = {};
      date.timestamp = entry.timestamp;
      const total = entry.cases.pop();
      date.infections = total.newCases;
      this.chartData.push(date);
    }

    this.chartLabel = 'Infectii Romania';
  },
}
</script>

