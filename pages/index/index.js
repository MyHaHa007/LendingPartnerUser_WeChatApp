var app = getApp();
Page({
  data:{
   interval : 3000,
   duration : 1000,
   imgUrls: ['../images/tabbar/index/index_1.png', '../images/tabbar/index/index_2.jpg','../images/tabbar/index/index_3.png'],
   search_input : '',
  },
  onLoad:function(options){

    var that = this;
     wx.request({
       url: 'http://10.0.26.2:5000/api/v1.0/home',
       data: {
          
       },
       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       header: {
         'content-type': 'json'
     },
       success: function(res){
         console.log(res.data);
         that.setData({
           items: res.data.recommend
         })
       },
       fail: function(res) {
         // fail
       },
       complete: function(res) {
         // complete
       }
     })
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  saoma : function(){
    var that = this;
    var token = app.globalData.base64.base;
   // ==================存在该书========================  
  if(!token){
    wx.showToast({
      title: '你还没登录，先去登录吧！',
      image : '../images/tabbar/book/info.png',
      duration : 2000
    })
   }
   else{
    wx.scanCode({
      success: (res) => {
        console.log(res);
        var book_id = res.result;  //图书编号
        var str = book_id.substring(1,book_id.length);
        console.log(str);
    wx.request({
      url: 'http://10.0.26.2:5000/api/v1.0/book_bar/' + str,
      data: {

      },
      header: {
        'content-type': 'json',
        'Authorization': 'Basic ' + token
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        console.log(res.statusCode);
        if (res.statusCode == 200) {
          wx.showModal({
            title: '提示',
            content: '已添加，是否继续扫描添加？',
            success: function (res) {
              if (res.confirm) {
                that.saoma();
              }
            }
          })
        }
        if (res.statusCode != 200){
          wx.showToast({
            title: '对不起，库存没有该书！',
            duration: 3000
          })
        }
      }
    })
  }
    })
   }

  },
  camera : function(){
     console.log("camera")
     wx.chooseImage({
       count: 1, // 最多可以选择的图片张数，默认9
       sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
       sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
       success: function(res){
         // success        
         wx.getImageInfo({
           src: res.tempFilePaths[0],
           success: function (res) {
             console.log(res);
             console.log(res.width)
             console.log(res.height)
           }
         })
         
       },

       fail: function(res) {
         // fail
          console.log("fail")
       },
       complete: function(res) {
         // complete
       }
     })

  },
search_confirm : function(e){
  console.log(e);
  var that = this;
  var search = e.detail.value;
  if (search != ''){
    wx.navigateTo({
      url: '../../../search/search?search=' + search,
    })
  }
},
  recommend : function(e){
    console.log(e);
    var index = e.currentTarget.id;
    var items = this.data.items;
    var isbn13 = items[index].isbn;
    console.log(items[index].isbn13);
    wx.navigateTo({
      url: '../type/bookdetail/bookdetail?isbn13=' + isbn13,
    })
  },


})