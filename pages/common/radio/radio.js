const app = getApp();
var common = require("../../../utils/util.js");
const myaudio = app.globalData.audio;
// const mybgaudio = app.globalData.bgaudio;

let currentSecond = 0;
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    'isplay': {
      type: String, //必填，目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: ""     //可选，默认值，如果页面没传值过来就会使用默认值
    }
  },
  data: {
    // 这里是一些组件内部数据
    isplay: 'pause',
    img: "",
    isShow: false,
    token:'',
    courseDetails:{}
  },
  created:function(){
    console.log("1")
  },
  attached:function(){
    var t = this;
    console.log("2")
    wx.getStorage({
      key: 'token',
      success: function(res) {
        t.setData({
          token:res.data
        })
      },
    })
    wx.getStorage({
      key: 'currentMedia',
      success: function(res) {
        t.setData({
          courseDetails:res.data,
          img: res.data.class_image,
          isShow: true
        })
        if (myaudio.src != res.data.url) {
          myaudio.src = res.data.url;
        }
      },
    })
  },
  ready: function() {
    // console.log(this.data.token)
    // console.log(myaudio)
    if (myaudio.paused) {
      this.setData({
        isplay: 'pause'
      });
    } else {
      this.setData({
        isplay: 'play'
      });
      wx.getStorage({
        key: 'currentMedia',
        success: (res) => {
          const data = res.data;
          this.setData({
            img: data.class_image,
          });
        },
      })
    }

    wx.getStorage({
      key: 'currentMedia',
      success: (res) => {
        const data = res.data;
        if (data) {
          this.setData({
            img: data.class_image,
            isShow: true
          });
          if (myaudio.src != data.url) {
            myaudio.src = data.url;
          }
        }
      },
    })
    myaudio.onPlay(() => {
      this.setData({
        isplay: 'play',
        // isShow: true
      });
      getApp().globalData.isplay = 'play';
      getApp().globalData.isShow = true;
      console.log(getApp().globalData)
      wx.getStorage({
        key: 'currentMedia',
        success: (res) => {
          const data = res.data;
          this.setData({
            img: data.class_image
          });
        },
      })
    });
    myaudio.onPause(() => {
      this.setData({
        isplay: 'pause'
      });
      getApp().globalData.isplay = 'pause';
    });
    myaudio.onStop(() => {
      console.log("clickstop")
      // this.setData({
      //   isShow: false
      // });
      getApp().globalData.isShow = false;
    });
    myaudio.onTimeUpdate(() => {
      currentSecond = myaudio.currentTime;
      // console.log(currentSecond);
    });

  },
  methods: {
    // 这里是一个自定义方法
    // 封装更新小节播放进度接口
    updateaudioTime: function (_id, _time, _free) {
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
    pausefun() {
      this.triggerEvent("pauseEvent", { isplay: 'pause' });
      //triggerEvent函数接受三个值：事件名称、数据、选项值  
    },
    playfun() {
      this.triggerEvent("playEvent", { isplay: 'play' });
      //triggerEvent函数接受三个值：事件名称、数据、选项值  
    },
    // 播放
    playAudio: function() {
      console.log("播放")
      myaudio.play();
      this.setData({
        isplay: 'play'
      })
      
    },
    // 暂停
    pauseAudio: function() {
      console.log("暂停");
      console.log(myaudio.currentTime)
      myaudio.pause();
      this.setData({
        isplay: 'pause'
      })
      // 此处调用更新小节播放进度接口
      this.updateaudioTime(this.data.courseDetails.id, myaudio.currentTime, this.data.courseDetails.is_free)
    },
    // 关闭
    close: function() {
      const t = this;
      console.log("关闭")
      console.log(myaudio.currentTime)
      // 此处调用更新小节播放进度接口
      t.updateaudioTime(t.data.courseDetails.id, myaudio.currentTime, t.data.courseDetails.is_free)
      myaudio.stop();
      t.setData({
        isShow: false
      })
      wx.setStorage({
        key: 'bygoneId',
        data: ''
      })
    },
    broadcastLink: function() {
      wx.navigateTo({
        url: '../broadcast/broadcast?buoy=true&currentSecond=' + parseInt(currentSecond),
      })
    }
  }
})