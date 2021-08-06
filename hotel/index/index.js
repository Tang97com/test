import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { getuserInfo,  GetAgreeAment, getSchool, HotelSearch, getConfig } from '../../api/api';
const app = getApp();
Page({
  data: {
    active: 0, //tab 选项卡
    startdate: '', //开始日期
    enddate: '', //结束日期
    day: '', //天数
    show: false, // 日历面板控制器
    schoolShow: false, // 学校选择
    actions: [],
    popupFlag: true, //协议弹窗控制器
    hasUserInfo: false,
    userInfo: {},
    flag: false,
    iconItem: [
    ],
    Icon: [],
    current_schoolName: '',
    current_schoolId: 0,
    protocol: '',  // 协议
    jdList: [], // 附近推荐
  },
  onLoad: function (options) {
    this.data.current_schoolId = app.globalData.current_schoolId
    this.setData({
      current_schoolName: app.globalData.current_schoolName
    })
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
    wx.setNavigationBarTitle({
      title: '在线订房',
    })
    this.startTime()
    // 附近推荐
    HotelSearch({schoolName: this.data.current_schoolName}).then((res)=>{
      this.setData({jdList: res.data})
      getApp().globalData.searchHotel = this.data.jdList
    })
    getApp().globalData.startdate = this.data.startdate
    console.log( getApp().globalData.startdate)
    getApp().globalData.enddate = this.data.enddate
  },
  hotelRegister(){
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo.idf == 'user') {
      wx.showModal({
        title: '您还不是商家',
        content: '请点击确定按钮入驻为商家',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.redirectTo({
              url: '../Merchant/hotelRegister/hotelRegister'
            })
            console.log('确定');
          } else {
            wx.redirectTo({
              url: './index'
            })
            console.log('取消');
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    console.log(event.detail)
    event.detail == 1 && this.storeIcon()
    event.detail == 2 && this.userIcon()
    
    this.setData({
      active: event.detail
    });
  },
  NoClick() {
    let idf = wx.getStorageSync('userInfo').idf
    console.log(idf);
    if (idf !== 'user') {
      wx.showModal({
        title: '提示',
        content: '您现在身份为商家',
        showCancel: false,
        cancelColor: '#000000',
        confirmText: '返回首页',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.redirectTo({
              url: './index'
            })
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
  onShow: function () {
    
  },
  onDisplay() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false,
      schoolShow:false
    });
  },
  onBottomPop() {
    this.setData({ schoolShow: true });
  },
  onSelect(event) {
    // console.log(event.detail);
    this.setData({current_schoolName: event.detail.name})
    wx.setStorageSync('school', event.detail)
    wx.setStorageSync('current_school', event.detail)
  },
  formatDate(date) {
    date = new Date(date);
    console.log(date.getDate())
    let day = date.getDay() ? `周${this.formatNumber(date.getDay())}` : `周天`
    return `${date.getMonth() + 1}月${date.getDate()}日${day}`;
  },
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      show: false,
      startdate: this.formatDate(start),
      enddate: this.formatDate(end),
      day: this.formatDayNum(start, end)
    });
    // date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
  },
  formatNumber(num) {
    switch (num) {
      case 1:
        num = '一'
        break;
      case 2:
        num = '二'
        break;
      case 3:
        num = '三'
        break;
      case 4:
        num = '四'
        break;
      case 5:
        num = '五'
        break;
      case 6:
        num = '六'
        break;
      default:
        num = '0'
        break;
    }
    return num
  },
  formatDayNum(start, end) {
    let starts = new Date(start);
    let ends = new Date(end);
    let endTime = ends.getTime() / 1000 - parseInt(starts.getTime() / 1000);
    let timeDay = parseInt(endTime / 60 / 60 / 24);
    return timeDay
  },
  startTime() {
    let day = new Date();
    let yestDay = day.getTime()
    console.log(yestDay)
    let now = day.getTime()+24 * 60 * 60 * 1000
    console.log(now)
    // console.log(this.formatDate(yestDay))
    // console.log(this.formatDate(now))
    this.setData({
      startdate: this.formatDate(yestDay),
      enddate: this.formatDate(now),
      day: 1
    })
   console.log(this.formatDate(yestDay))
  },
  serchHotel() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  jumpSearchPage() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  jumpDetail(e) {
    let id = e.detail
    wx.navigateTo({
      url: `../detail/detail?id=${id}`,
    })
  },
  storeIcon() {
      let iconItem = [
        {id: 1, cls: 'ahh iconjiedan', TypesOf: 'store', name: '新订单'},
        {id: 2, cls: 'ahh iconfuwu1', TypesOf: 'store', name: '进行中'},
        {id: 3, cls: 'ahh iconyiwancheng2', TypesOf: 'store', name: '已完成'},
        {id: 4, cls: 'ahh iconlayer', TypesOf: 'store', name: '全部订单'},
      ]
      let Icon = [
        {id: 8, cls: 'ahh iconxieyiguanli', name: '商家协议' },
        {id: 10, cls: 'ahh iconchuang1', name: '库存管理'},
        {id: 6, cls: 'ahh iconwodeshouyi', name: '我的收益' },
      ]
      this.setData({
        Icon,
        iconItem
      })
  },
  // 授权的 
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res.userInfo)
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
  userIcon() {
    let iconItem = [
    { id: 1, cls: 'ahh iconjiedan', TypesOf: 'user', name: '新订单' },
    { id: 2, cls: 'ahh iconfuwu1', TypesOf: 'user', name: '进行中' },
    { id: 3, cls: 'ahh iconyiwancheng2', TypesOf: 'user', name: '已完成' },
    { id: 4, cls: 'ahh iconlayer', TypesOf: 'user', name: '全部订单' }
    ]
    let Icon = [
      { id: 5, cls: 'ahh iconwodeshouyi', name: '小金库' },
      { id: 9, cls: 'ahh iconxieyiguanli', name: '用户协议' },
      { id: 7, cls: 'ahh iconlianxikefu1', name: '联系客服' }
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
        url: `../order/order?type=${id}&TypesOf=${TypesOf}`,
      })
    }
    id === 9 && GetAgreeAment({type: 8}).then((res)=>{
      this.setData({ protocol: res.data })
    }) && this.changeFlag()
    id === 8 && GetAgreeAment({type: 7}).then((res)=>{
      this.setData({ protocol: res.data })
    }) && this.changeFlag()
    id === 10 && wx.navigateTo({url: '../Hotel_inventory/Hotel_inventory'})
    id === 7 && getConfig().then((res)=>{
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
    id === 6 && wx.navigateTo({
      url: '/common/myIncome/myIncome?idf=store&typesOf=jd'
    })
    id === 5 && wx.navigateTo({
      url: '/common/myIncome/myIncome?idf=user&typesOf=jd'
    })
  },
  changeFlag() {
    this.setData({
      flag: !this.data.flag,
      protocol: ''
    })
  },
  onHide: function () {
    let date = []
    date.push(this.data.startdate, this.data.enddate)
    getApp().globalData.date = date;
    app.globalData.day = this.data.day
  }
})