import { StoreRegister, prentCheckIn } from '../../../api/api';
Page({
  data: {
    imgurl: '/static/img/y.png',
    bgimggurl: '/static/img/y.png',
    flag: 1,
    imageUrl: '/static/img/hotel.png',
    LatAndLon: [], // 经纬度
  },
  onLoad: function (options) {
    console.log(options)
    if (options.xcx === 'jd') {
      this.setData({
        flag: 3
      })
    }
    wx.setNavigationBarTitle({
      title: '酒店入驻'
    })
    this.setData({
      LatAndLon: getApp().globalData.LatAndLon
    })
  },

  formSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showLoading({
      title: '正在上传入驻信息',
    })
    let obj = e.detail.value
    let imgurl = this.data.imgurl
    let imageUrl = this.data.imageUrl
    console.log(imgurl)
    if (!obj.shopName || !obj.name || !obj.tel || !obj.shopeaddress || imgurl === '/static/img/y.png' || imageUrl === '/static/img/hotel.png') {
      wx.hideLoading()
      wx.showToast({
        title: ' 请填写完酒店信息，并保证营业执照上传成功',
        icon: "none"
      })
      return false
    }
    let school_id = wx.getStorageSync('current_school').id
    if ( this.data.flag === 2) {
      prentCheckIn({
        name: obj.shopName,
        tel_name: obj.name,
        tel: obj.tel,
        address: obj.shopeaddress,
        image_url: this.data.imgurl,
        imageUrl: this.data.imageUrl,
        school_id,
        shop_type: 'jd'
      }).then(res => {
        wx.hideLoading()
        res.code === 200 && wx.showToast({
          title: '申请成功，信息审核中...',
          icon: 'none',
          duration: 2000,
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 1500)
      }).catch(err => [
        console.error(err)
      ])

      return 
    } 
    StoreRegister({
      name: obj.shopName,
      tel_name: obj.name,
      tel: obj.tel,
      address: obj.shopeaddress,
      image_url: this.data.imgurl,
      imageUrl: this.data.imageUrl,
      school_id,
      shop_type: 'jd',
      lat: this.data.LatAndLon[0],
      lng: this.data.LatAndLon[1],
    }).then(res => {
      wx.hideLoading()
      res.code === 200 && wx.showToast({
        title: '申请成功，信息审核中...',
        icon: 'none',
        duration: 2000,
      });
      setTimeout(() => {
        // wx.navigateBack({
        //   delta: 1,
        // })
        wx.redirectTo({
          url: '../../index/index',
        });
      }, 1500)
    }).catch(err => [
      console.error(err)
    ])
  },
  uploadImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const file = res.tempFilePaths
        wx.uploadFile({
          url: 'https://sa.scyxk.top/api/attachment/upload',
          filePath: file[0],
          name: 'file',
          header: {"Content-Type": "multipart/form-data"},
          success: (res) => {
            var data = JSON.parse(res.data);
            console.log(data);
            data.msg === '成功' && wx.hideToast(); wx.showToast({
              title: data.msg,
            })
            this.setData({
               imgurl: data.data.url 
            })
          },
          fail: (res) => {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        });
      }
    })
  },
  uploadImages() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        const file = res.tempFilePaths
        wx.uploadFile({
          url: 'https://sa.scyxk.top/api/attachment/upload',
          filePath: file[0],
          name: 'file',
          header: {"Content-Type": "multipart/form-data"},
          success: (res) => {
            var data = JSON.parse(res.data);
            console.log(data);
            data.msg === '成功' && wx.hideToast(); wx.showToast({
              title: data.msg,
            })
            this.setData({
              imageUrl: data.data.url 
            })
          },
          fail: (res) => {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        });
      }
    })
  },
})