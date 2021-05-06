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
            <!-- <h2>{msg[0].username}</h2> -->
            <el-form
              class="login-form"
              :model="ruleForm"
              :rules="rules"
              ref="loginForm"
            >
              <el-form-item prop="username">
                <el-input
                  type="text"
                  v-model.trim="ruleForm.username"
                  placeholder="账号/手机号"
                ></el-input>
              </el-form-item>
              <!-- <div class="login-input-area"> -->
              <el-form-item prop="password">
                <el-input
                  type="text"
                  v-model.trim="ruleForm.password"
                  placeholder="密码"
                ></el-input>
              </el-form-item>

              <!-- </div> -->
              <el-form-item class="login-remember-account-area">
                <el-checkbox v-model="checked">记住账号</el-checkbox>
              </el-form-item>
              <el-form-item class="login-login-button-area">
                <el-button class="login-login-button" @click="submitForm">登陆</el-button>
              </el-form-item>
              <el-form-item class="login-other-opts-area">
                <el-button type="text">忘记密码</el-button>
                <router-link
                  class="login-go-to-signup-page"
                  :to="{ name: 'Signup' }"
                  >用户注册</router-link
                >
              </el-form-item>
              <!-- <el-input v-model="form.name" placeholder="账号/手机号"></el-input> -->
            </el-form>
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
import { reactive, ref, toRefs } from "vue";
import json from "@/assets/fakeUsers.json";

export default {
  name: "Login",
  components: {
    loginHeader,
    Footer,
  },
  setup() {
    const loginForm = ref(null);
    const state = reactive({
      ruleForm: {
        username: "",
        passowrd: "",
      },
      rules: {
        username: [
          { required: "true", message: "账户不能为空", trigger: "blur" },
        ],
        password: [
          { required: "true", message: "密码不能为空", trigger: "blur" },
        ],
      },
    });

    var fakeusers = json.fakeusers;
    console.log(fakeusers)

    const submitForm = async () => {
      // loginForm.value.validate((valid) => {
      //   if (valid) {
          
      //     // this.isValidate(state.ruleForm.username).then(res => {
      //     //   console.log(state.ruleForm.username,res)
      //     //   window.location.href = '/'
      //     // })
      //   }
      //   else {
      //     console.log('submit error')
      //     return false
      //   }
      // })
      window.location.href = '/'
    };
    
    return {
      ...toRefs(state),
      loginForm,
      submitForm
    }
  },
  methods: {
    isValidate(value) {
      if (value=="abc"){
        return true
      }
      return false
    }
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

.login-other-opts-area .el-form-item__content{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

</style>
