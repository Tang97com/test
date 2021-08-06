
Component({
  properties: {
     tabItem: {
       type: Array,
       value: []
     }
  },

  data: {
    acvive: 'null'
  },

  methods: {
    switchRouter(e) {
      // console.log(e.currentTarget.id)
      let id = e.currentTarget.id
      this.triggerEvent("changeState", {id})
    }
  }
})
