// const app = getApp()
// var common = require("../../utils/util.js");

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 封装请求方法
 * url  请求的接口地址
 * data 请求接口的数据
 * successFunc  请求成功后执行的方法
 * errorFunc    请求失败后执行的方法
 * method    默认为get
 * header    默认为{'content-type': 'application/json'}
 */

var requestNum = 0;
function nRequest(url, data, successFunc, method, header, errorFunc) {
  header = header || { 'content-type': 'application/json' };
  method = method || "get";

  // console.log(requestNum);

  requestNum++;
  if (wx.showLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  } else {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }

  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    method: method,
    data: data,
    header: header,
    success: function (res) {
      successFunc(res);
      requestNum--;
      if (requestNum == 0) {
        wx.hideLoading();
      }
    },
    error: function (err) {
      errorFunc(err);
      requestNum--;
      if (requestNum == 0) {
        wx.hideLoading();
      }
    }
  })
};
// 封装登录方法(该方法用在每次进入小程序的时候调用，更新缓存中的token)
function getLogin (_this,_url) {
  var t = _this;
  var that = this;
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      that.nRequest(
        getApp().data.services + "api/login", 
        { code: res.code },
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            console.log(res)
            if (res.data.data.state == '1') {//该用户已注册，获取token存起来
              getApp().globalData.token = res.data.data.token;
              wx.setStorageSync('token', res.data.data.token)
              // 获取token的时间
              // var tokenstarTime = new Date();
              // console.log(res.data.data.token)
              t.setData({
                showLogin: false
              })
              // 判断是否分销商进来
              wx.getStorage({
                key: 'codeType',
                success: function (_codeType) {
                  console.log(_codeType)
                  if (_codeType.data == '2'){//如果是分销商进来，判断有没有授权过手机号
                  // 获取用户信息
                    that.nRequest(
                      getApp().data.services + "api/user/getdetail",
                      {  },
                      function (res) {
                        if (getApp().data.Reg.test(res.statusCode)) {
                          console.log(res)
                          // 
                          wx.setStorageSync('loginedLink', 'fenxiao')
                          if (!res.data.data.mobile) {
                            t.setData({
                              showGetPhone: true
                            })
                          } else {
                            // 曾经有授权过手机号
                            t.setData({
                              showGetPhone: false
                            })
                          }
                        }
                      },
                      "post",
                      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + res.data.data.token },
                      function () {
                        console.log('系统错误')
                      }
                    )
                  }else{
                    t.setData({
                      showGetPhone: false
                    })
                  }
                },
              })
            } else {//该用户还没注册
              console.log("不存在该用户，去授权登录")
              // 弹出弹框让用户授权
              getApp().globalData.showLogin = true;
              t.setData({
                showLogin: true
              })
              wx.setStorageSync('loginedLink', _url)
            }
          }
        },
        "post",
        { 'content-type': 'application/x-www-form-urlencoded' },
        function () {
          console.log('系统错误')
        }
      );
    }
  })
};
// 封装请求手机号方法（该方法用于分销商）
function getPhone(_this) {
  var t = this;
  
}

module.exports = {
  formatTime: formatTime,
  nRequest: nRequest,
  getLogin: getLogin,
  getPhone: getPhone
}
