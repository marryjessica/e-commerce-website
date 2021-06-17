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
                        <label>Username</label>
                        <div class="control">
                            <input type="text" class="input" v-model="mobile">
                        </div>
                    </div>

                    <div class="field">
                        <label>Password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password">
                        </div>
                    </div>

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Log in</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/signup">click here</router-link> to sign up!
                </form>
<!-- 


            <el-form
              class="login-form"
              :model="ruleForm"
              :rules="rules"
              ref="loginForm"
            >
              <el-form-item prop="mobile">
                <el-input
                  type="text"
                  v-model.trim="ruleForm.mobile"
                  placeholder="账号/手机号"
                ></el-input>
              </el-form-item>
              
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model.trim="ruleForm.password"
                  placeholder="密码"
                ></el-input>
              </el-form-item>

              
              <el-form-item class="login-remember-account-area">
                <el-checkbox v-model="checked">记住账号</el-checkbox>
              </el-form-item>
              <el-form-item class="login-login-button-area">
                <el-button class="login-login-button" @click="submitForm" value="login">登陆</el-button>
              </el-form-item>
              <el-form-item class="login-other-opts-area">
                <el-button type="text">忘记密码</el-button>
                <router-link
                  class="login-go-to-signup-page"
                  :to="{ name: 'Signup' }"
                  >用户注册</router-link
                >
              </el-form-item>
              
            </el-form> -->
            <!-- <form @submit.prevent="submitForm">
              <div class="login-area">
                <input type="text" v-model="ruleForm.mobile" placeholder="手机号">
                
                <input type="password" v-model="ruleForm.password" placeholder="密码">
                <button>登陆</button>
              </div>
              <div>

              </div>

            </form> -->
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
import axios from 'axios';  
import cookie from '@/static/cookie';


// import { ElMessage } from 'element-plus'
// import { reactive, ref, toRefs } from "vue";
// import json from "@/assets/fakeUsers.json";
// import { userLogin } from "@/api/index.js";

