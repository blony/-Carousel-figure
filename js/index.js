
//----------获取和创建-----------
var box = myId("box");
var screen = box.children[0];//可视区域
var list = screen.children[0];//运动的ul
var lisUl = list.children;//图片个数
var ol = screen.children[1];//放置小方块按钮
var arr = box.children[1];//放置箭头的父盒子
var arrLeft = arr.children[0];//操作的箭头
var arrRight = arr.children[1];//操作的箭头
var imgWid = screen.offsetWidth;

//1 总体分为两部分: 简单轮播图，左右焦点图
//2 实现简单轮播图：点击按钮变色，list的运动
//3 点击按钮变色：根据图片个数创建按钮,实现变色

//4 左右焦点图：移入移出显示隐藏，点击运动
//5 点击运动：先跑起来，找到需要特殊处理的点
//6 特殊处理部分：如何判断当前状态？进行什么操作？

//1 创建小方块部分
for (var i = 0; i < lisUl.length; i++) {
    var li = document.createElement("li");
    ol.appendChild(li);
    li.innerHTML = i + 1;
}


//2 设置样式，默认第一个显示
var lisOl = ol.children;
lisOl[0].className = "current";

//3 点击按钮变色,同时设置list进行运动
for (var i = 0; i < lisOl.length; i++) {
    lisOl[i].index = i;
    //点击事件
    lisOl[i].onclick = function () {
        //判断一下，如果当前显示的是假的第一张，抽回
        if (pic == lisUl.length - 1) {
            list.style.left = 0 + "px";
        }

        for (var i = 0; i < lisOl.length; i++) {
            lisOl[i].className = "";
        }
        this.className = "current";
        //4 点击按钮的时候设置ul滚动
        var target = -this.index * imgWid;
        animate(list, target);

        //-------让pic跟索引值同步-------
        pic = this.index;
    };
}

//--------操作左右按钮部分--------
//  //6 由于点击左右按钮时需要无缝滚动，我们克隆第一张图片
var firstPic = lisUl[0].cloneNode(true);
list.appendChild(firstPic);


//5 点击效果
var pic = 0;

arrRight.onclick = function () {
    //在某一次点击的时候，如果当前显示的是假的第一张，我们需要先抽回，然后继续运动
    //判断pic的值，如果是length-1，这时抽回
    if (pic == lisUl.length - 1) {
        list.style.left = 0 + "px";//抽回
        pic = 0;
    }
    //！！千万别加else，因为滚动是每次执行所必需的
    pic++;
    animate(list, -pic * imgWid);

    //设置对应的按钮进行变色
    for (var i = 0; i < lisOl.length; i++) {
        lisOl[i].className = "";
    }
    //由于pic可能取到5，lisUl的元素个数比lisOl的个数多1,
    //所以当我们显示假的第一张时，显示第一个按钮
    if (pic == lisUl.length - 1) {//这个判断会比上面的判断先一次点击执行
        lisOl[0].className = "current";
    } else {
        lisOl[pic].className = "current";
    }


};

arrLeft.onclick = function () {

    //检测，如果当前已经是真的第一张了，这时抽到假的第一张显示的位置
    if (pic == 0) {
        list.style.left = -(list.offsetWidth - imgWid) + "px";
        pic = lisUl.length - 1;//设置为5
    }
    //先跑起来
    pic--;
    animate(list, -pic * imgWid);

    //对应按钮显示
    for (var i = 0; i < lisOl.length; i++) {
        lisOl[i].className = "";
    }
    //因为pic的作用是表示当前滚过的图片张数
    //但是点击左按钮的时候，没有机会停在假的第一张上。所以取不到lisUl.length - 1
    lisOl[pic].className = "current";
};


//------------自动播放部分--------------
//通过观察我们发现，自动播放，实际上就是间隔固定的时间，执行点击右按钮这件事
var timer = null;
timer = setInterval(function () {
    arrRight.click();
}, 2500);

box.onmouseover = function () {
    arr.style.display = "block";
    //移入时让自动播放停止
    clearInterval(timer);
};

box.onmouseout = function () {
    arr.style.display = "none";
    //再次设置自动播放
    timer = setInterval(play, 2500);
};


function play() {
    //在某一次点击的时候，如果当前显示的是假的第一张，我们需要先抽回，然后继续运动
    //判断pic的值，如果是length-1，这时抽回
    if (pic == lisUl.length - 1) {
        list.style.left = 0 + "px";//抽回
        pic = 0;
    }
    //！！千万别加else，因为滚动是每次执行所必需的
    pic++;
    animate(list, -pic * imgWid);

    //设置对应的按钮进行变色
    for (var i = 0; i < lisOl.length; i++) {
        lisOl[i].className = "";
    }
    //由于pic可能取到5，lisUl的元素个数比lisOl的个数多1,
    //所以当我们显示假的第一张时，显示第一个按钮
    if (pic == lisUl.length - 1) {//这个判断会比上面的判断先一次点击执行
        lisOl[0].className = "current";
    } else {
        lisOl[pic].className = "current";
    }


}

//缓动的animate
function animate(tag, target) {
    clearInterval(tag.timer);
    tag.timer = setInterval(function () {
        var leader = tag.offsetLeft;//取值时，会进行四舍五入
        //var step = 10;//步长是固定值，导致运动是匀速效果
        // 缓动公式： （目标位置 - 当前位置）/10
        var step = (target - leader) / 10;
        //对step进行取整操作
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        leader = leader + step;
        tag.style.left = leader + "px";
        //尽管盒子会在到达位置时停住但是我们还要清除定时器
        if (leader == target) {
            clearInterval(tag.timer);
        }
    }, 17);
}
function myId(id) {
    return document.getElementById(id);
}
