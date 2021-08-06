Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
  },
  data: {
    _id: 0,
    name: ''
  },
  methods: {
    bindChange(e) {
      const val = e.detail.value
      let arr = this.properties.list
      for (let [index, item] of arr.entries()) {
        if (index == val[0]) {
          this.data._id = item.id
          this.data.name = item.name || item.title
          break
        }
      }
      this.triggerEvent('bindChange', {
        id: this.data._id,
        name: this.data.name
      })
    },
    cancal(e) {
      this.triggerEvent('cancal', {btn: "取消"})
    },
    determine(e) {
      console.warn("确定")
      this.triggerEvent('determine', {id: this.data._id,
        name: this.data.name})
    },
  }
})