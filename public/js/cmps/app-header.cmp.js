'use strict'
import { eventBus } from '../services/eventBus-service.js'

import { userService } from "../services/user.service.js"

export default {
    template:/*html*/ `
        <header>
            <h1>Missss Bug</h1>
            <section v-if="user">
            <p>Welcome {{user.fullname}}</p>   
            <button @click="logout">Logout</button>
       </section>
       <section v-else>
       <button @click="loginOut">Login</button> 
            <login-signup @onChangeLoginStatus="onChangeLoginStatus"></login-signup>
       </section>  
        </header>
    `,
    created() {
        eventBus.on('onChangeLoginStatus', this.onChangeLoginStatus)
    },
    data() {
        return {
            user: userService.getLoggedInUser()
        }
    },
    methods: {
        loginOut() {
            eventBus.emit('loginOut')
        },
        onChangeLoginStatus() {
            this.user = userService.getLoggedInUser()
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.user = null
                })
        }
    },
}
