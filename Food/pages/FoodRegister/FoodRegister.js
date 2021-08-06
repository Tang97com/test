import { StoreRegister, prentCheckIn, GetRange } from '../../../api/api';
Page({
  data: {
    imgurl: '/static/img/y.png',
    bgimggurl: '/static/img/y.png',
    flag: 1,
    imageUrl: '/static/img/foodSafety.jpg',
    LatAndLon: [], // 经纬度
    foodClassFication: ['麻辣烫', '烧烤', '家常菜', '火锅', '糕点'],  // 美食分类
    foodSelected: [],
    CategoryId: '',
    isCatchtap: false,  // 控制分类点击事件
  },
  onLoad: function (options) {
    console.log(options)
    if (options.xcx === 'ms') {
      this.setData({
        flag: 4
      })
    }
    wx.setNavigationBarTitle({
      title: '商家入驻'
    })
    this.setData({
      LatAndLon: getApp().globalData.LatAndLon
    })
    GetRange().then((res)=>{
      let foodClassFication = res.data.map(item=>(item.name))
      console.log(foodClassFication)
      this.setData({
        foodClassFication
      })
    })
  },

  ChooseCategory(e) {
    let FoodName = e.currentTarget.dataset.item;
    // console.log(FoodName);
    this.data.foodSelected.push(FoodName)
    // console.log(this.data.foodSelected);
    this.setData({foodSelected: this.data.foodSelected})
    if (this.data.foodSelected.length === 3) {
      this.setData({isCatchtap: true})
    }
  },

  Deselect(e) {
    let Foodindex = e.currentTarget.dataset.index;
    // console.log(Foodindex);
    this.data.foodSelected.splice(Foodindex)
    this.setData({foodSelected: this.data.foodSelected})
    // console.log(this.data.foodSelected.length);
    if (this.data.foodSelected.length !== 3) {
      this.setData({isCatchtap: false})
    }
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
    if (!obj.shopName || !obj.name || !obj.tel || !obj.shopeaddress || !foodSelected || imgurl === '/static/img/y.png' || imageUrl === '/static/img/foodSafety.png') {
      wx.hideLoading()
      wx.showToast({
        title: ' 请填写完店铺信息，并保证营业执照上传成功',
        icon: "none"
      })
      return false
    }
    let school_id = wx.getStorageSync('current_school').id
    if ( this.data.flag === 4) {
      prentCheckIn({
        name: obj.shopName,
        tel_name: obj.name,
        tel: obj.tel,
        address: obj.shopeaddress,
        image_url: this.data.imgurl,
        imageUrl: this.data.imageUrl,
        school_id,
        shop_type: 'ms'
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
      shop_type: 'ms',
      lat: this.data.LatAndLon[0],
      lng: this.data.LatAndLon[1],
      business_type: this.data.foodSelected,
    }).then(res => {
      console.log(res);
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
          url: '../index/index',
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