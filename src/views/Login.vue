<template>
  <div id="login">
    <el-container class="login-contianer">
      <el-header class="login-header" style="height: 60px">
        <loginHeader />
      </el-header>
      <el-main class="login-main">
        <el-container class="login-main-back-container">
          <el-card class="login-card">
            <h2>用户登录</h2>
            <form @submit.prevent="submitForm">
              <div class="field">
                <label>用户名/手机号：</label>
                <div class="control">
                  <input type="text" class="userinput" v-model="mobile" />
                </div>
              </div>

              <div class="field">
                <label>密码：</label>
                <div class="control">
                  <input type="password" class="userinput" v-model="password" />
                </div>
              </div>

              <div class="notification" v-if="errors.length">
                <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
              </div>

              <div class="field">
                <div class="control">
                  <button class="login-button">登录</button>
                </div>
              </div>
              <div class="tosignin">
                <span>没有账号？</span>
                <router-link to="/signup">点我注册</router-link>
              </div>
            </form>
          </el-card>
        </el-container>
      </el-main>
      <el-footer style="height: 100%">
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import loginHeader from "@/components/Login_header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import cookie from "@/static/cookie";

import { ElMessage } from "element-plus";

export default {
  name: "Login",
  components: {
    loginHeader,
    Footer,
  },
  data() {
    return {
      mobile: "",
      password: "",
      errors: [],
    };
  },
  mounted() {
    document.title = "Log In | Djackets";
  },
  methods: {
    submitForm() {
      var that = this;

      const formData = {
        username: that.mobile,
        password: that.password,
      };
      axios
        .post("http://127.0.0.1:8000/login/", formData)
        .then((res) => {
          console.log("res: ", res);
          const refresh = res.data.refresh;

          cookie.setCookie("name", that.mobile, 7);
          cookie.setCookie("token", res.data.access, 7);
          localStorage.setItem("refresh", refresh);

          this.$store.commit("setToken");

          const toPath = this.$route.query.to || "/";
          ElMessage({
            showClose: true,
            message: "登陆成功",
            type: "success",
            duration: 1000,
          });
          this.$router.push(toPath);
        })
        .catch((error) => {
          if (error.response) {
            var msg = '用户名或密码不正确'
            if (error.response.data['username']){
              msg = "用户名/手机号不能为空"
            } else if (error.response.data['password']){
              msg = "密码不能为空"
            } 
            ElMessage({
            showClose: true,
            message: msg,
            type: "error",
            duration: 1000,
          });
          } else {
            ElMessage({
            showClose: true,
            message: "抱歉，出了一些问题，登录失败",
            type: "error",
            duration: 1000,
          });
          }
        });
    },
  },
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
  background-image: url("../assets/backimg.png");
}

#login .login-card {
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

.login-remember-account-area {
  display: flex;
}

.login-go-to-signup-page {
  text-decoration: none;
}

.login-other-opts-area .el-form-item__content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.login-area {
  display: flex;
  flex-direction: column;
}

.userinput {
  height: 35px;
  width: 200px;
  border: 0.5px solid grey;
  border-radius: 5px;
  text-indent: 14px;
}

#login .login-card label {
  margin: 10px 10px 10px 25px;
  float: left;
  font-weight: bold;
}

.login-button {
  margin: 20px 10px;
  font-size: 22px;
  background: linear-gradient(to right, #188bf7, #1ab0f5);
  border: none;
  border-radius: 5px;
  color: white;
  padding: 5px;
  width: 100px;
  cursor: pointer;
}

.tosignin {
  border-top: 1px solid grey;
  margin: 25px 10px 0px;
   padding: 5px;
    font-size: 14px;
    color: #525252;
    text-align: right;
}
</style>
