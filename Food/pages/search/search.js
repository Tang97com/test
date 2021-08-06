import { FoodSeach } from '../../../api/api'
const app = getApp();
Page({
  data: {
    name: '',  
    history: [],  // 搜索历史
    searchFood: [], // 搜索结果
    recommend: ['烧烤', '螺狮粉', '炒饭', '沙拉', '米线', '烤鱼', '烤肉', '牛排', '烤豆干', '家常菜'],  // 推荐
    focus: false,
  },
  // onShow() {
  //   this.setData({
  //     name: ''
  //   })
  // },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '搜索',
    });
    let history = wx.getStorageSync('Foodhistory') ? wx.getStorageSync('Foodhistory') : []
    this.setData({
      history
    })
  },
  getName(e) {
    let name = e.currentTarget.dataset.name
    this.setData({name,focus: true})
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
    FoodSeach({name:name}).then(res=>{
      console.log(res.data);
      this.setData({
        searchFood: res.data
      })
      wx.navigateTo({
        url: `../searchDetail/searchDetail?name=${name}`,
      })
    })
    // HotelSearch({name: name}).then((res)=>{
    //   // let searchFood = that.data.searchFood
    //   console.log(res.data);
    //   // console.log(searchFood);
    //   that.setData({
    //     searchFood: res.data
    //   })
    //   // console.log(searchFood);
    // })
    wx.setStorageSync('Foodhistory', that.data.history)
    // if (that.data.searchFood != []) {
      
    // }
    that.setData({
      name: ''
    })
  },
  onHide: function () {

  },
  onCancel() {
    wx.navigateBack({
      delta: 1
    });
  }
})