// pages/textualAssistant/textualAssistant.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    NewsList:[],
    textRecord:{},
    isShow: false,
    isplay: app.globalData.isplay,
    historyRecord:{},
    showLogin: false
  },
  getKey: function (e) {
    console.log(e)
    this.setData({
      showLogin: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 登录
    console.log(options)
    if (options.pid){
      common.getLogin(this, 'textualAssistant')
    }
    const t = this;
    // 获取资讯列表
    common.nRequest(
      getApp().data.services + "api/news/news",
      { page: 1, per_page: 5 },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res)
          t.setData({
            NewsList: res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
    
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
    var t = this;
    t.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
    wx.removeStorage({key: 'zhuanyeid'})
    wx.removeStorage({ key: 'zhiyeid' })
    // 获取用户查询记录
    common.nRequest(
      getApp().data.services + "api/cert/getsearchrecords",
      {},
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res)
          t.setData({
            textRecord: res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
    // [记录]获取证书查询记录
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        common.nRequest(
          getApp().data.services + "/api/cert/getsearchcertrecords",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              t.setData({
                historyRecord: res.data.data
              })
              if (res.data.data.length >= 1) {
                app.globalData.testRecord = true
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

      }
    })
  },
  // 测试
  textFun:function(){
    wx.navigateTo({
      url: '../textualAssistant_step/textualAssistant_step'
    })
  },
  // 链接到相关动态详情
  linkNewsDetails:function(e){
    // wx.setStorage({
    //   key: "newsId",
    //   data: e.currentTarget.dataset.id
    // })
    wx.navigateTo({
      url: '../newsDetails/newsDetails?id=' + e.currentTarget.dataset.id
    })
  },
  // 
  urlLinkrecord:function(){
    getApp().globalData.recordNav = '2';
    wx.switchTab({
      url: '../record/record'
    })

    // console.log("000")
    // wx.navigateTo({
    //   url: '../record/record'
    // })
  }
})