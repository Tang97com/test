import { HotelSearch } from '../../api/api'
import request from '../../api/http'
const app = getApp();
Page({
  data: {
    name: '',  
    history: [],  // 搜索历史
    searchHotel: [] // 搜索结果
  },
  // onShow() {
  //   this.setData({
  //     name: ''
  //   })
  // },
  onLoad: function (options) {
    let history = wx.getStorageSync('history') ? wx.getStorageSync('history') : []
    this.setData({
      history
    })
  },
  onChange(e) {
    this.setData({
      name: e.detail,
    });
  },
  onSearch() {
    var that = this
    // console.log('搜索' + that.data.name);
    let list = that.data.history
    let item =  list.concat(that.data.name)
    that.setData({
      history: item
    })
    let name = that.data.name
    HotelSearch({name: name}).then((res)=>{
      // let searchHotel = that.data.searchHotel
      console.log(res.data);
      // console.log(searchHotel);
      that.setData({
        searchHotel: res.data
      })
      // console.log(searchHotel);
      wx.navigateTo({
        url: `../findhotel/findhotel?name=${that.data.name}`,
      })
    })
    wx.setStorageSync('history', that.data.history)
    // if (that.data.searchHotel != []) {
      
    // }
  },
  onHide: function () {
    // console.log(onSearch());
    getApp().globalData.searchHotel = this.data.searchHotel;
    // this.data.searchHotel = []
    console.log(this.data.searchHotel);
  },
  onCancel() {
    wx.navigateBack({
      delta: 1
    });
  }
})