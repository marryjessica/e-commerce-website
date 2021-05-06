<template>

  <div class="home">
    <el-container>
      <el-header>
        <div id="head">
          <Header/>
        </div>
      </el-header>
      <el-main>
        <div>
          <img alt="Vue logo" src="../assets/logo.png">
        </div>
      </el-main>
      <el-footer>
        <Footer/>
      </el-footer>
    </el-container>
    
  </div>

</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Footer
  }
}
</script>
