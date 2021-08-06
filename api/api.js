import request from './http'
const devurl = 'http://localhost:3000'
const prdurl = 'https://sa.scyxk.top'
const testurl = 'http://sa.scyxk.top'
const mockurl = 'https://www.fastmock.site/mock/2995ae7394e97a683c9fd1dba9944533'

// 入驻分类
export function GetRange() {
	return GetRequest(`${prdurl}/api/index/GetRange`)
}

// 美食搜索
export function FoodSeach(data) {
	return GetRequest(`${prdurl}/api/user/FoodSearch`, data)
}

// 房间详情
export function RoomDetail(data) {
	return GetRequest(`${prdurl}/api/user/RoomDetails`, data)
}

// 获取酒店房间库存开关
export function HotelCapacity(data) {
	return PostRequest(`${prdurl}/api/shop/isroom`,data)
}

// 获取酒店用户订单
export function HotelUserOrder(data) {
	return GetRequest(`${prdurl}/api/shop/hotel_list`,data)
}

// 获取酒店房间储量
export function HotelRoomCapacity() {
	return GetRequest(`${prdurl}/api/shop/hotel_isroom`)
}

// 获取酒店订单
export function HotelOrder(data) {
	return PostRequest(`${prdurl}/api/user/hotel_list`,data)
}

// 获取酒店房间
export function HotelRoom(data) {
	return PostRequest(`${prdurl}/api/shop/hoteldel`,data)
}

export function UserHotelRoom(data) {
	return GetRequest(`${prdurl}/api/user/hoteltype`, data)
}

export function UserHotelRoom1(data) {
	return GetRequest(`${prdurl}/api/user/hoteltype1`, data)
}

// 酒店搜索
export function HotelSearch(data) {
	return PostRequest(`${prdurl}/api/user/likehotel`,data)
}

// 批量上传
// 获取打印店铺  
export function startPlUpload(data) {
  return PostRequest(`${prdurl}/api/attachment/batch_file`, data)
}

// 获取打印店铺  
export function printStore(data) {
  return PostRequest(`${prdurl}/api/shop/Print_show`, data)
}

// 打印店铺入驻
export function prentCheckIn(data) {
  return PostRequest(`${prdurl}/api/shop/check_ing`, data)
}

function PostRequest(url, data) {
	return request({
		url,
		method: 'POST',
		data
	})
}

function GetRequest(url, data) {
  return request({
		url,
		method: 'GET',
		data
	})
}

// 提现
export function Withdrawal(data) {
	return request({
		url: `${prdurl}/api/index/with_money`,
		method: 'POST',	
		data
	})
}
// 配送员取单
export function Marikconfirmpick(data) {
	return request({
		url: `${prdurl}/api/dstb/confirmpick`,
		method: 'POST',	
		data
	})
}
// 小程序配置信息
export function watchProgress(data) {
	return request({
		url: `${prdurl}/api/user/jindu`,
		method: 'POST',	
		data
	})
}

// 小程序配置信息
export function getConfig(data) {
	return request({
		url: `${prdurl}/api/index/config`,
		method: 'POST',	
		data
	})
}

// 配送协议
export function GetAgreeAment(data) {
	return request({
		url: `${prdurl}/api/index/get_agreement`,
		method: 'POST',	
		data
	})
}
// 下单 
export function PlaceOrder(data) {
	return request({
		url: `${prdurl}/api/user/add_order`,
		method: 'POST',	
		data
	})
}
// 用户确认订单完成  
export function userConfirmOrder(data) {
	return request({
		url: `${prdurl}/api/user/complete`,
		method: 'GET',	
		data
	})
}
// 商家入驻  
export function StoreRegister(data) {
	return request({
		url: `${prdurl}/api/shop/business_ing`,
		method: 'POST',	
		data
	})
}
// 商家接单  
export function StoreReceveOrder1(data) {
	return request({
		url: `${prdurl}/api/shop/receiving_horder`,
		method: 'GET',	
		data
	})
}

export function StoreReceveOrder(data) {
	return request({
		url: `${prdurl}/api/shop/receiving_order`,
		method: 'GET',	
		data
	})
}

// 商家完成订单  
export function NoStoreCleanOVer(data) {
	return request({
		url: `${prdurl}/api/shop/Nocomplet`,
		method: 'GET',	
		data
	})
}

