Page({
  data: {
    haveData: true,
    list: [],
    allSelect: "circle",
    num: 0,
    count: 0
  },
  onLoad: function (options) {
    let list = wx.getStorageSync('cart')
    this.setData({
      list: list
    })
  },
  goindex() {
    wx.navigateBack({
      delta: 0,
    })
  },
  // 改变选框状态
  change(e) {
    // 获取下标
    let index = e.currentTarget.dataset.index
    //得到选中状态
    let select = e.currentTarget.dataset.select
    let stype = select == 'circle' ? 'success' : 'circle'

    // 新值赋值给 新数组
    let newList = this.data.list
    newList[index].select = stype

    // 更新状态
    wx.setStorageSync('cart', newList)
    
    // 新数组传给前台

    this.setData({
      list: newList
    })

    // 调用计算数目方法
    this.countNum()
    // 计算金额
    this.count()
  },
  // 加法
  addtion(e) {
    let index = e.currentTarget.dataset.index
    //得到点击的值
    let num = e.currentTarget.dataset.num
    //默认99件最多
    if (num < 100) {
      num++
    }
    //把新的值给新的数组
    let newList = this.data.list
    newList[index].num = num
    wx.setStorageSync('cart', newList)
    
    //把新的数组传给前台
    this.setData({
      list: newList
    })
    //调用计算数目方法
    this.countNum()
    //计算金额
    this.count()
  },
  // 减法
  subtraction(e) {
    //得到下标
    let index = e.currentTarget.dataset.index
    //得到点击的值
    let num = e.currentTarget.dataset.num
    //把新的值给新的数组
    let newList = this.data.list
    //当1件时，点击移除
    if (num == 1) {
      newList.splice(index, 1)
      wx.setStorageSync('cart', newList)
      
    } else {
      num--
      newList[index].num = num
      wx.setStorageSync('cart', newList)
      
    }
    //把新的数组传给前台
    this.setData({
      list: wx.getStorageSync('cart')
    })
    //调用计算数目方法
    this.countNum()
    //计算金额
    this.count()
  },
  // 全选
  allSelect(e) {
    //先判断现在选中没
    let allSelect = e.currentTarget.dataset.select
    // console.error(allSelect)
    let newList = this.data.list
    if (allSelect == "circle") {
      //先把数组遍历一遍，然后改掉select值
      for (let i = 0; i < newList.length; i++) {
        newList[i].select = "success"
      }
      var select = "success"
    } else {
      for (let i = 0; i < newList.length; i++) {
        newList[i].select = "circle"
      }
      var select = "circle"
    }
    wx.setStorageSync('cart', newList)
    
    this.setData({
      list: newList,
      allSelect: select
    })
    //调用计算数目方法
    this.countNum()
    //计算金额
    this.count()
  },
  //计算数量
  countNum() {
    //遍历数组，把既选中的num加起来
    let newList = this.data.list
    let allNum = 0
    for (let i = 0; i < newList.length; i++) {
      if (newList[i].select == "success") {
        allNum += parseInt(newList[i].num)
      }
    }
    parseInt
    console.log(allNum)
    this.setData({
      num: allNum
    })
  },
  //计算金额方法
  count() {
    //思路和上面一致
    //选中的订单，数量*价格加起来
    let newList = this.data.list
    let newCount = 0
    for (let i = 0; i < newList.length; i++) {
      if (newList[i].select == "success") {
        // console.log(parseFloat(newList[i].price))(newList[i].price)
        newCount += newList[i].num * newList[i].price
      }
    }
    // console.log((newCount).toFixed(1))
    this.setData({
      count: (newCount).toFixed(1)
    })
  },
  // 支付界面
  payMoney() {
    console.log(this.data.list[0].shopID)
    if (this.data.count && this.data.list.length) {
      console.log("开始支付")
      console.log(this.data.count, this.data.num)
      wx.navigateTo({
        url: `../pay/pay?count=${this.data.count}&num=${this.data.num}&shopid=${this.data.list[0].shopID}`,
      })
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      })
    }
  }
})