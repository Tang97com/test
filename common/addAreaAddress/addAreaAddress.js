import {
  addAddres,
  editAddress,
  getUserAddress
} from '../../api/api';
import {
  isMobile
} from '../../utils/Regular';
Page({
  data: {
    index: 0, // 性别
    school_index: 0,
    school_id: 0, // 选择的学校的ID
    school_name: '', // 选择的学校名
    AList: [], // 学校 楼 数据 A 
    AfirstName: '', // 首先显示的 A
    AschoolID: 0, //  A  的 ID 号
    AFlag: false, // 选择器 A 
    sex: ['男', '女'],
    school: [], // 学校名称
    hcAddress: [], //请求地址缓存的地址修改
    hcFlag: false,
    mask: false,
    state: '' // 状态
  },

  onLoad: function (options) {
    let school = wx.getStorageSync('school')
    let arr = []
    for (let item of school.values()) {
      arr.push(item.name)
    }
    if (options.tap === "编辑") {
      console.log(+options.id)
      getUserAddress({
        id: +options.id
      }).then(res => {
        // console.warn(res.data[0].school_name)
        // console.warn(arr)
        let current_index = school.findIndex(val => {
          return res.data[0].school_name == val.name
        })
        // 当前学校和ID 默认值
        let currrent_school = school.find(val => {
          return res.data[0].school_name == val.name
        })
        console.log(current_index) // 当前下标
        let index = res.data[0].gender == 1 ? 0 : 1
        this.setData({
          hcAddress: res.data[0],
          state: options.tap,
          school_index: current_index,
          school: arr,
          index,
          school_name: currrent_school.name,
          school_id: currrent_school.id
        })
      })
    } else {
      this.setData({
        school: arr,
        school_name: school[0].name,
        school_id: school[0].id
      })
    }
  },
  // 性别
  sex(e) {
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit(e) {
    this.setData({
      mask: true
    })
    wx.showLoading({
      title: '正在保存中....',
    })
    if (this.data.state === '编辑') {
      // 修改地址
      console.log("修改的", e)
      editAddress({
        id: this.data.hcAddress.id, //地址ID
        name: e.detail.value.name,
        tel: e.detail.value.phone,
        gender: +e.detail.value.sex + 1,
        address: e.detail.value.detaildz,
        school_id: this.data.school_id,
        school_name: this.data.school_name
      }).then(res => {
        // console.log(res)
        res.code === 200 && wx.showToast({
          title: '修改成功!2秒后自动返回',
          icon: 'none',
          duration: 2000
        })
        wx.hideLoading()
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 1500);
      }).catch(error => {
        console.error(error)
      })
      return
    }

    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (1) {
      // 新建地址
      console.log(this.data.school_name)
      addAddres({
        name: e.detail.value.name,
        tel: e.detail.value.phone,
        gender: +e.detail.value.sex + 1,
        address: e.detail.value.detaildz,
        school_id: this.data.school_id,
        school_name: this.data.school_name
      }).then(res => {
        console.log(res)
        res.code === 200 && wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '添加成功2s后自动返回',
              icon: 'none'
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../address/address?addState=1',
              })
            }, 2000)
          },
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        title: '请输入完整，输入真实的手机号',
        icon: 'none'
      })
      this.setData({
        mask: false
      })
    }
  },
  //  改变 
  bindPickerChange(e) {
    console.warn("当前的学校的选择下标", e.detail.value)
    this.setData({
      school_index: +e.detail.value
    })
    this.getSchoolPer(e.detail.value)
  },
  // 获m取学校ID和名称
  getSchoolPer(index) {
    let school = wx.getStorageSync('school')
    let name = this.data.school[+index]
    console.log(name)
    let currrent_school = school.find(val => {
      return name == val.name
    })
    console.log(currrent_school)
    this.setData({
      school_name: currrent_school.name,
      school_id: currrent_school.id
    })
  }
})