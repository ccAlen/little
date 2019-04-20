// pages/occupationEvaluation/occupationEvaluation.js 
import chartWrap from '../../utils/canvas/chartWrap'
import getConfig from './getConfig'
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let pageThis = this
    app.deviceInfo.then(function (deviceInfo) {
      console.log('设备信息', deviceInfo)
      let width = Math.floor(deviceInfo.windowWidth - (deviceInfo.windowWidth / 750) * 10 * 2)//canvas宽度
      let height = Math.floor(width / 1.6)//这个项目canvas的width/height为1.6
      let canvasId = 'myCanvas'
      let canvasConfig = {
        width: width,
        height: height,
        id: canvasId
      }
      let config = getConfig(canvasConfig)
      chartWrap.bind(pageThis)(config)

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