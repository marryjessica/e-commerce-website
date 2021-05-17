<template>

  <div class="home">
    <el-container>
      <el-header>
        <div id="head">
          <Header/>
        </div>
      </el-header>
      <el-main>
        <el-row>

        </el-row>
        <el-row class='middle_area'>
          <div>
          <img alt="Vue logo" src="../assets/logo.png">
        </div>
        </el-row>
        <el-row class='lower_area'>
          <div class='category_container'>

          </div>
        </el-row>
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

<style>
  .image {
    margin-top: -1.25rem;
    margin-right: -1.25rem;
    margin-left: -1.25rem;

  }
</style>