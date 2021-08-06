Component({
  properties: {
 
  },
  data: {
    imgs: [{
      id: 1
    }, {
      id: 2
    }, {
      id: 3
    }, {
      id: 4
    }, {
      id: 5
    }],
    starId: 5,
    src2: '/static/img/start-1.png',
    src1: '/static/img/start.png',
  },
 
  methods: {
    select(e) {
      // console.log(e.currentTarget.dataset.index)
      let start = e.currentTarget.dataset.index
      this.data.starId = e.currentTarget.dataset.index;
      this.setData({
        starId: this.data.starId
      })
      this.triggerEvent('select', start)
    }
  }
})