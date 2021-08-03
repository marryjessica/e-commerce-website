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
          <el-breadcrumb-item>{{ category_name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row class="category-name-container">
          <span class="category-name">{{ category_name }}</span>
        </el-row>

        <div class="products_container" v-if="productsLength">
          <div>
          <el-col
            class="product-card"
            v-for="(product, index) in products"
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
                  <el-button
                    type="text"
                    icon="el-icon-star-on"
                    class="product_fav_button"
                    v-if="product.isFaved"
                    @click="delFromFav(product.id, index)"
                  />
                  <el-button
                    type="text"
                    icon="el-icon-star-off"
                    class="product_fav_button"
                    v-else
                    @click="addToFav(product.id, index)"
                  />
                </div>
              </div>
            </div>
          </el-col>
          </div>
          <el-pagination
              :page-size="3"
              layout="total, prev, pager, next, jumper"
              :total="totalNumOrders"
              @next-click="loadNext"
              @prev-click="loadPrev"
              @current-change="clickPage"
            >
            </el-pagination>
        </div>
        <div v-else>
          该分类还没有商品哦
        </div>
        <div>
          
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
      products: [],
      favorited_products: [],
      category_name: '',
      totalNumOrders: 0,
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
  created() {
    if (localStorage.getItem("refresh") !== null && this.$store.state.tokenTimeDiff < 1800) {
      this.getFavProducts();
    }
  },
  mounted() {
    this.getLatestProducts(1);
    
  },
  methods: {
    async getLatestProducts(currentPage) {
      this.$store.commit("setIsLoading", true);

      const category_slug = this.$route.params.category_slug;

      await axios
        .get(`/api/v1/category-products/${category_slug}/?page=${currentPage}`)
        .then((res) => {
          console.log(res.data.results);
          this.totalNumOrders = res.data.count;
          this.products.length = 0;

          for (var i = 0; i < res.data.results.length; i++) {
            const item = {
              category_name: res.data.results[i].category_name,
              description: res.data.results[i].description,
              get_absolute_url: res.data.results[i].get_absolute_url,
              get_image: res.data.results[i].get_image,
              get_thumbnail: res.data.results[i].get_thumbnail,
              id: res.data.results[i].id,
              isFaved: this.hasFav(res.data.results[i].id),
              name: res.data.results[i].name,
              price: res.data.results[i].price,
            }
            this.products.push(item)
          }
          this.category_name = this.products[0].category_name
          
        })
        .catch((err) => {
          console.log("error:", err);
        });

      console.log(this.products)

      this.$store.commit("setIsLoading", false);
    },
    getFavProducts() {
      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios.get("/retrieve_fav_products/").then((res) => {
        res.data.forEach((fav) => {
          this.favorited_products.push(fav.goods);
        });
        console.log(this.favorited_products);      
      });
    },
    addToFav(id, index) {
      console.log(this.$route.path)
      console.log('addtoFav: ', this.products, this.favorited_products, id, index)
      if (localStorage.getItem("refresh") !== null && this.$store.state.tokenTimeDiff < 1800) {
      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios.post("/user_fav/", { goods: id }).then((res) => {
        this.favorited_products.push(res.goods);
        this.products[index].isFaved = true;
      });
      } else {
        this.$router.push("/login?to="+this.$route.path);
      }
    },
    delFromFav(id, index) {
      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios.delete("/user_fav/"+id+"/").then(() => {
        this.favorited_products.splice(index, 1);
        this.products[index].isFaved = false;
        console.log(this.favorited_products)
      });
    },
    hasFav(id) {
      return this.favorited_products.includes(id);
    },
    loadNext(currentPage) {
        this.getLatestProducts(currentPage)
    },
    loadPrev(currentPage) {
        this.getLatestProducts(currentPage)
    },
    clickPage(currentPage) {
        this.getLatestProducts(currentPage)
    },
  },
  computed: {
    productsLength() {
      if (this.products.length === 0) {
        return 0
      } else {
        return this.products.length
      }
    }
  },
};
</script>

<style>
.main-body {
  padding-left: 7%;
  padding-right: 8%;
}

.category-name-container {
  margin: 10px;
  font-size: 30px;
  font-style: italic;
}

.products_container {
  display: flex;
    flex-direction: column;
}

.product-card {
  height: 320px;
  width: 225px;
  margin: 30px;
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
  border-radius: 5px;
}

.card .product-info {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  margin: 10px;
  width: 91%;
}

.card .product-name-container {
  height: 45px;
  text-align: left;
  line-height: 18px;
  font-size: 14px;
  font-weight: bold;
}

.card .product-button-container {
  margin-top: 5px;
  text-decoration: none;
  width: 100%;
}

.card img {
  height: 200px;
  width: 225px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.card figure {
  margin: 0px;
}

.product-button {
  text-decoration: none;
  float: left;
  margin-top: 7px;
  color: black;
}

.product_fav_button {
  font-size: 30px;
  padding: 0px;
  float: right;
  margin-top: -5px;
}

</style>
