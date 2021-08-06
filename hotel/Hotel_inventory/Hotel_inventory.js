import { HotelRoomCapacity } from "../../api/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    id:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDta()
  },
  getDta(){
    HotelRoomCapacity().then((res) => {
      console.log(res);
      this.setData({
        list: res.data,
      })
    })
  },
  Have(e){
    console.log(e.target.id);
    wx.request({
      url: 'https://sa.scyxk.top/api/shop/isroom',
      data: {
        id: e.target.id,
        
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('成功');
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  No(e){
    console.log(e.target.id);
    wx.request({
      url: 'https://sa.scyxk.top/api/shop/isroom',
      data: {
        id:e.target.id
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        setTimeout(() => {
          this.onLoad()
        }, 500);
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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