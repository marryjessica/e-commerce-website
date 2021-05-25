<template>
  <div class="user-profile">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <el-row> </el-row>
        <el-row class="middle_area">
          <div>
            <el-button class="logout-button" @click="logout()" type="danger"
              >退出</el-button
            >
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

import { ElMessage } from 'element-plus'

import axios from "axios";

export default {
  name: "UserProfile",
  components: {
    Header,
    Footer,
  },
  methods: {
    logout() {
      axios.defaults.headers.common["Authorization"] = "";

      this.$store.commit("removeToken");
      this.$router.push("/");

      ElMessage({
                showClose: true,
                message: '成功退出登陆',
                type: 'success',
                duration: 1000
            })
    },
  },
};
</script>

<style></style>
