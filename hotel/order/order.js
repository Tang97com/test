import { HotelUserOrder, StoreReceveOrder, NoStoreCleanOVer, Hotel_order, userOrderBack, StoreReceveOrder1 } from "../../api/api";
Page({
  data: {
    order: [],
    page: 2,  // 页数
    last_page: 0 ,//最后的页数
    state: '', // 订单状态
    flag: '', // 是否还有数据
    type: 0, //当前订单类型
    ordertype: 'jd', //小程序订单的类型
    date: 0, // 当前时间
    TypesOf: '', // 用户类型
  },
  onShow() {
    this.setData({
      last_page: 0,
      page: 2
    })
    if (this.data.TypesOf == 'store') {
      this.getData({type: this.data.type, page: 1, ordertype:'jd'})
    }else {
      console.log(this.data.type);
      this.getUserData({type: this.data.type, page: 1, id: 1})
    }
    
  },
  onLoad: function (options) {
    console.log(options);
    let date = new Date()
    let type = +options.type
    let state = options.state || '订单'
    this.setData({
      TypesOf: options.TypesOf,
      ordertype:  options.ordertype,
      state,
      type,
      date: date.getHours()
    })
    console.log(this.data.TypesOf);
  },
  // 请求用户订单数据
  getUserData({type, page}) {
    wx.showLoading({
      title: '拼命加载数据中...',
    })
    Hotel_order({type, page, ordertype: 'jd'}).then(res => {
      console.log(res);
      wx.hideLoading()
      if (res.code === 200 ) {
        console.log("请求的页数", page, "一共", res.data.last_page)
        if (this.data.page - 2 === res.data.last_page ) {
          console.error("请求完了没有数据了")
          this.setData({
            flag: true
          })
          return
        }
        let item = this.data.page < 3 ? res.data.data : this.data.order.concat(res.data.data)
        console.warn(item)
        this.setData({
          order: item,
          last_page: res.data.last_page
        })
      } else {
        console.error("code不等于200", res)
        return false
      }
    }).catch(err => {
      console.error(err)
    })
    
  },
  // 请求商家订单数据
  getData({type, page, ordertype}) {
    wx.showLoading({
      title: '拼命加载数据中...',
    })
    // StoreOrder
    HotelUserOrder({type, page, ordertype}).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.code === 200 ) {
        console.log("请求的页数", page, "一共", res.data.last_page)
        if (this.data.page - 2 === res.data.last_page ) {
          console.error("请求完了没有数据了")
          this.setData({
            flag: true
          })
          return 0
        }
        // console.log("43行", this.data.page)
        let item = this.data.page < 3 ? res.data.data : this.data.order.concat(res.data.data)
        console.warn(item)
        this.setData({
          order: item,
          last_page: res.data.last_page
        })
      } else {
        console.error("code不等于200", res)
        return false
      }
    }).catch(err => {
      console.log("商家订单接口请求错误code不等于200", err)
    })
  },
  // 商家确认订单
  GetOrders(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type
    if (type == 1) {
      console.log('确认订单', e.currentTarget);
      StoreReceveOrder1({orderid:e.currentTarget.id, type: 2}).then((res)=>{
        console.log(res);
        wx.navigateTo({url: `./order?type=${type+=1}&TypesOf=store`})
      })
    } else if (type == 2) {
      console.log(e.currentTarget.dataset);
      console.log(e.currentTarget);
      wx.showModal({
        title: '请输入安全码',
        editable:true,
        content: '',
        success: (result) => {
          console.log(result);
          if(result.confirm){
            if (result.content == e.currentTarget.dataset.safety_code) {
              NoStoreCleanOVer({orderid:e.currentTarget.id, type: 4}).then((res)=>{
                console.log(res);
                wx.navigateTo({url: './order?type=3&TypesOf=store'})
              })
            } else {
              console.log('验证失败');
            }
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
  // 跳转详情页
  goToOrderDetail(e) {
    console.log(e);
    let TypesOf = this.data.TypesOf
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.id
    let item = e.currentTarget.dataset.detail
    getApp().globalData.orderDetail = item
    if (TypesOf=='user'&&type==2 || TypesOf=='store'&&type==2) {
      console.log('跳转详情页');
      wx.navigateTo({
        url: `../orderDetail/orderDetail?id=${id}&typesof=${TypesOf}`,
      });
    }
  },
  // 退款
  GetRefund(e) {
    let orderNumber = e.currentTarget.dataset.ordernumber
    let id = e.currentTarget.id
    userOrderBack({orderid: id, order_number: orderNumber}).then((res)=>{
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    })
  },
  // 拒绝接单
  RefuseOrders(e) {
    StoreReceveOrder1({orderid:e.currentTarget.id, type: 8,}).then(res=>{
      console.log(res);
      wx.showToast({
        title: '已拒绝接单',
        icon: 'none',
        duration: 1000
      })
      
    })
  },
  onReachBottom: function () {
    console.log("上拉刷新ING")
    if (this.data.page - 2 !== this.data.last_page ) {
      this.getData({page: this.data.page++, type: this.data.type})
    } else {
      return false
    }
  },
})