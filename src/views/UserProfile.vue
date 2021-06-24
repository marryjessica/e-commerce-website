<template>
  <div class="user-profile">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <el-row>
          <div v-loading="this.$store.state.isLoading">
            <el-button @click="swapProfileBox">编辑个人信息</el-button>
            <p>你好 {{ user_profile.name }}</p>
            <p>手机号: {{ user_profile.mobile }}</p>
          </div>
        </el-row>
        <div class="add_new_address_box" v-if="isShowProfileBox">
              <div class="edit_user_profile">
                <h3>编辑个人信息</h3>
                <p>
                  <input
                    type="text"
                    autofocus
                    ref="user_name"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    ref="user_mobile"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    ref="user_company"
                  />
                </p>
                <el-button class="add_address_btn" @click="editProfile"
                  >确定</el-button
                >
                <span class="close_add_new_address_box" @click="swapProfileBox"
                  >x</span
                >
              </div>
            </div>
        <el-row class="middle_area">
          <div>
            <el-button class="logout-button" @click="logout()" type="danger"
              >退出</el-button
            >
          </div>
        </el-row>
        <div v-loading="this.$store.state.isLoading">
          <div>待付款</div>
          <div class="orders-table">
            <table>
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>订单详情</th>
                  <th>订单金额</th>
                  <th>订单状态</th>
                </tr>
              </thead>
              <tbody v-if="getOrderLength">
                <tr
                  class="orders"
                  v-for="(order, index) in user_orders"
                  :key="index"
                >
                  <td>
                    <p>{{ order.order_sn }}</p>
                  </td>
                  <td>
                    <div
                      class="order_items"
                      v-for="(item, idx) in order.goods"
                      :key="idx"
                    >
                      <div class="order_items_content">
                        <p>
                          <router-link
                            class="product-button"
                            :to="item.goods.get_absolute_url"
                            >{{ item.goods.name }}</router-link
                          >
                        </p>
                        <p>{{ item.goods.price }}</p>
                        <p>{{ item.goods_nums }}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p>{{ order.total_price }}</p>
                  </td>
                  <td>
                    <p>{{ getOrderStatus(order.order_status) }}</p>
                  </td>
                </tr>
              </tbody>
              <p class="no-orders" v-else>
                没有订单
              </p>
            </table>

            <el-pagination
              :page-size="5"
              layout="total, prev, pager, next, jumper"
              :total="user_orders.length"
            >
            </el-pagination>
          </div>

          <div>待发货</div>
          <div>待收货</div>
          <div>已完成</div>
        </div>
        <div>
          <div>收货地址</div>
          <div>
            <div
              class="address_grid"
              v-for="(address, index) in user_address"
              :key="index"
            >
              <p>收货人：{{ address.signer_name }}</p>
              <p>电话：{{ address.signer_mobile }}</p>
              <p>
                收货地址：{{
                  address.province +
                    "省" +
                    address.city +
                    "市" +
                    address.district +
                    "区" +
                    address.address
                }}
              </p>
              <div class="address_options">
                <span @click="showAddressEditBox(index)">编辑</span>
                <span @click="delAddress(index, address)">删除</span>
              </div>
            </div>
            <div
              class="address_grid plus"
              v-show="user_address.length < 8"
              @click="openAddressBox"
            >
              +
            </div>
            <div class="add_new_address_box" v-if="isShowAddAddressBox">
              <div class="add_new_address">
                <h3>新增收货地址</h3>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货人"
                    autofocus
                    ref="signer_name"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货联系电话"
                    ref="signer_mobile"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货地址"
                    ref="new_address"
                  />
                </p>
                <el-button class="add_address_btn" @click="addNewAddress"
                  >确定</el-button
                >
                <span class="close_add_new_address_box" @click="closeAddressBox"
                  >x</span
                >
              </div>
            </div>
            <div class="add_new_address_box" v-if="isShowEditAddressBox">
              <div class="add_new_address">
                <h3>编辑收货地址</h3>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货人"
                    autofocus
                    ref="edit_signer_name"
                    :value="user_address[updateAddressIndex].signer_name"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货联系电话"
                    ref="edit_signer_mobile"
                    :value="user_address[updateAddressIndex].signer_mobile"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货地址"
                    ref="edit_address"
                    :value="user_address[updateAddressIndex].address"
                  />
                </p>
                <el-checkbox v-model="default_address"
                  >设为默认地址</el-checkbox
                >
                <!-- 设为默认地址未完成 -->
                <el-button class="add_address_btn" @click="editAddress()"
                  >确定</el-button
                >
                <span class="close_add_new_address_box" @click="closeAddressBox"
                  >x</span
                >
              </div>
            </div>
          </div>
        </div>
        <el-row class="lower_area">
          <div class="category_container"></div>
        </el-row>
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

