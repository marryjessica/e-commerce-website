<template>
  <div class="cart-page">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <table class="checkout-table">
          <thead>
            <tr>
              <th>商品信息</th>
              <th>单价（元）</th>
              <th>数量</th>
              <th>小计</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <div v-loading="this.$store.state.isLoading">
              <el-row v-for="item in cart.items" :key="item.goods.id">
                <tr>
                  <td>
                    <router-link :to="item.goods.get_absolute_url">
                      <figure class="image">
                        <img :src="item.goods.get_thumbnail" alt="缩略图" />
                      </figure>
                      {{ item.goods.name }}
                    </router-link>
                  </td>
                  <td>{{ item.goods.price }}</td>
                  <td>
                    {{ item.nums }}
                  </td>
                  <td>{{ getItemTotal(item).toFixed(2) }}</td>
                </tr>
              </el-row>
            </div>
          </tbody>
        </table>
        <div class="cart-summary">
          <div>全部商品 {{ cart.items.length }} 件</div>
          <div>总价：¥{{ cartTotalPrice }} 元</div>
        </div>
        <div>
          <h3>收货地址</h3>
          <el-row>
            {{ selected_address.address }}
            {{ selected_address.signer_name }}
            {{ selected_address.signer_mobile }}
          </el-row>
          <el-button @click="swapSelectedAddress">
            修改收货地址
          </el-button>
        </div>
        <div class="change_address_box" v-if="change_address_box">
          <div class="change_address">
            <h3>我的地址</h3>
            <h4
              class="address_option"
              v-for="(address, index) in user_address"
              :key="address"
            >
              <el-radio
                v-model="selected_address.id"
                :label="address.id"
                @click="changeSelectedAddress(index)"
                >{{
                  address.province +
                    "省" +
                    address.city +
                    "市" +
                    address.district +
                    "区" +
                    address.address
                }}</el-radio
              >
            </h4>
            <el-button @click="swapSelectedAddress">确定</el-button>
          </div>
        </div>
        <div>
          <el-button v-if="this.cart.items.length" @click="CheckOut">下单</el-button>
          <el-button v-else disabled="true">下单</el-button>
        </div>
        <div class="order_success_box" v-if="order_success">
          <div class="order_success_box_content">
            <h2>下单成功</h2>
            <el-button :to="{ name: 'Home' }">继续购物</el-button>
            <router-link :to="{ name: 'UserProfile' }">查看订单</router-link>
          </div>
        </div>
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

import axios from "axios";
import cookie from "@/static/cookie";

import { ElMessage } from "element-plus";

export default {
  name: "CheckOut",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      cart: {
        items: [],
      },
      user_address: [],
      selected_address: {},
      order_success: false,
      change_address_box: false,
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
        console.log(this.$store.state.tokenTimeDiff);
      });
    } else {
      this.$router.push("/login?to=/check-out");
    }
  },
  mounted() {
    this.getCheckOutItems();
    this.getUserAddress();
  },
  methods: {
    getCheckOutItems() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      console.log("record1: ", axios.defaults.headers.common["Authorization"]);

      axios
        .get("/shopcartitemselected/")
        .then((res) => {
          this.cart.items = res.data;
        })
        .catch((err) => {
          console.log(err.response);
          var err_msg = err.response.data.messages[0].message;
          ElMessage({
            showClose: true,
            message: err_msg,
            type: "error",
            duration: 1500,
          });
        });

      this.$store.commit("setIsLoading", false);
    },
    getItemTotal(item) {
      return item.goods.price * item.nums;
    },
    getUserAddress() {
      this.$store.commit("setIsLoading", true);

      //   var token = cookie.getCookie("token");
      //   axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .get("/user_address/")
        .then((res) => {
          this.user_address = res.data;
          console.log("res data: ", res.data);
          this.getSelectedAddress();
        })
        .catch((err) => {
          console.log(err.messages[0].message);
        });

      this.$store.commit("setIsLoading", false);
    },
    getSelectedAddress() {
      this.user_address.forEach((address) => {
        if (address.is_default) {
          this.selected_address = address;
          console.log(this.selected_address);
        }
      });
    },
    swapSelectedAddress() {
      this.change_address_box = !this.change_address_box;
    },
    changeSelectedAddress(index) {
      this.selected_address = this.user_address[index];
    },
    CheckOut() {
      if (this.cart.items.length === 0) {
        ElMessage({
          showClose: true,
          message: "下单失败",
          type: "error",
          duration: 1000,
        });
      } else {
        this.$store.commit("setIsLoading", true);

        //   var token = cookie.getCookie("token");
        //   axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        let data = new FormData();
        data.append("address", this.selected_address.id);

        axios
          .post("/user_orders/", data)
          .then((res) => {
            console.log("res data: ", res.data);
            ElMessage({
              showClose: true,
              message: "恭喜！成功下单",
              type: "success",
              duration: 1000,
            });
            console.log("下单成功");
            this.order_success = true;
          })
          .catch((err) => {
            console.log(err);
            ElMessage({
              showClose: true,
              message: "因为未知错误，下单失败",
              type: "danger",
              duration: 1000,
            });
            console.log("下单失败");
          });

        this.$store.commit("setIsLoading", false);
      }
    },
  },
  computed: {
    cartTotalLength() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += parseInt(curVal.nums));
      }, 0);
    },
    cartTotalPrice() {
      return this.cart.items.reduce((accumulator, current) => {
        return (accumulator +=
          parseInt(current.goods.price) * parseInt(current.nums));
      }, 0);
    },
  },
};
</script>

<style>
.main-body {
  padding-left: 7%;
  padding-right: 8%;
}

.order_success_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
}

.order_success_box_content {
  width: 500px;
  height: 300px;
  padding: 20px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -250px;
}

.change_address_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
}

.change_address_box .change_address {
  width: 500px;
  height: 300px;
  padding: 20px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -250px;
}

.change_address_box .change_address .address_option span {
  font-size: 16px;
}
</style>
