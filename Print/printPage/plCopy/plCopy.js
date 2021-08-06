import { startPlUpload } from '../../../api/api';
Page({
  data: {
    showPop: false,
    fileList: [],
    state: true,
  },
  onLoad: function (options) {
     if (options.state === '文件打印') {
        this.setData({
          state: false
        })
     }
  },
  // 事件函数
  addfile() {
    this.setData({
      showPop: true
    })
  },
  // 从微信中选择文件
  wechatFile() {
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        console.log(res.tempFiles[0])
        let obj = { path: res.tempFiles[0].path, name: res.tempFiles[0].name, num: 1, price: 1}
        let item = that.data.fileList.concat(obj)
        that.setData({
          fileList: item,
          showPop: false
        })
      }
    })
  },
  // 获取手机图片
  phoneFild() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        let obj = { path: tempFilePaths[0], name: '图片.jpg', num: 1, price: 1}
        let item = that.data.fileList.concat(obj)
        that.setData({
          fileList: item,
          showPop: false
        })
      }
    })
  },
  // 关闭弹窗
  closePop() {
    this.setData({
      showPop: false
    })
  },
  // 删除文件list
  delfile(e) {
    console.warn(e.target.id)
    let item = this.data.fileList.splice(e.target.id, 1)
    console.log(item)
    this.setData({
      fileList: this.data.fileList
    })
  },
  // 打印文件
  printPage() {
    console.warn("开始打印的逻辑")
    // 
    startPlUpload({data: this.data.fileList}).then (res => {
      console.log(res)
    }).catch(err => {
      console.error(err)
    })
    console.log(this.data.fileList)
    let file = JSON.stringify(this.data.fileList)
    console.log(file)
    // wx.navigateTo({
    //   url: `../../pay/pay?file=${file}&filelink=${this.data.fileLink}&label=批量`,
    // })
  },
  add(e) {
    console.warn(e.currentTarget.id)
    let item = this.data.fileList
    let index =+e.currentTarget.id 
    if (item[index].num < 99 ) {
      item[index].num++
      this.setData({
        fileList: item
      })
    }
    // console.log(item[index].num)
  },
  jian(e) {
    console.warn(e.currentTarget.id)
    let item = this.data.fileList
    let index =+e.currentTarget.id 
    if (item[index].num === 1) {
       wx.showToast({
         title: '至少打印一份',
         icon: 'none'
       })
    } else {
      item[index].num--
      this.setData({
        fileList: item
      })
    }
  },
})