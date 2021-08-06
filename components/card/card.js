Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
    marikHall: {
      type: Boolean,
      value: false
    },
    state: {
      type: String,
      value: '接单'
    },
    idf: {
      type: String,
      value: ''
    }
  },
  data: {
    ids: 0,
  },
  methods: {
    jumpDetail(e) {
      // console.log(e.currentTarget.dataset)
      let order = e.currentTarget.dataset.orderdetail
      this.triggerEvent('jumpDetail', {order})
    },
    openCodeBtn(e) {
      this.setData({
        ids: e.currentTarget.id
      })
    }
  }
})