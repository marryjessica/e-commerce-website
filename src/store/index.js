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
        orders: [],
        isLoading: false,
        tokenTimeDiff: 0,
    },
    mutations: {
        addToOrder(state) {
            localStorage.setItem('orders', JSON.stringify(state.orders))
        },
        isTokenExpired(state){
            const recordTime = new Date()
            const tokenSetTime = parseInt(localStorage.getItem('token_set_time'))
            if(tokenSetTime === null) {
                console.log("no token settle")
            } else {
                const newTime = recordTime.getTime()
                console.log(newTime, " - ", tokenSetTime)
                const timeDiff = (newTime - tokenSetTime)/1000
                console.log("time diff: ", timeDiff)
                state.tokenTimeDiff = timeDiff
                if(timeDiff > 1800) {
                    console.log("please re-login")
                }
            }
        },
        setToken(state) {
            state.userInfo.name = cookie.getCookie('name')
            state.userInfo.token = cookie.getCookie('token')
            state.userInfo.refresh = localStorage.getItem('refresh')
            console.log('getCookie: ', cookie.getCookie('name'))
            console.log('userInfo: ', state.userInfo);

            var current_time = new Date().getTime()
            var token_set_time = localStorage.getItem('token_set_time')
            if(token_set_time === null) {
                console.log("it is null")
                localStorage.setItem('token_set_time', JSON.stringify(current_time))
            } else {
                console.log("it has time", localStorage['token_set_time'])
                localStorage['token_set_time'] = current_time
                console.log("new time", localStorage['token_set_time'])
            }
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