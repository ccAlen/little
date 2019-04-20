// pages/editMaterial/editMaterial.j
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    avatar: '',//头像
    workExperience:[],//工作经历数组
    educationalExperience:[],//教育经历数组
    intentionExperience:[],//求职意向数组
    token:'',
    isShow: false,
    isplay: app.globalData.isplay
  },
  // 更改用户头像
  changeAvatar:function(){
    var t = this;
    var _userInfo = t.data.userInfo;
    // wx.chooseImage({
    //   success: function (res) {
    //     var tempFilePaths = res.tempFilePaths
    //     wx.uploadFile({
    //       url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
    //       filePath: tempFilePaths[0],
    //       name: 'file',
    //       formData: {
    //         'user': 'test'
    //       },
    //       success: function (res) {
    //         var data = res.data
    //         //do something
    //       }
    //     })
    //   }
    // })
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths[0])
        // console.log('tempFilePaths[0]')
        wx.uploadFile({
          url: getApp().data.services + "api/user/updateuser", //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'avatar',
          formData: {
            avatar: tempFilePaths[0],
          },
          header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
          success: function (res) {
            var data = res.data
            // console.log('res.data')
            // console.log(res.data)
            // wx.showToast({
            //   title: res.data.message[0],
            //   icon: 'none',
            //   duration: 5000
            // })
            t.setData({
              avatar: tempFilePaths[0]
            })
            _userInfo.avatar = tempFilePaths[0];//这里需要修改，不能直接显示上传返回的图片地址，需要后台做处理，所以该头像图片不出来
            wx.setStorage({
              key: 'userInfo',
              data: _userInfo,
            })
          }
        })
        // 更新用户信息-头像
        // common.nRequest(
        //   getApp().data.services + "api/user/updateuser",
        //   { avatar: tempFilePaths[0] },
        //   function (res) {
        //     if (res.statusCode == app.data.status.s402) {
        //       console.log(res)
        //       wx.showToast({
        //         title: res.data.message[0],
        //         icon: 'none',
        //         duration: 5000
        //       })
        //       t.setData({
        //         avatar: tempFilePaths[0]
        //       })
        //       _userInfo.avatar = tempFilePaths[0];//这里需要修改，不能直接显示上传返回的图片地址，需要后台做处理，所以该头像图片不出来
        //       wx.setStorage({
        //         key: 'userInfo',
        //         data: _userInfo,
        //       })
        //     }
        //   },
        //   "post",
        //   { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
        //   function () {
        //     console.log('系统错误')
        //   }
        // );
      }
    })
  },
  // 更改用户名字
  editName:function(e){
    // console.log(e.detail.value)
    var t = this;
    var _userInfo = t.data.userInfo;
    // 更新用户信息-名字
    common.nRequest(
      getApp().data.services + "api/user/updateuser",
      { name: e.detail.value },
      function (res) {
        if (res.statusCode == app.data.status.s402) {
          // console.log(res)
          _userInfo.name = e.detail.value
          t.setData({
            userInfo: _userInfo
          })
          wx.setStorage({
            key: 'userInfo',
            data: _userInfo,
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
      function () {
        console.log('系统错误')
      }
    );   
  },
  // 更改手机号
  editPhone:function(e){
    var t = this;
    var _userInfo = t.data.userInfo;
    var mobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var _val = e.detail.value;
    if(_val.match(mobile)){
      //更新用户信息 - 手机号
      common.nRequest(
        getApp().data.services + "api/user/updateuser",
        { mobile: _val },
        function (res) {
          if (res.statusCode == app.data.status.s402) {
            // console.log(res)
            _userInfo.mobile = _val;
            t.setData({
              userInfo: _userInfo
            })
            wx.setStorage({
              key: 'userInfo',
              data: _userInfo,
            })
          }
        },
        "post",
        { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
        function () {
          console.log('系统错误')
        }
      ); 
    }else{
      wx.showToast({
        title: '您输入的手机号格式有误,请重新输入',
        icon: 'none',
        duration: 2000
      })
      _userInfo.mobile = '';
      t.setData({
        userInfo: _userInfo
      })
    }
  },
  // 更改邮箱
  editEmail:function(e){
    var t = this;
    var _userInfo = t.data.userInfo;
    var email = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    var _val = e.detail.value;
    if (_val.match(email)) {
      //更新用户信息 - 手机号
      common.nRequest(
        getApp().data.services + "api/user/updateuser",
        { email: _val },
        function (res) {
          if (res.statusCode == app.data.status.s402) {
            // console.log(res)
            _userInfo.email = _val;
            t.setData({
              userInfo: _userInfo
            })
            wx.setStorage({
              key: 'userInfo',
              data: _userInfo,
            })
          }
        },
        "post",
        { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
        function () {
          console.log('系统错误')
        }
      );
    } else {
      wx.showToast({
        title: '您输入的邮箱格式有误,请重新输入',
        icon: 'none',
        duration: 2000
      })
      _userInfo.email = '';
      t.setData({
        userInfo: _userInfo
      })
    }
  },
  // 更改微信号
  editWechat:function(e){
    var t = this;
    var _userInfo = t.data.userInfo;
    var _val = e.detail.value;
    if (_val != '') {
      //更新用户信息 - 微信号
      common.nRequest(
        getApp().data.services + "api/user/updateuser",
        { wechat: _val },
        function (res) {
          if (res.statusCode == app.data.status.s402) {
            // console.log(res)
            _userInfo.wechat = _val;
            t.setData({
              userInfo: _userInfo
            })
            wx.setStorage({
              key: 'userInfo',
              data: _userInfo,
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var t = this;
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
    // 从缓存获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function (_userInfo) {
        t.setData({
          userInfo: _userInfo.data,
          avatar: _userInfo.data.avatar
        })
      },
    })
    // 获取token
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        t.setData({
          token: _token.data
        })
        // 获取工作经历
        common.nRequest(
          getApp().data.services + "api/user/getworkhistories",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              if (res.statusCode == app.data.status.s201) {
                console.log(res.data.data)
                t.setData({
                  workExperience: res.data.data,
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
        // 获取教育经历
        common.nRequest(
          getApp().data.services + "api/user/geteduhistories",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              if (res.statusCode == app.data.status.s201) {
                console.log(res.data.data)
                t.setData({
                  educationalExperience: res.data.data
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
        // 获取求职意向
        common.nRequest(
          getApp().data.services + "api/user/getjobintenetion",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              if (res.statusCode == app.data.status.s201) {
                console.log(res)
                t.setData({
                  intentionExperience: res.data.data ? res.data.data : {}
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
        wx.showToast({
          title: '您还没授权呢',
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
  
  },
  // 删除经验
  deletFun:function(e){
    console.log(e.currentTarget.dataset.deltype)
    var t = this;
    var _workExperience = t.data.workExperience;
    var _educationalExperience = t.data.educationalExperience;
    var _deltype = e.currentTarget.dataset.deltype;
    if (_deltype == 'work'){//工作
      var _content = '是否要删除该项工作经历？';
      var _url = "api/user/delworkhistory";
    } else if (_deltype == 'edu') {//教育
      var _content = '是否要删除该项教育经历？';
      var _url = "api/user/deleduhistory";
    }
    wx.showModal({
      title: '提示',
      content: _content,
      success: function (res) {
        if (res.confirm) {
          // 删除工作经历
          common.nRequest(
            getApp().data.services + _url,
            { id: e.currentTarget.dataset.id},
            function (res) {
                if (res.statusCode == app.data.status.s203) {
                  if (_deltype == 'work') {//工作
                    for (var i = 0; i < _workExperience.length; i++){
                      if (_workExperience[i].id == e.currentTarget.dataset.id){
                        _workExperience.splice(i,1)
                      }
                    }
                    t.setData({
                      workExperience: _workExperience
                    })
                  } else if (_deltype == 'edu') {//教育
                    for (var i = 0; i < _educationalExperience.length; i++) {
                      if (_educationalExperience[i].id == e.currentTarget.dataset.id) {
                        _educationalExperience.splice(i, 1)
                      }
                    }
                    t.setData({
                      educationalExperience: _educationalExperience
                    })
                  }
                } 
            },
            "post",
            { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + t.data.token },
            function () {
              console.log('系统错误')
            }
          );
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 添加工作经验
  addWorkFun:function(e){
    wx.setStorage({
      key: 'editwork',
      data: '',
    })
    wx.setStorage({
      key: 'edittype',
      data: e.currentTarget.dataset.edittype
    })
    wx.navigateTo({
      url: '../addWork/addWork',
    })
  },
  // 添加教育经历
  addEducationFun: function (e) {
    wx.setStorage({
      key: 'editwork',
      data: '',
    })
    wx.setStorage({
      key: 'edittype',
      data: e.currentTarget.dataset.edittype
    })
    wx.navigateTo({
      url: '../addEducation/addEducation',
    })
  },
  // 添加求职意向
  addIntentionFun: function (e) {
    wx.setStorage({
      key: 'editwork',
      data: '',
    })
    wx.setStorage({
      key: 'edittype',
      data: e.currentTarget.dataset.edittype
    })
    wx.navigateTo({
      url: '../addIntention/addIntention',
    })
  },
  
  // 更改工作经历
  editFun:function(e){
    wx.setStorage({
      key: 'edittype',
      data: e.currentTarget.dataset.edittype
    })
    var t = this;
    var _id = e.currentTarget.dataset.id;
    var _workExperience = t.data.workExperience;
    for (var i = 0; i < _workExperience.length; i++){
      if (_id == _workExperience[i].id){
        console.log(_workExperience[i])
        wx.setStorage({
          key: 'editwork',
          data: _workExperience[i],
        })
        wx.navigateTo({
          url: '../addWork/addWork',
        })
      }
    }
  },
  // 更改教育经历
  editFunEdu: function (e) {
    wx.setStorage({
      key: 'edittype',
      data: e.currentTarget.dataset.edittype
    })
    var t = this;
    var _id = e.currentTarget.dataset.id;
    var _educationalExperience = t.data.educationalExperience;
    for (var i = 0; i < _educationalExperience.length; i++) {
      if (_id == _educationalExperience[i].id) {
        console.log(_educationalExperience[i])
        wx.setStorage({
          key: 'editwork',
          data: _educationalExperience[i],
        })
        wx.navigateTo({
          url: '../addEducation/addEducation',
        })
      }
    }
  },
  // 更改求职意向
  editFunInt: function (e) {
    wx.setStorage({
      key: 'edittype',
      data: e.currentTarget.dataset.edittype
    })
    var t = this;
    var _id = e.currentTarget.dataset.id;
    var _intentionExperience = t.data.intentionExperience;
    wx.setStorage({
      key: 'editwork',
      data: _intentionExperience,
    })
    wx.navigateTo({
      url: '../addIntention/addIntention',
    })
    
  }
})