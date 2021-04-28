<template>
  <div id="head-bar">
    <div class="head-bar-inside">
      <div class="head-bar-container">
        <div class="head-bar-container-left">
          <div class="head-bar-logo">
            <a class="logo" href="/">中新材</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>

<style>
	/* 快捷导航栏 */
	#head-bar {
    position: fixed;
    top: 0px;
    left: 0px;
		width: 100%;
		background-color: #5CB2FF;
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


</style>