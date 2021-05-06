<template>
  <div id="sign">
    <el-container class="sign-contianer">
      <el-header class="sign-header" style="height: 60px">
        <loginHeader />
      </el-header>
      <el-main class="sign-main">
        <el-container class="sign-main-back-container">
          <el-card class="sign-card">
            <h2>用户注册</h2>
            <el-form
              class="sign-form"
              :model="ruleForm"
              :rules="rules"
              ref="signForm"
            >
              <el-form-item class="sign-input-phone" prop="username">
                <el-input type="text" placeholder="账号/手机号"></el-input>
              </el-form-item>
              <el-form-item class="sign-input-password" prop="password">
                <el-input
                  type="text"
                  placeholder="6-20位字母、符号或者数字"
                ></el-input>
              </el-form-item>
              <el-form-item class="sign-input-repeat-password">
                <el-input type="text" placeholder="再次输入密码"></el-input>
              </el-form-item>
              <el-form-item class="sign-sign-button">
                <el-button>注册</el-button>
              </el-form-item>
              <el-form-item class="sign-other-opts">
                <span>已有账号？</span>
                <router-link
                  class="sign-go-to-login-page"
                  :to="{ name: 'Login' }"
                  >用户登陆</router-link
                >
              </el-form-item>
            </el-form>
          </el-card>
        </el-container>
      </el-main>
      <el-footer>
          <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import loginHeader from "@/components/Login_header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Signup",
  components: {
    loginHeader,
    Footer
  },
  data() {
    return {
      checked: true,
    };
  },
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
  background-image: url("../assets/backimg.png");
}

#sign .sign-card {
  height: 400px;
  width: 300px;
  position: absolute;
  top: 170px;
  right: 22%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
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

.sign-other-opts .el-form-item__content {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>
