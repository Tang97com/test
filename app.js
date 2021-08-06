import { login } from './api/api';
App({
  onLaunch() {
    this.setNavBarInfo()
    // // 地理位置
    // this.getLocation()
    // 
    // 登录
    // let userInfo = wx.getStorageSync('userInfo')
    // if (!userInfo) {
      wx.login({
        success: res => {
          // console.log(res.code)
          if (res.code) {
            login({ code: res.code }).then(res => {
              // console.log(res)
              if  (res.code === 200) {
                console.warn("登陆成功！")
                wx.setStorageSync('token', res.data.token)
                wx.setStorageSync('userInfo', res.data)
              } else {
                console.error("登陆授权失败")
                wx.showToast({
                  title: res.msg,
                  icon: "none",
                  duration: 2000
                })
              }
            })
          }
        }
      })
    // } 
    // this.getLocation()
  },
  // 获取地理位置
  
  
  // 自定义导航栏
  setNavBarInfo() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
    this.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuHeight = menuButtonInfo.height;
  },
  globalData: {
    userInfo: null,
    navBarHeight: 0, // 导航栏高度
    menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    searchHotel: [], // 酒店搜索
    date: [], // 时间
    day: 0,  // 居住时间
    startdate: '',
    enddate: '',
    current_schoolName: '',
    current_schoolId: 0,
    LatAndLon: [], // 经纬度
    orderDetail: [], // 订单详情
    roomDetail: [], // 房间详情
  }
})