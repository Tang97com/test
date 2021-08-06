import { UserHotelRoom, UserHotelRoom1, RoomDetail } from "../../api/api";
const app = getApp();
Page({
  data: {
    show: false,
    date:[],
    hotelRoom:[], // 酒店房间
    hotelDatail: [], // 酒店详情
    roomDetail: [], // 房间详情
    LatAndLon: [], // 用户经纬度
    lng: 0,
    lat: 0, // 酒店经纬度
    day: 1, // 天数
    date: [],  // 入离时间
    phone: '',  // 酒店电话
  },
  onLoad: function (options) {
    this.setData({
      day: app.globalData.day,
      date: app.globalData.date
    })
    let LatAndLon = this.data.LatAndLon
    LatAndLon = getApp().globalData.LatAndLon
    let roomId = options.id
    UserHotelRoom({id:roomId, lat:LatAndLon[0], lng: LatAndLon[1]}).then((res)=>{
      this.setData({
        hotelDatail: res.data,
        lng: res.data[0].lng,
        lat: res.data[0].lat,
        phone: res.data[0].tel
      })
    })
    UserHotelRoom1({id:roomId}).then((res)=>{
      console.log(res);
      this.setData({
        hotelRoom: res.data
      })
    })
    wx.setStorageSync('RoomId', roomId);
    let date = app.globalData.date
    this.setData({
      date,
    })
  },
  getToMap() {
    wx.openLocation({
      latitude: this.data.lat * 1,
      longitude: this.data.lng * 1,
      scale: 18,
      name: this.data.hotelDatail[0].name,
      address: this.data.hotelDatail[0].address,
    });
  },
  onClose(e) {
    console.log(e);
    this.setData({ show: !this.data.show });
    RoomDetail({id: e.currentTarget.id}).then((res)=>{
      this.setData({
        roomDetail: res.data
      })
    })
  },
  onSubmit(e) {
    let rooMoney = e.currentTarget.id / 100
    app.globalData.roomDetail = this.data.roomDetail
    wx.navigateTo({
      url: `../pay/pay?id=${rooMoney}`,
    })
  },
  Call() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.error(err)
      }
    })
  }
})