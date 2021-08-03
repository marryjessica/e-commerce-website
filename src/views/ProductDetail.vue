<template>
  <div class="prodcut-detail">
    <div class="prodcut-detial-container">
      <el-header>
        <Header />
      </el-header>
      <el-main class="main-body" v-loading="this.$store.state.isLoading">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{ path: '/' + $route.params.category_slug }"
            >{{ product.category_name }}</el-breadcrumb-item
          >
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="product_detail_container">
          <div class="product_detail_left">
            <figure class="image">
              <img
                :src="product.get_image"
                alt="图片"
                height="400"
                width="300"
              />
            </figure>
          </div>
          <div class="product_detail_right">
              <div class="product_detail_right_name">
                  <h5 class="subtitle">商品名称</h5>
                  <h3 style="    text-align: left;
    margin-left: 8%;">{{ product.name }}</h3>
              </div>
            <div class="product_detail_right_description">
                <h5 class="subtitle">商品详情</h5>
            <p style="    margin-left: 8%;
    text-align: left;">{{ product.description }}</p>
            </div>
            <div class="product_detail_right_buy">
                <div class="product_detail_price">
                    <p><strong>价格：</strong>¥{{ product.price }}</p>
                    <p><strong>数量：</strong><input
                  class="quantity-input"
                  type="number"
                  min="1"
                  :max="product.stock_nums"
                  v-model="quantity"
                  style="width: 60px; height: 20px;"
                /> {{ product.unit }}</p>
                
              <span style="font-size:10px">库存：{{ product.stock_nums }} {{ product.unit }}</span>
                </div>
               
              <div class="product_detail_control">
                <button
                  class="addtocartbutton"
                  v-if="product.stock_nums > 0"
                  @click="addToCart"
                >
                  加入购物车
                </button>
                <button class="addtocartbutton" v-else :disabled="true">
                  加入购物车
                </button> 
            </div>
            </div>
          </div>
        </div>
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
      axios
        .post("/login/refresh/", refresh_token)
        .then((res) => {
          cookie.delCookie("token");
          cookie.setCookie("token", res.data.access, 7);

          this.$store.commit("setToken");
        })
        .catch(function(error) {
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
      if (this.product.stock_nums < 1) {
        ElMessage({
          showClose: true,
          message: "售罄了哦",
          type: "error",
          duration: 1000,
        });
      } else if (this.quantity > this.product.stock_nums) {
        ElMessage({
          showClose: true,
          message: "没有那么多哦",
          type: "danger",
          duration: 1000,
        });
      } else {
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
      }
    },
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
.main-body {
  padding-left: 7%;
  padding-right: 8%;
}

.product_detail_container {
    display: flex;
    flex-direction: row;
    margin: 30px 0px;
}

.product_detail_left {
    width: 35%;
}

.product_detail_right {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 100px;
    width: 60%;
}

.product_detail_right_name {
    height: 100px;
    width: 100%;
}

h5.subtitle {
    text-align: left;
}

.product_detail_right_description {
    height: 55%;
    width: 100%;
}

.product_detail_right_buy{
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-around;
    align-items: center;
}

.product_detail_price {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
}

.addtocartbutton {
    margin: 20px 10px;
    font-size: 22px;
    background: linear-gradient(to right, #188bf7, #1ab0f5);
    border: none;
    border-radius: 5px;
    color: white;
    padding: 5px;
    width: 200px;
    cursor: pointer;
}
   
</style>