import { ElMessage } from "element-plus";

import axios from "axios";
import cookie from "@/static/cookie";

export default {
  name: "UserProfile",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      user_profile: [],
      user_address: [],
      user_orders: [],
      isShowProfileBox: false,
      isShowAddAddressBox: false,
      isShowEditAddressBox: false,
      updateAddressIndex: 0,
      default_address: false,
    };
  },
  mounted() {
    this.getUserAddress();
    this.getOrders();
  },
  beforeCreate() {
    var refresh_token = {
      refresh: localStorage.getItem("refresh"),
    };

    if (refresh_token.refresh !== null) {
      axios.post("/login/refresh/", refresh_token).then((res) => {
        cookie.delCookie("token");
        cookie.setCookie("token", res.data.access, 7);

        this.$store.commit("setToken");
      });
    }
  },
  created() {
    this.getUserProfile();
  },
  methods: {
    logout() {
      axios.defaults.headers.common["Authorization"] = "";

      this.$store.commit("removeToken");
      this.$router.push("/");

      ElMessage({
        showClose: true,
        message: "成功退出登陆",
        type: "success",
        duration: 1000,
      });
    },
    getUserProfile() {
      this.$store.commit("setIsLoading", true);
      // var token = localStorage.getItem('token').slice(1, -1)

      var token = cookie.getCookie("token");
      console.log(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .get("/users/1")
        .then((res) => {
          this.user_profile = res.data;
          console.log("res data: ", res.data);
        })
        .catch((err) => {
          console.log(err.messages[0].message);
        });

      this.$store.commit("setIsLoading", false);
    },
    swapProfileBox() {
      this.isShowProfileBox = !this.isShowProfileBox
    },
    editProfile() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      const new_profile = {
        address: this.$refs.new_address.value,
        signer_name: this.$refs.signer_name.value,
        signer_mobile: this.$refs.signer_mobile.value,
      };

      axios
        .post("/user_address/", new_profile)
        .then((res) => {
          console.log("address length: ", this.user_address, res);
          this.getUserAddress();
          this.isShowAddAddressBox = false;
        })
        .catch((err) => {
          console.log(err);
        });

      this.$store.commit("setIsLoading", false);
    },
    getUserAddress() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .get("/user_address/")
        .then((res) => {
          this.user_address = res.data;
          console.log("res data: ", res.data);
        })
        .catch((err) => {
          console.log(err.messages[0].message);
        });

      this.$store.commit("setIsLoading", false);
    },
    openAddressBox() {
      this.isShowAddAddressBox = true;
    },
    addNewAddress() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      const new_address = {
        address: this.$refs.new_address.value,
        signer_name: this.$refs.signer_name.value,
        signer_mobile: this.$refs.signer_mobile.value,
      };

      axios
        .post("/user_address/", new_address)
        .then((res) => {
          console.log("address length: ", this.user_address, res);
          this.getUserAddress();
          this.isShowAddAddressBox = false;
        })
        .catch((err) => {
          console.log(err);
        });

      this.$store.commit("setIsLoading", false);
    },
    closeAddressBox() {
      this.isShowAddAddressBox = false;
      this.isShowEditAddressBox = false;
    },
    delAddress(index, address) {
      var double_check = confirm("确定要删除该地址吗");

      if (double_check) {
        axios
          .delete("/user_address/" + address.id + "/")
          .then((res) => {
            this.user_address.splice(index, 1);
            console.log(res);
          })
          .catch((err) => {
            console.log(err.messages[0].message);
          });
      }
    },
    showAddressEditBox(index) {
      this.isShowEditAddressBox = true;
      this.updateAddressIndex = index;
    },
    editAddress() {
      this.$store.commit("setIsLoading", true);

      const update_address = {
        address: this.$refs.edit_address.value,
        signer_name: this.$refs.edit_signer_name.value,
        signer_mobile: this.$refs.edit_signer_mobile.value,
      };

      axios
        .patch(
          "/user_address/" +
            this.user_address[this.updateAddressIndex].id +
            "/",
          update_address
        )
        .then((res) => {
          console.log(res);
          this.getUserAddress();
        })
        .catch((err) => {
          console.log(err);
        });

      this.isShowEditAddressBox = false;

      this.$store.commit("setIsLoading", false);
    },
    getOrders() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .get("/user_orders/")
        .then((res) => {
          // this.user_orders = res.data;
          console.log("orders data: ", res.data);
          console.log(res.data);
          res.data.forEach((order) => {
            this.getOrderItems(order.id);
          });
        })
        .catch((err) => {
          console.log(err);
        });

      this.$store.commit("setIsLoading", false);
    },
    getOrderItems(order_id) {
      this.$store.commit("setIsLoading", true);

      // var token = cookie.getCookie("token");
      // axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .get("/user_orders/" + order_id + "/")
        .then((res) => {
          console.log("order items data: ", res.data);
          this.user_orders.push(res.data);
        })
        .catch((err) => {
          console.log(err.messages[0].message);
        });

      this.$store.commit("setIsLoading", false);
    },
    getOrderStatus(status) {
      if (status === "WAIT_VERIFY" || status === "1") {
        return "等待审核";
      } else if (status === "WAIT_PAY" || status === "2") {
        return "等待支付";
      } else if (status === "WAIT_SHIP" || status === "3") {
        return "等待发货";
      } else if (status === "SHOPPING" || status === "4") {
        return "等待收货";
      } else if (status === "ORDER_COMPLETED" || status === "5") {
        return "订单完成";
      } else if (status === "ORDER_PENDING" || status === "6") {
        return "订单暂停";
      } else if (status === "ORDER_CANCEL" || status === "7") {
        return "订单取消";
      }
    },
  },
  computed: {
    userprofileLength() {
      if (this.user_profile.length === 0) {
        return 0;
      } else {
        return this.user_profile;
      }
    },
    getOrderLength() {
      return this.user_orders.length;
    },
  },
};
</script>

