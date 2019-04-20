//index.js  
//获取应用实例
const app = getApp()
var common = require("../../utils/util.js");
Page({
  data: {
    hotNewsList:[],
    recommend:[],
    imgUrls: [],
    isShow:false,
    isplay: app.globalData.isplay,
    showLogin:false,
    page:1,
    showMore: false,
    showGetPhone: false,
    normalCode:false
    // showGetPhone:false
  },
  // 获取login组件的值
  getKey: function (e) {
    console.log(e)
    this.setData({
      showLogin: e.detail
    })
    console.log(this.data.entrytype)
    if (this.data.normalCode) {
      this.setData({
        showGetPhone: !e.detail
      })
      console.log("这里是getkey")
    }
  },
  // 获取login组件的值
  // getKey: function (e) {
  //   console.log(e)
  //   this.setData({
  //     showLogin: e.detail
  //   })
  // },
 
  onShow:function(){
    wx.login({
      success: function (res) {
        console.log(res)
      }
    });
    console.log(app.globalData.showLogin)
    console.log(app.globalData)
    // 登录
    // common.getLogin(this)
    // // 授权手机号
    // common.getPhone(this)
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay,
    })
    wx.setStorageSync('loginedLink', 'index')
  },

  onReachBottom:function(){
    console.log('下拉')
    if (this.data.page === 3) {
      return false
    }
    if (this.data.page ===2){
      this.setData({
        showMore: true
      })
    }
    this.data.page = this.data.page + 1
    this.getHomeShow({ page: this.data.page, per_page: 5});
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '猩职场'
      
    }
  },
  // 组件事件
  onReady: function () {
    //获得dialog组件
  },
 
  // 组件edd
  onLoad: function (options) {
    const t = this;
    if(options.pid){//扫码进来，弹出授权手机号弹框
      getApp().globalData.normalCode = true
      t.setData({
        normalCode:true
      })
    }else{
      getApp().globalData.normalCode = false
      t.setData({
        normalCode: false
      })
    }
    // 登录
    common.getLogin(t,'index')
    // 广告列表
    common.nRequest(
      getApp().data.services + "api/getad",
      {
        position_no:'2018001'
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res.data.data[0].ads)
          t.setData({
            imgUrls: res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
    // 热门内容列表
    common.nRequest(
      getApp().data.services + "api/news/gethotnews",
      { page: 1, per_page: 3, is_recommend:'1', is_hot:'1' },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)){
          t.setData({
            hotNewsList:res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
    // 精品推荐列表
    this.getHomeShow({ per_page:5});
  },
 
  getHomeShow:function(query){
    var t = this
    common.nRequest(
      getApp().data.services + "api/course/gethomeshow",
      query,
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res)
          if (res.data.data.length > 0) {
            var recommend = t.data.recommend;
            for (var i = 0; i < res.data.data.length; i++) {
              recommend.push(res.data.data[i])
            }
            t.setData({
              recommend: recommend
            })
          }
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },
  // 获取用户信息
  getPhoneNumber: function (e) {
    var t = this;
    t.setData({
      showGetPhone: false
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          if (e.detail.iv) { //允许获取手机号 
            // 获取用户手机
            wx.getStorage({
              key: 'token',
              success: function (_token) {
                common.nRequest(
                  getApp().data.services + "api/user/getmobile", {
                    code: res.code,
                    iv: e.detail.iv,
                    encryptedData: e.detail.encryptedData
                  },
                  function (phoneNum) {
                    console.log(phoneNum)
                    if (getApp().data.Reg.test(phoneNum.statusCode)) {
                      t.setData({
                        showGetPhone: false
                      })
                      console.log(phoneNum.data.data.phoneNumber)
                      // 获取到手机号后，请求更新用户信息接口存储手机号
                      common.nRequest(
                        getApp().data.services + "api/user/updateuser", {
                          mobile: phoneNum.data.data.phoneNumber
                        },
                        function (res) {
                          console.log(res)
                          if (res.statusCode == app.data.status.s402) {
                            wx.showToast({
                              title: '您已授权手机号',
                              icon: 'none',
                              duration: 2000
                            })
                          }
                        },
                        "post", {
                          'content-type': 'application/x-www-form-urlencoded',
                          'Authorization': 'Bearer ' + _token.data
                        },
                        function () {
                          console.log('系统错误')
                        }
                      );
                    }
                  },
                  "post", {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + _token.data
                  },
                  function () {
                    console.log('系统错误')
                  }
                );
              },
              fail: function () {
                console.log("没有token")
              }
            })
          } else { //拒绝获取手机号
            t.setData({
              showGetPhone: false
            })
            console.log("拒绝授权手机号")
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
})
