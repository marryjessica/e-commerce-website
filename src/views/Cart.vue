<template>
  <div class="cart-page">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <table class="cart-table" v-if="cartTotalLength">
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
            <div>
              <el-row v-for="item in cart.items" :key="item.product.id">
                <tr>
                  <td>
                    <router-link :to="item.product.get_absolute_url">
                      <figure class="image">
                        <img :src="item.product.get_thumbnail" alt="缩略图" />
                      </figure>
                      {{ item.product.name }}
                    </router-link>
                  </td>
                  <td>{{ item.product.price }}</td>
                  <td>
                    {{ item.quantity }}
                    <a @click="decrementQuantity(item)">-</a>
                    <a @click="incrementQuantity(item)">+</a>
                  </td>
                  <td>{{ getItemTotal(item).toFixed(2) }}</td>
                  <td>
                    <el-button @click="removeItemFromCart(item)"
                      >删除</el-button
                    >
                  </td>
                </tr>
              </el-row>
            </div>
          </tbody>
        </table>
        <p v-else>没有商品</p>
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
  mounted() {
    this.cart = this.$store.state.cart;
  },
  methods: {
    getItemTotal(item) {
      return item.product.price * item.quantity;
    },
    incrementQuantity(item) {
      item.quantity += 1;

      this.updateCart();
    },
    decrementQuantity(item) {
      if (item.quantity === 1) {
        console.log("注意，最少买一个");
      } else {
        item.quantity -= 1;

        this.updateCart();
      }
    },
    removeItemFromCart(item) {
      this.cart.items = this.cart.items.filter(
        (i) => i.product.id !== item.product.id
      );

      this.updateCart();
    },
    updateCart() {
      localStorage.setItem("cart", JSON.stringify(this.$store.state.cart));
    },
  },
  computed: {
    cartTotalLength() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += parseInt(curVal.quantity));
      }, 0);
    },
    cartTotalPrice() {
      return this.cart.items.reduce((accumulator, current) => {
        return (accumulator += parseInt(current.product.price) * parseInt(current.quantity));
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
