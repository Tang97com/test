import { getMarikHall } from '../../api/api';
Page({
  data: {
     list: [],
     page: 2, 
     last_page: 0,
     Spage: 1,
     wbFlag: false, //没有数据显示文字
     oneList: [], // 筛选条件 楼栋
     oneFlag: false, // First 控制器
     oneFirstItem: {}, //默认第一个值
     oneText: '', //筛选值显示
     isSelect: false, // 是否筛选中 默认没有
  },
  onShow() {
    this.setData({
      last_page: 0
    })
    this.getData({page: 1, type: 2})
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      ordertype: options.ordertype
    })
  },
  getData(page) {
    wx.showLoading({
      title: '正在加载中',
    })
    page = page || 1
    console.log(page)
    getMarikHall({page, type: 2}).then(res => {
      console.log(res)
      if (res.data.data.length === 0) {
        console.error("长度为O没有数据")
        this.setData({
          wbFlag: true,
        })
        wx.hideLoading()
      }
      let list = this.data.list
      // console.warn(this.data.page)
      let item = this.data.page < 3 ? res.data.data : list.concat(res.data.data)
      console.warn(item)
      res.code === 200 && this.setData({
        list: item
      })
      wx.hideLoading()
    })
  },
  getSelectData(Spage, school_id) {
    school_id = school_id || ''
    Spage = Spage || 1
    console.log(Spage)
    getOrderList({page: Spage, school_id}).then(res => {
      wx.hideLoading()
      if (res.code === 200 ) {
        console.log("请求的页数", page, "一共", res.data.last_page)
        if (this.data.page - 2 === res.data.last_page ) {
          console.error("请求完了没有数据了")
          this.setData({
            wbFlag: true
          })
          return 0
        }
        let item = this.data.page < 3 ? res.data.data : this.data.list.concat(res.data.data)
        console.warn(item)
        this.setData({
          list: item,
          last_page: res.data.last_page
        })
      } else {
        console.error("code不等于200", res)
        return false
      }
    }).catch(err => {
      console.error("配送大厅接口错误", err)
    })
  },
  // 跳详情
  goToDeTetail(e) {
    console.log(e.detail.order)
    // wx.setStorageSync('marikHallOrder', e.detail.order)
    let item = JSON.stringify(e.detail.order)
    wx.navigateTo({
      url: `../marikPage/orderDetail/orderDetail?type=0&obj=${item}`,
    })
  },
  gotoMarkiMine(e) {
    wx.redirectTo({
      url: `../marikPage/my/my?ordertype=${this.data.ordertype}`,
    })
  },
  // 第一个控制器
  showOneList() {
    this.ChangeOneFlag()
  },
  // 弹窗控制器 楼栋
  Onedetermine(e) {
    console.log(e.detail.name)
    console.log(e.detail.id)
    let currentSchool = wx.getStorageSync('currentSchool')
    if ( e.detail.name && e.detail.id ) {
      this.setData({
        oneText: e.detail.name, 
        isSelect: true,
      })
      let page = 1
      this.getSelectData(page, currentSchool.id)
      this.ChangeOneFlag()
    } else {
      // 默认 第一个 或没有选择
      this.setData({
        oneText: this.data.oneFirstItem.name,
        isSelect: true,
      })
      // console.log(this.data.oneFirstItem) 
      let page = 1
      this.getSelectData(page, currentSchool.id)
      this.ChangeOneFlag()
    }
  },
  ChangeOneFlag() {
    this.setData({
      oneFlag: !this.data.oneFlag
    })
  },
  // 分页 上拉加载
  onReachBottom () {
    console.warn("上拉刷新ING")
    console.warn(this.data.page - 2,  this.data.last_page)
    if (this.data.page - 2 !== this.data.last_page) {
      this.getData({page: this.data.page++})
    } else {
      this.setData({
        wbFlag: true
      })
      return false
    }
  }
})