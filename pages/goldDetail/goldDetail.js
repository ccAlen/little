// pages/goldDetail/goldDetail.js
const app = getApp();
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goldList:[],
    isShow: false,
    isplay: app.globalData.isplay
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    // 获取金币记录
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        common.nRequest(
          app.data.services + "api/user/getcoinlogs",
          { page: 1, per_page: 1000 },
          function (res) {
            if (app.data.Reg.test(res.statusCode)) {
              // console.log(res)
              t.setData({
                goldList:res.data.data
              })
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
        
      }
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})