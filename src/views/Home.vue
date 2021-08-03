<template>
  <div class="home">
    <div id="head">
      <Header />
    </div>
    <div>
      <div class="banner">
        <el-carousel
          :interval="2000"
          trigger="click"
          initial-index="1"
          arrow="always"
          height="650px"
        >
          <el-carousel-item v-for="item in this.$store.state.carousels" :key="item">
            <img class="carousel_img" :src="item.get_image" alt="缩略图" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div>
        <span class="fenlei">分类：</span>
      </div>

      <div class="main-body">
        <div class="middle_area">
          <div
            class="category_card"
            v-for="category in categories"
            :key="category.id"
          >
            <img :src="category.get_image" alt="缩略图" />
            <router-link
              class="into_products_span"
              :to="{
                path: category.get_absolute_url,
              }"
            >
              {{ category.category_name }}<i class="uparrow el-icon-top"></i>
            </router-link>
          </div>
        </div>
        <div class="lower_area"></div>
      </div>
    </div>
    <div>
      <Footer />
    </div>
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
      carousels: [],
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
    } else {
      axios.defaults.headers.common["Authorization"] = "";

      this.$store.commit("removeToken");
    }
  },
  created() {
    this.$store.commit("setCarousel")
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    getCarousels() {
      this.$store.commit("setIsLoading", true);

      axios
        .get("/api/v1/carousels/")
        .then((res) => {
          this.carousels = res.data;
          this.$store.commit("setCarousel", this.carousels)
          console.log(res.data);
        })
        .catch((err) => {
          console.log("error:", err.response.data.messages);
        });

      this.$store.commit("setIsLoading", false);
    },
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


#head {
  height: 60px;
}
* {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
}
.main-body {
  padding-left: 7%;
  padding-right: 8%;
}

.fenlei {
  font-size: 46px;
  font-style: italic;
  font-weight: bold;
  display: flex;
  margin-left: 4%;
  margin-top: 20px;
}

.banner {
  height: 650px;
  margin: -8px;
}

.banner .carousel_img {
  width: 100%;
  height: 650px;
}

.middle_area {
  display: flex;
  flex-direction: row;
  margin-left: 4%;
  margin-right: 4%;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.category_card {
  height: 200px;
  width: 225px;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-right: 25px;
  margin-left: 25px;
}

.category_card img {
  height: 200px;
  width: 225px;
  filter: brightness(0.3) opacity(0.7);
}

.category_card img :hover {
  transform: scale(1.5);
}

.into_products_span {
  position: relative;
  top: -70%;
  text-decoration: none;
  font-size: 22px;
  color: white;
  font-weight: bold;
}

@keyframes bounce {
  0%,
  100%,
  20%,
  50%,
  80% {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
  40% {
    -webkit-transform: translateY(-30px);
    -ms-transform: translateY(-30px);
    transform: translateY(-30px);
  }
  60% {
    -webkit-transform: translateY(-15px);
    -ms-transform: translateY(-15px);
    transform: translateY(-15px);
  }
}

.category_card .uparrow {
  display: block;
  margin-top: 10px;
  color: white;
  font-weight: bold;
  font-size: 26px;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  color: white;
}

.category_card .uparrow :hover {
  cursor: pointer;
  animation-name: bounce;
  -moz-animation-name: bounce;
}
</style>
