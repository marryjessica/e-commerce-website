<template>
  <div class="search-page">
    <el-header>
      <Header />
    </el-header>
    <el-main class="main-body" v-loading="this.$store.state.isLoading">
      <div>
        <h2>{{ query }} 的搜索结果：</h2>
      </div>
      <div>
        <el-col
          class="product-card"
          v-for="product in products"
          :key="product.id"
          :product="product"
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
                  style="color:black;"
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
  </div>
</template>

<script>
// import axios from "axios";

// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import cookie from "@/static/cookie";

export default {
  name: "Search",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      products: [],
      query: "",
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
    else {
      axios.defaults.headers.common["Authorization"] = "";

      this.$store.commit("removeToken");
    }
  },
  mounted() {
    document.title = "搜索结果";

    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);

    if (params.get("query")) {
      this.query = params.get("query");
      this.makeSearch();
    }
  },
  methods: {
    async makeSearch() {
      this.$store.commit("setIsLoading", true);

      await axios
        .post("api/v1/products/search/", { query: this.query })
        .then((res) => {
          this.products = res.data;
        })
        .catch((err) => {
          console.log(err.response.data.messages);
        });

      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>

<style>
.main-body {
  padding-left: 7%;
  padding-right: 8%;
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
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.card figure {
  margin: 0px;
}

a {
  text-decoration: none;
}
</style>
