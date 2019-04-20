// pages/newsList/newsList.js
var common = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay,
    hotNewsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var t = this;
    // 获取资讯列表
    common.nRequest(
      getApp().data.services + "api/news/news", {
        is_recommend: '0',
        is_hot:'0',
      },
      function(res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res)
          t.setData({
            hotNewsList:res.data.data
          })
        }
      },
      "post", {
        'content-type': 'application/x-www-form-urlencoded'
      },
      function() {
        console.log('系统错误')
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})