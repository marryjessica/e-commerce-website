<template>
    <div class='prodcut-detail'>
        <div class='prodcut-detial-container'>
            <el-header>
                <Header/>
            </el-header>
            <el-main class='main-body' v-loading='this.$store.state.isLoading'>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/products' }">{{ this.$route.params.category_slug }}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
                </el-breadcrumb>
                <el-row>
                    <el-col>
                        <figure class='image'>
                            <img :src='product.get_image' alt="图片" height="400" width="300">
                        </figure>
                        <h1 class='title'>{{ product.name }}</h1>
                        <p class='descirption'>{{ product.descirption }}</p>
                    </el-col>
                        
                    <el-col>
                        <h2 class='subtitle'>详情</h2>
                        <p>{{ product.description }}</p>
                        <p><strong>价格：</strong>¥{{ product.price }}</p>

                        <div class='field has-addons mt-6'>
                            <div class='control'>
                                <input class='quantity-input' type="number" min="1" v-model='quantity'>
                            </div>
                            <div class='control'>
                                <button class='button is-dark' @click="addToCart">加入购物车</button>
                            </div>

                        </div>
                    </el-col>
                        
                </el-row>

            </el-main>
            <el-footer>
                <Footer/>
            </el-footer>

        </div>
    </div>
    
</template>

<script>
import axios from 'axios';

// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

import { ElMessage } from 'element-plus'

export default {
    name: 'ProductDetail',
    data() {
        return {
            product: {},
            quantity: 1,
        }
    },
    mounted() {
        this.getProduct();

    },
    methods: {
        async getProduct() {
            this.$store.commit('setIsLoading', true)

            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug

            console.log(category_slug)
            console.log(product_slug)
            await axios
                .get(`http://127.0.0.1:8000/api/v1/products/${category_slug}/${product_slug}`)
                .then((res) => {
                    console.log(res.data)
                    this.product = res.data
                })
                .catch((error) => {
                    console.log(error)
                })
    
            this.$store.commit('setIsLoading', false)
        },
        addToCart() {
            if (isNaN(this.quantity) || this.quantity < 1) {
                this.quantity = 1
            }

            const item = {
                product: this.product,
                quantity: this.quantity
            }

            this.$store.commit('addToCart', item)

            ElMessage({
                showClose: true,
                message: '成功加入购物车',
                type: 'success',
                duration: 1000
            })
        }
    },
    components: {
        Header,
        Footer,
    }
}
</script>