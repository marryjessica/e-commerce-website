<template>
  <div class="user-profile">
      <h2 style="text-align:left; margin-left:20px">我的收藏</h2>
        <div class="user_fav_container" v-loading="this.$store.state.isLoading">
          
          <el-card class="fav_card" v-for="fav in user_fav" :key="fav">
            <div class="fav_product">
              <router-link
                class="fav_product_img"
                :to="fav.goods.get_absolute_url"
              >
                <img :src="fav.goods.get_thumbnail" alt="缩略图" />
              </router-link>
              <span>
                <router-link
                  class="fav_product_name"
                  :to="fav.goods.get_absolute_url"
                  >{{ fav.goods.name }}
                </router-link>
              </span>
            </div>
          </el-card>
        </div>
  </div>
</template>

<script>
import axios from "axios";
import cookie from "@/static/cookie";

export default {
  name: "UserFav",
  data() {
    return {
      user_fav: [],
    };
  },
  mounted() {
    this.getUserFav();
  },
  beforeCreate() {
    var refresh_token = {
      refresh: localStorage.getItem("refresh"),
    };

    this.$store.commit("isTokenExpired");
    console.log('treid again--------------------------')
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
  methods: {
    getUserFav() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .get("/user_fav/")
        .then((res) => {
          console.log("fav data: ", res.data);
          this.user_fav = res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      this.$store.commit("setIsLoading", false);
    },
  },
  computed: {
  },
  updated: function() {
    console.log("1==我会先执行");

    this.$nextTick(function() {
      //在下次 DOM 更新循环结束之后执行这个回调。在修改数据之后立即使用这个方法，获取更新后的DOM.

      console.log("3==我只能等页面渲染完了才会立即执行");
    });

    console.log("2==我虽然在最后但会比$nextTick先执行");
  },
};
</script>

<style>
.user_fav_container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-left: 20px;
}

.fav_card {
  width: 200px;
  height: 200px;
  margin: 10px;
}

.fav_card .el-card__body {
    padding: 15px;
}

.fav_card .fav_product {
  width: 100%;
  height: 100%;
}

.fav_card .fav_product img {
  width: 100%;
    height: 130px;
    border-radius: 2px;
}

.fav_card .fav_product .fav_product_name {
  text-decoration: none;
  font-size: 14px;
  color: black;
}
</style>
