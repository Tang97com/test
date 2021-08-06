import { PlaceOrder,GetAgreeAment } from '../../api/api';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { randomOrder } from '../../utils/Regular';
Page({
  data: {
    item: [{
        title: '总价',
        num: 0,
        str: ''
      },
      {
        title: '配送费',
        num: 2,
        str: ''
      },
      {
        title: '店铺名称',
        num: 0,
        str: '我是一个地址'
      },
      {
        title: '店铺地址',
        num: 0,
        str: '21321313'
      },
    ],
    file: [],
    orderSelect: [{
        name: '是否加急',
        title: '加急',
        title2: '不加急',
        status: '不加急'
      },
      {
        name: '配送方式',
        title: '送到楼上',
        title2: '送到楼下',
        status: '送到楼下'
      },
      {
        name: '配送时间',
        title: '15:00-17:00',
        title2: '19:00-22:00',
        status: '19:00-22:00'
      }
    ],
    storeId: 2, //店铺ID
    originPrice: 0,
    flag: false
  },
  onShow() {
    this.setData({
      current_address: wx.getStorageSync('SelectAdress').obj
    })
  },
  onLoad: function (options) {
    console.warn(options)
    let current_store = wx.getStorageSync('current_store') // 获取店铺
    let current_address = wx.getStorageSync('SelectAdress').obj
    if (current_store) {
      this.setData({
        storeId: current_store.id
      })
      this.handleStoreItem(current_store.name, current_store.address)
    } else this.handleStoreItem('','')
    
    this.setData({
      file: JSON.parse(options.file),
      filelink: options.filelink,
      current_address
    })
    this.sum()
    this.getAmentUser()
  },
  radioChange(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    // console.log('Index', e.currentTarget.id)
    this.money(e.detail.value)
    let orderSelect = this.data.orderSelect
    orderSelect[+e.currentTarget.id].status = e.detail.value
    this.setData({
      orderSelect
    })
  },
  payMoney() {
    // Toast.loading({
    //   message: '正在支付...',
    //   forbidClick: true,
    // });
    if (!this.data.current_address) {
      Toast.fail('请添加地址');
      return 
    }
    console.warn("支付")
    console.log(this.data.item)
    console.log(this.data.orderSelect)
    console.log(this.data.current_address)
    console.log(this.data.file)
    let is_urgent = this.data.orderSelect[0].status === '不加急' ? 0 : 1
    console.log(is_urgent)
    const orderNumber = randomOrder()
    PlaceOrder({
      order_number: orderNumber,
      userid: wx.getStorageSync('userInfo').id,
      school_id: this.data.current_address.school_id,
      city_id: this.data.current_address.id, 
      delivery_mode: this.data.orderSelect[1].status, 
      delivery_time: this.data.orderSelect[2].status,
      is_urgent,
      fee: +this.data.item[1].num,
      shop_id: this.data.storeId,
      total: +this.data.item[0].num,
      file: this.data.file,
      filelink: this.data.filelink,
      ordertype: "dy"
    }).then(res => {
      console.log(res)
      if (res.code === 707) {
        wx.requestPayment({
          provider: 'wxpay',
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          paySign: res.data.paySign,
          timeStamp: res.data.timeStamp,
          signType: 'MD5',
          success: (res) => {
            console.log(res)
            if (res.errMsg.indexOf("ok") > 0) {
              Toast.success("支付成功")
              setTimeout(() => {
                wx.reLaunch({
                  url: '../userPage/mine/mine',
                })
              },1500)
            } else {
              Toast.fail('支付失败');
            }
          },
          fail: (err) => {
            // 取消支付或关闭支付
            Toast.fail('支付失败');
            this.setData({
              Mask: false
            })
            console.error('fail:' + JSON.stringify(err));
          }
        })
      }else if (res.code === 200) {
        Toast.success('支付成功');
        setTimeout(() => {
          wx.reLaunch({
            url: '../userPage/mine/mine',
          })
        })
      } else {
        Toast.fail('下单失败，服务器开小差了');
      }
    }).catch(err => {
      console.error(err)
    })
  },
  sum() {
    let list = this.data.file
    let item = this.data.item
    let sum = 0
    list.forEach(e => {
      sum += +e.num * +e.price
    })
    console.log(sum)
    item[0].num = item[1].num + sum
    this.setData({
      originPrice: sum,
      item
    })
  },
  money(str) {
    let item = this.data.item
    switch (str) {
      case '送到楼上':
        item[1].num = 3
        this.setData({
          item
        })
        this.sum()
        break;
      case '送到楼下':
        item[1].num = 2
        this.setData({
          item
        })
        this.sum()
        break;
      case '加急':
        let num = this.data.originPrice
        item[0].num = num * 0.5 + num + item[1].num
        this.setData({
          item
        })
        break;
      case '不加急':
        item[0].num = this.data.originPrice + item[1].num
        this.setData({
          item
        })
        break;
      default:
        console.log("不需要运算")
        break;
    }
  },
  selectAddres() {
    wx.navigateTo({
      url: '/common/address/address',
    })
  },
  handleStoreItem(name, address) {
     let item = this.data.item
     item[2].str = name || '暂无' // 店铺名称
     item[3].str = address || '暂无' // 店铺地址
     this.setData({
       item
     })
  },
  showmessage() {
    // 用户协议
    this.setData({
      flag: !this.data.flag
    })
  },
  // 获取用户协议
  getAmentUser() {
    GetAgreeAment({type: 1}).then(res => {
      this.setData({
        nodes: res.data
      })
    })
  }
})