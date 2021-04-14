<template>
  <div>
    <md-checkbox v-for="average in sma" :key="average.id" v-model="average.active" class="md-primary">{{ average.label }}</md-checkbox>
  </div>
</template>

<script>

export default {
  name:'MovingAverages',
  data: () => ({
    sma: [
      {
        id: 1,
        label: 'Medie mobila 3 zile',
        intervals: 3,
        active: false,
        color: 'rgba(0, 0, 255)'
      },
      {
        id: 2,
        label: 'Medie mobila 7 zile',
        intervals: 7,
        active: false,
        color: 'rgba(0, 255, 0)'
      }
    ]
  }),

  watch: {
    sma:{
      deep: true,
      handler(){
        this.$emit('newSma', this.sma);
      }
    }
  }
}
</script>
