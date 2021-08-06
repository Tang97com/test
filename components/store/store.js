Component({
  properties: {
    menu: {
      type: Array,
      value: []
    },
    storeData: {
      type: Array,
      value: []
    },
    storeFirstName: {
      type: String,
      value: ''
    }
  },
  data: {
    currentTab: 0, //对应样式变化
    scrollTop: 0, //用作跳转后右侧视图回到顶部
    selects: true,
    screenId: "", //后台查询需要的字段
  },
  methods: {
    navbarTap(e) {
      // console.log(e)
      this.setData({
        currentTab: e.currentTarget.id
      })
      let screenid = e.currentTarget.dataset.screenid
      this.triggerEvent('navbarTap', {
        screenid
      })
    },
    showitems(e) {
      let obj = e.currentTarget.dataset.obj
      // console.log(obj)
      this.triggerEvent('showitems', {
        obj
      })
    },
    selectShop(e) {
      this.triggerEvent('selectShop')
    }
  }
})