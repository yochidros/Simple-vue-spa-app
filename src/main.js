
Vue.config.productionTip = false
/* ======== UserList ============== */
var getUsers = function(callback) {
  setTimeout(function() {
    callback(null, [
      {
        id: 1,
        name: "yochidros",
        description: "AirAsia"
      },
      {
        id: 2,
        name: "job",
        description: "Scoooooooooooooooot"
      }
    ])
  }, 1000)
}

var UserList = {
  template: '#user-list',
  data: function() {
    return {
      loading: false,
      users: function() { return [] },
      error: null
    }
  },

  created: function() {
    this.fetchData()
  },

  watch: {
    '$route': 'fetchData'
  },

  methods: {
    fetchData: function() {
      this.loading = true
      getUsers((function (err, users) {
        this.loading = false

        if (err) {
          this.error = err.toString()
        } else {
          this.users = users
        }
      }).bind(this))
    }
  }
}

/* ======== UserDetail ============== */
var userData = [
  {
    id: 1,
    name: "yochidros",
    description: "AirAsia"
  },
  {
    id: 2,
    name: "job",
    description: "Scoooooooooooooooot"
  }
]

var getUser = function(userId, callback) {
  setTimeout(function() { 
    var filteredUsers = userData.filter(function(user) {
      return user.id === parseInt(userId, 10)
    })

    callback(null, filteredUsers && filteredUsers[0])

  }, 1000);
}

var UserDetail = {
  template: '#user-detail',
  data: function() {
    return {
      loading: false,
      user: null,
      error: null
    }
  },

  created: function() {
    this.fetchData()
  },

  watch: {
    '$route': 'fetchData'
  },

  methods: {
    fetchData: function() {
      this.loading = true
      getUser(this.$route.params.userId, (function (err, user) {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.user = user
        }
      }).bind(this))
    }
  }
}
/* ======== UserCreate ============== */

var postUser = function (params, callback) {
  setTimeout(function() { 
    params.id = userData.length + 1
    userData.push(params)
    console.log(userData)
    callback(null, params)
  }, 1000)
}

var UserCreate = {
  template: '#user-create',
  data: function() {
    return {
      sending: false,
      user: this.defaultUser(),
      error: null
    }
  },

  created: function() {},

  methods: {
    defaultUser: function() {
      return {
        name: '',
        description: ''
      }
    },

    createUser: function() {
      if(this.user.name.trim() === '') {
        this.error = 'No inputed Name!!'
        return 
      } 

      if (this.user.description.trim() === '') {
        this.error = 'No inputed Description!!'
        return 
      }

      postUser(this.user, (function(err, user) {
        this.sending = false

        if (err) {
          this.error = err.toString()
        } else {
          this.error = null

          this.user = this.defaultUser()
          alert('Register User!!')
          this.$router.push('/users')
        }
      }).bind(this))
    }
  }
}

/* ======= Auth  ============== */
var Auth = {
  login: function(email, pass, cb) {
    setTimeout(function() { 
      if (email === 'vue@example.com' && pass === 'vue') {
        localStorage.token = Math.random().toString(36).substring(7)
        if (cb) { cb(true) }
      } else {
        if (cb) { cb(false) }
      }
    }, 5)
  },

  logout: function () {
    delete localStorage.token
  },

  loggedIn: function() {
    return !!localStorage.token
  }
}

/* ======== Log In ============== */
var Login = {
  template: '#login',
  data: function() {
    return {
      email: 'vue@example.com',
      pass: '',
      error: false
    }
  },

  methods: {
    login: function() {
      Auth.login(this.email, this.pass, (function(loggedIn) {
        if (!loggedIn) {
          this.error = true
        } else {
          console.log('Log In!!')
          this.$router.replace(this.$route.query.redirect || '/')
        }
      }).bind(this))
    }
  }
}

/* ======== Router ============== */
var router = new VueRouter({
  routes: [
    {
      path: '/',
      component: {
        template: '<h1>Top</h1>'
      }
    },
    {
      path: '/users',
      component: UserList
    },
    {
      path: '/user/new',
      component: UserCreate,
      beforeEnter: function(to, from, next) {
        if (!Auth.loggedIn()) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        } else {
          next()
        }
      }
    },
    {
      path: '/user/:userId',
      component: UserDetail
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/logout',
      beforeEnter: function(to,from,next) {
        Auth.logout()
        console.log('Log out!!')
        next('/users')
      }
    },
    { 
      path: '*',
      redirect: '/'
    }
  ]
})

new Vue({
  router: router,
  data: function() {
    return {
      auth: Auth,
      users: userData
    }
  }
}).$mount('#app')
