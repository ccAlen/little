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
    newsDetails:'',
    //article将用来存储towxml数据
    article: {},
    iszan:false,
    token:'',
    newsId:'',
    isShow: false,
    isplay: app.globalData.isplay,
    favorites_count:0
  },
  getNewsDetails:function(_id,_token){
    var t = this;
    common.nRequest(
      getApp().data.services + "api/news/getnewsdetail",
      { id: _id },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res)
          if (res.data.data.content) {
            //html转WXML
            let wxml = app.towxml.toJson(res.data.data.content.content, 'html', t);
            t.favorites_count = res.data.data.favorites_count
            t.setData({
              article: wxml,
              newsDetails: res.data.data,
              favorites_count: res.data.data.favorites_count
            })
            if (res.data.data.has_favorite) {
              t.setData({
                iszan: true
              })
            }
          } else {
            t.setData({
              newsDetails: res.data.data
            })
            if (res.data.data.has_favorite) {
              t.setData({
                iszan: true
              })
            }
          }
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token },
      function () {
        console.log('系统错误')
      }
    );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    const t = this;
    t.setData({
      newsId: options.id
    })
    wx.getStorage({
      key: 'token',
      success: function (_token) {//用户已授权，可以知道是否点赞
        t.setData({
          token:_token.data
        })
        // 咨询详情
        t.getNewsDetails(options.id, _token.data)
      },
      fail:function(){//用户没授权，不能知道是否已点赞
        // 咨询详情
        t.getNewsDetails(options.id)
        // common.nRequest(
        //   getApp().data.services + "api/news/getnewsdetail",
        //   { id: newsId.data },
        //   function (res) {
        //     if (getApp().data.Reg.test(res.statusCode)) {
        //       // console.log(res)
        //       if (res.data.data.content) {
        //         //html转WXML
        //         let wxml = app.towxml.toJson(res.data.data.content.content);
        //         t.setData({
        //           article: wxml,
        //           newsDetails: res.data.data
        //         })
        //         // console.log(wxml)
        //       } else {
        //         t.setData({
        //           newsDetails: res.data.data
        //         })
        //       }
        //     }
        //   },
        //   "post",
        //   { 'content-type': 'application/x-www-form-urlencoded'},
        //   function () {
        //     console.log('系统错误')
        //   }
        // );
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

  zanFun:function(){
    var t = this;
    // 点赞接口
    wx.login({
      success: function (res) {
        console.log(res.code)
        common.nRequest(
          getApp().data.services + "api/favorite",
          {
            id: t.data.newsDetails.id,
            increase: !t.data.iszan ? '1' : '-1',
            favorite: 'news',
            code: res.code
          },
          function (res) {
            if (res.statusCode == app.data.status.s203) {//点赞成功
              t.favorites_count = t.favorites_count + (!t.data.iszan ? 1 : -1)
              t.setData({
                iszan: !t.data.iszan,
                favorites_count: t.favorites_count
              })
              /*wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })*/
              // 重新加载详情
              //t.getNewsDetails(t.data.newsId, t.data.token)
            }else{
              wx.showToast({
                title: res.data.message,
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
    });
  }
})