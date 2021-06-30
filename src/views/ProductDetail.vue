<template>
  <div class="prodcut-detail">
    <div class="prodcut-detial-container">
      <el-header>
        <Header />
      </el-header>
      <el-main class="main-body" v-loading="this.$store.state.isLoading">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/products' }">{{
            this.$route.params.category_slug
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
          <el-col>
            <figure class="image">
              <img
                :src="product.get_image"
                alt="图片"
                height="400"
                width="300"
              />
            </figure>
            <h1 class="title">{{ product.name }}</h1>
            <p class="descirption">{{ product.descirption }}</p>
          </el-col>

          <el-col>
            <h2 class="subtitle">详情</h2>
            <p>{{ product.description }}</p>
            <p><strong>价格：</strong>¥{{ product.price }}</p>

            <div class="field has-addons mt-6">
              <div class="control">
                <input
                  class="quantity-input"
                  type="number"
                  min="1"
                  v-model="quantity"
                />
              </div>
              <div class="control">
                <button class="button is-dark" @click="addToCart">
                  加入购物车
                </button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";

// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import cookie from "@/static/cookie";

import { ElMessage } from "element-plus";
// import { ref } from '@vue/reactivity';

export default {
  name: "ProductDetail",
  data() {
    return {
      product: {},
      quantity: 1,
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
      console.log("here");
      axios
        .post("/login/refresh/", refresh_token)
        .then((res) => {
          cookie.delCookie("token");
          cookie.setCookie("token", res.data.access, 7);

          this.$store.commit("setToken");
          console.log("sdfjlkjojxojci");
        })
        .catch(function(error) {
          console.log("sdfsfsfsfsfd");
          if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
        });
    } else {
      this.$store.commit("onlyRemoveToken");
    }
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    async getProduct() {
      this.$store.commit("setIsLoading", true);

      const category_slug = this.$route.params.category_slug;
      const product_slug = this.$route.params.product_slug;

      await axios
        .get(
          `http://127.0.0.1:8000/api/v1/products/${category_slug}/${product_slug}`
        )
        .then((res) => {
          console.log(res.data);
          this.product = res.data;
        })
        .catch(function(error) {
          console.log(error);
          if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.messages);
          }
        });
      this.$store.commit("setIsLoading", false);
    },
    addToCart() {
      if (isNaN(this.quantity) || this.quantity < 1) {
        this.quantity = 1;
      }

      const item = {
        goods: this.product.id,
        nums: this.quantity,
      };
      this.$store.commit("setIsLoading", true);

      var token = this.$store.state.userInfo.token;
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .post("/shopcarts/", item)
        .then((res) => {
          console.log("add to cart success: ", res);
          ElMessage({
            showClose: true,
            message: "成功加入购物车",
            type: "success",
            duration: 1000,
          });
        })
        .catch((err) => {
          console.log(err.toString());
          ElMessage({
            showClose: true,
            message: "添加购物车失败",
            type: "fail",
            duration: 1000,
          });
          this.$router.push("/login?to=/shopping-cart"); //可行
        });

      this.$store.commit("setIsLoading", false);
    },
  },
  components: {
    Header,
    Footer,
  },
};
</script>
