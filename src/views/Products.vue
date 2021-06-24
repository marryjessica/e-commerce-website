<template>
  <div class="products">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body" v-loading="this.$store.state.isLoading">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>石材</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row class="category-name-container">
          <span class="category-name">石材</span>
        </el-row>

        <div>
          <el-col
            class="product-card"
            v-for="product in latestProducts"
            :key="product.id"
          >
            <div class="card">
              <figure class="image">
                <img :src="product.get_thumbnail" alt="缩略图" />
              </figure>
              <div class="product-info">
                <div class="product-name-container">
                  <span class="product-name">{{ product.name }}</span>
                </div>
                <div class="product-price-container">
                  <span class="product-price" has-text-grey
                    >¥{{ product.price }}</span
                  >
                </div>
                <div class="product-button-container">
                  <router-link
                    class="product-button"
                    :to="product.get_absolute_url"
                    >查看</router-link
                  >
                </div>
              </div>
            </div>
          </el-col>
        </div>
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

import cookie from "@/static/cookie";

export default {
  name: "Products",
  data() {
    return {
      latestProducts: [],
    };
  },
  components: {
    Header,
    Footer,
  },
  beforeCreate() {
    var refresh_token = {
      refresh: localStorage.getItem("refresh"),
    };

    if (refresh_token.refresh !== null) {
      axios
        .post("/login/refresh/", refresh_token)
        .then((res) => {
          cookie.delCookie('token')
          cookie.setCookie("token", res.data.access, 7)

          this.$store.commit("setToken")
        })
    }
  },
  mounted() {
    this.getLatestProducts();
  },
  methods: {
    async getLatestProducts() {
      this.$store.commit("setIsLoading", true);

      await axios
        .get("/api/v1/latest-products/")
        .then((res) => {
          this.latestProducts = res.data;
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
.main-body {
  padding-left: 95px;
  padding-right: 95px;
}

.category-name-container {
  margin: 10px;
  font-size: 30px;
  font-style: italic;
}

.product-card {
  height: 320px;
  width: 225px;
  margin: 10px;
}

.product-card .card {
  width: 100%;
  height: 100%;
  margin: 0px auto;
  background-color: white;
  border: 1px solid #c3c1c1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card .product-info {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  margin: 10px;
}

.card .product-name-container {
  height: 45px;
  text-align: left;
  line-height: 18px;
  font-size: 14px;
  font-weight: bold;
}

.card .product-button-container {
  margin: 10px;
  margin-left: 0px;
  text-decoration: none;
}

.card img {
  height: 200px;
  width: 225px;
}

.card figure {
  margin: 0px;
}

a {
  text-decoration: none;
}
</style>
