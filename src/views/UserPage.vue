<template>
  <div class="user-profile">
    <el-container>
      <el-header>
        <div id="head">
          <Header />
        </div>
      </el-header>
      <el-main class="main-body">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:10px">
          <el-breadcrumb-item>我的账号</el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadcrumb_tag">{{
            breadcrumb_tag
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-menu
  default-active="/user-profile"
  class="el-menu-demo"
  mode="horizontal"
  router
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item index="/user-profile">个人中心</el-menu-item>
  <el-menu-item index="/user-orders">订单中心</el-menu-item>
  <el-menu-item index="/user-address">地址管理</el-menu-item>
  <el-menu-item index="/user-fav">我的收藏</el-menu-item>
</el-menu>
  <router-view/>
        <!-- <el-row>
          <div v-loading="this.$store.state.isLoading">
            <el-button @click="swapProfileBox">编辑个人信息</el-button>
            <p>你好 {{ user_profile.name }}</p>
            <p>手机号: {{ user_profile.mobile }}</p>
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
              <select class="gender_selecter" v-model="user_profile.gender" placeholder="请选择">
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
              <input
                type="text"
                ref="user_mobile"
                :value="user_profile.mobile"
              />
            </p>
            <p>
              <label>公司：</label>
              <input type="text" ref="user_company" />
            </p>
            <el-button class="add_address_btn" @click="editProfile"
              >确定</el-button
            >
            <button class="close_add_new_address_box" @click="swapProfileBox"
              >×</button
            >
          </div>
        </div>
          <div style="display: -webkit-box">
            <el-button class="logout-button" @click="logout()" type="danger"
              >退出</el-button
            >
          </div>
        <div
          class="user_order_container"
          v-loading="this.$store.state.isLoading"
        >
          <div>待付款</div>
          <div class="orders-table">
            <table>
              <thead>
                <tr>
                  <th class="ordersn">订单号</th>
                  <th>订单详情</th>
                  <th class="orderprice">订单金额</th>
                  <th class="orderstatus">订单状态</th>
                </tr>
              </thead>
              <tbody v-if="getOrderLength">
                <tr
                  class="orders"
                  v-for="(order, index) in user_orders"
                  :key="index"
                >
                  <td>
                    <p>{{ order.order_sn }}</p>
                  </td>
                  <td>
                    <div
                      class="order_items"
                      v-for="(item, idx) in order.goods"
                      :key="idx"
                    >
                      <div class="order_items_content">
                        <div class="product_info">
                          <router-link
                            class="product_link"
                            :to="item.goods.get_absolute_url"
                          >
                            <img :src="item.goods.get_thumbnail" alt="缩略图" />

                            <p>{{ item.goods.name }}</p></router-link
                          >
                        </div>
                        <div class="product_price">
                          <p>单价：{{ item.goods.price }}</p>
                        </div>
                        <div class="prodcut_unit">
                          <p>单位：SKU</p>
                        </div>
                        <div class="product_nums">
                          <p>数量：x{{ item.goods_nums }}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p>{{ order.total_price }}</p>
                  </td>
                  <td>
                    <p>{{ getOrderStatus(order.order_status) }}</p>
                    <el-button>
                      查看详情
                    </el-button>
                    <el-button @click="requestCancelOrder">
                      申请取消订单
                    </el-button>
                  </td>
                </tr>
              </tbody>
              <p class="no-orders" v-else>
                没有订单
              </p>
            </table>

            <el-pagination
              :page-size="5"
              layout="total, prev, pager, next, jumper"
              :total="user_orders.length"
            >
            </el-pagination>
          </div>

          <div>待发货</div>
          <div>待收货</div>
          <div>已完成</div>
        </div>
        <div class="user_address_container">
          <div>收货地址</div>
          <div>
            <div
              class="address_grid"
              v-for="(address, index) in user_address"
              :key="index"
            >
              <span class="address_default" v-if="address.is_default"
                >默认地址</span
              >
              <p>收货人：{{ address.signer_name }}</p>
              <p>电话：{{ address.signer_mobile }}</p>
              <p>
                收货地址：{{
                  address.province +
                    "省" +
                    address.city +
                    "市" +
                    address.district +
                    "区" +
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
              +
            </div>
            <div class="pop_up_box" v-if="isShowAddAddressBox">
              <div class="pop_up_content">
                <h3>新增收货地址</h3>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货人"
                    autofocus
                    ref="signer_name"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货联系电话"
                    ref="signer_mobile"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货地址"
                    ref="new_address"
                  />
                </p>
                <el-button class="add_address_btn" @click="addNewAddress"
                  >确定</el-button
                >
                <button class="close_add_new_address_box" @click="closeAddressBox"
                  >×</button
                >
              </div>
            </div>
            <div class="pop_up_box" v-if="isShowEditAddressBox">
              <div class="pop_up_content">
                <h3>编辑收货地址</h3>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货人"
                    autofocus
                    ref="edit_signer_name"
                    :value="user_address[updateAddressIndex].signer_name"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货联系电话"
                    ref="edit_signer_mobile"
                    :value="user_address[updateAddressIndex].signer_mobile"
                  />
                </p>
                <p>
                  <input
                    type="text"
                    placeholder="请输入收货地址"
                    ref="edit_address"
                    :value="user_address[updateAddressIndex].address"
                  />
                </p>
                <el-checkbox
                  v-model="user_address[updateAddressIndex].is_default"
                  ref="edit_default"
                  >设为默认地址</el-checkbox
                >
                <el-button class="add_address_btn" @click="editAddress()"
                  >确定</el-button
                >
                <button class="close_add_new_address_box" @click="closeAddressBox"
                  >×</button
                >
              </div>
            </div>
          </div>
        </div>
        <div class="user_fav_container">
          <h3>我的收藏</h3>
          <el-card class="fav_card" v-for="fav in user_fav" :key="fav">
            <div class="fav_product">
              <router-link
                class="fav_product_img"
                :to="fav.goods.get_absolute_url"
              >
                <img :src="fav.goods.get_thumbnail" alt="缩略图" />
              </router-link>
              <span>
                <router-link
                  class="fav_product_name"
                  :to="fav.goods.get_absolute_url"
                  >{{ fav.goods.name }}
                </router-link>
              </span>
            </div>
          </el-card>
        </div>
        <el-row class="lower_area">
          <div class="category_container"></div>
        </el-row> -->
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
  name: "UserPage",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      breadcrumb_tag: ''
    }
  },
  mounted() {
    this.get_default_tag()
  },
  methods: {
    get_default_tag() {
      if (this.$route.path === '/user-profile') {
        this.breadcrumb_tag = '个人中心'
    }
    },
    handleSelect(key) {
      if (key === '/user-profile') {
        this.breadcrumb_tag = '个人中心'
      } else if (key === '/user-address') {
        this.breadcrumb_tag = '地址管理'
      } else if (key === '/user-orders') {
        this.breadcrumb_tag = '订单中心'
      } else if (key === '/user-fav') {
        this.breadcrumb_tag = '我的收藏'
      } else {
        this.breadcrumb_tag = ''
      }
    }
  },
};
</script>

<style>
.main-body {
  padding-left: 7%;
  padding-right: 8%;
}
</style>
