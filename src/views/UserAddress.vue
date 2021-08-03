<template>
  <div class="user-profile">
    <div class="user_address_container" v-loading="this.$store.state.isLoading">
      <div>
        <h2 style="text-align: left; margin-left: 20px">收货地址</h2>
      </div>
      <div>
        <div
          class="address_grid"
          v-for="(address, index) in user_address"
          :key="index"
        >
          <span class="address_default el-icon-check" v-if="address.is_default"
            >默认地址</span
          >
          <p>收货人：{{ address.signer_name }}</p>
          <p>电话：{{ address.signer_mobile }}</p>
          <p>
            收货地址：{{
              address.province +
                "/" +
                address.city +
                "/" +
                address.district +
                "/" +
                address.address
            }}
          </p>
          <div class="address_options">
            <span @click="showAddressEditBox(index)">编辑</span>
            <span @click="delAddress(index, address)">删除</span>
          </div>
        </div>
        <div
          class="address_grid plus"
          v-show="user_address.length < 8"
          @click="openAddressBox"
        >
          <span>+</span>
        </div>
        <div class="pop_up_box" v-if="isShowAddAddressBox">
          <div class="address_pop_up_content">
            <h3>新增收货地址</h3>
            <p><label>收货人：</label>
              <input
                type="text"
                placeholder="请输入收货人"
                autofocus
                ref="signer_name"
              />
            </p>
            <p><label>联系电话：</label>
              <input
                type="text"
                placeholder="请输入收货联系电话"
                ref="signer_mobile"
              />
            </p><label>收货地区：</label>
            <el-cascader
              class="address_picker"
              v-model="selected_p_c_d"
              :options="p_city_d"
            ></el-cascader>
            <p><label>详细地址：</label>
              <input
                type="text"
                placeholder="请输入收货地址"
                ref="new_address"
              />
            </p>
            <el-button class="add_address_btn" @click="addNewAddress"
              >确定</el-button
            >
            <button class="close_add_new_address_box" @click="closeAddressBox">
              ×
            </button>
          </div>
        </div>
        <div class="pop_up_box" v-if="isShowEditAddressBox">
          <div class="address_pop_up_content">
            <h3>编辑收货地址</h3>
            <p><label>收货人：</label>
              <input
                type="text"
                placeholder="请输入收货人"
                autofocus
                ref="edit_signer_name"
                :value="user_address[updateAddressIndex].signer_name"
              />
            </p>
            <p><label>联系电话：</label>
              <input
                type="text"
                placeholder="请输入收货联系电话"
                ref="edit_signer_mobile"
                :value="user_address[updateAddressIndex].signer_mobile"
              />
            </p><label>收货地区：</label>
            <el-cascader
              class="address_picker"
              v-model="selected_p_c_d"
              :options="p_city_d"
              @change="handleChange"
            ></el-cascader>
            <p><label>详细地址：</label>
              <input
                class="address_input"
                type="text"
                placeholder="请输入收货地址"
                ref="edit_address"
                :value="user_address[updateAddressIndex].address"
              />
            </p>

            <div class="address_control">
              <el-checkbox
                v-model="user_address[updateAddressIndex].is_default"
                ref="edit_default"
                >设为默认地址</el-checkbox
              >
              <el-button class="add_address_btn" @click="editAddress()"
                >确定</el-button
              >
            </div>

            <button class="close_add_new_address_box" @click="closeAddressBox">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { ElMessage } from "element-plus";

import axios from "axios";
import cookie from "@/static/cookie";
import province_city_district from "@/static/province_city_district.json";

