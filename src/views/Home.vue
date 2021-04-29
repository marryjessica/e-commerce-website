<template>

  <div class="home">
    <el-row :gutter="20">
      <div id="head">
        <Header/>
      </div>
    </el-row>
    <el-row :gutter="20">
      <img alt="Vue logo" src="../assets/logo.png">
    </el-row>
    
  </div>

</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'

export default {
  name: 'Home',
  components: {
    Header
  }
}
</script>
