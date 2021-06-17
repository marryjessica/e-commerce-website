<template>
  <div id="head-bar">
    <div class="head-bar-inside">
      <div class="head-bar-container" type="flex" justify="center">
        <div class="head-bar-container-left">
          <div class="head-bar-logo">
            <a class="logo" href="/">中新材</a>
          </div>
        </div>
        <div class="head-bar-container-middle">
          <div class="head-bar-search-container">
            <!-- <form method="get" action="/search">
              <div class="field has-addons">
                <div class="control">
                  <input type="text" class="input" placeholder="What are you looking for?" name="query">
                </div>

                <div class="control">
                  <button class="button">
                      搜索
                  </button>
                </div>
              </div>
            </form> -->
            <form method='get' action="/search">
            <div class="head-bar-search">
              <input
                id="head-bar-search-input"
                type="text"
                autocomplete="off"
                name='query'
                placeholder="搜索"
              />
              <button
                class="head-bar-search-button"
                id="head-bar-search-button"
                >搜索</button
              >
            </div>
            </form>
            
          </div>
        </div>
        <div class="head-bar-container-right">
          <div class="head-bar-container-others">
            <div class="head-bar-contact-us-container">
              <span class="head-bar-contact-us" id="head-bar-contact-us"
                ><i class="el-icon-phone-outline" />联系我们：12345678901</span
              >
            </div>
            <div v-if="this.$store.state.userInfo.token" class="head-bar-login-container">
                <router-link 
                class="head-bar-login"
                id="head-bar-login"
                :to="{ name: 'UserProfile' }"
                >My account</router-link>
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
                ><i class="el-icon-shopping-cart-1" />购物车<span
                  >({{ cartTotalLength }})</span
                ></router-link
              >
            </div>
          </div>
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

    // const token = this.$store.state.token
    // if (token) {
    //     axios.defaults.headers.common['Authorization'] = "Token " + token
    // } else {
    //     axios.defaults.headers.common['Authorization'] = ""
    // }
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
  background-color: #5cb2ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

#head-bar * {
  padding: 0;
  margin: 0;
  box-sizing: content-box;
}

#head-bar .head-bar-container {
  width: 100%;
  min-width: 1280px;
  box-sizing: border-box;
  padding: 0 24px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-content: center;
  align-items: stretch;
}

#head-bar .head-bar-container .head-bar-container-left {
  -webkit-box-flex: 0;
  flex: none;
}

#head-bar .head-bar-logo {
  max-width: 145px;
  padding-left: 100px;
  height: 100%;
  margin-right: 10px;
}

#head-bar .logo {
  text-decoration: none;
  display: block;
  height: 100%;
  color: white;
  padding: 0 10px;
  font-size: 38px;
  font-weight: bold;
  padding-top: 10px;
}

#head-bar .head-bar-container .head-bar-container-middle {
  -webkit-box-flex: 1;
  width: 100%;
  padding: 0 16px;
}

#head-bar .head-bar-search-container {
  width: 100%;
  max-width: 720px;
  height: 40px;
  line-height: 32px;
  margin-top: 13px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

#head-bar .head-bar-search-container .head-bar-search {
  width: 100%;
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0;
}

#head-bar .head-bar-search-container .head-bar-search input {
  font-size: 14px;
  display: inline-block;
  width: 300px;
  height: 100%;
  line-height: 1.5;
  border: 0 none;
  outline: 0;
  background: #f5f6f7;
  color: #222226;
  vertical-align: top;
  text-indent: 16px;
  border: 1px solid #e8e8ed;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px 0 0 4px;
}

/* #head-bar .head-bar-search-container .head-bar-search .head-bar-search-button {
  display: inline-block;
  width: 40px;
  height: 100%;
  outline: 0;
  border: 0 none;
  background: url(https://g.csdnimg.cn/common/csdn-toolbar/images/csdn-white-search.png)
    no-repeat center center #03a9f4;
  background-size: 70%;
  border-radius: 0 4px 4px 0;
  font-size: 0;
  cursor: pointer;
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
} */

#head-bar .head-bar-container .head-bar-container-right {
  -webkit-box-flex: 0;
  flex: none;
  margin-right: 100px;
}

#head-bar .head-bar-container-others {
  height: 100%;
  margin-top: 15px;
}

#head-bar .head-bar-container-others .head-bar-contact-us-container {
  height: 100%;
  display: inline;
  margin-right: 50px;
}

#head-bar .head-bar-container-others .head-bar-contact-us {
  text-decoration: none;
  display: inline;
  height: 100%;
  color: white;
  padding: 0 10px;
  font-size: 16px;
  padding-top: 10px;
}

.el-icon-phone-outline {
  content: "";
  position: relative;
  bottom: -1px;
}

#head-bar .head-bar-container-others .head-bar-login-container {
  height: 100%;
  display: inline;
  margin-right: 30px;
}

#head-bar .head-bar-container-others .head-bar-login {
  text-decoration: none;
  display: inline;
  height: 100%;
  color: white;
  padding: 0 10px;
  font-size: 18px;
  font-weight: bold;
  padding-top: 10px;
}

.el-icon-user:before {
  content: "";
  position: relative;
  bottom: -1px;
  font-size: 30px;
}

#head-bar .head-bar-container-others .head-bar-cart-container {
  height: 100%;
  display: inline;
}

#head-bar .head-bar-container-others .head-bar-cart {
  text-decoration: none;
  display: inline;
  height: 100%;
  color: white;
  padding: 0 10px;
  font-size: 18px;
  font-weight: bold;
  padding-top: 10px;
}

.el-icon-shopping-cart-1:before {
  content: "";
  position: relative;
  bottom: -2px;
  font-size: 30px;
}

.head-bar-cart span {
  font-size: 12px;
  font-style: italic;
  position: relative;
  top: -10px;
}
</style>
