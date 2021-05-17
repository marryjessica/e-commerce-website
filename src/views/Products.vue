<template>
  <div class="products">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
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
            <el-card>
              <figure class="image">
                <img :src="product.get_thumbnail" alt="缩略图" />
              </figure>
              <div class="product-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-price" has-text-grey
                  >¥{{ product.price }}</span
                >
                <router-link class='button is-dark mt-4' :to='product.get_absolute_url'>查看</router-link>
              </div>
            </el-card>
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
  mounted() {
    this.getLatestProducts();
  },
  methods: {
    getLatestProducts() {
      axios
        .get("/api/v1/latest-products/")
        .then((res) => {
          this.latestProducts = res.data;
          console.log(res.data);
        })
        .catch((error) => {
          console.log("error:", error);
        });
    },
  },
};
</script>

<style>
.main-body {
  padding-left: 100px;
  padding-right: 100px;
}

.category-name-container {
  margin: 10px;
  font-size: 30px;
  font-style: italic;
}

.product-card {
  height: 300px;
  width: 250px;
  margin: 10px;
}

.el-card {
  height: 100%;
  width: 100%;
}

.product-info {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
}

img {
  height: 200px;
  width: 250px;
}

figure {
  margin-bottom: 0;
}
</style>
