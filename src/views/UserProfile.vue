<template>
  <div class="user-profile">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <el-row>
          <div v-loading="this.$store.state.isLoading">
            <p>你好 {{ user_profile.name }}</p>
            <p>手机号: {{ user_profile.mobile }}</p>
          </div>
        </el-row>
        <el-row class="middle_area">
          <div>
            <el-button class="logout-button" @click="logout()" type="danger"
              >退出</el-button
            >
          </div>
          <div>
            
          </div>
        </el-row>
        <el-row class="lower_area">
          <div class="category_container"></div>
        </el-row>
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

import { ElMessage } from "element-plus";

import axios from "axios";
import cookie from "@/static/cookie";

export default {
  name: "UserProfile",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      user_profile: [],
    };
  },
  mounted() {
    // this.getUserProfile();
  },
  created() {
    this.getUserProfile();
  },
  methods: {
    logout() {
      axios.defaults.headers.common["Authorization"] = "";

      this.$store.commit("removeToken");
      this.$router.push("/");

      ElMessage({
        showClose: true,
        message: "成功退出登陆",
        type: "success",
        duration: 1000,
      });
    },
    getUserProfile() {
      this.$store.commit("setIsLoading", true);
      // var token = localStorage.getItem('token').slice(1, -1)

      var token = cookie.getCookie("token");
      console.log(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .get("/users/1")
        .then((res) => {
          this.user_profile = res.data;
          console.log("res data: ", res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      this.$store.commit("setIsLoading", false);
    },
  },
  computed: {
    userprofileLength() {
      if (this.user_profile.length === 0) {
        return 0;
      } else {
        return this.user_profile;
      }
    },
  },
};
</script>

<style></style>
