var appInst =  getApp();
Component({
  data: {
    jdList:[],
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    ready: function () {
        this.setData({
          jdList:appInst.globalData.searchHotel
        })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  properties: {
    
  },
  methods: {
    gotoDetail(e) {
      // console.log(e.currentTarget.id)
      this.triggerEvent('jumpDetail', e.currentTarget.id)
    }
  }
})