export default {
  name: "UserAddress",
  data() {
    return {
      user_address: [],
      isShowProfileBox: false,
      isShowAddAddressBox: false,
      isShowEditAddressBox: false,
      updateAddressIndex: 0,
      default_address: false,
      p_city_d: province_city_district,
      selected_p_c_d: [],
    };
  },
  mounted() {
    this.getUserAddress();
    console.log(province_city_district[10]);
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
    handleChange(value) {
      console.log(this.selected_p_c_d, value);
    },
    getUserAddress() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      axios
        .get("/user_address/")
        .then((res) => {
          this.user_address = res.data;
          console.log("res data: ", res.data);
        })
        .catch((err) => {
          console.log(err.messages[0].message);
        });

      this.$store.commit("setIsLoading", false);
    },
    openAddressBox() {
      this.isShowAddAddressBox = true;
      this.default_address = this.user_address[
        this.updateAddressIndex
      ].is_default;
      console.log(this.default_address);
    },
    addNewAddress() {
      this.$store.commit("setIsLoading", true);

      var token = cookie.getCookie("token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      const new_address = {
        address: this.$refs.new_address.value,
        signer_name: this.$refs.signer_name.value,
        signer_mobile: this.$refs.signer_mobile.value,
        province: this.selected_p_c_d[0],
        city: this.selected_p_c_d[1],
        district: this.selected_p_c_d[2],
      };

      axios
        .post("/user_address/", new_address)
        .then((res) => {
          console.log("address length: ", this.user_address, res);
          this.getUserAddress();
          this.isShowAddAddressBox = false;
        })
        .catch((err) => {
          console.log(err);
        });

      this.$store.commit("setIsLoading", false);
    },
    closeAddressBox() {
      this.isShowAddAddressBox = false;
      this.isShowEditAddressBox = false;
      this.user_address[
        this.updateAddressIndex
      ].is_default = this.default_address;
      console.log(this.user_address[this.updateAddressIndex].is_default);
    },
    delAddress(index, address) {
      var double_check = confirm("确定要删除该地址吗");

      if (double_check) {
        axios
          .delete("/user_address/" + address.id + "/")
          .then((res) => {
            this.user_address.splice(index, 1);
            console.log(res);
          })
          .catch((err) => {
            console.log(err.messages[0].message);
          });
      }
    },
    showAddressEditBox(index) {
      this.isShowEditAddressBox = true;
      this.updateAddressIndex = index;
      this.default_address = this.user_address[
        this.updateAddressIndex
      ].is_default;
      console.log(this.default_address);
      this.selected_p_c_d = [this.user_address[this.updateAddressIndex].province, this.user_address[this.updateAddressIndex].city, this.user_address[this.updateAddressIndex].district]
    },
    editAddress() {
      this.$store.commit("setIsLoading", true);

      const update_address = {
        address: this.$refs.edit_address.value,
        signer_name: this.$refs.edit_signer_name.value,
        signer_mobile: this.$refs.edit_signer_mobile.value,
        is_default: this.user_address[this.updateAddressIndex].is_default,
        province: this.selected_p_c_d[0],
        city: this.selected_p_c_d[1],
        district: this.selected_p_c_d[2],
      };
      console.log(
        "defalut: ",
        this.user_address[this.updateAddressIndex].is_default
      );
      console.log("sldjjsdklfsdjflks: ", this.$refs.edit_default.checked);
    
    if (this.user_address[this.updateAddressIndex].is_default === true) {
      for (var i = 0; i < this.user_address.length; i++) {
        if (
          this.user_address[i].is_default === true &&
          i !== this.updateAddressIndex
        ) {
          console.log(
            "----------:",
            this.user_address[i].is_default,
            i,
            this.updateAddressIndex
          );
          axios
            .patch("/user_address/" + this.user_address[i].id + "/", {
              is_default: false,
            })
            .then((res) => {
              console.log(res);
              this.getUserAddress();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }

      axios
        .patch(
          "/user_address/" +
            this.user_address[this.updateAddressIndex].id +
            "/",
          update_address
        )
        .then((res) => {
          console.log(res);
          this.getUserAddress();
        })
        .catch((err) => {
          console.log(err);
        });

      this.isShowEditAddressBox = false;

      this.$store.commit("setIsLoading", false);
    },
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
.address_grid {
  float: left;
  width: 250px;
  height: 150px;
  border: 1px solid #545c64;
  margin: 10px 10px 10px 20px;
  padding: 10px;
  overflow: hidden;
  position: relative;
  text-align: left;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  background: #fcfeff;
}

.address_grid p {
  margin: 5px;
}

.address_grid .address_default {
  font-size: 12px;
  border: none;
  padding: 2px;
  color: white;
  float: right;
  background: linear-gradient(to right, #188bf7, #1ab0f5);
}

.address_grid .address_options {
  width: 250px;
  height: 20px;
  padding: 5px;
  font-size: 12px;
  position: absolute;
  top: 130px;
  background-color: #fff;
}

.address_grid .address_options span {
  cursor: pointer;
  display: block;
  float: right;
  color: #545c64cf;
  padding: 2px;
  margin: 0 5px;
  border: none;
}

.plus {
  font-size: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pop_up_box {
  background-color: rgb(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.address_pop_up_content {
  margin: 70px auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 30%;
  position: relative;
}

.address_pop_up_content input {
  width: 60%;
  height: 30px;
  text-indent: 9px;
}

.address_pop_up_content label {
  width: 80px;
  text-align: left;
  display: inline-block;
}

.address_picker .el-input--suffix .el-input__inner {
  padding-right: 0px;
  width: 270px;
  height: 35px;
  margin: 0px 0px;
  border: 1px solid;
  text-indent: 1px;
  border-radius: 2px;
}

.address_pop_up_content .close_add_new_address_box {
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

.user_address_container {
  display: grid;
}

.address_control {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 0px 14px;
}
</style>
