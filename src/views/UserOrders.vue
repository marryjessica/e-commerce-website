<template>
  <div class="user-profile">
    <div class="user_order_container" v-loading="this.$store.state.isLoading">
      <div>
        <select
          class="order_status_select"
          name="selected"
          @change="handleChange($event)"
        >
          <option value="ALL">全部</option>
          <option value="WAIT_VERIFY">待审核</option>
          <option value="WAIT_PAY">待支付</option>
          <option value="WAIT_SHIP">待发货</option>
          <option value="SHOPPING">已发货</option>
          <option value="ORDER_COMPLETED">订单完成</option>
          <option value="REQUEST_CANCEL">已申请取消订单</option>
          <option value="WITHDRAW_REQUEST">已申请撤销取消</option>
          <option value="ORDER_CANCEL">订单取消</option>
        </select>
      </div>
      <div class="orders-table">
        <table>
          <thead>
            <tr>
              <th class="ordersn">订单号</th>
              <th>订单详情</th>
              <th class="orderprice">订单金额</th>
              <th class="orderstatus">订单状态</th>
            </tr>
          </thead>
          <tbody v-if="totalNumOrders">
            <tr
              class="orders"
              v-for="(order, index) in user_orders"
              :key="index"
            >
              <td>
                <h3>{{ order.order_sn }}</h3>
              </td>
              <td>
                  <div class="order_shipping_and_creation_info">
                      <div class="order_created_time">
                        <span>下单时间：</span>
                        <span>{{ getOrderTime(index) }}</span>
                      </div>
                      <div class="order_shipping_info">
                        <span>运单号：</span>
                        <span>{{ order.shipping_number }}</span>
                        <span class="shipping_company">{{ order.shipping_company }}</span>
                      </div>
                      
                  </div>
                <div
                  class="order_items"
                  v-for="(item, idx) in order.goods"
                  :key="idx"
                >
                  <div class="order_items_content">
                    <div class="product_info">
                      <router-link
                        class="product_link"
                        :to="item.goods.get_absolute_url"
                      >
                        <img :src="item.goods.get_thumbnail" alt="缩略图" />

                        <p>{{ item.goods.name }}</p></router-link
                      >
                    </div>
                    <div class="order_detail">
                      <div class="order_product_info">
                        <div class="product_price">
                          <p>单价：{{ item.goods.price }}</p>
                        </div>
                        <div class="product_unit">
                          <p>单位：SKU</p>
                        </div>
                        <div class="product_nums">
                          <p>数量：x{{ item.goods_nums }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <p>{{ order.total_price }}</p>
              </td>
              <td>
                <p>{{ getOrderStatus(order.order_status) }}</p>
                <el-button size="small"
                  class="request_button"
                  v-if="
                    order.order_status != 'REQUEST_CANCEL' &&
                      order.order_status != '6'
                        && order.order_status != 'ORDER_CANCEL'
                          && order.order_status != 'WITHDRAW_REQUEST'
                  "
                  @click="requestCancelOrder(order.id, index)"
                >
                  申请取消订单
                </el-button>
                <el-button size="small" 
                class="request_button"
                @click="withdrawRequest(order.id, index)"
                v-if="order.order_status === 'REQUEST_CANCEL' ||
                      order.order_status === '6'">
                    申请撤销
                </el-button>
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
          :total="totalNumOrders"
          :current-page="current_page"
          @next-click="loadNext"
          @prev-click="loadPrev"
          @current-change="clickPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// import { ElMessage } from "element-plus";

import axios from "axios";
import cookie from "@/static/cookie";

export default {
  name: "UserOrders",
  data() {
    return {
      user_orders: [],
      totalNumOrders: 0,
      current_page: 1,
      current_filter: "ALL",
    };
  },
  mounted() {
    this.getOrders("/user_orders/?page=", 1);
  },
  beforeCreate() {
    var refresh_token = {
      refresh: localStorage.getItem("refresh"),
    };

    this.$store.commit("isTokenExpired");
    console.log("treid again--------------------------");

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
    async getOrders(url, currentPage) {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      await axios
        .get(url + currentPage)
        .then((res) => {
          console.log("orders data: ", res.data);
          this.user_orders = res.data.results;
          this.totalNumOrders = res.data.count;
        })
        .catch((err) => {
          console.log(err);
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
      } else if (status === "REQUEST_CANCEL" || status === "6") {
        return "已申请取消订单";
      } else if (status === "ORDER_CANCEL" || status === "7") {
        return "订单取消";
      } else if (status === "WITHDRAW_REQUEST" || status === "8") {
        return "已申请撤销取消"
      }
    },
    changePage(currentPage) {
      if (this.current_filter === "ALL") {
        this.getOrders("/user_orders/?page=", currentPage);
      } else if (this.current_filter === "WAIT_VERIFY") {
        this.getOrders("/user_orders_wait_verify/?page=", currentPage);
      } else if (this.current_filter === "WAIT_PAY") {
        this.getOrders("/user_orders_wait_pay/?page=", currentPage);
      } else if (this.current_filter === "WAIT_SHIP") {
        this.getOrders("/user_orders_wait_ship/?page=", currentPage);
      } else if (this.current_filter === "SHOPPING") {
        this.getOrders("/user_orders_shipping/?page=", currentPage);
      } else if (this.current_filter === "ORDER_COMPLETED") {
        this.getOrders("/user_orders_completed/?page=", currentPage);
      } else if (this.current_filter === "REQUEST_CANCEL") {
        this.getOrders("/user_orders_request_cancel/?page=", currentPage);
      } else if (this.current_filter === "ORDER_CANCEL") {
        this.getOrders("/user_orders_cancelled/?page=", currentPage);
      } else if (this.current_filter === "WITHDRAW_REQUEST") {
        this.getOrders("/user_orders_withdraw_request/?page=", currentPage);
      }
    },
    loadNext(currentPage) {
      this.current_page = currentPage;
      this.changePage(currentPage);
    },
    loadPrev(currentPage) {
      this.current_page = currentPage;
      this.changePage(currentPage);
    },
    clickPage(currentPage) {
      this.current_page = currentPage;
      this.changePage(currentPage);
    },
    handleChange(event) {
      console.log(event.target.value);
      this.current_filter = event.target.value;
      this.current_page = 1;
      if (event.target.value === "ALL") {
        this.getOrders("/user_orders/?page=", 1);
      } else if (event.target.value === "WAIT_VERIFY") {
        this.getOrders("/user_orders_wait_verify/?page=", 1);
      } else if (event.target.value === "WAIT_PAY") {
        this.getOrders("/user_orders_wait_pay/?page=", 1);
      } else if (event.target.value === "WAIT_SHIP") {
        this.getOrders("/user_orders_wait_ship/?page=", 1);
      } else if (event.target.value === "SHOPPING") {
        this.getOrders("/user_orders_shipping/?page=", 1);
      } else if (event.target.value === "ORDER_COMPLETED") {
        this.getOrders("/user_orders_completed/?page=", 1);
      } else if (event.target.value === "REQUEST_CANCEL") {
        this.getOrders("/user_orders_request_cancel/?page=", 1);
      } else if (event.target.value === "ORDER_CANCEL") {
        this.getOrders("/user_orders_cancelled/?page=", 1);
      } else if (event.target.value === "WITHDRAW_REQUEST") {
        this.getOrders("/user_orders_withdraw_request/?page=", 1);
      }
    },
    requestCancelOrder(id, index) {
      var double_check = confirm("您确定要申请取消订单吗？");

      if (double_check) {
        var token = cookie.getCookie("token");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        axios
          .patch(`/user_orders/${id}/`, { order_status: "REQUEST_CANCEL" })
          .then((res) => {
            console.log("orders data: ", res.data);
            this.user_orders[index].order_status = "REQUEST_CANCEL";
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    withdrawRequest(id, index) {
      var double_check = confirm("您确定要申请取消订单吗？");

      if (double_check) {
        var token = cookie.getCookie("token");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        axios
          .patch(`/user_orders/${id}/`, { order_status: "WITHDRAW_REQUEST" })
          .then((res) => {
            console.log("orders data: ", res.data);
            this.user_orders[index].order_status = "WITHDRAW_REQUEST";
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getOrderTime(index) {
        return this.user_orders[index].order_time.substring(0,16).replace("T", " ")
    }
  },
  computed: {},
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
.order_status_select {
  padding: 7px 30px 7px 12px;
  width: 14%;
  border: 1px solid #e8eaed;
  border-radius: 1px;
  background: white;
  position: relative;
  right: -42.9%;
}

.orders-table thead {
  background: linear-gradient(to right, #188bf7, #1ab0f5);
}

.order_items_content {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
}

.order_shipping_and_creation_info {
        display: flex;
    flex-direction: row;
    height: 20px;
    margin: -12px 4px 0px 4px;
    border-bottom: 1.5px solid #c4c4ca;
    align-items: flex-end;
    padding-bottom: 2px;
    padding-left: 10px;
    text-align: left;
}

.order_items_content .product_info {
  width: 45%;
}

.order_items_content .order_detail {
    width: 48%;
    display: flex;
    flex-direction: column;
    text-align: left;
}

.order_detail .order_product_info {
        display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.order_detail .product_price {
  width: 30%;
  margin-right: 5px;
}

.order_detail .product_unit {
  width: 30%;
}

.order_detail .product_nums {
  width: 30%;
  margin-left: 5px;
}

.order_shipping_info {
    width: 55%;
}

.order_shipping_info .shipping_company {
    margin-left: 5px;
    border-left: 1px solid #c4c4c9;
    padding-left: 5px;
}

.order_created_time {
        width: 44%;
    border-right: 1px solid #c4c4c9;
    margin-right: 4px;
    padding-top: 2px;
}

.order_items_content .product_link {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  color: #202f48;
}

.order_items_content img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

button.el-button.el-button--default.el-button--small.request_button {
    width: 90px;
    padding: 0px;
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
  background-color: #f5f7f9;
}
.orders-table td {
  color: #202f48;
  line-height: 12px;
}

.orders-table th,
td {
  padding: 12px 2px;
  font-size: 12px;
  text-align: center;
}

.orders-table .ordersn {
  width: 20%;
}

.orders-table .orderstatus {
  width: 15%;
}

.orders-table .orderprice {
  width: 15%;
}

.orders-table .no-orders {
  width: 400%;
}
</style>
