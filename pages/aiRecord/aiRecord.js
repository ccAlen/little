// pages/aiRecord/aiRecord.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay,
    recordsList:[],
    isshowban:true,
    countprofileintegrity:{}
  },
  closebanner:function(){
    this.setData({
      isshowban: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    wx.getStorage({
      key: 'token',
      success: function(_token) {
        // 获取面试记录列表
        common.nRequest(
          getApp().data.services + "api/interview/getinterviewrecords",
          {

          },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              if(res.data.data){
                t.setData({
                  recordsList:res.data.data
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
        // 计算用户资料完整度
        common.nRequest(
          getApp().data.services + "api/user/countprofileintegrity",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              if (res.data.data) {
                t.setData({
                  countprofileintegrity: res.data.data
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
      fail:function(){
        wx.showToast({
          title: '必须授权登录后才有面试记录哟~',
          icon: 'none',
          duration: 2000
        })
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

  aiIndex: function () {
    wx.redirectTo({
      url: '../aiInterviewer/aiInterviewer',
    })
  },
  aiQuestions: function () {
    wx.redirectTo({
      url: '../aiCommonQuestions/aiCommonQuestions',
    })
  },
  aiRecord: function () {
    // wx.redirectTo({
    //   url: '../aiRecord/aiRecord',
    // })
  }
})