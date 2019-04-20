// pages/courseHandouts/courseHandouts.js 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: app.globalData.courseTitle
    })
    var text = app.globalData.courseHandouts;
    console.log(text)
    this.setData({
      article:text
    })
  },
})