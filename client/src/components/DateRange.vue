<template>
  <div>
    <md-datepicker v-model="fromDate" md-immediately>
      <label>De la</label>
    </md-datepicker>
    <md-datepicker v-model="toDate" md-immediately>
      <label>Pana la</label>
    </md-datepicker>
    <md-button class="md-raised md-primary" v-if="fromDate && toDate" @click.prevent='compareDates()'>Modifica Interval</md-button>
    <md-button class="md-raised md-primary" v-else @click.prevent='compareDates()'>Toate Cazurile</md-button>
  </div>
</template>

<script>
  export default {
    name: 'DateRange',
    data: () => ({
      fromDate: null,
      toDate: null,
    }),

    methods:{
      compareDates(){
        if ( this.toDate > this.fromDate ){
          const interval = {};
          interval.fromDate = Math.floor(Date.parse(this.fromDate) / 1000);
          interval.toDate = Math.floor(Date.parse(this.toDate) / 1000);
          this.$emit('intervalChange', interval);
        } else if ( this.fromDate == null || this.toDate == null ){
          const interval = {};
          interval.fromDate = 0;
          interval.toDate = Math.floor(Date.now() / 1000);
          this.$emit('intervalChange', interval);
        } else{
          alert('Interval incorect selectat');
        }
      }
    }
  }
</script>