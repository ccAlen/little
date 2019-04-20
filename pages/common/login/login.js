const app = getApp();
var common = require("../../../utils/util.js");
Component({
  properties: {
    // // 这里定义了innerText属性，属性值可以在组件使用时指定
    showGetPhone: {
      type: Object,// 类型（必填）
      value: '', // 属性值 （可选）
      observer: function (newVal, oldVal) {  //  属性被改变时执行的函数（可选）,可以监听外部值的改变，从而进行对应操作
      }
    }
  },
  data: {
    // 这里是一些组件内部数据 
    showLogin: false,
    value:false,
    showGetPhone:false
    // showGetPhone: false
  },
  // attached: function () {
  //   // 将外部传入的值复制给value，当然也可以直接使用key值
  //   this.setData({
  //     value: this.data.key
  //   })
  // },
  ready:function(){
    var t = this;
    console.log(app.globalData)
    console.log(app.globalData.showLogin)
    t.setData({
      showLogin: app.globalData.showLogin
    })
    t.setData({
      showGetPhone: true
    })
  },
  methods: {
    // 获取getphone组件的值
    // getPhone: function (e) {
    //   console.log(e)
    //   this.setData({
    //     showGetPhone: e.detail
    //   })
    // },
    // 获取用户信息
    onGotUserInfo:function(){
      var t = this;
      t.triggerEvent('getKey', t.data.value)
      t.setData({
        showLogin:false
      })
      wx.getSetting({
        success: res => {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                t.setData({
                  showLogin: false
                })
                console.log(res)
                // 把获取到的用户信息存到缓存
                wx.setStorage({
                  key: "userInfo",
                  data: res
                })
                // 可以将 res 发送给后台解码出 unionId
                // 登录
                wx.login({
                  success: _code => {
                    console.log(_code)
                    // 请求注册接口
                    wx.getStorage({
                      key: 'options',
                      complete: function (options) {
                        console.log(options)
                        // 判断是否分销商进来66666666666666666666这里这里
                        wx.getStorage({
                          key: 'codeType',
                          success: function (_codeType) {
                            console.log(_codeType)
                            if (_codeType.data == '2') {//如果是分销商进来,弹出授权过手机号弹框
                              console.log("login页面判断是分享进来")
                              t.setData({
                                showGetPhone: true
                              })
                              common.nRequest(
                                getApp().data.services + "api/register",
                                {
                                  code: _code.code,
                                  iv: res.iv,
                                  encryptedData: res.encryptedData,
                                },
                                function (res) {
                                  if (getApp().data.Reg.test(res.statusCode)) {
                                    // 获取到用户token,存到缓存
                                    getApp().globalData.token = res.data.data.token;
                                    wx.setStorageSync('token', res.data.data.token)
                                    t.setData({
                                      showLogin: false
                                    })

                                    // 跳转到对应的页面
                                    wx.getStorage({
                                      key: 'loginedLink',
                                      success: function (_loginedLink) {
                                        if (_loginedLink.data == 'courseDetails') {
                                          console.log("1")
                                          wx.redirectTo({
                                            url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                          })
                                        } else if (_loginedLink.data == 'fenxiao') {
                                          console.log("分销")
                                          // 获取用户信息
                                          common.nRequest(
                                            getApp().data.services + "api/user/getdetail",
                                            {},
                                            function (res) {
                                              if (getApp().data.Reg.test(res.statusCode)) {
                                                console.log(res.data.data.mobile)
                                                // 
                                                wx.setStorageSync('loginedLink', 'fenxiao')
                                                if (res.data.data.mobile == null) {
                                                  console.log("pppppppppp")
                                                  // t.triggerEvent('getPhone', true)
                                                  t.setData({
                                                    showGetPhone: true
                                                  })
                                                  console.log(t.data.showGetPhone)
                                                } else {
                                                  // 曾经有授权过手机号
                                                  t.setData({
                                                    showGetPhone: false
                                                  })
                                                  // t.triggerEvent('getPhone', false)
                                                  console.log("sssssssssss")
                                                }
                                              }
                                            },
                                            "post",
                                            { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + res.data.data.token },
                                            function () {
                                              console.log('系统错误')
                                            }
                                          )
                                        } else {
                                          console.log("2")
                                          wx.redirectTo({
                                            url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                          })
                                        }
                                      },
                                    })
                                    console.log(res.data.data.token)
                                  }
                                },
                                "post",
                                { 'content-type': 'application/x-www-form-urlencoded' },
                                function () {
                                  console.log('系统错误')
                                }
                              );
                            } else {//不是分销商进来
                              if (getApp().globalData.normalCode){
                                t.setData({
                                  showGetPhone: true
                                })
                              }
                              common.nRequest(
                                getApp().data.services + "api/register",
                                {
                                  code: _code.code,
                                  iv: res.iv,
                                  encryptedData: res.encryptedData,
                                  pid: options.data.query.pid ? options.data.query.pid : ''//二维码中的推广id
                                },
                                function (res) {
                                  if (getApp().data.Reg.test(res.statusCode)) {
                                    // 获取到用户token,存到缓存
                                    getApp().globalData.token = res.data.data.token;
                                    wx.setStorageSync('token', res.data.data.token)
                                    t.setData({
                                      showLogin: false
                                    })

                                    // 跳转到对应的页面
                                    wx.getStorage({
                                      key: 'loginedLink',
                                      success: function (_loginedLink) {
                                        if (_loginedLink.data == 'courseDetails') {
                                          console.log("1")
                                          wx.redirectTo({
                                            url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                          })
                                        } else if (_loginedLink.data == 'fenxiao') {
                                          console.log("分销")
                                          // 获取用户信息
                                          common.nRequest(
                                            getApp().data.services + "api/user/getdetail",
                                            {},
                                            function (res) {
                                              if (getApp().data.Reg.test(res.statusCode)) {
                                                console.log(res.data.data.mobile)
                                                // 
                                                wx.setStorageSync('loginedLink', 'fenxiao')
                                                if (res.data.data.mobile == null) {
                                                  console.log("pppppppppp")
                                                  // t.triggerEvent('getPhone', true)
                                                  t.setData({
                                                    showGetPhone: true
                                                  })
                                                  console.log(t.data.showGetPhone)
                                                } else {
                                                  // 曾经有授权过手机号
                                                  t.setData({
                                                    showGetPhone: false
                                                  })
                                                  // t.triggerEvent('getPhone', false)
                                                  console.log("sssssssssss")
                                                }
                                              }
                                            },
                                            "post",
                                            { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + res.data.data.token },
                                            function () {
                                              console.log('系统错误')
                                            }
                                          )
                                        } else {
                                          console.log("2")
                                          wx.navigateTo({
                                            url: '../' + _loginedLink.data + '/' + _loginedLink.data,
                                          })
                                        }
                                      },
                                    })
                                    console.log(res.data.data.token)
                                  }
                                },
                                "post",
                                { 'content-type': 'application/x-www-form-urlencoded' },
                                function () {
                                  console.log('系统错误')
                                }
                              );
                            }
                          },
                        })
                      },
                    })
                  }
                })
                
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (t.userInfoReadyCallback) {
                  t.userInfoReadyCallback(res)
                }
              },
              fail:res => {
                t.setData({
                  showGetPhone: false
                })
              }
            })
          }else{
            console.log("没有授权")
            t.setData({
              showLogin: false,
              showGetPhone: false
            })
            getApp().globalData.showLogin = false;
          }
        }
      })
    }
  }
})