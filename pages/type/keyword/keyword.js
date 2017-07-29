// pages/keyword/keyword.js
Page({
  data:{
    keyword : '',
    minCount : 'none',
    maxCount : 'block',    
    items : [],
    img: '',
    content: '',
    scrollTop : 0,
    scrollWidth: 0,
    scrollHeight: 0,
    gotoTop : 'none',
    page : 0,
    isbn13 : '',
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          scrollWidth: res.windowWidth
        })
      }
    })
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
    // 页面关闭
  },
  submit : function(e){ 
    var that = this;
    var keyword = e.detail.value.keyword;
    if (keyword != ''){
      wx.request({
        url: 'http://10.0.26.2:5000/api/v1.0/search/' + keyword,
        data: {
         
        },
        header: { 'content-type': 'application/json' },
        method: 'GET',
        success: function (res) {
           var count = res.data.count;          
           console.log(res.data);
          if(count == 0){
            that.setData({
               minCount : 'block',
               maxCount : 'none',
               img: '../../images/tabbar/type/fail.png',
               content: '对不起！没有你想要的结果',
             })
          }
          if (count != 0){
            // wx.showLoading({
            //   title: '加载中......',
            //   duration: 500,
            //   mask: 'false',
            // })
            that.setData({
              minCount: 'none',
              maxCount: 'block',
              keyword: e.detail.value.keyword,
              items : res.data.result
            })
            console.log(that.data.items);
          }
  
        },
        fail: function (res) {
        
        }
      })
    }
  },

  scroll: function (e) {
    if (e.detail.scrollTop > 100) {
      this.setData({
        gotoTop: 'block'
      })
    }
    else {
      this.setData({
        gotoTop: 'none'
      })
    }
  },
  goTopFun: function (e) {
    var scrollTop = this.data.scrollTop;
    this.setData({
      scrollTop: 0
    })
  },
  click : function(e){
    console.log(e);
    var index = e.currentTarget.id;
    var items = this.data.items;
    var isbn13 = items[index].isbn;

    wx.navigateTo({
      url: '../bookdetail/bookdetail?isbn13=' + isbn13,
    })
  }
})