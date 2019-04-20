// pages/order/order.js 
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay,
    courseInfo:{},
    couponsList:[],
    count:0,
    token:'',
    checkedId:'',
    showGetPhone:false,
    userInfo:{},
    showLogin: false,
    updatebindmobile:false
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    var t = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    t.setData({
      showGetPhone: false
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          if (e.detail.iv) {//允许获取手机号
            // 获取用户手机
            common.nRequest(
              getApp().data.services + "api/user/getmobile",
              {
                code:res.code,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData
              },
              function (phoneNum) {
                console.log(phoneNum)
                if (getApp().data.Reg.test(phoneNum.statusCode)) {
                  console.log(phoneNum.data.data.phoneNumber)
                  // 获取到手机号后，请求更新用户信息接口存储手机号
                  common.nRequest(
                    getApp().data.services + "api/user/updateuser",
                    {
                      mobile: phoneNum.data.data.phoneNumber
                    },
                    function (res) {
                      console.log(res)
                      if (res.statusCode == app.data.status.s402) {
                        var _userInfo = t.data.userInfo;
                        _userInfo.mobile = phoneNum.data.data.phoneNumber;
                        wx.setStorage({
                          key: 'userInfo',
                          data: _userInfo,
                        })
                        console.log(t.data.updatebindmobile)
                        if (t.data.updatebindmobile){
                          console.log(t.data.updatebindmobile)
                          // 更新手机绑定状态
                          common.nRequest(
                            getApp().data.services + "api/distribute/updatebindmobile",
                            {},
                            function (res) {
                              console.log(res)
                              t.goBack(t.data.courseInfo.id, true)
                            },
                            "post",
                            { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
                            function () {
                              console.log('系统错误')
                            }
                          );
                        }else{
                          t.goBack(t.data.courseInfo.id, true)
                        }
                        
                      }
                    },
                    "post",
                    { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
                    function () {
                      console.log('系统错误')
                    }
                  );
                }
              },
              "post",
              { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
              function () {
                console.log('系统错误')
              }
            );
          } else {//拒绝获取手机号
            t.setData({
              showGetPhone: false
            })
            // wx.redirectTo({
            //   url: '../courseDetails/courseDetails?courseid=' + t.data.courseInfo.id
            // })
            // wx.navigateBack({//返回
            //   courseid: t.data.courseInfo.id
            // })
            t.goBack(t.data.courseInfo.id, true)
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
 
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    var _couponsList = this.data.couponsList;
    // _couponsList[0].checked = 'true';
    for (var i = 0; i < _couponsList.length; i++){
      if (_couponsList[i].user_coupon_id == e.detail.value){
        this.setData({
          count: (parseFloat(this.data.courseInfo.current_price) - parseFloat(_couponsList[i].coupon_value)).toFixed(2),
          checkedId: e.detail.value
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    wx.getStorage({
      key: 'purchaseCourseInfo',
      success: function (_purchaseCourseInfo) {
        t.setData({
          courseInfo: _purchaseCourseInfo.data
        })
        if (_purchaseCourseInfo.data.charge_mode == 1){//该课程是免费课程，金额显示0，不显示优惠信息
          t.setData({
            count: 0.00
          })
        } else {//该课程是收费费课程
          wx.getStorage({
            key: 'token',
            success: function (_token) {
              t.setData({
                token: _token.data
              })
              if (_purchaseCourseInfo.data.can_use_coupon == 1) {//可添加优惠券
                // 请求可用优惠
                common.nRequest(
                  getApp().data.services + "api/coupon/getcoupons",
                  {
                    is_used: '0',
                    course_id: _purchaseCourseInfo.data.id
                  },
                  function (res) {
                    if (getApp().data.Reg.test(res.statusCode)) {
                      // console.log(res)
                      if (res.data.data.length > 0) {//有可用优惠券
                        var _couponsList = res.data.data;
                        _couponsList[0].checked = 'true';
                        t.setData({
                          couponsList: _couponsList,
                          count: (parseFloat(_purchaseCourseInfo.data.current_price) - parseFloat(_couponsList[0].coupon_value)).toFixed(2),
                          checkedId: _couponsList[0].user_coupon_id
                        })
                      } else {//无可用优惠券
                        t.setData({
                          count: (parseFloat(_purchaseCourseInfo.data.current_price)).toFixed(2)
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
              } else {//不可用优惠券
                t.setData({
                  count: (parseFloat(_purchaseCourseInfo.data.current_price)).toFixed(2)
                })
              }
            },
            fail:function(){
              // 弹出弹框让用户授权
              t.setData({
                showLogin: true
              })
              wx.setStorageSync('loginedLink', 'order')
            }
          })
        }
      },
      fail:function(){
        wx.showModal({
          title: '提示',
          content: '没有获取到可用的商品信息，请返回上一页重新下单',
          showCancel:false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  goBack: function (_courseid,_back){
    let pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    prevPage.setData({
      courseId: _courseid,
      isback: _back
    })  //以上就是我回到上个页面所要携带的所有参数  如果我们用navigateTo来跳转的话 试想一下 那个跳转地址会写多长
    wx.navigateBack({
      delta: 1,
    }) //回到上一个页面  仅适用于用navigateTo跳转过来的页面
  },
  getKey: function (e) {
    console.log(e)
    this.setData({
      showLogin: e.detail
    })
  },
// 去支付
  goPayFun:function(){
    var t = this;
    // 获取token
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        common.nRequest(
          getApp().data.services + "api/consume/addorder",
          { id: t.data.courseInfo.id, coupon_id: t.data.checkedId },
          function (res) {
            console.log("这里这里")
            console.log(res)
            if (res.statusCode == app.data.status.s402) {
              wx.showModal({
                title: '提示',
                // content: typeof (res.data.message) == Object ? res.data.message[0] : res.data.message,
                content: res.data.message,
                showCancel: false,
                success: function (res) {
                  t.goBack(t.data.courseInfo.id, true)
                  // // 获取用户信息
                  // t.getuserInfo()
                }
              })
            } else if (getApp().data.Reg.test(res.statusCode)) {
              if (res.data.data) {
                console.log(res.data.data)
                wx.requestPayment({
                  'timeStamp': res.data.data.payload.timeStamp,
                  'nonceStr': res.data.data.payload.nonceStr,
                  'package': res.data.data.payload.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.payload.paySign,
                  'success': function (paydata) {
                   
                    // 购买成功，判断有没有授权过手机号，如果没有，弹出授权获取手机号的弹框
                    // 获取用户信息
                    t.getuserInfo()
                    if (res.data.data.distributor_id != 0){
                      t.setData({
                        updatebindmobile:true
                      })
                    }else{
                      t.setData({
                        updatebindmobile: false
                      })
                    }
                  },
                  'fail': function (res) {
                    console.log('购买失败,返回重新下单')
                    console.log(res)
                    wx.showModal({
                      title: '提示',
                      content: '购买失败,返回重新下单',
                      showCancel: false,
                      success: function (res) {
                        wx.navigateBack()
                      }
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '购买数据有误',
                  icon: 'none',
                  duration: 2000
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
      fail: function () {
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'order')
      }
    })
  },
  showDialog() {
    this.dialog.showDialog();
  },
  // 获取用户信息，看有没有授权过手机号
  getuserInfo:function(){
    // console.log("进来授权了")
    var t = this;
    common.nRequest(
      getApp().data.services + "api/user/getdetail",
      {},
      function (res) {
        console.log(res)
        if (getApp().data.Reg.test(res.statusCode)) {
          t.setData({
            userInfo: res.data.data
          })
          // console.log(res.data.data)
          if (!res.data.data.mobile) {
            t.setData({
              showGetPhone: true
            })
          } else {
            // 曾经有授权过手机号，直接跳转回课程详情页
            t.goBack(t.data.courseInfo.id, true)
          }
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
      function () {
        console.log('系统错误')
      }
    );
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

})