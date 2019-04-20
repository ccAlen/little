// pages/center/center.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    sign:false,//签到
    token:'',
    isShow:false,
    isplay: app.globalData.isplay,
    showLogin: false
  },
  getKey: function (e) {
    console.log(e)
    this.setData({
      showLogin: e.detail
    })
  },
  
  // 组件事件
  onReady: function () {
    //获得dialog组件
    // this.dialog = this.selectComponent("#dialog");
    // this.radio = this.selectComponent("#radio");
    wx.setStorage({
      key: 'loginedLink',
      data: 'center',
    })  
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var t = this;
    // common.getLogin(this)
    t.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
    // 获取token
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        t.setData({
          token:_token.data
        })
        // 获取用户信息
        common.nRequest(
          getApp().data.services + "api/user/getdetail",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              if (res.statusCode == app.data.status.s201){
                // console.log("用户信息")
                // console.log(res.data.data)
                t.setData({
                  userInfo:res.data.data,
                  sign: res.data.data.has_signed == 1 ? true : false
                })
                wx.setStorage({
                  key: 'userInfo',
                  data: res.data.data,
                })
              }
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
          function () {
            console.log('系统错误')
          }
        );
      },
      fail: function () {
        // 弹出弹框让用户授权
        
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 点击编辑
  editFun:function(){
    var t = this;
    // 判断用户有没有注册
    wx.getStorage({
      key: 'token',
      success: function (res) {//已授权
        wx.navigateTo({
          url: '../editMaterial/editMaterial'
        })
      },
      fail: function () {//未授权
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'editMaterial')
      }
    })
  },
  // 点击提醒
  tipsLink:function(){
    var t = this;
    // 判断用户有没有注册
    wx.getStorage({
      key: 'token',
      success: function (res) {//已授权
        wx.navigateTo({
          url: '../tipsList/tipsList',
        })
      },
      fail: function () {//未授权
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'tipsList')
      }
    })
  },
  // 反馈建议
  suggestionLink:function(){
    wx.navigateTo({
      url: '../feedbackSuggestion/feedbackSuggestion',
    })
  },
  // 金币明细
  goldDetailLink:function(){
    var t = this;
    // 判断用户有没有注册
    wx.getStorage({
      key: 'token',
      success: function (res) {//已授权
        wx.navigateTo({
          url: '../goldDetail/goldDetail',
        })
      },
      fail: function () {//未授权
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'goldDetail')
      }
    })
  },
  // 我的礼券
  myGiftVoucherLink:function(){
    var t = this;
    // 判断用户有没有注册
    wx.getStorage({
      key: 'token',
      success: function (res) {//已授权
        wx.navigateTo({
          url: '../myGiftVoucher/myGiftVoucher',
        })
      },
      fail: function () {//未授权
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'myGiftVoucher')
      }
    })
    
  },
  // 签到
  signIn:function(){
    const t = this;
    // 判断用户有没有注册
    wx.getStorage({
      key: 'token',
      success: function (res) {//已授权
        if (t.data.sign == true) {
          wx.showToast({
            title: '今日已签到',
            icon: 'none',
            duration: 2000
          })
          return;
        } else {
          common.nRequest(
            getApp().data.services + "api/user/sign",
            {},
            function (res) {
              if (res.statusCode == app.data.status.s203) {
                wx.showToast({
                  title: '签到成功',
                  icon: 'none',
                  duration: 2000
                })
                t.setData({
                  sign: true
                })
              } else if (res.statusCode == app.data.status.s402) {
                wx.showToast({
                  title: '今日已签到',
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '签到失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            "post",
            { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
            function () {
              console.log('系统错误')
            }
          );
        }
      },
      fail: function () {//未授权
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'center')
      }
    })
  },
  onShareAppMessage: function (res) {
    var t = this;
    return {
      title: '猩职场',
      path: '/pages/index/index',
      success(e) {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail(e) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})