<template>
  <div id="login">
    <el-container class="login-contianer">
      <el-header class="login-header" style="height: 60px">
        <loginHeader/>
      </el-header>
      <el-main class="login-main">
        <el-container class="login-main-back-container">
          <el-card class="login-card">
            <h2>用户登录</h2>
            <el-form ref="form" class="login-form" :model="form">
              <el-form-item>
                <div class="login-input-area">
                  <input type="text" placeholder="账号/手机号">
                  <input type="text" placeholder="Password">
                </div>
                <div class="login-remember-account-area">
                  <el-checkbox v-model="checked">记住账号</el-checkbox>
                </div>
                <div class="login-login-button-area">
                  <el-button>登陆</el-button>
                </div>
                <div class="login-other-opts-area">
                  <el-button type="text">忘记密码</el-button>
                  <router-link class="login-go-to-signup-page" :to="{name: 'Signup'}">用户注册</router-link>
                </div>
                <!-- <el-input v-model="form.name" placeholder="账号/手机号"></el-input> -->
              </el-form-item>
            </el-form>
          </el-card>
          
        </el-container>
      </el-main>
      <el-footer style="height: 100%">
        <Footer/>
      </el-footer>
    </el-container>
    
    
  </div>
</template>

<script>
  // @ is an alias to /src
  import loginHeader from '@/components/Login_header.vue'
  import Footer from '@/components/Footer.vue'
  
  export default {
  name: 'Login',
  components: {
    loginHeader,
    Footer
  },
  data() {
    return {
      checked: true
    };
  }
};
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
    height: 600px;
    background-image: url('../assets/backimg.png');
  }

  #login .login-card {
    height: 400px;
    width: 300px;
    position: absolute;
    top: 170px;
    right: 22%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    }

    .login-go-to-signup-page {
      text-decoration: none;
    }
</style>