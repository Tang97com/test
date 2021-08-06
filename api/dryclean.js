import request from './http'
const devurl = 'http://localhost:3000'
const prdurl = ''

export function testAPi(data) {
	return request({
		url: `${devurl}/api/user/test`,
		method: 'GET',
		data
	})
}

// https://www.fastmock.site/mock/2995ae7394e97a683c9fd1dba9944533/api/dryclean/store