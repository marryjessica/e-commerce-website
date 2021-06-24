// import { createStore } from 'vuex'

// export default createStore({
//     state: {
//         cart: {
//             items: []
//         },
//         isAuthenticated: false,
//         token: '',
//         isLoading: false
//     },
//     mutations: {
//         initializeStore(state) {
//             if (localStorage.getItem('cart')) {
//                 state.cart = JSON.parse(localStorage.getItem('cart'))
//             } else {
//                 localStorage.setItem('cart', JSON.stringify(state.cart))
//             }

//             if (localStorage.getItem('token')) {
//                 state.token = localStorage.getItem('token')
//                 state.isAuthenticated = true
//             } else {
//                 state.token = ''
//                 state.isAuthenticated = false
//             }
//         },
//         addToCart(state, item) {
//             const exists = state.cart.items.filter(i => i.product.id === item.product.id)

//             if (exists.length) {
//                 exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity)
//             } else {
//                 state.cart.items.push(item)
//             }

//             localStorage.setItem('cart', JSON.stringify(state.cart))
//         },
//         setIsLoading(state, status) {
//             state.isLoading = status
//         },
//         setToken(state, token) {
//             state.token = token
//             state.isAuthenticated = true
//             localStorage.setItem('token', JSON.stringify(state.token))
//         },  
//         removeToken(state) {
//             state.token = ''
//             state.isAuthenticated = false
//             localStorage.removeItem('token')
//         },
//     },
//     actions: {
//     },
//     modules: {
//     }
// })


import { createStore } from 'vuex'

import cookie from '@/static/cookie';

export default createStore({
    state: {
        userInfo: {
            name: cookie.getCookie('name')||'',
            token: cookie.getCookie('token')||'',
            refresh: localStorage.getItem('refresh')||''
        },
        // goods_list
        cart: {
            items: []
        },
        isLoading: false,
    },
    mutations: {
        setToken(state) {
            state.userInfo.name = cookie.getCookie('name')
            state.userInfo.token = cookie.getCookie('token')
            state.userInfo.refresh = localStorage.getItem('refresh')
            // localStorage.setItem('token', JSON.stringify(state.token))
            console.log('getCookie: ', cookie.getCookie('name'))
            console.log('userInfo: ', state.userInfo);
        },
        removeToken(state) {
            state.userInfo.token = ''
            state.userInfo.refresh = ''
            // state.isAuthenticated = false
            cookie.delCookie('token')
            cookie.delCookie('name')
            localStorage.removeItem('refresh')
        },
        onlyRemoveToken(state) {
            state.userInfo.token = ''
            cookie.delCookie('token')
            console.log('onlyRemoveToken')
        },
        setIsLoading(state, status) {
            state.isLoading = status
        },
        initializeStore(state) {
            if (localStorage.getItem('cart')) {
                state.cart = JSON.parse(localStorage.getItem('cart'))
            } else {
                localStorage.setItem('cart', JSON.stringify(state.cart))
            }

            // if (localStorage.getItem('token')) {
            //     state.token = localStorage.getItem('token')
            //     state.isAuthenticated = true
            // } else {
            //     state.token = ''
            //     state.isAuthenticated = false
            // }
        },
        addToCart(state, item) {
            const exists = state.cart.items.filter(i => i.product.id === item.product.id)

            if (exists.length) {
                exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity)
            } else {
                state.cart.items.push(item)
            }

            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
    },
    actions: {
    },
    modules: {
    }

})