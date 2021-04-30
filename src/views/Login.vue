<template>
  <div id="login">
    <el-container class="login-contianer">
      <el-header class="login-header" style="height: 86px">
        <loginHeader/>
      </el-header>
      <el-main class="login-main">
        <el-container class="login-main-back-container">
          <el-card class="login-card">
            <h2>用户登录</h2>
            <el-form ref="form" class="login-form" :model="form">
              <el-form-item>
                <input type="text" placeholder="账号/手机号">
                <!-- <el-input v-model="form.name" placeholder="账号/手机号"></el-input> -->
              </el-form-item>
            </el-form>
          </el-card>
          
        </el-container>
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

<style>

  #login {
    width: 100%;
    padding: 0;
  }

  /* #login .login-header {
    height: 86px;
  } */

  #login .login-main {
    padding: 0;
    padding-top: 7px;
    margin-left: -8px;
    margin-right: -8px;
  }

  #login .login-main-back-container {
    height: 815px;
    background-image: url('../assets/backimg.png');
  }

  #login .login-card {
    height: 550px;
    width: 400px;
    position: absolute;
    top: 200px;
    right: 22%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
</style>