export default {
  name: "Login",
  components: {
    loginHeader,
    Footer,
  },
    data() {
        return {
            mobile: '',
            password: '',
            errors: []
        }
    },
    mounted() {
        document.title = 'Log In | Djackets'
    },
    methods: {
         submitForm() {
          var that = this;
            // axios.defaults.headers.common["Authorization"] = ""
            // localStorage.removeItem("token")
            const formData = {
                username: that.mobile,
                password: that.password
            }
             axios
                .post("http://127.0.0.1:8000/login/", formData)
                .then(res => {
                  console.log('res: ', res)

                  cookie.setCookie('name', that.mobile, 7);
                  cookie.setCookie('token', res.data.access, 7);

                  // that.$store.dispatch('setInfo')
                    // const token = response.data.auth_token
                    this.$store.commit('setToken')
                    
                    // axios.defaults.headers.common["Authorization"] = "Token " + token
                    // // localStorage.setItem("token", token)
                    
                    const toPath = this.$route.query.to || '/'
                    this.$router.push(toPath)
                })
            //     ElMessage({
            //     showClose: true,
            //     message: '登陆成功',
            //     type: 'success',
            //     duration: 1000
            // })
                .catch(error => {
                    if (error.response) {
                        for (const property in error.response.data) {
                            this.errors.push(`${property}: ${error.response.data[property]}`)
                        }
                    } else {
                        this.errors.push('Something went wrong. Please try again')
                        
                        console.log(JSON.stringify(error))
                    }
                })
        }
    }



//   data() {
//       return {
//         checked: true,
//         ruleForm: {
//           mobile: '',
//           password: ''
//         }
//       }
//     },

// //   data() {
// //     return {
// //       mobile: '',
// //       password: '',
// //       errors: []
// //     }
// //   },
// //   mounted() {
// //         document.title = 'Log In | Djackets'
// //     },
// //     methods: {
// //         async submitForm() {
// //             axios.defaults.headers.common["Authorization"] = ""
// //             localStorage.removeItem("token")
// //             const formData = {
// //                 mobile: this.mobile,
// //                 password: this.password
// //             }
// //             await axios
// //                 .post("/api/v1/token/login/", formData)
// //                 .then(response => {
// //                     const token = response.data.auth_token
// //                     this.$store.commit('setToken', token)
                    
// //                     axios.defaults.headers.common["Authorization"] = "Token " + token
// //                     localStorage.setItem("token", token)
// //                     const toPath = this.$route.query.to || '/shopping-cart'
// //                     this.$router.push(toPath)
// //                 })
// //                 .catch(error => {
// //                     if (error.response) {
// //                         for (const property in error.response.data) {
// //                             this.errors.push(`${property}: ${error.response.data[property]}`)
// //                         }
// //                     } else {
// //                         this.errors.push('Something went wrong. Please try again')
                        
// //                         console.log(JSON.stringify(error))
// //                     }
// //                 })
// //         }
// //     }
// // }


//   // setup() {
//   //   const loginForm = ref(null);
//   //   const state = reactive({
//   //     ruleForm: {
//   //       mobile: "",
//   //       passowrd: "",
//   //     },
//   //     rules: {
//   //       mobile: [
//   //         { required: "true", message: "账户不能为空", trigger: "blur" },
//   //       ],
//   //       password: [
//   //         { required: "true", message: "密码不能为空", trigger: "blur" },
//   //       ],
//   //     },
//   //   });

//   //   const submitForm = async () => {
//   //     axios.defaults.headers.common["Authorization"] = ""
//   //     loginForm.value.validate((valid) => {
//   //       if (valid) {
//   //         const _this = this
//   //         axios.post('/api/v1/token/login/', {
//   //           mobile: state.ruleForm.mobile,
//   //           password: state.ruleForm.password
//   //         }).then((res) => {
//   //           const token = res.data.auth_token
//   //           _this.$store.commit('setToken', token)
//   //           axios.defaults.headers.common["Authorization"] = "Token " + token
//   //           // window.localStorage.setItem('token', JSON.stringify(res))  //储存token在localStorage  需要更改
//   //           window.location.href = '/'
//   //         })
//   //         // .catch(error => {
//   //         //   if (error.response) {
//   //         //       for (const property in error.response.data) {
//   //         //           console.log(`${property}: ${error.response.data[property]}`)
//   //         //       }
//   //         //   } else {
//   //         //       console.log('Something went wrong. Please try again')
                
//   //         //       console.log(JSON.stringify(error))
//   //         // }})
//   //       } else {
//   //         console.log('error submit!!')
//   //         return false;
//   //       }
//   //     })
//   //     // var params = {
//   //     //   mobile: state.ruleForm.mobile,
//   //     //   password: state.ruleForm.passowrd
//   //     // }
//   //     // console.log("aaaa:",params.mobile)
//   //     // userLogin(params).then(res => {
//   //     //   // if (res.result.state===1){
//   //     //     console.log("bbbb:", res)
//   //     //   if (res.data===1){
//   //     //     this.$router.push({
//   //     //       path: '/'
//   //     //     })
//   //     //   }else {

//   //     //     return false
//   //     //   }
//   //     // })
//   //   };
    
//   //   return {
//   //     ...toRefs(state),
//   //     loginForm,
//   //     submitForm
//   //   }
//   // },

//   methods: {
//     async submitForm() {
//       if(this.ruleForm.mobile === "" || this.ruleForm.password === ""){
//         alert("请输入账号或密码")
//       } else {
//         const formData = {
//           mobile: this.ruleForm.mobile,
//           password: this.ruleForm.password
//         }

//         await axios
//         .post("/api/v1/token/login/", formData)
//         .then(res => {
//           console.log(res.data)
//           const token = res.data.auth_token
//           this.$store.commit('setToken', token)
//           this.$router.push('/')
//         })
//         .catch(error => {
//           console.log(error.response)
//         })
//       }
//     }
//   },

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

.login-area {
  display: flex;
  flex-direction: column;
}

</style>
