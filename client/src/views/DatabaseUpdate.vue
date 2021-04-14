<template>
    <div>
      <progress-bar>
      </progress-bar>
      <h3>Acutalizare baza de date...</h3>
    </div>
</template>

<script>

const API_URL = 'http://localhost:3000/cases/update';
import ProgressBar from '@/components/ProgressBar.vue';

export default {
  name: 'DatabaseUpdate',
  components: {
    ProgressBar
  },

  data: () => ({
    updating : false,
    error: {},
  }),

  async mounted(){
    this.updating = true;
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if(!result.error){
        if(result.status){
          this.update = false;
          this.$router.push('/dashboard');
        } else{
          // WAIT A SECOND FOR EFFECT
          setTimeout(() => {
            this.update = false;
            this.$router.push('/dashboard');
          }, 1000);          
        } 
      }
    } catch(error) {
      setTimeout(() => {
        console.log(error);
        this.update = false;
        this.$router.push('/dashboard');
      }, 1000);
    }
  }
}
</script>