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
          <div class="head-bar-title-container">
            <div class="head-bar-title">
              <span>用户登录/注册</span>
            </div>
          </div>
        </div>
        <div class="head-bar-container-right">
          <div class="head-bar-container-others">
            <div class="head-bar-contact-us-container">
              <span class="head-bar-contact-us" id="head-bar-contact-us">联系我们：12345678901</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginHeader'
}
</script>

<style>
	/* 快捷导航栏 */
  #head-bar {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 75px;
    background-color: #5CB2FF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
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
    /* padding: 0 24px; */
    margin: 0 auto;
	height: 75px;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
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
    font-size: 40px;
    font-weight: bold;
    padding-top: 10px;
  }

  #head-bar .head-bar-container .head-bar-container-middle {
    -webkit-box-flex: 1;
    width: 100%;
    padding: 0 16px;
  }

  #head-bar .head-bar-title-container {
    width: 100%;
    max-width: 720px;
    height: 50px;
    line-height: 32px;
    margin-top: 13px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  #head-bar .head-bar-title-container .head-bar-title {
    width: 100%;
    height: 50px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 0;
    display: flex;
    justify-content: center;
  }

  #head-bar .head-bar-title-container .head-bar-title span {
      font-size: 36px;
      color: white;
      font-weight: bold;
      position: absolute;
      bottom: 2px;
  }

  #head-bar .head-bar-container .head-bar-container-right {
    -webkit-box-flex: 0;
    flex: none;
    margin-right: 100px;
  }

  #head-bar .head-bar-container-others {
    height: 100%;
    margin-top: 20px;
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
    font-size: 22px;
    padding-top: 10px;
  }

  /* #head-bar .head-bar-container-others .head-bar-login-container {
    height: 100%;
    display: inline;
    margin-right: 100px;
  }

  #head-bar .head-bar-container-others .head-bar-login {
    text-decoration: none;
    display: inline;
    height: 100%;
    color: white;
    padding: 0 10px;
    font-size: 26px;
    font-weight: bold;
    padding-top: 10px;
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
    font-size: 26px;
    font-weight: bold;
    padding-top: 10px; */
  /* } */

</style>