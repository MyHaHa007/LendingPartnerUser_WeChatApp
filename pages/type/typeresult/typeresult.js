Page({
  data:{
    items : [],
    sourse : '',
    explain : '',
    options : '',
    scrollTop : 0,
    scrollWidth : 0,
    scrollHeight:0,
    page : 0,
    start : 0,
    gotoTop : 'none', 
  },
  onLoad:function(options){
    var that = this;
       wx.getSystemInfo({
           success:function(res){
               that.setData({
                   scrollHeight:res.windowHeight,
                   scrollWidth : res.windowWidth
              })
           }
       })   
     that.setData({
       options: options
     })
     console.log(options.tag);
     wx.request({
       url: 'https://api.douban.com/v2/book/search',
       data: {
         tag : options.tag,
         count : 15,
         start : 0,
       },
       method: 'GET', 
        header: {
          'content-type': 'json'
     }, 
       success: function(res){
         console.log(res.data);
         that.setData({
            items : res.data.books
         })
       }
     })
  },
  click : function(e){
     var index = e.currentTarget.id;
     var items = this.data.items;
     var isbn13 = items[index].isbn13;
     wx.navigateTo({
       url: '../bookdetail/bookdetail?isbn13=' + isbn13,
     })
  },
  onPullDownRefresh : function(){
    //     wx.showLoading({
    //   title : '加载中......',
    //   duration: 500,
    //   mask : 'false',
    // })
    var  page = 1;
    var options = this.data.options;
    var that = this;
    var start = that.data.start;
    that.setData({
      start : start+10
    })
    wx.request({
      url: 'https://api.douban.com/v2/book/search',
      data: {
        tag : options.tag,
        start : start,
      },
      method: 'GET', 
      header: {
        'content-type': 'json'
     }, 
      success: function(res){
        that.setData({
           items : that.data.items.concat(res.data.books)
        })
        page++;   //页面加载
      }
    })
    
  },
  scroll : function(e){
    if(e.detail.scrollTop > 300){
      this.setData({
        gotoTop : 'block'
      })
    }
    else{
      this.setData({
        gotoTop : 'none'
      })
    }
  },
  goTopFun : function(e){
    var scrollTop = this.data.scrollTop;
    this.setData({  
      scrollTop: 0 
    })
  }
})