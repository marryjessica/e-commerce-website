<template>
  <div class="home">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main>
        <el-row> </el-row>
        <el-row class="middle_area">
          <div v-for="category in categories" :key="category.id">
            <router-link class="product-button" to="products">
              <div class="card">
                <figure class="image">
                  <img :src="category.get_image" alt="缩略图" />
                </figure>
                {{ category.category_name }}
              </div>
            </router-link>
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
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

import axios from "axios";
import cookie from "@/static/cookie";

export default {
  name: "Home",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      categories: [],
    };
  },
  beforeCreate() {
    var refresh_token = {
      refresh: localStorage.getItem("refresh"),
    };

    this.$store.commit("isTokenExpired");

    if (
      refresh_token.refresh !== null &&
      this.$store.state.tokenTimeDiff < 1800
    ) {
      axios.post("/login/refresh/", refresh_token).then((res) => {
        cookie.delCookie("token");
        cookie.setCookie("token", res.data.access, 7);

        this.$store.commit("setToken");
      });
    }
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      this.$store.commit("setIsLoading", true);

      axios
        .get("/api/v1/category/")
        .then((res) => {
          this.categories = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          console.log("error:", err.response.data.messages);
        });

      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>

<style>
.el-main {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
}

.main-body {
  padding-left: 95px;
  padding-right: 95px;
}

.card img {
  height: 200px;
  width: 225px;
}
</style>
