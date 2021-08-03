<template id="core">
  <div class="cart-page">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <div class="cart-table-area" v-loading="this.$store.state.isLoading">
          <el-table
            class="cart_items_table"
            v-if="cartTotalLength"
            ref="cart_items_table_ref"
            :data="cart.items"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @select="selectRow"
          >
            <el-table-column
              type="selection"
              :min-width="5"
              :selectable="selectable"
            />
            <el-table-column
              class="item_info"
              prop="good_thumbnail"
              label="商品名称"
              :min-width="35"
            >
              <template #default="scope">
                <img :src="scope.row.good_thumbnail" alt="缩略图" />
                {{ scope.row.good_name }}
                <el-tag v-if="scope.row.good_stock_nums<1" color="yellow" style="font-size:16px;color:dimgrey;">售罄</el-tag>
                
              </template>
            </el-table-column>
            <el-table-column
              prop="good_price"
              label="单价"
              sortable
              :min-width="15"
            />
            <el-table-column prop="nums" label="数量" :min-width="20">
              <template #default="scope">
                <el-button @click="decrementQuantity(scope.row)">-</el-button>
                <input
                  class="item_nums_input"
                  type="text"
                  v-model.lazy="scope.row.nums"
                  @blur="inputQuantity(scope.row)"
                />
                <el-button @click="incrementQuantity(scope.row)">+</el-button>
              </template>
            </el-table-column>
            <el-table-column label="金额" sortable :min-width="15">
              <template #default="scope">
                {{ getItemTotal(scope.row).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" :min-width="10">
              <template #default="scope">
                <el-button @click="removeItemFromCart(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <p v-else>没有商品</p>
        </div>

        <div class="cart-summary">
          <div>全部商品 {{ cart.items.length }} 件</div>
          <div>选择了 {{ cartSelectedLength }} 件商品</div>
          <div>总价：¥{{ cartTotalPrice }} 元</div>
          <el-button @click="toCheckOut">去结算</el-button>
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
  name: "Cart",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      cart: {
        items: [],
      },
      selected_items: [],
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
      this.$router.push("/login?to=/shopping-cart");
    }
  },
  mounted() {
    // this.cart = this.$store.state.cart;
    this.getCartItem();
  },
  methods: {
    async getCartItem() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      console.log("tokens: ", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      await axios
        .get("/shopcarts/")
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            var temp_item = {
              id: res.data[i].id,
              good_id: res.data[i].goods.id,
              good_name: res.data[i].goods.name,
              good_price: res.data[i].goods.price,
              good_stock_nums: res.data[i].goods.stock_nums,
              nums: res.data[i].nums,
              good_url: res.data[i].goods.get_absolute_url,
              good_thumbnail: res.data[i].goods.get_thumbnail,
              add_time: res.data[i].add_time,
              is_selected: res.data[i].is_selected,
            };
            this.cart.items.push(temp_item);
          }
          console.log("this.cart: ", this.cart.items);
          this.$nextTick(() => {
          for (var j = 0; j < this.cart.items.length; j++) {
            if (this.cart.items[j].is_selected == true && this.cart.items[j].good_stock_nums > 0) {
              this.$refs.cart_items_table_ref.toggleRowSelection(this.cart.items[j], true);
            }
          }})
        })
        .catch((err) => {
          console.log(err);
          var err_msg = err;
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
      return item.good_price * item.nums;
    },
    incrementQuantity(item) {
      if (item.nums >= item.good_stock_nums) {
        ElMessage({
            showClose: true,
            message: "没有那么多哦",
            type: "error",
            duration: 1500,
          });
      } else {
        this.$store.commit("setIsLoading", true);

      const product_update = {
        nums: item.nums + 1,
      };

      axios
        .patch("shopcarts/" + item.good_id + "/", product_update)
        .then(() => {
          item.nums += 1;
        })
        .catch((err) => {
          console.log(err.response.data.messages);
          var err_msg = err.response.data.messages[0].message;
          ElMessage({
            showClose: true,
            message: err_msg,
            type: "error",
            duration: 1500,
          });
        });

      this.$store.commit("setIsLoading", false);
      }
    },
    decrementQuantity(item) {
      this.$store.commit("setIsLoading", true);

      if (item.nums === 1) {
        console.log("注意，最少买一个");
      } else {
        const product_update = {
          nums: item.nums - 1,
        };
        axios
          .patch("shopcarts/" + item.good_id + "/", product_update)
          .then(() => {
            item.nums -= 1;
          })
          .catch((err) => {
            console.log(err.response.data.messages);
            var err_msg = err.response.data.messages[0].message;
            ElMessage({
              showClose: true,
              message: err_msg,
              type: "error",
              duration: 1500,
            });
          });
      }

      this.$store.commit("setIsLoading", false);
    },
    inputQuantity(item) {
      console.log(item)
      if (item.nums > item.good_stock_nums) {
        ElMessage({
            showClose: true,
            message: "没有那么多哦",
            type: "error",
            duration: 1500,
          });
          item.nums = item.good_stock_nums;
      } else if (item.nums < 1) {
        ElMessage({
            showClose: true,
            message: "太少了哦",
            type: "error",
            duration: 1500,
          });
          item.nums = 1;
      } else {
      this.$store.commit("setIsLoading", true);

        const product_update = {
          nums: item.nums,
        };
        axios
          .patch("shopcarts/" + item.good_id + "/", product_update)
          .catch((err) => {
            console.log(err.response.data.messages);
            var err_msg = err.response.data.messages[0].message;
            ElMessage({
              showClose: true,
              message: err_msg,
              type: "error",
              duration: 1500,
            });
          });
      }
  
      this.$store.commit("setIsLoading", false);
    },
    removeItemFromCart(index, item) {
      this.$store.commit("setIsLoading", true);

      axios
        .delete("shopcarts/" + item.good_id + "/")
        .then(() => {
          // console.log(res);
          this.cart.items.splice(index, 1);
          console.log("store.state: ", this.$store.state.cart.items);
        })
        .catch((err) => {
          console.log(err.response.data.messages);
          var err_msg = err.response.data.messages[0].message;
          ElMessage({
            showClose: true,
            message: err_msg,
            type: "error",
            duration: 1500,
          });
        });

      this.$store.commit("setIsLoading", false);

      // this.updateCart();
    },
    handleSelectionChange(selected) {
      this.selected_items = selected
      console.log(this.selected_items)
    },
    selectRow(selection, row) {
      console.log("selection: ", selection)
      console.log("row: ", row.id)

      this.$store.commit("setIsLoading", true);

      axios
        .patch("/shopcartselected/" + row.id + "/")
        .then((res) => {
          console.log("res selected: ", res.data);
        })
        .catch((err) => {
          console.log(err);
          var err_msg = err;
          ElMessage({
            showClose: true,
            message: err_msg,
            type: "error",
            duration: 1500,
          });
        });

      this.$store.commit("setIsLoading", false);
    },
    selectable(row){
      return row.good_stock_nums > 0
    },
    toCheckOut() {
      if (this.selected_items.length > 0) {
        console.log(this.selected_items.length)
        this.$router.push("/check-out/");
      }
      else {
        ElMessage({
            showClose: true,
            message: "最少选择一个商品哦",
            type: "error",
            duration: 1500,
          });
      }
    },
  },
  computed: {
    cartTotalLength() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += parseInt(curVal.nums));
      }, 0);
    },
    cartSelectedLength() {
      if (this.selected_items.length === 0) {
        return 0
      } else {
        return this.selected_items.length
      }
    },
    cartTotalPrice() {
      return this.selected_items.reduce((accumulator, current) => {
        return (accumulator +=
          parseInt(current.good_price) * parseInt(current.nums));
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

.cart-summary {
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

.el-table__row .cell img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.item_nums_input {
  width: 40px;
  height: 30px;
  text-align: center;
}
</style>
