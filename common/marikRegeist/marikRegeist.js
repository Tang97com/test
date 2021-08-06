import {
  registerMarik
} from '../../api/api';
import {
  isIDCard,
  isMobile,
  isCorrectName
} from '../../utils/Regular';
Page({
  data: {
    imgList: [{
        id: 1,
        name: '身份证反正面',
        url: '/static/img/idcard_zheng.png'
      },
      {
        id: 2,
        name: '身份证反面',
        url: '/static/img/idcard_fan.png'
      },
      {
        id: 3,
        name: '学生证或一卡通(学生证封面)',
        url: '/static/img/studencard_zheng.png'
      },
      {
        id: 4,
        name: '学生证或一卡通(学生证内页)',
        url: '/static/img/studencard_fan.png'
      },
    ]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '配送员申请'
    })
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let obj = e.detail.value
    let imgList = this.data.imgList
    let schoolID = wx.getStorageSync('currentSchool').id
    console.log(imgList)
    wx.showLoading({
      title: '正在提交',
    })
    
    let userid = wx.getStorageSync('userInfo').id
    if (this.checkItem(obj.name, obj.idcard, obj.tel)) {
      registerMarik({
         id: userid,
         name: obj.name,
         tel: obj.tel,
         gender: +obj.sex,
         idcard: obj.idcard,
         student_number: obj.studentcard,
         idcard_img: imgList[0].url,
         idcard_img_fen: imgList[1].url,
         student_img: imgList[2].url,
         student_img_fen: imgList[3].url,
         school_id: +schoolID
      }).then(res => {
        console.log(res)
        res.code === 200 && wx.hideLoading()
        wx.showToast({
          title: '提交成功，正在审核',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        },1500)
      })
    } else {
      return 0
    }
  
  },
  uploadImg(id) {
    console.log(id)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const file = res.tempFilePaths
        wx.uploadFile({
          url: 'https://mini.scyxk.top/api/attachment/upload',
          filePath: file[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: (res) => {
            var data = JSON.parse(res.data);
            console.log(data);
            data.msg === '成功' && wx.hideToast();
            wx.showToast({
              title: data.msg,
            })
            let imgList
            if (id == 1 || id == 2 || id == 3 || id == 4) {
              imgList = this.changeImgUrl(id, data.data.url)
            }
            this.setData({
              imgList
            })
          },
          fail: (res) => {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) {}
            })
          }
        });
      }
    })
  },
  idcardUpload(e) {
    console.warn(e.currentTarget.id)
    let id = e.currentTarget.id
    this.uploadImg(id)
  },
  changeImgUrl(id, url) {
    let imgList = this.data.imgList
    imgList[+id - 1].url = url
    console.warn("处理了的Img", imgList)
    return imgList
  },
  // 数据判断
  checkItem(name, idcard, tel) {
    console.log(name, idcard, tel)
    switch (true) {
      case !isCorrectName(name):
        wx.showToast({
          title: '请输入正确的姓名',
          icon: 'none'
        })
        break
      case !isIDCard(idcard):
        wx.showToast({
          title: '请输入正确的身份证号',
          icon: 'none'
        })
        break
      case !isMobile(tel):
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        break
      default:
        return true
    }
  }
})