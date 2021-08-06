import { StoreRegister, prentCheckIn } from '../../../api/api';
Page({
  data: {
    imgurl: '/static/img/y.png',
    bgimggurl: '/static/img/y.png',
    flag: 1
  },
  onLoad: function (options) {
    console.log(options)
    if (options.xcx === 'dy') {
      // 打印店铺入驻
      this.setData({
        flag: 2
      })
    }
    wx.setNavigationBarTitle({
      title: '商铺入驻'
    })
  },

  formSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showLoading({
      title: '正在上传入驻信息',
    })
    let obj = e.detail.value
    let imgurl = this.data.imgurl
    console.log(imgurl)
    if (!obj.shopName || !obj.name || !obj.tel || !obj.shopeaddress || imgurl === '/static/img/y.png') {
      wx.hideLoading()
      wx.showToast({
        title: ' 请填写完商铺信息，并保证营业执照上传成功',
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
        school_id,
        shop_type: 'dy'
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
      school_id,
      shop_type: 'gx'
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
})