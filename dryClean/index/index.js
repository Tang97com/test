import {
  getStore,
  getStoreData,
  getStoreMenu,
  getSwiperImg
} from '../../api/api';
Page({
  data: {
    havedata: false,
    num: 0,
    storeData: [],
    state: 1,
    StoreFlag: false, //店铺选择器flag
    StoreID: 0, //店铺ID
    marikType: false,
    storeType: false,
    show: false,
    actions: [],
  },
  onShow() {
    this.scanCart()
  },
  onLoad: function (options) {
    let  userInfo = wx.getStorageSync('userInfo')
    // console.log(userInfo.idf)
    if (userInfo.idf == 'marik') {
      this.setData({
        marikType: true
      })
    } 
    if (userInfo.idf == 'store') {
      this.setData({
        storeType: true
      })
    }
    this.getAllData()
    this.StoreDataItem()
  },
  changeState(e) {
    // console.log(e.detail.id)
    let id = +e.detail.id
    switch (id) {
      case 1:
        this.changeIndex(1)
        break;
      case 2:
        this.changeIndex(2)
        break;
      case 3:
        this.changeIndex(3)
        break;
      default:
        console.error("错误")
        break;
    }
  },
  changeIndex(id) {
    let item = this.data.tabItem
    item.map(e => {
      e.active = ''
      if (e.id == id) {
        e.active = 'active'
      }
    })
    // console.log(item)
    this.setData({
      tabItem: item,
      state: id
    })
  },
  gotoRouter(e) {
    console.log(e.currentTarget.id)
    let name = e.currentTarget.id
    let userIdf = wx.getStorageSync('userInfo').idf
    if (name === 'user') {
      if (userIdf === 'user' || userIdf === 'marik') {
        wx.navigateTo({
          url: '../my/my',
        })
      } else return false
    }
    if (name === 'store') {
      if (userIdf === 'store') {
        wx.navigateTo({
          url: '../store/store',
        })
      } else wx.navigateTo({
        url: '../storePage/storeRegister/storeRegister',
      }) 
    }
    if (name === 'marik') {
      if ( userIdf === 'user' || userIdf === 'marik' ) {
        let flag = this.data.marikType
      if (flag) {
        wx.navigateTo({
          url: '../marik/marik',
        })
      } else {
        wx.navigateTo({
          url: '/common/marikRegeist/marikRegeist',
        })
      }
      } else return false
    }
    if (name === 'cart') {
      let stroe = wx.getStorageSync('store')
      // console.log(stroe.length)
      if (!stroe.length) {
        wx.showToast({
          title: '该学校并未入驻店铺',
          icon: 'none',
          duration: 2000
        })
        return 0
      } else {
        wx.navigateTo({
          url: '../cart/cart',
        })
      } 
    }
  },
  getAllData() {
    wx.showLoading({
      title: '正在拼命加载....',
    })
    // let school = wx.getStorageSync('current_school')
    let school_id = wx.getStorageSync('current_school').id
    console.log(school_id)
    Promise.all([getStoreMenu({
      shopid: 1
    }), getStore({
      school_id
    }), getSwiperImg({
      type: 1,
      school_id
    })]).then(res => {
      // console.error(res)
      wx.setStorageSync('store', res[1].data) // 缓存店铺
      let name = '暂无店铺'
      res.length && wx.hideLoading()
      this.setData({
        storeFirstName: res[1].code === 200 ? res[1].data[0].name : name,
        StoreID: res[1].code === 200 ? res[1].data[0].id : [],
        menu: res[0].data,
        actions: res[1].data,
        imgList: res[2].data
      })
      
    }).catch(err => {
      console.error(err)
    })
  },
  // 获取菜单分类 店铺衣服裤子类别
  StoreDataItem(type) {
    type = type || 1
    let storeid = this.data.StoreID || 1
    getStoreData({
      type,
      storeid
    }).then(res => {
      // console.log(res)
      res.code === 200 && this.setData({
        storeData: res.data
      })
    })
  },
  navbarTap(e) {
    console.log(e.detail.screenid)
    let type = +e.detail.screenid
    this.StoreDataItem(type)
  },
  // 购物车
  showitems(e) {
    // console.log(e.detail.obj)
    let stroe = wx.getStorageSync('store')
      // console.log(stroe.length)
    if (!stroe.length) {
      wx.showToast({
        title: '该学校并未入驻店铺',
        icon: 'none',
        duration: 2000
      })
      return 0
    } 
    // 数据缓存
    let obj = e.detail.obj
    // obj = e.detail.obj
    let list = {
      shopID: obj.storeid,
      id: obj.id,
      num: 1,
      price: obj.price,
      name: obj.name,
      select: "circle",
      style: '普通规格',
      url: obj.url,
    }
    let item = []
    let newdata = wx.getStorageSync('cart').length === 0 ? item.concat(list) : wx.getStorageSync('cart').concat(list)
    // 本地缓存购物车列表

    wx.setStorageSync('cart', newdata)
    this.scanCart()
    //app.scanCart()  //刷新
    this.setData({
      cartData: newdata
    })
  },
  // 更新购物车数据
  scanCart() {
    let cart = wx.getStorageSync('cart')
    if (+cart.length >= 1) {
      let num = +cart.length
      console.warn(num)
      this.setData({
        num,
      })
    } else {
      wx.removeStorageSync('cart')
      this.setData({
        num: 0,
      })
    }
  },
  onClose() {
    this.setData({ show: !this.data.show });
  },
  onSelect(event) {
    console.log(event.detail);
    this.setData({
      storeFirstName: event.detail.name
    })
    wx.setStorageSync('current_store', event.detail)
  },
  // Tabbar 商家模块
  onChange() {
    
  },
})