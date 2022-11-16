'use strict'
import { bugService } from '../services/bug-service.js'
import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'
import loginSignup from '../cmps/login-signup.cmp.js'
import { eventBus, showErrorMsg } from '../services/eventBus-service.js'
// import { showSuccessMsg } from '../services/event-bus.service.js'

export default {
  template: /*html*/ `
  <login-signup v-if="loginOut" />
    <section v-else class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <button @click="setPage(-1)">Prev</button>
        <button @click="setPage(1)">Next</button>
        <button @click="downloadPdf(bugs)">Download PDF</button>
        <a v-if="pdfLink" :href="pdfLink" target="_blank">Download PDF</a>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        page: 0,
      },
      totalPages: 0,
      pdfLink:null,
      loginOut: false
    }
  },
  created() {
    this.loadBugs()
    eventBus.on('loginOut',()=>this.loginOut = !this.loginOut)
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy)
        .then(({ totalPages, filteredBugs }) => {
          this.totalPages = totalPages
          this.bugs = filteredBugs
        })
    },

    setFilterBy(filterBy) {
      this.filterBy = filterBy
      this.loadBugs()
    },
    removeBug(bugId) {
      bugService.remove(bugId).then(() => this.loadBugs())
      .catch(err => showErrorMsg('unauthorized'))
    },
    setFilter(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page }
      this.loadBugs()
    },
    setPage(dir) {
      this.filterBy.page += +dir
      if (this.filterBy.page > this.totalPages - 1) this.filterBy.page = 0
      if (this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1
      this.loadBugs()
    },
    downloadPdf(bugs){
      bugService.createPDF(bugs).then((res)=> this.pdfLink = res)
    }
  },
  computed: {
    // bugsToDisplay() {
    //   if (!this.filterBy?.title) return this.bugs
    //   return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
    // },
  },
  components: {
    bugList,
    bugFilter,
    loginSignup,
  },
}
