// pages/aiInterviewer/aiInterviewer.js  
const app = getApp()
var common = require("../../utils/util.js"); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay,
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.pid) {
      common.getLogin(this, 'aiInterviewer')
    }
  },
  getKey: function (e) {
    this.setData({
      showLogin: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
  },
  goInterviewer:function(){
    var t = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.navigateTo({
          url: '../aiPost/aiPost',
        })
      },
      fail:function(){
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'aiPost')
      }
    })
  },
  aiIndex:function(){
    // wx.redirectTo({
    //   url: '../aiInterviewer/aiInterviewer',
    // })
  },
  aiQuestions: function () {
    wx.redirectTo({
      url: '../aiCommonQuestions/aiCommonQuestions',
    })
  },
  aiRecord: function () {
    var t = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.redirectTo({
          url: '../aiRecord/aiRecord',
        })
      },
      fail:function(){
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'aiRecord')
      }
    })
  }
})