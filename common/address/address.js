import { getUserAddress,DelecteAddress,DefaultAddress } from '../../api/api';
Page({
  data: {
    flag: true,
    addAddress: false,
    check: false,
    address: [],
    payHTML: true,
    addState: 0,
  },
  onShow() {
    this.getData()
  },
  onLoad: function (options) {
    console.log(options.addState)
    if (options.addState == 1) {
      this.setData({
        addState: 1
      })
    }
    if (options.user === 'user') {
      this.setData({
        payHTML: false
      })
      wx.removeStorageSync('payState')
    }
    wx.setNavigationBarTitle({
      title: '我的收货地址',
    })
  },
  // 事件函数
  getData() {
    let userInfo = wx.getStorageSync('userInfo')
    getUserAddress({userid: userInfo.id}).then(res => {
      let item =  res.data.data
      item.map(e => {
        e.gender = e.gender === 1 ? '男' : '女'
      })
      // console.log(item)
      wx.setStorageSync('address', item)
      this.setData({
        address:item
      })
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '../addAreaAddress/addAreaAddress',
    })
  },
  // 设为默认
  changecheck(e) {
    let id = e.currentTarget.id
    console.log(id)
    DefaultAddress({id, is_default: 1}).then(res => {
      console.log(res)
       res.code === 200 &&  this.getData()
    }).catch(err => {
      console.error(err)
    })
  },
  // 编辑
  edit(e) {
    // console.log(e.currentTarget.id)
    wx.navigateTo({
      url: `../addAreaAddress/addAreaAddress?tap=编辑&id=${e.currentTarget.id}`,
    })
  },
  confirm(e) {
    let id = e.currentTarget.id
    let obj = (e.currentTarget.dataset)
    wx.setStorageSync('SelectAdress', obj)
    if (this.data.addState) {
      wx.navigateBack({
        delta: 2,
      })
    } else {
      wx.navigateBack({
        delta: 0,
      })
    }
    
  },
  // 删除
  del(e) {
    console.log(e.currentTarget.id)  
    let id = e.currentTarget.id
    DelecteAddress({id}).then(res => {
     console.log(res) 
     res.code === 200 && wx.showToast({
       title: '删除成功',
       icon: 'none',
       duration: 2000
     })
    //  刷新数据s
      this.getData() 
    }).catch(err => {
      console.error(err)
    })
  },

})