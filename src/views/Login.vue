<template>
  <div class="login">
    <el-container>
      <el-header>
        <loginHeader/>
      </el-header>
      <el-main>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
        <h1>This is an about page</h1>
      </el-main>
      <el-footer></el-footer>
    </el-container>
    
    
  </div>
</template>

<script>
  // @ is an alias to /src
  import loginHeader from '@/components/Login_header.vue'
  
  export default {
  name: 'Login',
  components: {
    loginHeader
  }
}
</script>