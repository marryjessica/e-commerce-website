<template>
  <div id="login-head-bar">
      <div class="login-head-bar-container">
          <div class="login-head-bar-logo">
            <a class="login-logo" href="/">中新材</a>
          </div>
            <div class="login-head-bar-title">
              <span>用户登录/注册</span>
            </div>
            <div class="login-head-bar-right">
              <span class="login-head-bar-contact-us" id="login-head-bar-contact-us"
                >联系我们：12345678901</span
              >
            </div>
              
      </div>
  </div>
</template>

<script>
export default {
  name: "loginHeader",
};
</script>

<style>
/* 快捷导航栏 */
#login-head-bar {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    background: linear-gradient(to right, #1ab0f5, #188bf7);
    box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
    height: 75px;
}

.login-head-bar-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: 100%;
    align-items: flex-end;
    position: relative;
    left: -5%;
}

.login-head-bar-logo {
  width: 20%;
}

.login-logo {
  text-decoration: none;
    color: white;
    font-size: 38px;
    font-weight: bold;
}

.login-head-bar-title {
  color: white;
    font-size: 30px;
    margin-bottom: 8px;
    font-weight: bold;
}

.login-head-bar-right {
      display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-end;
    width: 20%;
    margin-bottom: 10px;
}

.login-head-bar-contact-us {
    color: white;
    font-size: 20px;
    margin-bottom: 8px;
}
</style>
