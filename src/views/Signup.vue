<template>
  <div id="sign">
    <el-container class="sign-contianer">
      <el-header class="sign-header" style="height: 60px">
        <loginHeader/>
      </el-header>
      <el-main class="sign-main">
        <el-container class="sign-main-back-container">
          <el-card class="sign-card">
            <h2>用户注册</h2>
            <el-form ref="form" class="sign-form" :model="form">
              <el-form-item>
                <div class="sign-input-area">
                  <input type="text" placeholder="账号/手机号">
                  <input type="text" placeholder="6-20位字母、符号或者数字">
                  <input type="text" placeholder="再次输入密码">
                </div>
                <!-- <div class="sign-remember-account-area">
                  <el-checkbox v-model="checked">Remember Account</el-checkbox>
                </div> -->
                <div class="sign-sign-button-area">
                  <el-button>注册</el-button>
                </div>
                <div class="sign-other-opts-area">
                  <span>已有账号？</span>
                  <router-link class="sign-go-to-login-page" :to="{name: 'Login'}">用户登陆</router-link>
                </div>
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
  name: 'Signup',
  components: {
    loginHeader
  },
  data() {
    return {
      checked: true
    };
  }
};
</script>

<style>

  #sign {
    width: 100%;
    padding: 0;
  }

  #sign .sign-main {
    padding: 0;
    padding-top: 7px;
    margin-left: -8px;
    margin-right: -8px;
  }

  #sign .sign-main-back-container {
    height: 600px;
    background-image: url('../assets/backimg.png');
  }

  #sign .sign-card {
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

    .sign-go-to-login-page {
        text-decoration: none;
    }
</style>