// 商家清洗完成  
export function StoreCleanOVer(data) {
	return request({
		url: `${prdurl}/api/shop/complete`,
		method: 'GET',	
		data
	})
}
// 配送员配送完成 
export function Marikdelivered(data) {
	return request({
		url: `${prdurl}/api/dstb/complete`,
		method: 'GET',	
		data
	})
}
// 用户退单
export function userOrderBack(data) {
	return request({
		url: `${prdurl}/api/user/cancel_order`,
		method: 'POST',	
		data
	})
}
// 配送员取消订单 order_number orderid  id
export function MarikOrderBack(data) {
	return request({
		url: `${prdurl}/api/dstb/marikback`,
		method: 'POST',	
		data
	})
}
// 配送员接单  idf--user marik store--
export function MarikreceOrder(data) {
	return request({
		url: `${prdurl}/api/dstb/receiving_order`,
		method: 'POST',	
		data
	})
}
// 获取商家订单 
export function StoreOrder(data) {
	return request({
		url: `${prdurl}/api/shop/order_list`,
		method: 'POST',	
		data
	})
}
// 获取用户订单
export function UserOrder(data) {
	return request({
		url: `${prdurl}/api/user/order_list`,
		method: 'POST',	
		data
	})
}
//
export function Hotel_order(data) {
	return request({
		url: `${prdurl}/api/user/hotel_list`,
		method: 'POST',	
		data
	})
}
// 修改用户地址 
export function editAddress(data) {
	return request({
		url: `${prdurl}/api/index/update_address`,
		method: 'POST',	
		data
	})
}
// 设置默认的地址
export function DefaultAddress(data) {
	return request({
		url: `${prdurl}/api/index/default_address`,
		method: 'GET',	
		data
	})
}
// 删除用户地址
export function DelecteAddress(data) {
	return request({
		url: `${prdurl}/api/index/delete_address`,
		method: 'GET',	
		data
	})
}
// 添加地址
export function addAddres(data) {
	return request({
		url: `${prdurl}/api/index/address`,
		method: 'POST',
		data
	})
}
// 获取用户的收货地址 
export function getUserAddress(data) {
	return request({
		url: `${prdurl}/api/index/show_address`,
		method: 'GET',	
		data
	})
}
// 申请成为配送员 注册 
export function registerMarik(data) {
	return request({
		url: `${prdurl}/api/index/marikreg`,
		method: 'POST',
		data
	})
}
// 投诉建议 
export function offerAdvice(data) {
	return request({
		url: `${prdurl}/api/index/advice`,
		method: 'POST',
		data
	})
}
// 配送大厅
export function getMarikHall(data) {
	return request({
		url: `${prdurl}/api/dstb/Hall`,
		method: 'POST',
		data
	})
}
export function getMarikHallall(data) {
	return request({
		url: `${prdurl}/api/dstb/Hall_all`,
		method: 'POST',
		data
	})
}
export function getmslist_shop(data) {
	return request({
		url: `${prdurl}/api/user/SeeFshop`,
		method: 'POST',
		data
	})
}
// 配送员订单 参数 data {  1：待接单 2：待送  3：已完成。 4：全部}  id：配送员Id
export function getMarikOrder(data) {
	return request({
		url: `${prdurl}/api/dstb/order_list`,
		method: 'POST',
		data
	})
}
// 配送员订单 参数 data {  1：待接单 2：待送  3：已完成。 4：全部}  id：配送员Id
export function getmsOrdrlist(data) {
	return request({
		url: `${prdurl}/api/user/foodlist`,
		method: 'POST',
		data
	})
}
export function getsmsOrdrlist(data) {
	return request({
		url: `${prdurl}/api/shop/foodlist`,
		method: 'POST',
		data
	})
}
export function getmsMarikOrder(data) {
	return request({
		url: `${prdurl}/api/dstb/order_mslist`,
		method: 'POST',
		data
	})
}
// 获取金额
export function getMoney(data) {
	return request({
		url: `${prdurl}/api/shop/money`,
		method: 'POST',
		data
	})
}
// 获取店铺菜单分类的接口  参数 店铺ID
export function getStoreMenu(data) {
	return request({
		url: `${prdurl}/api/shop/storemenu`,
		method: 'GET',
		data
	})
}
export function getshopinfo(data) {
	return request({
		url: `${prdurl}/api/user/SeeShop`,
		method: 'GET',
		data
	})
}
export function GetFoodType(data) {
	return request({
		url: `${prdurl}/api/user/GetFoodType`,
		method: 'GET',
		data
	})
}
export function gethotms(data) {
	return request({
		url: `${prdurl}/api/user/FoodHot`,
		method: 'GET',
		data
	})
}
export function getRcommend(data) {
	return request({
		url: `${prdurl}/api/user/FoodRcommend`,
		method: 'GET',
		data
	})
}
// 获取轮播图 参数 小程序type值
export function getSwiperImg(data) {
	return request({
		url: `${prdurl}/api/index/get_rotation`,
		method: 'GET',
		data
	})
}
//  获取店铺数据 参数 店铺ID storeid || type 
export function getStoreData(data) {
	return request({
		url: `${prdurl}/api/shop/storedata`,
		method: 'POST',
		data
	})
}
//  获取店铺数量 参数
export function getStore(data) {
	return request({
		url: `${prdurl}/api/shop/shop_name`,
		method: 'GET',
		data
	})
}
// 接口测试 获取学校 参数 lag, lng 经纬度
export function getSchool(data) {
	return request({
		url: `${prdurl}/api/index/getschool`,
		method: 'GET',
		data
	})
}
// 登陆接口
export function login(data) {
	return request({
		url: `${prdurl}/api/login`,
		method: 'POST',
		data
	})
}
// 用户授权存储用户头像，昵称
export function getuserInfo(data) {
	return request({
		url: `${prdurl}/api/index/updateUser`,
		method: 'POST',
		data
	})
}