<style>
.address_grid {
  float: left;
  width: 250px;
  height: 150px;
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  overflow: hidden;
  position: relative;
  text-align: left;
}

.address_grid p {
  margin: 5px;
}

.address_grid .address_options {
  width: 250px;
  height: 20px;
  padding: 5px;
  font-size: 12px;
  position: absolute;
  top: 130px;
  background-color: #fff;
}

.address_grid .address_options span {
  cursor: pointer;
  display: block;
  float: right;
  color: #aaa;
  padding: 2px;
  margin: 0 5px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8%;
}

.plus {
  font-size: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add_new_address_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
}

.add_new_address {
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

.add_new_address input {
  width: 400px;
  height: 30px;
}

.add_new_address .close_add_new_address_box {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
  display: center;
  align-items: center;
  justify-content: 50%;
  border-radius: 50%;
  background-color: #ccc;
}

/* .orders {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
} */

.order_items_content {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.orders-table table {
  table-layout: fixed;
  width: 100%;
}

.orders-table thead {
  background-color: #67a1ff;
}
.orders-table th {
  color: #fff;
  line-height: 17px;
  font-weight: normal;
}

.orders-table tbody {
  background-color: #eaf2ff;
}
.orders-table td {
  color: #677998;
  line-height: 12px;
}

.orders-table th,
td {
  width: 60px;
  padding: 12px 2px;
  font-size: 12px;
  text-align: center;
}

.orders-table .no-orders {
  width: 400%;
}
</style>
