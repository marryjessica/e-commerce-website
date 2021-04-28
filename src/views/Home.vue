<template>

  <div class="home">
    <div id="head">
      <HelloWorld/>
      <p>联系我们：12345678901</p>
    </div>
    <img alt="Vue logo" src="../assets/logo.png">
    
  </div>

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
