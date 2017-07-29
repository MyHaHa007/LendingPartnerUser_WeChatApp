Page({
  data:{
    userImg : '../../images/tabbar/home/userImg.png',
    flag : true,
    array : ['男','女'],
     index: '',
    record : ['硕士','博士','本科','专科','其他'],
    myrecord :　'',
    date : '',
    place : '',
    autograph : '',
  },
  onLoad:function(){ 
    console.log("111111");
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    console.log("off");
  },
  // changeheading : function(e){
  //    var that = this;
  //    //上传头像
  //    wx.chooseImage({
  //      count: 1, // 最多可以选择的图片张数，默认9
  //      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
  //      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
  //      success: function(res){
  //        // success
         
  //        console.log(res)
  //        var tempFilePaths = res.tempFilePaths[0];
  //        that.setData({
  //            userImg : tempFilePaths
  //        })
  //        App.appImg.homeImages = {userImg:tempFilePaths};
      
  //        wx.uploadFile({
  //     url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
  //     filePath: tempFilePaths[0],
  //     name: 'file',
  //     formData:{
  //       'user': 'test'
  //     },
  //     success: function(res){
  //       var data = res.data
  //       console.log(data);
  //     }
  //   })
  //      },
  //      fail: function(res) {
  //        // fail
  //      },
  //      complete: function(res) {
  //        // complete
  //      }
  //    })
  // },
  sexChange : function(e){
    this.setData({
      index : e.detail.value
    })
  },
  bornchange : function(e){
     this.setData({
        date : e.detail.value
     })    
  },
  recordchange : function(e){
     this.setData({
        myrecord : e.detail.value
     })
  }
})