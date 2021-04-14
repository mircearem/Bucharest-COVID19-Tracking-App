<script>

import { Bar } from 'vue-chartjs';
import { formatDates, movingAverage, movingAveragePlot } from '../util';

export default {
  extends: Bar,
  props: {
    label:{
      type: String
    },

    chartData:{
      type: Array
    }, 

    options: {
      type: Object,
      default: null
    },

    sma:{
      type: Array,
    },
  },

  methods:{
    updateChartData(){
      let chartData = {
        labels: [],
        datasets: []
      };

      let barData = {
        label: this.label,
        borderWith: 1,
        data: []
      }

      // FORMAT THE BAR DATA
      this.chartData.forEach(day => {
        const stamp = formatDates(day);
        chartData.labels.push(stamp);  
        barData.data.push(day.infections);
      });

      chartData.datasets.push(barData);

      // FORMAT THE LINE DATA -> USE CLASS ??
      this.sma.forEach(average => {
        if ( average.active ){
          const data = movingAverage(barData.data, average.intervals - 1);
          const label = average.label;
          const color = average.color;

          const plot = new movingAveragePlot(label, data, color);
          const dataset = plot.getData();
          chartData.datasets.push(dataset);
        }
      });

      return chartData;
    }
  },

  watch: {
    chartData: {
      deep: true,
      handler(){
        const data = this.updateChartData();
        this.renderChart(data, this.options);
      }
    },

    sma:{
      deep: true,
      handler(){
        const data = this.updateChartData();
        this.renderChart(data, this.options);        
      }
    }
  },
}
</script>

