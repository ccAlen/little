// pages/broadcast/broadcast.js 
const app = getApp()
var common = require("../../utils/util.js");
// 音频引入
const myaudio = app.globalData.audio;
myaudio.obeyMuteSwitch = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //article将用来存储towxml数据
    article: {},
    barVal: '0',
    time: '00:00:00',
    isplay: 'pause',
    haslength: false, //当前是否有音乐的长度
    maxlength: 0,
    totleTime: '',
    value: 0, //当前播放到了哪儿
    duration: 0,
    courseShow: false, //课程显示
    islecture: false, //讲义弹框
    // isLogin: false,//是否显示login弹框
    courseDetails: {}, //课程详情内容
    classList: [], //课程列表
    token: '',
    _index: '', //当前播放小节的index
    courseId:'',
    has_bought: '0',//是否已购买
    courseTitle:'',
    classid:'',
    courseDetailskecheng:{}
  },
  linkBroadcast:function(e){
    var t = this;
    // console.log(e.currentTarget.dataset.id)
    wx.getStorage({
      key: 'class_id',
      success: function(_class_id) {
        // console.log(_class_id.data)
        if (e.currentTarget.dataset.id == _class_id.data){
          t.setData({
            courseShow:false
          })
        }else{
          if (t.data.has_bought == '1'){
            for (var i = 0; i < t.data.classList.length; i++) {
              if (e.currentTarget.dataset.id == t.data.classList[i].id) {
                // console.log(t.data.classList[i])
                t.getPlayRadio(t.data.classList[i].id)
                t.setData({
                  _index: i
                })
              }
            }
          }else{
            if (e.currentTarget.dataset.hasfree == 0) {
              wx.showToast({
                title: '该课程要付费',
                icon: 'none',
                duration: 2000
              })
            } else {
              for (var i = 0; i < t.data.classList.length; i++) {
                if (e.currentTarget.dataset.id == t.data.classList[i].id) {
                  // console.log(t.data.classList[i])
                  t.getPlayRadio(t.data.classList[i].id)
                  t.setData({
                    _index:i
                  })
                }
              }
            }
          }
        }
      },
    })
  },
  // 有token的获取课程详情方法
  getTokencourseDetail: function (_token, _courseid) {
    var t = this;
    // 获取课程详情
    common.nRequest(
      getApp().data.services + "api/course/getcoursedetail", {
        id: _courseid
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log("这是有token的课程详情")
          console.log(res.data.data)
          wx.setStorage({
            key: 'has_bought',
            data: res.data.data.has_bought,
          })
          const _courseDetails = res.data.data;
          for (var i = 0; i < _courseDetails.classes.length; i++) {
            _courseDetails.classes[i].time_length = t.secondToDate(_courseDetails.classes[i].time_length)
            if (_courseDetails.classes[i].id == t.data.classid){
              t.setData({
                courseDetails: _courseDetails.classes[i]
              })
            }
          }
          t.setData({
            classList: res.data.data.classes,
            has_bought: res.data.data.has_bought,
            courseDetailskecheng: _courseDetails,
          })
         
          wx.setStorage({
            key: 'courseDetails',
            data: _courseDetails
          })
          
        }
      },
      "post", {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + _token
      },
      function () {
        console.log('系统错误')
      }
    );
  },
  // 分享解锁
  onShareAppMessage: function (res) { 
    var t = this;
    return {
      title: t.data.courseTitle == '' ? '猩职场' : t.data.courseTitle,
      path: '/pages/courseDetails/courseDetails?courseid=' + t.data.courseId,
      success(e) {
        // 判断是否分享解锁
        wx.getStorage({
          key: 'share_unlock',
          success: function(res) {
            if(res.data == 0){//不是分享解锁，直接跳出分享成功
              wx.showModal({
                title: '提示',
                content: '分享成功',
                showCancel: false,
                success: function (res) {
                  
                }
              })
            }else{//分享解锁，调用解锁接口
              common.nRequest(
                getApp().data.services + "api/share/handleshareevent",
                { course_id: t.data.courseId },
                function (res) {
                  console.log(res)
                  console.log("分享")
                  console.log(t.data.courseId)
                  if (getApp().data.status.s203 == res.statusCode) {
                    wx.showModal({
                      title: '提示',
                      content: '分享成功',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log(t.data.token)
                          console.log(t.data.courseId)
                          t.getTokencourseDetail(t.data.token, t.data.courseId)

                        }
                      }
                    })

                  } else if (getApp().data.status.s204 == res.statusCode) {
                    wx.showToast({
                      title: '分享失败',
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
          },
        })
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
  onShow:function(){
    
    var t = this;
    console.log("这里是课程列表啦")
    console.log(t.data.classList)
    wx.getStorage({
      key: 'kechengId',
      success: function (_courseId) {
        console.log('_courseId')
        console.log(_courseId)
        t.setData({
          courseId: _courseId.data
        })
        
      }
    })
    wx.getStorage({
      key: 'kechengTitle',
      success: function (_kechengTitle) {
        t.setData({
          courseTitle: _kechengTitle.data
        })
      },
    })
    wx.getStorage({
      key: 'has_bought',
      success: function (_has_bought) {
        t.setData({
          has_bought: _has_bought.data
        })
      },
    })
  },
  // 封装更新小节播放进度接口
  updateaudioTime:function(_id,_time,_free){
    var t = this;
    common.nRequest(
      getApp().data.services + "api/course/updateplayprogress", {
        id: _id,
        time_schedule: parseInt(_time),
        is_free: _free
      },
      function (res) {
        console.log(res)

        if (getApp().data.Reg.test(res.statusCode)) {


        }
      },
      "post", {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + t.data.token
      },
      function () {
        console.log('系统错误')
      }
    );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadNetMedia.bind(this);
    this.loadStorageMedia.bind(this);

    console.log("进入播放页面"); 
    // console.log(options);
    // 从缓存中获取课程列表

    //取消监听 onTimeUpdate 事件
    console.log(options)
    if (options.buoy) {//从悬浮框进入该页面
      this.loadStorageMedia(options);
    } else {//从课程列表进入该页面
      this.loadNetMedia();
    }

    myaudio.onPlay((res) => {
      this.setData({
        isplay: 'play'
      })
      // this.updateTime(this);
    }) //没有这个事件触发，无法执行updatatime
    myaudio.onPause((res) => {
      this.setData({
        isplay: 'pause'
      })
      console.log("暂停啦")
      console.log(myaudio.currentTime)
      // 此处调用更新小节播放进度接口
      this.updateaudioTime(this.data.classid, myaudio.currentTime, this.data.courseDetails.is_free)
    });
    
    // console.log(myaudio.paused);
    myaudio.onTimeUpdate(() => {
      // console.log(myaudio.currentTime)
      //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新
      var _currentTime = parseInt(myaudio.currentTime);
      var _time = this.secondToDate(_currentTime)
      this.setData({
        time: _time,
        value: _currentTime
      })
      if (myaudio.duration){
        this.setData({
          duration: myaudio.duration.toFixed(2) * 100
        })
        // 播放结束
        myaudio.onEnded(() => {
          this.setStopState(this)
          // myaudio.stop()
          // 此处调用更新小节播放进度接口
          this.updateaudioTime(this.data.classid, this.data.courseDetails.time_length, this.data.courseDetails.is_free)
          // myaudio.seek(0); //让滑块跳转至指定位置
          // myaudio.startTime = 0;
          // myaudio.currentTime = 0;
        })
      }
    })
    // myaudio.onSeeked((res) => {
    //   this.updateTime(this) //注意这里要继续出发updataTime事件，
    // })
  },
  // updateTime: function(that) {
  //   console.log(myaudio.currentTime);
  //   if (myaudio.duration){
  //     //播放到最后一秒
  //     if (myaudio.duration.toFixed(2) - myaudio.currentTime.toFixed(2) <= 0) {
  //       that.setStopState(that)
  //       console.log("666")
  //       that.setData({
  //         value: 0,
  //         time: '00:00:00',
  //         isplay: 'pause'
  //       })
  //       myaudio.stop()
  //     }
  //     myaudio.onEnded(() => {
  //       that.setStopState(that)
  //     })
  //   }
  // },
// 进入该页面继续播放上次播放的音频
  loadStorageMedia: function (options) {
    console.log(options)
    var t = this;
    wx.getStorage({
      key: 'classList',
      success: function (res) {
        console.log(res.data)
        var _classList = res.data;
        // 从缓存中获取token
        wx.getStorage({
          key: 'token',
          success: function (_token) {
            t.setData({
              token: _token.data
            })
            // 从缓存中获取课程小节id
            wx.getStorage({
              key: 'class_id',
              success: function (_class_id) {
                console.log(_class_id.data)
                t.setData({
                  classid: _class_id.data
                })
                // 获取当前小节的在数组中的index
                for (var i = 0; i < _classList.length; i++) {
                  if (_classList[i].id == _class_id.data) {
                    console.log(i)
                    t.setData({
                      _index: i
                    })
                  }
                }
              }
            })
          }
        })
        t.setData({
          classList: _classList
        })
      }
    })
    const {currentSecond} = options;
    // console.log({ currentSecond })
    // console.log(t.secondToDate(currentSecond))
    // console.log(currentSecond)
    wx.getStorage({
      key: 'currentMedia',
      success: (res) => {
        const data = res.data;
        //html转WXML
        let wxml = app.towxml.toJson(data.class_text);
        t.setData({
          courseDetails: data,
          time: t.secondToDate(currentSecond),
          value: currentSecond,
          article: wxml,
        });
        
        t.getmusiclength();
        if (myaudio.paused) {
          t.setData({
            isplay: 'pause'
          });
        } else {
          t.setData({
            isplay: 'play'
          });
        }
        // t.updateTime(t);
      },
    })
  },
//从课程列表进入该页面播放的方法
  loadNetMedia: function() {
    var t = this;
    
    wx.getStorage({
      key: 'classList',
      success: function(res) {
        console.log(res.data)
        var _classList = res.data;
        // 从缓存中获取token
        wx.getStorage({
          key: 'token',
          success: function(_token) {
            t.setData({
              token: _token.data
            })
            // 从缓存中获取课程小节id
            wx.getStorage({
              key: 'class_id',
              success: function(_class_id) {
                console.log(_class_id.data)
                t.setData({
                  classid: _class_id.data
                })
                wx.getStorage({
                  key: 'bygoneId',
                  success: function (bygoneId) {
                    if (bygoneId.data == _class_id.data) {
                      // 这次打开的跟上次一样
                      console.log("这次打开的跟上次一样")
                      t.loadStorageMedia({currentSecond:parseInt(myaudio.currentTime)})
                      console.log(myaudio.currentTime)
                    } else {
                      console.log("这次打开的跟上次bu一样")
                      // 这次打开的跟上次不一样
                      // 获取当前小节的在数组中的index
                      for (var i = 0; i < _classList.length; i++) {
                        if (_classList[i].id == _class_id.data) {
                          console.log(i)
                          t.setData({
                            _index: i
                          })
                        }
                      }
                      // 调用请求小节详情的方法
                      t.getPlayRadio(_class_id.data)
                    }
                  },
                  fail:function(){
                    // 获取当前小节的在数组中的index
                    for (var i = 0; i < _classList.length; i++) {
                      if (_classList[i].id == _class_id.data) {
                        console.log(i)
                        t.setData({
                          _index: i
                        })
                      }
                    }
                    // 调用请求小节详情的方法
                    t.getPlayRadio(_class_id.data)
                  }
                })
              }
            })
          },
          fail:function(){
            wx.showToast({
              title: '获取token失败',
              icon: 'none',
              duration: 2000
            })
            console.log("获取token失败")
          }
        })
        t.setData({
          classList: _classList
        })
      }
    })
  },
// 封装请求小节详情的方法（包括可播放链接）
  getPlayRadio: function (_classId){
    var t = this;
    console.log(_classId)
    // 请求小节详情（包含可播放链接）
    common.nRequest(
      getApp().data.services + "api/course/getplayableurl", {
        class_id: _classId
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res.data.data)
          t.setData({
            courseDetails: res.data.data,
            classid: res.data.data.id
          })
          t.setCurrentMediaStorage(res.data.data);
          t.setClassIdStorage(res.data.data.id);
          myaudio.src = res.data.data.url;
          // myaudio.src = 'http://xhstore.oss-cn-shenzhen.aliyuncs.com/27/0394f77f6a4ccf5c937504aff6f6e80f.mp3?OSSAccessKeyId=LTAI6HwmD06MoKj1&Expires=1533696700&Signature=lwTooJAI38R6Ai%2BYxdp%2BrqTO0wI%3D'
          // myaudio.src = 'http://xhstore.oss-cn-shenzhen.aliyuncs.com/16/d4420a500c55ba83bfdd085dcc5fe2a8.mp3'
          myaudio.title = res.data.data.class_title;
          // 这里控制开始播放位置
          if (res.data.data.progress == null || ''){
            myaudio.startTime = 0;
          } else if (res.data.data.progress.time_schedule == res.data.data.time_length){//上次播放完了
            console.log("上次播放完了")
            myaudio.startTime = 0;
            myaudio.currentTime = 0;
            myaudio.pause();
            myaudio.seek(0)
            t.setData({
              time: '00:00:00',
              value: 0, //当前播放到了哪儿
            })
          }else{
            myaudio.startTime = res.data.data.progress.time_schedule;
          }
          // console.log(res.data.data.progress.time_schedule)
          myaudio.onError((res) => {
            console.log(res)
            wx.showModal({
              // title: '播放出错',
              content: '播放出错',
              showCancel:false,
              confirmText:'退出',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack()
                } 
              }
            })
            t.setData({
              isplay:'pause'
            })
          })
          t.getmusiclength();
          //html转WXML
          let wxml = app.towxml.toJson(res.data.data.class_text);
          t.setData({
            article: wxml,
            value: 0, //当前播放到了哪儿
            isplay: 'pause',
            time: '00:00:00'
          })
        } else if (res.statusCode == app.data.status.s301){
          wx.showModal({
            // title: '播放出错',
            content: res.data.message,
            confirmText: '去购买',
            success: function (res) {
              if (res.confirm) {
                // wx.navigateTo({
                //   url: '../courseDetails/courseDetails'
                // })
                wx.navigateBack()
              } else if (res.cancel) {
                // 点击取消后，重置播放链接
                myaudio.src = t.data.courseDetails.url;
                myaudio.pause();
              }
            }
          })
          return;
        } else if (res.statusCode == app.data.status.s402){
          // console.log(res)
          wx.showModal({
            // title: '播放出错',
            content: res.data.message[0],
            showCancel: false,
            confirmText: '退出',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      },
      "post", {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + t.data.token
      },
      function () {
        console.log('系统错误')
      }
    );
  },
  setCurrentMediaStorage: function(data) {
    wx.setStorage({
      key: 'currentMedia',
      data: data,
    })
  },
  setClassIdStorage: function (data) {
    wx.setStorage({
      key: 'class_id',
      data: data,
    })
  },

  // 时间转换
  secondToDate: function(result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = h + ":" + m + ":" + s;
  },

  // 播放
  playAudio: function() {
    console.log('myaudio.src')
    console.log(myaudio.src)
    myaudio.play()
    this.setData({
      isplay: 'play'
    })
    console.log('点击播放')
    console.log(this.data._index)
    console.log(this.data.classList.length)
    if(this.data._index + 1 >= this.data.classList.length){//如果是最后一节，点击播放，继续播放最后一节
      myaudio.src = this.data.courseDetails.url;
    }
  },
  // 暂停
  pauseAudio: function() {
    myaudio.pause()
    this.setData({
      isplay: 'pause'
    })
    console.log('点击暂停')
  },
  //获取音乐的长度
  getmusiclength: function() {
    const that = this;
    // console.log(myaudio.duration);
    // console.log(that.data.courseDetails.time_length)
    // var _totalTime = that.secondToDate(myaudio.duration);
    if (that.data.courseDetails.time_length == 0) {
      setTimeout(function() {
        that.data.haslength = false;
        that.getmusiclength();
      }, 100);
    } else {
      var a = Math.ceil(that.data.courseDetails.time_length);
      var _totleTime = that.secondToDate(Math.ceil(that.data.courseDetails.time_length));
      that.setData({
        haslength: true,
        maxlength: a,
        value: 0,
        totleTime: _totleTime
      });

    }
  },
  //播放进度变化
  // updateTime: function(that) {
  //   console.log(myaudio.currentTime);
  //   if (myaudio.duration){
  //     //播放到最后一秒
  //     if (myaudio.duration.toFixed(2) - myaudio.currentTime.toFixed(2) <= 0) {
  //       that.setStopState(that)
  //       console.log("666")
  //       that.setData({
  //         value: 0,
  //         time: '00:00:00',
  //         isplay: 'pause'
  //       })
  //       myaudio.stop()
  //     }
  //     myaudio.onEnded(() => {
  //       that.setStopState(that)
  //     })
  //   }
  // },
  //拖动滑块
  slideBar: function(e) {
    let that = this;
    var curval = e.detail.value; //滑块拖动的当前值
    var _time = that.secondToDate(curval)
    console.log(curval)
    that.setData({
      value: curval,
      time: _time,
    })
    myaudio.seek(curval); //让滑块跳转至指定位置
    myaudio.startTime = curval;
    myaudio.currentTime = curval;
    // myaudio.onSeeked((res) => {
    //   this.updateTime(that) //注意这里要继续出发updataTime事件，
    // })
  },
  // 播放结束
  setStopState: function(that) {
    console.log("jieshulalallala")
    // myaudio.startTime = 0;
    // myaudio.currentTime = 0;
    that.setData({
      value: 0,
      time: '00:00:00',
      isplay: 'pause'
    })
    // 播完自动跳下一节
    // console.log(this.data._index)
    // console.log(this.data.classList.length)
    this.nextFun()
    // myaudio.pause();
    // 播完再播一遍
    // myaudio.src = this.data.courseDetails.url;
    // console.log(myaudio.src)
  },
  // 课程目录
  courseList: function() {
    console.log('this.data.courseShow')
    this.setData({
      courseShow: true
    })
  },
  // 课程目录关闭
  courseClose: function() {
    this.setData({
      courseShow: false
    })
  },
  // 关闭讲义弹框
  closeLecture: function() {
    this.setData({
      islecture: false
    })
  },
  // 讲义弹框
  lectureFun: function() {
    // this.setData({
    //   islecture: true
    // })
    console.log(this.data.courseDetails)
    wx.navigateTo({
      url: '../courseHandouts/courseHandouts',
    })
    app.globalData.courseHandouts = this.data.article;
    app.globalData.courseTitle = this.data.courseDetails.class_title
  },
  // 上一个音频
  previousFun: function() {
    var t = this;
    var _index = t.data._index;
    var _classList = t.data.classList;
    console.log(_index)
    if (_index <= 0) {
      wx.showToast({
        title: '这已经是可播放的第一个课程了',
        icon: 'none',
        duration: 2000
      })
      _index = 0;
      return _index;
    } else {
      const preId = _classList[_index - 1].id;
     
      // 调用请求小节详情的方法
      t.getPlayRadio(preId)
      t.setData({
        _index: _index - 1
      })
    }
  },
  // 下一个音频
  nextFun: function() {
    
    var t = this;
    var _index = t.data._index;
    var _classList = t.data.classList;
    console.log(_index)
    if (_index + 1 >= _classList.length) {
      wx.showToast({
        title: '这已经是可播放的最后一个课程了',
        icon: 'none',
        duration: 2000
      })
    } else {
      const preId = _classList[_index + 1].id;
      t.getPlayRadio(preId)
      t.setData({
        _index: _index + 1
      })
      
    }
  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载
    console.log("离开播放页面");
    if (this.data.isplay == 'play'){
      getApp().globalData.isShow = true;
      getApp().globalData.isplay = 'play';
      wx.setStorage({
        key: 'bygoneId',
        data: this.data.courseDetails.id,
      })
    }else{
      getApp().globalData.isShow = false;
      wx.setStorage({
        key: 'bygoneId',
        data: ''
      })
    }
  },
})