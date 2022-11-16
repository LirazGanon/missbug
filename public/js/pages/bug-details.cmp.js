'use strict'

import { bugService } from '../services/bug-service.js'

export default {
  template:/*html*/ `
	<section v-if="bug" class="bug-details">
	  <h1>{{bug.title}}</h1>
	  <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
	  <router-link to="/bug">Back</router-link>
	</section>
	<section v-if="error404" class="bug-details">
	  <img src="401.png" class="img401" />
    <router-link to="/">Home</router-link>
	</section>
	`,
  data() {
    return {
      bug: null,
      error404: false,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId).then((bug) => {
        this.bug = bug
      })
        .catch(err =>{
          if (err.response.status === 401) this.error404 = true
        })
    }
  },
}
