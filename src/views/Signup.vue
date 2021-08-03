<template>
  <div id="sign">
    <el-container class="sign-contianer">
      <el-header class="sign-header" style="height: 60px">
        <loginHeader />
      </el-header>
      <el-main class="sign-main">
        <el-container class="sign-main-back-container">
          <el-card class="sign-card">
            <h2 style="margin:0px 10px;">用户注册</h2>
            <form @submit.prevent="submitForm">
              <div class="field">
                <label>用户名：</label>
                <div class="control">
                  <input type="text" class="signinput" v-model="username" />
                </div>
              </div>

              <div class="field">
                <label>手机号：</label>
                <div class="control">
                  <input type="number" class="signinput" v-model="mobile" />
                </div>
              </div>

              <div class="field">
                <label>密码：</label>
                <div class="control">
                  <input type="password" class="signinput" v-model="password" />
                </div>
              </div>

              <div class="field">
                <label>再次输入密码：</label>
                <div class="control">
                  <input
                    type="password"
                    class="signinput"
                    v-model="re_password"
                  />
                </div>
              </div>

              <div class="notification" v-if="errors.length">
                <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
              </div>

              <div class="field">
                <div class="control">
                  <button class="sign-button">注册</button>
                </div>
              </div>

              <div class="tologin">
                <span>已有账号？</span>
                <router-link to="/login">点我登录</router-link>
              </div>
            </form>
          </el-card>
        </el-container>
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import loginHeader from "@/components/Login_header.vue";
import Footer from "@/components/Footer.vue";

import { ElMessage } from "element-plus";

import axios from "axios";
import cookie from "@/static/cookie";

export default {
  name: "Signup",
  components: {
    loginHeader,
    Footer,
  },
  data() {
    return {
      username: "",
      mobile: "",
      password: "",
      re_password: "",
      errors: [],
    };
  },
  methods: {
    submitForm() {
      var that = this;
      var msg = "";
      if (this.username === "") {
        msg = "用户名不能为空";
      } else if (this.mobile === "") {
        msg = "手机号不能为空";
      } else if (this.password === "") {
        msg = "密码请再长一点";
      } else if (this.password !== this.re_password) {
        msg = "两次密码不匹配";
      }
      if (msg !== "") {
        ElMessage({
          showClose: true,
          message: msg,
          type: "error",
          duration: 1000,
        });
      } else {
        const formData = {
          username: that.username,
          mobile: that.mobile,
          password: that.password,
        };
        axios
          .post("/users/", formData)
          .then((res) => {
            console.log("sign up successfully", res.data);
            cookie.setCookie("name", res.data.username);
            cookie.setCookie("token", res.data.token);

            that.$store.dispatch("setInfo");

            this.$router.push("/login");
            ElMessage({
              showClose: true,
              message: "注册成功",
              type: "success",
              duration: 1000,
            });
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.data["username"]) {
                msg = "不可用用户名";
              } else if (error.response.data["password"]) {
                msg = "不可用密码";
              } else if (error.response.data["mobile"]) {
                msg = "不可用手机号"
              }
              ElMessage({
                showClose: true,
                message: msg,
                type: "error",
                duration: 1000,
              });
            } else if (error.message) {
              ElMessage({
                showClose: true,
                message: error.message,
                type: "error",
                duration: 1000,
              });
            }
          });
      }
    },
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
  height: 450px;
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

.signinput {
  height: 25px;
  width: 200px;
  border: 0.5px solid grey;
  border-radius: 5px;
  text-indent: 14px;
}

#sign .sign-card label {
  margin: 10px 10px 10px 25px;
  float: left;
  font-weight: bold;
}

.sign-button {
  margin: 15px 10px 10px 10px;
  font-size: 22px;
  background: #188bf7;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 4px;
  width: 100px;
  cursor: pointer;
}

.tologin {
  border-top: 1px solid grey;
  margin: 1px 10px;
  padding: 5px;
  font-size: 14px;
  color: #525252;
  text-align: right;
}
</style>
