// pages/courseDetails/courseDetails.js 
const app = getApp()
var common = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //article将用来存储towxml数据
    article: {},
    article1: {},
    courseDetails: '',
    classesNum: '',
    isPullDown: false,
    // isLogin: false,//是否显示login弹框
    isTeacher: false,
    freeClass: [], //免费试听课程id数组
    isShowmode: false, //是否显示免费试听和锁的图标
    showXianshi: false, //是否显示限时免费购买按钮
    isShow: false,
    isplay: app.globalData.isplay,
    courseId: '',
    token: '',
    _options: false,
    isFavorite: false, //是否收藏
    classList: [], //课程小节数组
    // isShareUnlock: false,//是否分享解锁
    isback: false, //这个isback就是接收的上个页面传过来的isback:true这个参数  此时你的页面data里面的isback的参数就变成了1
    showLogin: false,
    showGetPhone: false,
    entrytype: '',
    isClose: true,     //判断当前页面是打开还是返回页
    isNewUser:'0',//是否新用户
    distributor_id: '',
    course_id: '',
    imgalist: ["https://xhuser.oss-cn-shenzhen.aliyuncs.com/qrcode.jpeg", "https://xhuser.oss-cn-shenzhen.aliyuncs.com/qrcode.jpeg"]
  },
  previewImage: function (e) {
    wx.previewImage({
      current: this.data.imgalist, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })

  },
  // 获取用户信息
  getPhoneNumber: function(e) {
    var t = this;
    t.triggerEvent('getPhone', t.data.value)
    t.setData({
      showGetPhone: false
    })
    wx.login({
      success: function(res) {
        if (res.code) {
          if (e.detail.iv) { //允许获取手机号 
            // 获取用户手机
            wx.getStorage({
              key: 'token',
              success: function(_token) {
                common.nRequest(
                  getApp().data.services + "api/user/getmobile", {
                    code: res.code,
                    iv: e.detail.iv,
                    encryptedData: e.detail.encryptedData
                  },
                  function(phoneNum) {
                    console.log(phoneNum)
                    if (getApp().data.Reg.test(phoneNum.statusCode)) {
                      t.setData({
                        showGetPhone: false
                      })
                      console.log(phoneNum.data.data.phoneNumber)
                      // 获取到手机号后，请求更新用户信息接口存储手机号
                      common.nRequest(
                        getApp().data.services + "api/user/updateuser", {
                          mobile: phoneNum.data.data.phoneNumber
                        },
                        function(res) {
                          console.log(res)
                          if (res.statusCode == app.data.status.s402) {
                            wx.showToast({
                              title: '您已授权手机号',
                              icon: 'none',
                              duration: 2000
                            })
                            if (app.globalData.token) { //判断有没有受过权，授权过才绑定分销商
                              // 调取绑定分销商接口
                              common.nRequest(
                                getApp().data.services + "api/distribute/binddistributor", {
                                  distributor_id: t.data.distributor_id,
                                  course_id: t.data.course_id,
                                  is_new: t.data.isNewUser,
                                  bind_mobile: '1'
                                },
                                function (fenxiao) {
                                  console.log(fenxiao)
                                  if (fenxiao.statusCode == app.data.status.s201) {
                                    console.log("绑定分销商")
                                    console.log(fenxiao)

                                  }
                                },
                                "post", {
                                  'content-type': 'application/x-www-form-urlencoded',
                                  'Authorization': 'Bearer ' + _token.data
                                },
                                function () {
                                  console.log('系统错误')
                                }
                              );
                            }
                          }
                        },
                        "post", {
                          'content-type': 'application/x-www-form-urlencoded',
                          'Authorization': 'Bearer ' + _token.data
                        },
                        function() {
                          console.log('系统错误')
                        }
                      );
                    }
                  },
                  "post", {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + _token.data
                  },
                  function() {
                    console.log('系统错误')
                  }
                );
              },
              fail: function() {
                console.log("没有token")
              }
            })
          } else { //拒绝获取手机号
            t.setData({
              showGetPhone: false
            })
            console.log("拒绝授权手机号")
            if (app.globalData.token) { //判断有没有受过权，授权过才绑定分销商
              // 调取绑定分销商接口
              common.nRequest(
                getApp().data.services + "api/distribute/binddistributor", {
                  distributor_id: t.data.distributor_id,
                  course_id: t.data.course_id,
                  is_new: t.data.isNewUser,
                  bind_mobile: '0'
                },
                function (fenxiao) {
                  console.log(fenxiao)
                  if (fenxiao.statusCode == app.data.status.s201) {
                    console.log("绑定分销商")
                    console.log(fenxiao)

                  }
                },
                "post", {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Bearer ' + app.globalData.token
                },
                function () {
                  console.log('系统错误')
                }
              );
            }
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  // 获取login组件的值
  getKey: function(e) {
    console.log(e)
    this.setData({
      showLogin: e.detail
    })
    console.log(this.data.entrytype)
    if (this.data.entrytype == 'fenxiao') {
      this.setData({
        showGetPhone: !e.detail
      })
      console.log("这里是getkey")
    }
  },
  
  onShow: function() {
    var t = this;
    console.log(t.data.isClose)
    if (!t.data.isClose) {
      wx.getStorage({
        key: 'courseDetails',
        success: function(res) {
          t.setData({
            courseDetails:res.data
          })
        },
      })
    }
    t.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    });
    let pages = getCurrentPages();
    console.log('t.data.isback')
    console.log(t.data.isback)
    if (t.data.isback) {
      t.getTokencourseDetail(app.globalData.token ? app.globalData.token : t.data.token, t.data.courseId)
    }
  },
  // 时间转换
  secondToDate: function(result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    if (h != '00') {
      return result = h + ":" + m + ":" + s;
    } else {
      return result = m + ":" + s;
    }
  },
  // 收藏
  collectionFun: function() {
    var t = this;
    // 判断用户有没有注册
    wx.getStorage({
      key: 'token',
      success: function(_token) { //已授权
        common.nRequest(
          getApp().data.services + "api/course/favoritecourse", {
            id: t.data.courseDetails.id
          },
          function(res) {
            console.log(res)
            if (getApp().data.status.s203 == res.statusCode) { //收藏成功
              t.setData({
                isFavorite: !t.data.isFavorite
              })
              wx.showToast({
                title: '收藏成功',
                icon: 'none',
                duration: 2000
              })
            } else if (getApp().data.status.s204 == res.statusCode) { //取消收藏成功
              wx.showToast({
                title: '取消收藏成功',
                icon: 'none',
                duration: 2000
              })
              t.setData({
                isFavorite: !t.data.isFavorite
              })
            }
          },
          "post", {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + _token.data
          },
          function() {
            console.log('系统错误')
          }
        );
      },
      fail: function() { //未授权
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'courseDetails')

      }
    })
  },
  // 封装onload里面的方法
  // loadFunction:function(token){
    
  // },
  onLoad: function(options) {
    console.log('options')
    console.log(options)
    var t = this;
    if (options.distributor_id || options.course_id){
      t.setData({
        distributor_id: options.distributor_id,
        course_id: options.course_id,
      })
    }
    
    options.courseid && (getApp().globalData.courseId = options.courseid)
    options.courseid =getApp().globalData.courseId 
    wx.removeStorage({key: 'courseDetails'})
    // 判断是从其他页面链接过来还是扫码进来该页面，如果其他页面链接过来就不请求login
    if (options.into == '1'){//其他页面链接过来，不用请求login
      t.setData({
        _options: true,
        courseId: options.courseid || options.course_id
      })
      wx.setStorageSync('loginedLink', 'courseDetails')
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          t.setData({
            token: _token.data
          })
          // 获取课程详情
          t.getTokencourseDetail(_token.data, t.data.courseId)
        },
        fail: function () {
          // 获取课程详情
          t.getcourseDetail(t.data.courseId)

          // 弹出弹框让用户授权
          t.setData({
            showLogin: true
          })
        }
      })
    }else{//扫码进来，请求login
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          common.nRequest(
            getApp().data.services + "api/login", {
              code: res.code
            },
            function (res) {
              if (getApp().data.Reg.test(res.statusCode)) {
                if (res.data.data.state == '1') { //该用户已注册，获取token存起来
                  getApp().globalData.token = res.data.data.token;
                  wx.setStorageSync('token', res.data.data.token)
                  // 获取token的时间
                  t.setData({
                    showLogin: false,
                    token: res.data.data.token
                  })
                  // 这里判断进入这个页面的入口
                  if (options.course_id && options.distributor_id) { //通过分销进入该页面
                    wx.setStorageSync('loginedLink', 'fenxiao')
                    t.setData({
                      _options: true,
                      courseId: options.courseid || options.course_id,
                      entrytype: 'fenxiao'
                    })
                    // 判断有没有授权过手机号
                    // 获取用户信息
                    common.nRequest(
                      getApp().data.services + "api/user/getdetail",
                      {},
                      function (getdetail) {
                        if (getApp().data.Reg.test(getdetail.statusCode)) {
                          wx.setStorageSync('loginedLink', 'fenxiao')
                          if (!getdetail.data.data.mobile) {//没授权过手机号
                            t.setData({
                              showGetPhone: true,
                              isNewUser: '0'// 这里需要传个不是新用户的值到授权手机号里
                            })
                          } else {
                            // 曾经有授权过手机号
                            t.setData({
                              showGetPhone: false
                            })
                            // 调取绑定分销商接口，这里是老用户，已经授权过手机号和授过权
                            common.nRequest(
                              getApp().data.services + "api/distribute/binddistributor", {
                                distributor_id: options.distributor_id,
                                course_id: options.course_id,
                                is_new: '0',
                                bind_mobile: '0'
                              },
                              function (fenxiao) {
                                if (fenxiao.statusCode == app.data.status.s201) {
                                  console.log("绑定分销商")
                                  console.log(fenxiao)
                                }
                              },
                              "post", {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Authorization': 'Bearer ' + res.data.data.token
                              },
                              function () {
                                console.log('系统错误')
                              }
                            );
                          }
                        }
                      },
                      "post",
                      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + res.data.data.token },
                      function () {
                        console.log('系统错误')
                      }
                    )

                    setTimeout(function () {
                      // 获取token
                      wx.getStorage({
                        key: 'token',
                        success: function (_token) {
                          t.setData({
                            token: _token.data
                          })
                          // 获取课程详情
                          t.getTokencourseDetail(_token.data, t.data.courseId)
                        },
                        fail: function () {
                          // 获取课程详情
                          t.getcourseDetail(t.data.courseId)
                          // 弹出弹框让用户授权
                          t.setData({
                            showLogin: true
                          })
                        }
                      })
                    }, 800)
                  } else if (options.courseid || options.course_id) { //这里是通过分享出去的链接进入该页面，带有课程id参数
                    t.setData({
                      _options: true,
                      courseId: options.courseid || options.course_id
                    })
                    wx.setStorageSync('loginedLink', 'courseDetails')
                    wx.getStorage({
                      key: 'token',
                      success: function (_token) {
                        t.setData({
                          token: _token.data
                        })
                        // 获取课程详情
                        t.getTokencourseDetail(_token.data, t.data.courseId)
                      },
                      fail: function () {
                        // 获取课程详情
                        t.getcourseDetail(t.data.courseId)

                        // 弹出弹框让用户授权
                        t.setData({
                          showLogin: true
                        })
                      }
                    })
                  } else {
                    t.setData({
                      _options: false
                    })
                    wx.setStorageSync('loginedLink', 'courseDetails')
                    wx.getStorage({
                      key: 'token',
                      success: function (_token) {
                        t.setData({
                          token: _token.data
                        })
                        // 获取课程详情
                        t.getTokencourseDetail(_token.data, t.data.courseId)
                      },
                      fail: function () {
                        // 获取课程详情
                        t.getcourseDetail(t.data.courseId)
                        // 弹出弹框让用户授权
                        t.setData({
                          showLogin: true
                        })
                      }
                    })
                  }
                } else { //该用户还没注册
                  t.setData({
                    showLogin: true,
                    isNewUser: '1'// 这里需要传个不是新用户的值到授权手机号里
                  })
                  // 这里判断进入这个页面的入口
                  if (options.course_id && options.distributor_id) { //通过分销进入该页面
                    wx.setStorageSync('loginedLink', 'fenxiao')
                    t.setData({
                      _options: true,
                      courseId: options.courseid || options.course_id,
                      entrytype: 'fenxiao'
                    })
                    // 如果新用户授权后才调用绑定分销商接口，否则不绑定,在login组件js里面有判断
                    setTimeout(function () {
                      // 获取token
                      wx.getStorage({
                        key: 'token',
                        success: function (_token) {
                          t.setData({
                            token: _token.data
                          })
                          // 获取课程详情
                          t.getTokencourseDetail(_token.data, t.data.courseId)
                        },
                        fail: function () {
                          // 获取课程详情
                          t.getcourseDetail(t.data.courseId)
                          // 弹出弹框让用户授权
                          t.setData({
                            showLogin: true
                          })
                        }
                      })
                    }, 800)
                  } else if (options.courseid || options.course_id) { //这里是通过分享出去的链接进入该页面，带有课程id参数
                    t.setData({
                      _options: true,
                      courseId: options.courseid || options.course_id
                    })
                    wx.setStorageSync('loginedLink', 'courseDetails')
                    wx.getStorage({
                      key: 'token',
                      success: function (_token) {
                        t.setData({
                          token: _token.data
                        })
                        // 获取课程详情
                        t.getTokencourseDetail(_token.data, t.data.courseId)
                      },
                      fail: function () {
                        // 获取课程详情
                        t.getcourseDetail(t.data.courseId)
                        // 弹出弹框让用户授权
                        t.setData({
                          showLogin: true
                        })
                      }
                    })
                  } else {
                    t.setData({
                      _options: false
                    })
                    wx.setStorageSync('loginedLink', 'courseDetails')
                    wx.getStorage({
                      key: 'token',
                      success: function (_token) {
                        t.setData({
                          token: _token.data
                        })
                        // 获取课程详情
                        t.getTokencourseDetail(_token.data, t.data.courseId)
                      },
                      fail: function () {
                        // 获取课程详情
                        t.getcourseDetail(t.data.courseId)
                        // 弹出弹框让用户授权
                        t.setData({
                          showLogin: true
                        })
                      }
                    })
                  }
                }
              }
            },
            "post", {
              'content-type': 'application/x-www-form-urlencoded'
            },
            function () {
              console.log('系统错误')
            }
          );
        }
      })
    }
    
  },






  /**
   * 生命周期函数--监听页面加载
   */
  // 有token的获取课程详情方法
  getTokencourseDetail: function(_token, _courseid) {
    var t = this;
    // 获取课程详情
    common.nRequest(
      getApp().data.services + "api/course/getcoursedetail", {
        id: _courseid
      },
      function(res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log("这是有token的课程详情")
          console.log(res.data.data)
          wx.setStorage({
            key: 'has_bought',
            data: res.data.data.has_bought,
          })
          t.setData({
            classList: res.data.data.classes
          })
          getApp().globalData.token = _token;
          wx.setStorageSync('token', _token)
          let wxml = app.towxml.toJson(res.data.data.description);
          let wxml1 = app.towxml.toJson(res.data.data.course_content);
          const _courseDetails = res.data.data;
          for (var i = 0; i < _courseDetails.classes.length; i++) {
            _courseDetails.classes[i].time_length = t.secondToDate(_courseDetails.classes[i].time_length)
          }
          // 遍历小节免费课程
          var _classes = res.data.data.classes;
          var _freeClass = [];
          if (_classes.length > 0) {
            for (var i = 0; i < _classes.length; i++) {
              if (_classes[i].is_free == 1) {
                _freeClass.push(_classes[i].id)
              }
            }
            t.setData({
              freeClass: _freeClass
            })
            // 免费试听课程id数组
            wx.setStorage({
              key: "freeClass",
              data: _freeClass
            })
          }

          t.setData({
            article: wxml,
            article1: wxml1,
            courseDetails: _courseDetails,
            classesNum: res.data.data.classes.length,
            isFavorite: res.data.data.has_favorite == '0' ? false : true
          })
          // 	收费模式：1完全免费，2限时免费，3部分免费，4全部收费
          var _mode = res.data.data.charge_mode;
          if (_mode == '1') { //1完全免费，所有课程可以听，购买价格加横线
            t.setData({
              isShowmode: false
            })
          } else if (_mode == '4') { //4全部收费
            // 先判断有没有购买
            if (res.data.data.has_bought == 1) { //已购买
              t.setData({
                isShowmode: false
              });
            } else { //未购买
              t.setData({
                isShowmode: true
              });
            }
          } else {
            wx.showToast({
              title: '没有这个收费模式',
            })
          }
        }
      },
      "post", {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + _token
      },
      function() {
        console.log('系统错误')
      }
    );
  },
  // 没有token的获取课程详情方法
  getcourseDetail: function(_courseid) {
    var t = this;
    // 获取课程详情
    common.nRequest(
      getApp().data.services + "api/course/getcoursedetail", {
        id: _courseid
      },
      function(res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log("这是没有token的课程详情")
          console.log(res.data.data)
          wx.setStorage({
            key: 'has_bought',
            data: res.data.data.has_bought,
          })
          t.setData({
            classList: res.data.data.classes
          })
          let wxml = app.towxml.toJson(res.data.data.description);
          let wxml1 = app.towxml.toJson(res.data.data.course_content);
          const _courseDetails = res.data.data;
          for (var i = 0; i < _courseDetails.classes.length; i++) {
            _courseDetails.classes[i].time_length = t.secondToDate(_courseDetails.classes[i].time_length)
          }
          // 遍历小节免费课程
          var _classes = res.data.data.classes;
          var _freeClass = [];
          if (_classes.length > 0) {
            for (var i = 0; i < _classes.length; i++) {
              if (_classes[i].is_free == 1) {
                _freeClass.push(_classes[i].id)
              }
            }
            t.setData({
              freeClass: _freeClass
            })
            // 免费试听课程id数组
            wx.setStorage({
              key: "freeClass",
              data: _freeClass
            })
          }

          t.setData({
            article: wxml,
            article1: wxml1,
            courseDetails: _courseDetails,
            classesNum: res.data.data.classes.length,
            isFavorite: res.data.data.has_favorite == '0' ? false : true
          })
          // 	收费模式：1完全免费，2限时免费，3部分免费，4全部收费
          var _mode = res.data.data.charge_mode;
          if (_mode == '1') { //1完全免费，所有课程可以听，购买价格加横线
            t.setData({
              isShowmode: false
            })
          } else if (_mode == '4') { //4全部收费
            t.setData({
              isShowmode: true
            })
          } else {
            wx.showToast({
              title: '没有这个收费模式',
            })
          }
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
  onReady: function() {
    const t = this;
  },
  // 分享解锁
  onShareAppMessage: function(res) {
    var t = this;
    return {
      title: t.data.courseDetails.title,
      path: '/pages/courseDetails/courseDetails?courseid=' + t.data.courseId,
      success(e) {
        // wx.getStorage({
        //   key: 'token',
        //   success: function(_token) {
        // 分享解锁：分享出去即视为分享成功
        common.nRequest(
          getApp().data.services + "api/share/handleshareevent", {
            course_id: t.data.courseId
          },
          function(res) {
            console.log(res)
            console.log("分享")
            console.log(t.data.courseId)
            if (getApp().data.Reg.test(res.statusCode)) {
              wx.showModal({
                title: '提示',
                content: '分享成功',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    t.getTokencourseDetail(t.data.token, t.data.courseId)
                  }
                }
              })

            } else {
              wx.showToast({
                title: '分享失败',
                icon: 'none',
                duration: 2000
              })
            }
          },
          "post", {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + t.data.token
          },
          function() {
            console.log('系统错误')
          }
        );
      },
      fail(e) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete() {

      }
    }
  },


  slideFun: function() {
    this.setData({
      isPullDown: !this.data.isPullDown,
    })
  },
  teacherSlideFun: function() {
    this.setData({
      isTeacher: !this.data.isTeacher,
    })
  },
  linkBroadcast: function(e) {
    const t = this;
    // 缓存课程id，在课程播放页面分享时用
    wx.setStorage({
      key: 'kechengId',
      data: t.data.courseId,
    })
    wx.setStorage({
      key: 'kechengTitle',
      data: t.data.courseDetails.title
    })
    // 缓存课程是否分享解锁
    wx.setStorage({
      key: 'share_unlock',
      data: t.data.courseDetails.share_unlock,
    })
    wx.setStorage({
      key: "classList",
      data: t.data.classList
    })
    // 判断用户有没有注册
    if (t.data.token) { //已授权
      // 判断有没有购买
      if (t.data.courseDetails.has_bought == 0) { //课程还没购买
        console.log("课程还没购买")
        wx.setStorage({
          key: 'has_bought',
          data: '0',
        })
        if (e.currentTarget.dataset.id == 'freeStr') { //从底部的免费试听按钮点进来
          // 缓存课程小节id
          wx.setStorage({
            key: "class_id",
            data: t.data.freeClass[0]
          })
          wx.navigateTo({
            url: '../broadcast/broadcast'
          })
          t.setData({ isClose: false })
        } else { //从课程列表点击进来...
          if (e.currentTarget.dataset.hasfree == '1') {
            // 缓存课程小节id
            wx.setStorage({
              key: "class_id",
              data: e.currentTarget.dataset.id
            })
            wx.navigateTo({
              url: '../broadcast/broadcast'
            })
            t.setData({ isClose: false })
          } else {
            wx.showToast({
              title: '该课程需付费',
              icon: 'none',
              duration: 2000
            })
          }
        }
      } else { //这个课程已经购买了
        console.log("课程已经购买了")

        wx.setStorage({
          key: 'has_bought',
          data: '1',
        })
        wx.setStorage({
          key: "class_id",
          data: e.currentTarget.dataset.id
        })
        wx.navigateTo({
          url: '../broadcast/broadcast'
        })
        t.setData({ isClose: false })
      }
    } else { //未授权
      console.log('还没授权呢')
      // 弹出弹框让用户授权
      t.setData({
        showLogin: true
      })
      wx.setStorageSync('loginedLink', 'broadcast')
      // 缓存课程小节id
      if (e.currentTarget.dataset.id == 'freeStr') { //从底部的免费试听按钮点进来
        // 缓存课程小节id
        wx.setStorage({
          key: "class_id",
          data: t.data.freeClass[0]
        })
      } else { //从课程列表点击进来...
        if (e.currentTarget.dataset.hasfree == '1') {
          // 缓存课程小节id
          wx.setStorage({
            key: "class_id",
            data: e.currentTarget.dataset.id
          })
        } else {
          wx.showToast({
            title: '该课程需付费',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  },
  // 购买
  purchaseFun: function() {
    const t = this;
    var _purchaseCourseInfo = {};
    _purchaseCourseInfo.title = t.data.courseDetails.title;
    _purchaseCourseInfo.cover_img = t.data.courseDetails.cover_img;
    _purchaseCourseInfo.id = t.data.courseDetails.id;
    _purchaseCourseInfo.current_price = t.data.courseDetails.current_price;
    _purchaseCourseInfo.can_use_coupon = t.data.courseDetails.can_use_coupon;
    _purchaseCourseInfo.charge_mode = t.data.courseDetails.charge_mode;
    wx.setStorage({ //存储购买的课程信息，在下单页用
      key: 'purchaseCourseInfo',
      data: _purchaseCourseInfo,
    })
    // 必须授权
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.navigateTo({
          url: '../order/order',
        })
        t.setData({ isClose: false })
      },
      fail: function(res) {
        // 弹出弹框让用户授权
        t.setData({
          showLogin: true
        })
        wx.setStorageSync('loginedLink', 'order')
      }
    })
  },
  onUnload: function() {
    var that = this
    if (that.data.token) {
      getApp().globalData.token = that.data.token;
      wx.setStorageSync('token', that.data.token)
    }
    setTimeout(function () {
      that.setData({ isClose: true })
    }, 200)
  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    if (this.data.isClose) {
      console.log('重新打开')
    }
  },
})