'use strict'

import { bugService } from '../services/bug-service.js'

export default {
  template:/*html*/ `
    <section class="bug-details">
        <img src="401.png" alt="">
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId).then((bug) => {
        this.bug = bug
      })
    }
  },
}
