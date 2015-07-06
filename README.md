# page-animate
h5场景页面切换效果

##  h5.loadCssImages()
加载css引用到的图片
##  h5.animate()
  ```
  h5.animate(elements,{
    animation:'fadeIn',
    duration:10000,
    delay:1000,
    count:1,
    function:'ease',
    animationEnd:function(){}
  })
  ```
##  h5.pageTo()
 ```
 h5.pageTo(1);

 h5.pageTo(1, ['fadeOut', 'fadeIn']);
 
 h5.pageTo(1, ['fadeOut', 'fadeIn'],pageInEndCallback);

 h5.pageTo(1,pageInEndCallback);
 
 h5.pageTo(1, ['fadeOut', {
    animation: 'slideInDown',
    duration: 600,
    ...
 }],pageInEndCallback);
 
 ```
 
 
