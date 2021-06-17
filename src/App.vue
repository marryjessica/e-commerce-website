<template>
  <div>
    <router-view/>

  </div>
  
</template>

<script>
// import { mapGetters } from 'vues';

  export default {
    data() {
      return {
        cart: {
          items: []
        }
      }
    },
    beforeCreate() {
      this.$store.commit('initializeStore')
    },
    mounted() {
      this.cart = this.$store.state.cart
      console.log(this.$store.state)
      
    },
    computed: {
      cartTotalLength() {
        let totalLength = 0;

        for (var i = 0; i < this.cart.items.length; i++){
          totalLength += this.cart.items[i].quantity
        }

        return totalLength
      }
    }
  }

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style>
