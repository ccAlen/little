// pages/aiFinishedQuestions/aiFinishedQuestions.js 
const app = getApp()
var common = require("../../utils/util.js");
var radio = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value:0,
    status:'pause',//播放状态
    isShow: false,
    isplay: app.globalData.isplay,
    audioList:[],//音频列表
    audioArr:[],//所有音频播放器
    _index:'',
    inner:[],
    duration:0,
    currentValue:0,
    reg: /(\S*)_/,
    entertype:'',
    second_index:'',
    aa:'',
    interviewdetails:{},
    iscode:true
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var t = this;
    var audioArr = [];
    var _yuyinList = [];
    if (options.iscode && (options.iscode = 1)){
      t.setData({
        iscode:true
      })
    }else{
      t.setData({
        iscode: false
      })
    }
    if (options.recordid){
      t.setData({
        entertype:'second'
      })
      // wx.getStorage({
      //   key: 'token',
        // success: function(_token) {
          // 获取面试详情
          common.nRequest(
            getApp().data.services + "api/interview/getinterviewdetail",
            {
              id: options.recordid
            },
            function (res) {
              if (getApp().data.Reg.test(res.statusCode)) {
                var _audioList = res.data.data.audios;
                
                for (var i = 0; i < _audioList.length; i++){
                  _audioList[i]._index = res.data.data.audios[i].question_no
                  _audioList[i].question = res.data.data.audios[i].question.title
                  _audioList[i].tempFilePath = ''
                }
                console.log(_audioList)
              
                t.setData({
                  audioList: _audioList,
                  interviewdetails: res.data.data
                })

              }
            },
            "post",
            { 'content-type': 'application/x-www-form-urlencoded'},
            function () {
              console.log('系统错误')
            }
          );
      //   },
      // })
    }else{
      t.setData({
        entertype: 'first'
      })
      wx.getStorage({
        key: 'audioList',
        success: function (audioList) {
          var _audioList = audioList.data;
          var inner = [];
          for (var i = 0; i < _audioList.length; i++) {

            inner[i] = wx.createInnerAudioContext();
            inner[i].src = _audioList[i].tempFilePath;
            if (i < _audioList.length - 1) {
              if (_audioList[i]._index == _audioList[i + 1]._index) {
                _audioList[i + 1].sin = true;
              }
            }
            // console.log(_audioList[i])
          }

          t.setData({
            audioList: _audioList,
            audioArr: audioArr,
            inner: inner
          })
        }
      });
    };
    radio.onPlay((res) => {
      radio.startTime = 0;
      // t.updateTime(t);
    }) //没有这个事件触发，无法执行updatatime
    radio.onPause((res) => {
      t.setData({
        value:0
      })
    })
    radio.onTimeUpdate(() => {
      //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新
      var _currentTime = parseInt(radio.currentTime);
      // console.log(_currentTime)
      t.setData({
        value: _currentTime,
        currentValue: _currentTime >= 10 ? _currentTime : '0' + _currentTime
      })
      if (radio.duration) {
        t.setData({
          duration: radio.duration.toFixed(0)
        })
        // console.log(radio.duration)
      }
    });
    radio.onEnded((res) => {
      console.log('播放结束')
      t.setData({ status: 'pause', value: 0 })
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

  //拖动滑块
  slideBar: function (e) {
    let t = this;
    var curval = e.detail.value; //滑块拖动的当前值
    var index = '';
    // var _time = t.secondToDate(curval)
    console.log(curval)
    console.log(e)
    t.setData({
      value: curval,
      _index: e.target.dataset.index
    })
    for (var i = 0; i < t.data.audioList.length; i++) {
      // inner[i] = wx.createInnerAudioContext();
      t.data.inner[i].pause();
      if (e.target.dataset.index == t.data.audioList[i].index) {
        index = i
      }
    }
    t.data.inner[index].seek(curval); //让滑块跳转至指定位置
    t.data.inner[index].play();
  },
  // 暂停播放
  radioContralplay: function (e) {
    this.setData({
      status: 'pause',
      _index: e.target.dataset.index
    })
    var t = this;
    var index = '';
    for (var i = 0; i < t.data.audioList.length; i++) {
      // inner[i] = wx.createInnerAudioContext();
      if (e.target.dataset.index == t.data.audioList[i].index) {
        index = i
      }
    }
    t.data.inner[index].pause()
    // inner[index].play()
  },
  // 另一个播放
  radioContralplay_second: function (e) {
    var t = this;
    t.setData({
      value:0,
      second_index: e.target.dataset.index,
      // aa: e.target.dataset.aa,
    })
    if (t.data.status == 'pause' || (t.data.status == 'play' && e.target.dataset.aa != t.data.aa)){
      t.setData({
        status: 'play',
        aa: e.target.dataset.aa,
      })
      console.log("bofang")
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          // 获取面试音频播放链接
          common.nRequest(
            getApp().data.services + "api/interview/getplayenableurl",
            {
              id: e.target.dataset.id
            },
            function (_getplayenableurl) {
              if (getApp().data.Reg.test(_getplayenableurl.statusCode)) {
                if (e.target.dataset.append == '0') {
                  t.setData({
                    saudioUrl: _getplayenableurl.data.data.audio_file
                  })
                  radio.src = _getplayenableurl.data.data.audio_file;
                } else {
                  t.setData({
                    saudioUrl: _getplayenableurl.data.data.audio_file_append
                  })
                  radio.src = _getplayenableurl.data.data.audio_file_append;
                }
                // console.log(radio.src)
                radio.play()
              }
            },
            "post",
            { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
            function () {
              console.log('系统错误')
            }
          );
        },
      })
    }else{
      t.setData({
        status: 'pause',
        value: '0',
        aa: e.target.dataset.aa,
      })
      console.log("zanting")
      radio.pause()
    }
    
  },
  //播放
  radioContralpause:function(e){
    this.setData({
      status: 'play',
      _index: e.target.dataset.index
    })
    var t = this;
    var index = '';
    for (var i = 0; i < t.data.audioList.length; i++) {
      // inner[i] = wx.createInnerAudioContext();
      t.data.inner[i].pause();
      if (e.target.dataset.index == t.data.audioList[i].index) {
        index = i
      }
    }
    // inner[index].stop()
    t.data.inner[index].play()
    t.data.inner[index].onSeeking(function (e) {
      t.data.inner[index].pause();
    });

    t.data.inner[index].onSeeked(function (e) {
      t.data.inner[index].play();
    });
    t.data.inner[index].onPlay((res) => {
      t.updateTime(t);
    }) //没有这个事件触发，无法执行updatatime
    t.data.inner[index].onTimeUpdate(() => {
      //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新
      var _currentTime = parseInt(t.data.inner[index].currentTime);
      console.log(_currentTime)
      t.setData({
        // time: _time,
        value: _currentTime,
        currentValue: _currentTime >= 10 ? _currentTime : '0' + _currentTime
      })
      if (t.data.inner[index].duration) {
        t.setData({
          duration: t.data.inner[index].duration.toFixed(2) * 100
        })
        console.log(t.data.inner[index].duration)
      }
    });
    t.data.inner[index].onEnded((res) => {
      console.log('播放结束')
      t.setData({ status: 'pause',value: 0 })
    })
  },
  // 查看面试结果
  checkResultFun:function(){
    var t = this;
    if (t.data.entertype == 'first'){//答题完毕前往面试结果页
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          wx.getStorage({
            key: 'postid',
            success: function (_postid) {
              wx.getStorage({
                key: 'answerArr',
                success: function (_answerArr) {
                  console.log(_answerArr)
                  common.nRequest(
                    getApp().data.services + "api/interview/handlerecord",
                    {
                      profession_id: _postid.data,
                      questions: JSON.stringify(_answerArr.data),
                    },
                    function (res) {
                      console.log(res)
                      if (getApp().data.Reg.test(res.statusCode)) {//返回分数
                        console.log("结果")
                        console.log(res.data.data)
                        // wx.setStorage({
                        //   key: 'record',
                        //   data: res.data.data,
                        // })
                        wx.navigateTo({
                          url: '../aiGrade/aiGrade?percent=' + res.data.data.percent + '&score=' + res.data.data.score + '&id=' + res.data.data.id,
                        })
                      } else if (app.data.status.s402 == res.statusCode) {//返回敏感词
                        console.log("有敏感词")
                        wx.navigateTo({
                          url: '../aiAnswerError/aiAnswerError',
                        })
                      }else{
                        console.log("不知道啥原因了")
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
                    title: '请先回答测试题，再查看面试结果',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            },
          })
        },
      })
    }else{//从面试官记录里面前往面试结果页
      wx.navigateTo({
        url: '../aiGrade/aiGrade?score=' + t.data.interviewdetails.final_score + '&percent=' + t.data.interviewdetails.percent + '&id=' + t.data.interviewdetails.id
        // url: '../aiGrade/aiGrade?score=5&percent=20'
      })
    }
  },
  onUnload:function(){
    console.log("离开答题完毕页面")
    radio.pause()
    this.setData({ status: 'pause', value: 0 })
  }
})