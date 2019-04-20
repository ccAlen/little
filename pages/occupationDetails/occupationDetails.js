// pages/newsDetails/newsDetails.js
// const Towxml = require('towxml');
// const towxml = new Towxml();
var common = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsDetails: '',
    //article将用来存储towxml数据
    article: {},
    iszan: false,
    isShow: false,
    isplay: app.globalData.isplay
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const t = this;
    //请求markdown文件，并转换为内容
    wx.getStorage({
      key: 'occupationId',
      success: function (newsId) {
        // 咨询详情
        common.nRequest(
          getApp().data.services + "api/prof/getprofessiondetail",
          { id: newsId.data },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              wx.setNavigationBarTitle({
                title: res.data.data.prof_name
              })
              if (res.data.data.content) {
                //html转WXML
                let wxml = app.towxml.toJson(res.data.data.content);
                t.setData({
                  article: wxml,
                  newsDetails: res.data.data
                })
                // console.log(wxml)
              } else {
                t.setData({
                  newsDetails: res.data.data
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
      fail: function (res) {
        wx.showToast({
          title: '没有获取到对应的资讯id',
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

  // zanFun: function () {
  //   var t = this;
  //   t.setData({
  //     iszan: !t.data.iszan
  //   })
  // }
})