<template>
  <div class="cart-page">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <el-table
          class="cart_items_table"
          v-if="cartTotalLength"
          ref="cart_items_table_ref"
          :data="cart.items"
          stripe
          style="width: 100%"
        >
          <el-table-column
            class="item_info"
            prop="good_thumbnail"
            label="商品名称"
            :min-width="35"
          >
            <template #default="scope">
              <img :src="scope.row.goods.get_thumbnail" alt="缩略图" />
              <span>{{ scope.row.goods.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="goods.price"
            label="单价（元）"
            :min-width="15"
          />
          <el-table-column prop="nums" label="数量" :min-width="20">
            <template #default="scope">
              <span>{{ scope.row.nums }} </span>
            </template>
          </el-table-column>
          <el-table-column label="金额" :min-width="15">
            <template #default="scope">
              {{ getItemTotal(scope.row).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
        <p v-else>没有商品</p>
        <div class="checkout-summary">
          <div>全部商品 {{ cart.items.length }} 件</div>
          <div>总价：¥{{ cartTotalPrice }} 元</div>
        </div>
        <div class="checkout-address">
          <h4 style="text-align:left;">
            收货信息<el-button
              style="margin-left: 40px;"
              size="mini"
              @click="swapSelectedAddress"
            >
              修改收货地址
            </el-button>
          </h4>

          <span style="text-align:left;">
            收货人: {{ selected_address.signer_name }} , 联系电话:
            {{ selected_address.signer_mobile }}
            , 收货地址:
            {{
              selected_address.province +
                selected_address.city +
                selected_address.district +
                selected_address.address
            }}</span
          >
        </div>
        <div class="change_address_box" v-if="change_address_box">
          <div class="change_address">
            <div
              style="display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 90px;"
            >
              <h3>我的地址</h3>
              <span
                class="address_option"
                v-for="(address, index) in user_address"
                :key="address"
                style="margin:10px 0px;"
              >
                <el-radio
                  v-model="selected_address.id"
                  :label="address.id"
                  @click="changeSelectedAddress(index)"
                  ><span
                    >{{
                      address.province +
                        "/" +
                        address.city +
                        "/" +
                        address.district +
                        "/" +
                        address.address
                    }}
                  </span></el-radio
                >
              </span>
              <el-button @click="swapSelectedAddress">确定</el-button>
            </div>
          </div>
        </div>
        <div style="text-align:right; ">
          <el-button
            v-if="this.cart.items.length"
            @click="CheckOut"
            style="margin-top: 10px; margin-right: 100px; width: 120px;"
            >下单</el-button
          >
          <el-button v-else disabled="true" style="margin-top: 10px; margin-right: 100px; width: 120px;">下单</el-button>
        </div>
        <div class="order_success_box" v-if="order_success">
          <div class="order_success_box_content">
            <h2>下单成功</h2>
            <router-link :to="{ name: 'Home' }" class="continue-next"
              >继续购物</router-link
            >
            <router-link :to="{ name: 'UserOrders' }" class="continue-next"
              >查看订单</router-link
            >
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
            this.cart.items = [];
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

.el-table__row .cell img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.checkout-summary {
  display: flex;
  justify-content: space-between;
  padding: 20px 92px 20px 60px;
  border-bottom: 1px solid #ebeef4;
}

.checkout-address {
  border-bottom: 1px solid #ebeef3;
  padding: 10px 20px 20px;
  display: flex;
  flex-direction: column;
}

.order_success_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  z-index: 1;
}

.order_success_box_content {
  width: 400px;
  height: 200px;
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
  z-index: 1;
}

.change_address_box .change_address {
  width: 460px;
  height: auto;
  padding: 20px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -250px;
}

.el-radio {
  white-space: break-spaces;
}

.change_address_box .change_address .address_option span {
  font-size: 16px;
}

.continue-next {
  text-decoration: none;
  color: black;
  border: 1px solid lightgrey;
  border-radius: 3px;
  margin: 10px;
  padding: 10px;
  position: relative;
  top: 50px;
  cursor: pointer;
}
</style>
