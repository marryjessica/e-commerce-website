<template>
  <div id="head-bar">
      <div class="head-bar-container">
        <div class="head-bar-container-left">
            <a class="logo" href="/">中新材</a>
        </div>
        <div class="head-bar-container-middle">
            <form method="get" action="/search">
                <input
                  id="head-bar-search-input"
                  class="head-bar-search-input"
                  type="text"
                  autocomplete="off"
                  name="query"
                  placeholder="搜索"
                />
                <button
                  class="head-bar-search-button"
                  id="head-bar-search-button"
                >搜索</button>
            </form>
        </div>
        <div class="head-bar-container-right">
          
            <div class="head-bar-contact-us-container">
              <span class="head-bar-contact-us" id="head-bar-contact-us"
                ><i class="el-icon-phone-outline" />联系我们：12345678901</span
              >
            </div>
            <div
              v-if="this.$store.state.userInfo.token"
              class="head-bar-login-container"
            >
              <router-link
                class="head-bar-login"
                id="head-bar-login"
                :to="{ name: 'UserProfile' }"
                >我的账号</router-link
              >
            </div>
            <div v-else class="head-bar-login-container">
              <router-link
                class="head-bar-login"
                id="head-bar-login"
                :to="{ name: 'Login' }"
                ><i class="el-icon-user" />登陆</router-link
              >
            </div>
            <div class="head-bar-cart-container">
              <router-link class="head-bar-cart" to="/shopping-cart"
                ><i class="el-icon-shopping-cart-1" />购物车
                </router-link
              >
            </div>
        </div>
      </div>
  </div>
</template>

<script>
// import axios from 'axios';

export default {
  name: "Header",
  data() {
    return {
      cart: {
        items: [],
      },
    };
  },
  beforeCreate() {
    this.$store.commit("initializeStore");
  },
  mounted() {
    this.cart = this.$store.state.cart;
  },
  computed: {
    cartTotalLength() {
      let totalLength = 0;

      for (var i = 0; i < this.cart.items.length; i++) {
        totalLength += parseInt(this.cart.items[i].quantity);
      }

      return totalLength;
    },
  },
};
</script>

<style>
/* 快捷导航栏 */
#head-bar {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    background: linear-gradient(to right, #1ab0f5, #188bf7);
    box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    height: 60px;
}

.head-bar-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: 100%;
    align-items: flex-end;
}

.head-bar-container-left {
  width: 20%;
}

.logo {
  text-decoration: none;
    color: white;
    font-size: 38px;
    font-weight: bold;
}

.head-bar-container-middle {
  width: 20%;
  white-space: nowrap;
}

.head-bar-search-input {
      height: 35px;
    border: none;
    padding: 0px;
    border-radius: 4px;
    text-indent: 14px;
    margin-bottom: 8px;
    width: 90%;
}


button#head-bar-search-button {
        height: 35px;
    border: none;
    position: relative;
    left: -45px;
    top: 2px;
    padding: 10px;
    width: 45px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    cursor: pointer;
}

button#head-bar-search-button:hover {
  background: #c6e2ff;
}

i.el-icon-search {
    position: relative;
    top: -2px;
    font-size: 19px;
}

.head-bar-container-right {
      display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-end;
    width: 40%;
    margin-bottom: 10px;
}

.head-bar-contact-us-container {
    color: white;
    font-size: 16px;
    margin-bottom: 8px;
}

.head-bar-login {
      text-decoration: none;
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.head-bar-cart-container {
    margin-right: 60px;
}

.head-bar-cart {
      text-decoration: none;
    color: white;
    font-size: 18px;
    font-weight: bold;
}

</style>
