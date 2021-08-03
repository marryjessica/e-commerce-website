<template>
  <div class="user-profile">
    <el-row class="profile_row">
      <div v-loading="this.$store.state.isLoading">
        <el-card class="profile_card">
          <el-row class="profile_card_row">
            <el-col class="profile_left_col">
              <img
                src="@/static/user_icon.png"
                class="profile_img"
                alt="User-Profile-Image"
              />
              <span class="profile_left_name">{{ user_profile.name }}</span>
              <div class="profile_left_company">
                <span style="white-space:nowrap">公司：</span>
                <span style="width:70%">{{ user_profile.company }}</span>
              </div>
            </el-col>
            <el-col class="profile_right_col">
              <h4 class="profile_right_row_name">个人信息</h4>
              <el-row class="profile_right_top_row">
                <el-col class="profile_right_top_left_col">
                  <p>手机：</p>
                  <h6>{{ user_profile.mobile }}</h6>
                </el-col>
                <el-col class="profile_right_top_left_col">
                  <p>邮箱：</p>
                  <h6>{{ user_profile.email }}</h6>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="profile_right_bottom_left_col">
                  <p>用户名：</p>
                  <span>{{ user_profile.username }}</span>
                </el-col>
                <el-col class="profile_right_bottom_right_col">
                  <el-button size="small" @click="swapProfileBox"
                    >编辑个人信息</el-button
                  >
                  <el-button
                    class="logout-button"
                    size="small"
                    @click="logout()"
                    type="danger"
                    >退出登录</el-button
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-row>
    <div class="pop_up_box" v-if="isShowProfileBox">
      <div class="pop_up_content">
        <h3>编辑个人信息</h3>
        <p>
          <label>用户名：</label>
          <input
            type="text"
            autofocus
            ref="user_name"
            :value="user_profile.name"
          />
        </p>
        <div class="profile_picker">
          <label>性别：</label>
          <select
            class="gender_selecter"
            v-model="user_profile.gender"
            placeholder="请选择"
          >
            <option label="男" value="male"></option>
            <option label="女" value="female"></option>
          </select>
          生日：
          <el-date-picker
            v-model="user_profile.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
        <p>
          <label>邮箱：</label>
          <input type="text" ref="user_email" :value="user_profile.email" />
        </p>
        <p>
          <label>电话：</label>
          <input type="text" ref="user_mobile" :value="user_profile.mobile" />
        </p>
        <p>
          <label>公司：</label>
          <input type="text" ref="user_company" :value="user_profile.company"/>
        </p>
        <el-button class="add_address_btn" @click="editProfile">确定</el-button>
        <button class="close_add_new_address_box" @click="swapProfileBox">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";

import axios from "axios";
import cookie from "@/static/cookie";

export default {
  name: "UserProfile",
  data() {
    return {
      user_profile: [],
      isShowProfileBox: false,
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
      this.isShowProfileBox = !this.isShowProfileBox;
    },
    editProfile() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      const new_profile = {
        name: this.$refs.user_name.value,
        gender: this.user_profile.gender,
        // birthday: this.$refs.user_birthday,
        email: this.$refs.user_email.value,
        mobile: this.$refs.user_mobile.value,
        company: this.$refs.user_company.value,
      };

      axios
        .patch("users/1/", new_profile)
        .then((res) => {
          console.log(res);
          this.getUserProfile();
        })
        .catch((err) => {
          console.log(err);
        });
      this.swapProfileBox();

      this.$store.commit("setIsLoading", false);
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
  },
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
.el-col-24 {
  flex: auto;
}

.profile_row {
  margin: 20px;
}

.profile_card .el-card__body {
  padding: 0px;
}

.profile_left_col {
  background: linear-gradient(to right, #1ab0f5, #188bf7);
  height: 300px;
  width: 250px;
  justify-content: center;
  display: flex;
  flex-direction: column;
}

.profile_left_col .profile_img {
  width: 40%;
  position: relative;
  right: -30%;
}

.profile_left_col .profile_left_name {
  font-size: 16px;
  font-weight: bold;
  margin: 10px;
}

.profile_left_col .profile_left_company {
  display: flex;
  justify-content: flex-start;
  padding-left: 15px;
  font-size: 14px;
  font-weight: bold;
  margin: 10px;
}

.profile_right_col {
  width: 450px;
}

.profile_right_col .profile_right_row_name {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
  margin: 20px 20px 10px 20px;
}

.profile_right_col h6 {
  color: #919aa3;
  font-size: 14px;
  margin: 30px 10px;
}

.profile_right_col .profile_right_bottom_left_col p {
  margin-top: 10px;
}

.profile_right_col .profile_right_bottom_left_col span {
  color: #919aa3;
  font-size: 16px;
  margin: 30px 10px;
  font-weight: bold;
}

.profile_right_col button.el-button.el-button--default.el-button--small {
  width: 100px;
}

.profile_right_col
  button.el-button.el-button--danger.el-button--small.logout-button {
  margin-top: 20px;
  width: 100px;
  margin-left: 0px;
}

.el-col.el-col-24.profile_right_bottom_right_col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pop_up_box {
  background-color: rgb(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.pop_up_content {
  margin: 70px auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 30%;
  position: relative;
}

.pop_up_content input {
  width: 58.5%;
  height: 30px;
  padding-left: 10px;
  text-indent: 5px;
}

.pop_up_content label {
  width: 70px;
  text-align: left;
  display: inline-block;
}

.pop_up_content input {
  border: 0.5px solid lightgrey;
  border-radius: 5px;
}

.pop_up_content .gender_selecter {
  height: 30px;
  width: 50px;
  margin-right: 20px;
  border: 0.5px solid lightgrey;
  border-radius: 5px;
  padding-left: 8px;
}

.pop_up_content .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 140px;
}

.pop_up_content .el-input--suffix .el-input__inner {
  padding-right: 0px;
  width: 130px;
}

.pop_up_content .close_add_new_address_box {
  position: absolute;
  top: 20px;
  right: 30px;
  transition: all 200ms;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
  border: none;
  background: none;
  cursor: pointer;
}
</style>
