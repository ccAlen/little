// pages/myGiftVoucher/myGiftVoucher.js 
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _index:'0',
    isShow: false,
    isplay: app.globalData.isplay,
    couponsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    // 获取未使用的优惠券
    wx.getStorage({
      key: 'token',
      success: function(_token) {
        common.nRequest(
          getApp().data.services + "api/coupon/getcoupons",
          { is_used: '0', per_page: '1000', page:'1' },
          function (res) {
            // console.log(res)
            if (getApp().data.Reg.test(res.statusCode)) {
              var _couponsList = res.data.data;
              if(_couponsList.length > 0){
                for(var i = 0; i < _couponsList.length; i++){
                  _couponsList[i].coupon_value = parseInt(_couponsList[i].coupon_value)
                  _couponsList[i].effective_time = /\d{4}-\d{1,2}-\d{1,2}/g.exec(_couponsList[i].effective_time)
                  _couponsList[i].failure_time = /\d{4}-\d{1,2}-\d{1,2}/g.exec(_couponsList[i].failure_time)
                }
              }
              t.setData({
                couponsList: _couponsList
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
      fail:function(){
        wx.showToast({
          title: '你还没授权哟，赶快去授权吧',
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
  navSelectFun:function(e){
    // console.log(e.currentTarget.dataset.index)
    var t = this;
    t.setData({
      _index: e.currentTarget.dataset.index
    })
    // 获取优惠券
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        common.nRequest(
          getApp().data.services + "api/coupon/getcoupons",
          { is_used: e.currentTarget.dataset.index, per_page: '1000' },
          function (res) {
            // console.log(res)
            if (getApp().data.Reg.test(res.statusCode)) {
              var _couponsList = res.data.data;
              if (_couponsList.length > 0) {
                for (var i = 0; i < _couponsList.length; i++) {
                  _couponsList[i].coupon_value = parseInt(_couponsList[i].coupon_value)
                }
              }
              t.setData({
                couponsList: _couponsList
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
        wx.showToast({
          title: '你还没授权哟，赶快去授权吧',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})