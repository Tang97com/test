import { getuserInfo,GetAgreeAment,getConfig ,getmslist_shop,gethotms,getRcommend} from "../../../api/api";
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      Distributor: '/iconfont/Distributor.svg',
      normal: '/iconfont/normal.svg'
    },
    active: 0,  // TabBar
    NavTab: 0, // 导航栏
    popupFlag: true, //协议弹窗控制器
    iconItem: [
    ],
    flag: false,
    protocol: '',  // 协议
    Icon: [],
    hasUserInfo: false,
    userInfo: {},
    list:[],
    hot:[],
    Rcommend:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({title: '美食'})
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo.avatar && userInfo.nickname && userInfo.gender) {
      // 已经授权登陆了
      this.setData({
        userInfo,
        hasUserInfo: true,
      })
    } else {
      this.getUserProfile() // 请求授权
    }
    this.getAllData()
  },
  getAllData() {
    getmslist_shop({lat:app.globalData.LatAndLon[0],lng:app.globalData.LatAndLon[1],school_id: wx.getStorageSync('current_school').id}).then(res => {
      console.log(res)
      this.setData({
        list:res.data.data,
      })
    })
    // gethotms({}).then(res=>{
    //   console.log(res)
    //   this.setData({
    //     hot:res.data.data,
    //   })
    // })
    // getRcommend({}).then(res=>{
    //   console.log(res)
    //   this.setData({
    //     Rcommend:res.data.data,
    //   })
    // })
  },
  goToSearch() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  getOrdering(e) {
    let id = e.currentTarget.dataset['id'];
    console.log(id)
    wx.navigateTo({
      url: `../ordering/ordering?id=${id}`
    });
  },

  getMarik() {
    wx.navigateTo({url: '../marik/marik'})
  },
  userIcon() {
    let iconItem = [
    { id: 1, cls: 'ahh iconjiedan', TypesOf: 'user', name: '新订单' },
    { id: 2, cls: 'ahh iconfuwu1', TypesOf: 'user', name: '进行中' },
    { id: 3, cls: 'ahh iconyiwancheng2', TypesOf: 'user', name: '已完成' },
    { id: 4, cls: 'ahh iconlayer', TypesOf: 'user', name: '全部订单' }
    ]
    let Icon = [
      { id: 12, cls: 'ahh iconwodeshouyi', name: '用户收益' },
      { id:11, cls: 'ahh iconxieyiguanli', name: '用户协议' },
      { id:6, cls: 'ahh iconlianxikefu1', name: '用户投诉建议' },
      { id:14, cls: 'ahh iconlianxikefu1', name: '联系客服' },
      { id:13, cls: 'ahh iconlianxikefu1', name: '我的地址' }
    ]
    this.setData({
      Icon,
      iconItem
    })
  },
  changeRouter(e) {
    console.log(e)
    let id = +e.currentTarget.id
    let TypesOf = e.currentTarget.dataset.typesof
    // id 为 1新订单  2确认订单 3已完成订单 4全部订单  用户与商家相同 
    if ( id < 5 ) {
      wx.navigateTo({
        url: `../mslist/mslist?type=${id}&TypesOf=${TypesOf}`,
      })
    }
    id === 11 && GetAgreeAment({type: 10}).then((res)=>{
      this.setData({ protocol: res.data })
    }) && this.changeFlag()
    
    id === 5 && GetAgreeAment({type: 9}).then((res)=>{
      this.setData({ protocol: res.data })
    }) && this.changeFlag()
    id === 14&& getConfig().then((res)=>{
      wx.makePhoneCall({
        phoneNumber: res.data.telephone,
        success: (res) => {
          console.log(res)
        },
        fail: (err) => {
          console.error(err)
        }
      })
    })
    id === 12 && wx.navigateTo({
      url: '/common/myIncome/myIncome?idf=store&typesOf=ms'
    })
    id ===7 && wx.navigateTo({
      url: '/common/myIncome/myIncome?idf=user&typesOf=ms'
    })
    id ===13 && wx.navigateTo({
      url: '/common/address/address?user=user',
    })
    id ===6 && wx.navigateTo({
      url: '/common/advice/advice?idf=user',
    })
  },
  changeFlag() {
    this.setData({
      flag: !this.data.flag,
      protocol: ''
    })
  },

  // getStore() {
  //   let idf = wx.getStorageSync('userInfo').idf
  //   console.log(idf);
  //   if (idf === 'user') {
  //     wx.showModal({
  //       title: '您现在还不是商家',
  //       content: '立即点击确定入驻成为商家吧',
  //       showCancel: true,
  //       cancelText: '取消',
  //       cancelColor: '#000000',
  //       confirmText: '确定',
  //       confirmColor: '#3CC51F',
  //       success: (result) => {
  //         if(result.confirm){
  //           wx.redirectTo({url: '../FoodRegister/FoodRegister'})
  //         } else {
  //           wx.redirectTo({url: './index'})
  //         }
  //       },
  //     });
  //   }
  // },
  
  // NoClick() {
  //   let idf = wx.getStorageSync('userInfo').idf
  //   console.log(idf);
  //   if (idf !== 'user') {
  //     wx.showModal({
  //       title: '提示',
  //       content: '您现在身份为商家',
  //       showCancel: false,
  //       cancelColor: '#000000',
  //       confirmText: '返回首页',
  //       confirmColor: '#3CC51F',
  //       success: (result) => {
  //         if(result.confirm){
  //           wx.redirectTo({
  //             url: './index'
  //           })
  //         }
  //       },
  //       fail: ()=>{},
  //       complete: ()=>{}
  //     });
  //   }
  // },
  onChange(event) {
    console.log(event.detail);
    event.detail == 2 && this.storeIcon()
    event.detail == 1 && this.userIcon()
    this.setData({
      active:event.detail
    })
  },
  storeIcon() {
    let iconItem = [
      {id: 1, cls: 'ahh iconshiwu-1', TypesOf: 'store', name: '新订单'},
      {id: 2, cls: 'ahh iconpeisongzhong', TypesOf: 'store', name: '派送中'},
      {id: 3, cls: 'ahh iconyiwancheng1', TypesOf: 'store', name: '已完成'},
      {id: 4, cls: 'ahh icondingdan', TypesOf: 'store', name: '全部订单'},
    ]
    let Icon = [
      {id: 5, cls: 'ahh iconyonghuxieyi', name: '商家协议' },
      {id: 6, cls: 'ahh iconxieyiguanli', name: '投诉建议'},
      {id: 7, cls: 'ahh iconwodeshouyi', name: '我的收益' },
      {id: 8, cls: 'ahh iconshangpin', name: '商品管理' },
      {id: 9, cls: 'ahh iconicon_Stock', name: '商品库存' },
      {id: 10, cls: 'ahh icondianpu', name: '店铺管理' },
    ]
    this.setData({
      Icon,
      iconItem
    })
  },
  userIcon() {
    let iconItem = [
    { id: 1, cls: 'ahh iconshiwu-1', TypesOf: 'user', name: '新订单' },
    { id: 2, cls: 'ahh iconpeisongzhong', TypesOf: 'user', name: '配送中' },
    { id: 3, cls: 'ahh iconyiwancheng1', TypesOf: 'user', name: '已完成' },
    { id: 4, cls: 'ahh icondingdan', TypesOf: 'user', name: '全部订单' }
    ]
    let Icon = [
      { id: 11, cls: 'ahh iconyonghuxieyi', name: '用户协议' },
      { id: 6, cls: 'ahh iconxieyiguanli', name: '投诉建议' },
      { id: 12, cls: 'ahh iconlianxikefu1', name: '我的收益' },
      { id: 13, cls: 'ahh icondingwei', name: '我的地址' },
      { id: 14, cls: 'ahh iconkefu2', name: '联系客服' },
    ]
    this.setData({
      Icon,
      iconItem
    })
  },
  // changeRouter(e) {
  //   console.log(e.currentTarget);
  //   let typesof = e.currentTarget.dataset.typesof
  //   let id = +e.currentTarget.id
  //   id === 10 && wx.navigateTo({url: '../administer/administer'})
  //   id === 8 && wx.scanCode({
  //     onlyFromCamera: true,
  //   })
  //   id === 1 && wx.navigateTo({url: `../Order/Order?typesof=${typesof}`})
  //   id === 9 && wx.navigateTo({url: '../stock/stock'})
  // },
  // 授权的 
  getUserProfile() {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
        let nickname = res.userInfo.nickName
        let avatar = res.userInfo.avatarUrl
        let gender = res.userInfo.gender
        getuserInfo({
          nickname,
          avatar,
          gender
        }).then(res => {
          console.log(res)
          if (res.code === 200) {
            wx.setStorageSync('userInfo', res.data)
            this.setData({
              userInfo: res.data,
              hasUserInfo: true
            })
          }
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },
  scrolltolower() {
    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})