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
            <form @submit.prevent="submitForm">
              <div class="field">
                <label>Username</label>
                <div class="control">
                  <input type="text" class="input" v-model="username" />
                </div>
              </div>

              <div class="field">
                <label>Mobile</label>
                <div class="control">
                  <input type="number" class="input" v-model="mobile" />
                </div>
              </div>

              <div class="field">
                <label>Password</label>
                <div class="control">
                  <input type="password" class="input" v-model="password" />
                </div>
              </div>

              <div class="field">
                <label>Repeat password</label>
                <div class="control">
                  <input type="password" class="input" v-model="re_password" />
                </div>
              </div>

              <div class="notification is-danger" v-if="errors.length">
                <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
              </div>

              <div class="field">
                <div class="control">
                  <button class="button is-dark">Sign up</button>
                </div>
              </div>

              <hr />

              Or <router-link to="/login">click here</router-link> to log in!
            </form>
            <!-- <el-form
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
              <el-form-item class="sign-input-repeat-password" prop="re_password">
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
            </el-form> -->
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
import cookie from "@/static/cookie"

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
      errors: []
    };
  },
  methods: {
    submitForm() {
      var that = this;
      this.errors = [];
      if (this.username === "") {
        this.errors.push("The username is missing");
      }
      if (this.mobile === "") {
        this.errors.push("The mobile is missing");
      }
      if (this.password === "") {
        this.errors.push("The password is too short");
      }
      if (this.password !== this.re_password) {
        this.errors.push("The passwords doesn't match");
      }
      if (!this.errors.length) {
        const formData = {
          username: that.username,
          mobile: that.mobile,
          password: that.password,
        };
        axios
          .post("/users/", formData)
          .then((res) => {
            console.log("sign up successfully", res.data);
            cookie.setCookie('name', res.data.username);
            cookie.setCookie('token', res.data.token);
            
            that.$store.dispatch('setInfo');
            
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
              for (const property in error.response.data) {
                this.errors.push(
                  `${property}: ${error.response.data[property]}`
                );
              }
              console.log(JSON.stringify(error.response.data));
            } else if (error.message) {
              this.errors.push("Something went wrong. Please try again");

              console.log(JSON.stringify(error));
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
