<template>
  <div>
    <md-autocomplete v-model="selectedCounty" :md-options="counties">
      <label>Judet</label>
    </md-autocomplete>
  </div>
</template>

<script>
  export default {
    name: 'CountySelector',
    data: () => ({
      selectedCounty: null,
      counties: [
        'Alba',
        'Arad',
        'Argeș',
        'Bacău',
        'Bihor',
        'Bistrița-Năsăud',
        'Botoșani',
        'Brașov',
        'Brăila',
        'Buzău',
        'Caraș-Severin',
        'Călărași',
        'Cluj',
        'Constanța',
        'Covasna',
        'Dâmbovița',
        'Dolj',
        'Galați',
        'Giurgiu',
        'Gorj',
        'Harghita',
        'Hunedoara',
        'Ialomița',
        'Iași',
        'Ilfov',
        'Maramureș',
        'Mehedinți',
        'Mureș',
        'Neamț',
        'Olt',
        'Prahova',
        'Satu Mare',
        'Sălaj',
        'Sibiu',
        'Suceava',
        'Teleorman',
        'Timiș',
        'Tulcea',
        'Vaslui',
        'Vâlcea',
        'Vrancea',
        'Mun. București',
        'Toate'
      ],
    }),

    methods:{
      updateCounty: function(){
        if(this.counties.indexOf(this.selectedCounty) != -1){
          this.$emit('newCounty', {
            index: this.counties.indexOf(this.selectedCounty)
          });
        }
      }
    },

    watch: {
      selectedCounty: function(){
        if (this.selectedCounty != ''){
          this.updateCounty();
        } 
      }
    },
  }
</script>