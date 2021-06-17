<template>
  <div class="cart-page">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <table class="cart-table">
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
            <div v-loading='this.$store.state.isLoading'>
              <el-row v-for="(item, index) in cart.items" :key="item.goods.id">
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
                    <a @click="decrementQuantity(item)">-</a>
                    <a @click="incrementQuantity(item)">+</a>
                  </td>
                  <td>{{ getItemTotal(item).toFixed(2) }}</td>
                  <td>
                    <el-button @click="removeItemFromCart(index, item)"
                      >删除</el-button
                    >
                  </td>
                </tr>
              </el-row>
            </div>
          </tbody>
        </table>
        <!-- <p v-else>没有商品</p> -->
        <div class="cart-summary">
          <div>全部商品 {{ cart.items.length }} 件</div>
          <div>总价：¥{{ cartTotalPrice }} 元</div>
          <el-button>去结算</el-button>
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

import axios from 'axios';
import cookie from "@/static/cookie";


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
    };
  },
  created() {

  },
  mounted() {
    // this.cart = this.$store.state.cart;
    this.getCartItem()
  },
  methods: {
    async getCartItem(){
      this.$store.commit('setIsLoading', true)

      var token = cookie.getCookie("token");
      console.log(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      await axios
      .get('/shopcarts/')
      .then((res) => {
        console.log("cart: ", res.data[0])
        // res.data.forEach((val) => {
        //   console.log("val: ", val.goods)
        //   this.cart.items.push(val.goods)
        // })
        this.cart.items = res.data
      })
      .catch((err) => {
        console.log(err)
      })
      this.$store.commit('setIsLoading', false)

    },
    getItemTotal(item) {
      return item.goods.price * item.nums;
    },
    incrementQuantity(item) {
      // item.quantity += 1;

      // this.updateCart();
      console.log('item:', item)

      this.$store.commit('setIsLoading', true)

      const product_update = {
        nums: item.nums+1
      }

      axios
      .patch('shopcarts/'+item.goods.id+'/', product_update)
      .then((res) => {
        console.log('update success: ', res)
        item.nums += 1
      })
      .catch((err) => {
        console.log(err)
      })
      // console.log('item2:', item)

      this.$store.commit('setIsLoading', false)

    },
    decrementQuantity(item) {
      // if (item.quantity === 1) {
      //   console.log("注意，最少买一个");
      // } else {
      //   item.quantity -= 1;

      //   this.updateCart();

      console.log('item:', item)

      this.$store.commit('setIsLoading', true)

      if(item.nums === 1) {
        console.log("注意，最少买一个")
      } else {
        const product_update = {
        nums: item.nums-1
      }
      axios
      .patch('shopcarts/'+item.goods.id+'/', product_update)
      .then((res) => {
        console.log('update success: ', res)
        item.nums -= 1
      })
      .catch((err) => {
        console.log(err)
      })
      }
      
      // console.log('item2:', item)

      this.$store.commit('setIsLoading', false)

    },
    removeItemFromCart(index, item) {
      // this.cart.items = this.cart.items.filter(
      //   (i) => i.product.id !== item.product.id
      // );
      console.log('store.state: ', this.$store.state.cart.items)
      this.$store.commit('setIsLoading', true)
      
      axios
      .delete('shopcarts/'+item.goods.id+'/')
      .then((res) => {
        console.log(res)
        this.cart.items.splice(index, 1)
        console.log('store.state: ', this.$store.state.cart.items)
      })
      .catch((err) => {
        console.log(err)
      })

      this.$store.commit('setIsLoading', false)

      // this.updateCart();
    },
    // updateCart() {
    //   localStorage.setItem("cart", JSON.stringify(this.$store.state.cart));
    // },
  },
  computed: {
    cartTotalLength() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += parseInt(curVal.nums));
      }, 0);
    },
    cartTotalPrice() {
      return this.cart.items.reduce((accumulator, current) => {
        return (accumulator += parseInt(current.goods.price) * parseInt(current.nums));
      }, 0);
    },
  },
};
</script>

<style>
.cart-summary {
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>
