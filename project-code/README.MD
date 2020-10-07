# - 序章 - THREE-JS 来源

> threejs是干嘛的？

    提供一套接口用于创建三维场景

> WebGL与ThreeJs的关系

    WebGL （Web Graphics Library） 是一种3D绘图标准, WebGL可以直接使用显卡资源创建高性能的二维和三维图形，供我们创建3d场景和模型，但是直接使用WebGL创建三维动画场景十分复杂，而且容易出问题，ThreeJs（three-dimension + js）就诞生了。

> ThreeJs可以做些什么？

    1.创建简单甚至复杂的三维几何图形
    2.创建虚拟现实和增强现实场景
    3.给物体添加纹理和材质
    4.使用光源装饰场景
    5.加载三维模型所创建的物体
    6.为三维场景添加高级后期处理效果
    7.使用自定义着色器以及粒子系统等 
                            -《Three.js开发指南》 - Jos Dirksen

> 兼容性

- 几乎所有浏览器的桌面端，移动端都支持WebGL, 唯一例外是：移动迷你版opera（mini）浏览器， 因为它支持服务端渲染，而opera服务器禁止运行js,从8.0版本后默认的工作模式被修改支持js和WebGL
- 对于ThreeJs, 现代基本所有浏览器都支持，IE10以及以下可以安装插件 [iewebgl](https://github.com/iewebgl/iewebgl)
  

# 1-如何创建一个三维场景

> 前期准备工作

- 案例源码地址： https://github.com/josdirksen/learning-threejs-third

- 中文案例地址：http://www.webgl3d.cn/threejs/docs/

- 如果需要加载外部文件，比如模型，文件，需要服务器来保证资源正常加载【http-server, Moongoose等】
  
- 禁用浏览器安全性检查(在没有web服务时正常运行代码，避免这种方式访问真正的网站，避免遭受恶意代码攻击）
    - windows
    
        ```
        chrome.exe --disable-web-security
        ```
    - linux
    
        ```
        google-chrome.exe --disable-web-security
        ```
    - mac os
    
        ```
        open -a "Google Chrome" --args disable-web-security
        ```

- 对于firefox 需要进行额外配置
    
    地址栏输入
    ```
    about:config
    ```

    搜索框输入(设置为false)：
    ```
    security.fileuri.strict_origin_policy
    ```

> 第一个案例 创建一个三维场景

- npm方式 添加依赖

    ```
    npm install three --save
    ```



- 库文件引入方式
 https://github.com/josdirksen/learning-threejs-third/learning-threejs-third/libs/three/three.js

主要流程（具体代码查看src\first-scene\index.js）：

```javascript
 function init (domId) {

     // 1. 创建场景
     scenIns = new THREE.Scene();
    
    // 1. 创建相机（常用的是透视和正交）
	/**
	 * @param [fov=50] Camera frustum vertical field of view. Default value is 50. 视场，视野范围 50度
	 * @param [aspect=1] Camera frustum aspect ratio. Default value is 1.长宽比 决定横视场和纵向视场的比例
	 * @param [near=0.1] Camera frustum near plane. Default value is 0.1. 近截面
	 * @param [far=2000] Camera frustum far plane. Default value is 2000. 远截面
	 */
    cameraIns = new THREE.PerspectiveCamera(45, WINDOW_INNER_WIDTH / WINDOW_INNER_HEIGHT, 0.1, 1000);


    // 创建渲染器
    rendererIns = new THREE.WebGLRenderer();
    rendererIns.setClearColor(new THREE.Color(0x000000));
    rendererIns.setSize(WINDOW_INNER_WIDTH, WINDOW_INNER_HEIGHT);

    // 调用方法进行添加三维物体
    addAxies(scenIns);
    addPanel(scenIns);
    createCube(scenIns);
    createSphere(scenIns);

    // 摄像机参数设置
    cameraIns.position.set(-30, 40, 30);
    cameraIns.lookAt(scenIns.position);

    // html节点进行渲染器挂载
    document.getElementById(domId).appendChild(rendererIns.domElement);

    // 场景渲染
    rendererIns.render(scenIns, cameraIns);
 }
```

# 鼠标操作三维场景-OrbitControls.js

- 引入依赖
-     <script type="text/javascript" charset="UTF-8" src="./libs/three/controls/OrbitControls.js"></script>
```

    // render(); // 函数替换

    // 使用轨道控制器
    let controls = new THREE.OrbitControls(cameraIns,rendererIns.domElement);//创建控件对象
    controls.addEventListener('change', render);//监听鼠标、键盘事件

```

# 加载.obj模型文件

模型的创建：Maya, 3dmax、blender软件导出的三维模型文件本质上是json

Geometry、Material、Light、Object3D等类，都提供了一个方法.toJSON(),可以导出Threejs三维模型的各类数据，该方法的功能就是把Threejs的几何体、材质、光源等对象转化为JSON格式导出。

Threejs在three.js-master\examples\js\loaders目录下会提供一系列的加载器,这些加载器本质上都是解析模型文件的字符串，通过正则表达式提取相关的顶点、材质等信息转化为Threejs自身的类表示的对象


- 只加载obj文件
引入路径three.js-master/examples/js/loaders/OBJLoader.js下的OBJLoader.js文件即可

<!-- 引入obj模型加载库OBJLoader.js -->
<script src="../../three.js-master/examples/js/loaders/OBJLoader.js"></script>

```
/**
 * OBJ文件加载  只加载obj文件中的几何信息，不加载材质文件.mtl
 */
var loader = new THREE.OBJLoader(); // 实例化THREE.OBJLoader();

// 没有材质文件，系统自动设置Phong网格材质
loader.load('./立方体/box.obj',function (obj) { // load函数接受两个参数：文件以及回调函数
  scene.add(obj);
  
  // 加载后的一些编辑操作
  obj.children[0].scale.set(20,20,20);//网格模型缩放
  obj.children[0].geometry.center();//网格模型的几何体居中
  obj.children[0].material.color.set(0xff0000);//设置材质颜色
})
```

- 同时加载obj文件和mtl文件
mtl文件包含模型的材质信息，纹理路径，贴图信息等

```
<!-- 引入obj模型加载库OBJLoader.js -->
<script src="../../three.js-master/examples/js/loaders/OBJLoader.js"></script>
<!-- 引入obj模型材质加载库MTLLoader.js -->
<script src="../../three.js-master/examples/js/loaders/MTLLoader.js"></script>

// 两个加载器的实例化
var OBJLoader = new THREE.OBJLoader();//obj加载器
var MTLLoader = new THREE.MTLLoader();//材质文件加载器

// 先加载材质文件，赋给模型加载器，然后加载模型
MTLLoader.load('./立方体/box.mtl', function(materials) {
  OBJLoader.setMaterials(materials);
  OBJLoader.load('./立方体/box.obj', function(obj) {
    obj.scale.set(10, 10, 10); //放大obj组对象
    scene.add(obj);//返回的组对象插入场景中
  })
})

```
.obj文件不包含场景的相机Camera,光源等信息，不能导出骨骼动画，如果希望导出光照，相机，骨骼动画，变形动画信息，可以选择.fbx、.gltf等格式

# fbx文件加载以及动画解析

stl、obj都是静态模型，不可以包含动画，fbx除了包含几何、材质信息，可以存储骨骼动画等数据

- 动画相关的数据是如何存储的
obj.animations属性的数组包含两个剪辑对象AnimationClip，obj.animations[0]对应剪辑对象AnimationClip包含多组关键帧KeyframeTrack数据，obj.animations[1]对应的剪辑对象AnimationClip没有关键帧数据，也就是说没有关键帧动画

```
var loader = new THREE.FBXLoader();//创建一个FBX加载器
loader.load("SambaDancing.fbx", function(obj) {
  // 查看动画数据  2个剪辑对象AnimationClip
  console.log(obj.animations)

})
```

- 解析fbx模型骨骼动画
```
var mixer=null;//声明一个混合器变量
var loader = new THREE.FBXLoader();//创建一个FBX加载器

loader.load("SambaDancing.fbx", function(obj) {
  scene.add(obj)
  // obj作为参数创建一个混合器，解析播放obj及其子对象包含的动画数据
  mixer = new THREE.AnimationMixer(obj);
  // 查看动画数据
  console.log(obj.animations)
  // obj.animations[0]：获得剪辑对象clip
  var AnimationAction=mixer.clipAction(obj.animations[0]);
  // AnimationAction.timeScale = 1; //默认1，可以调节播放速度
  // AnimationAction.loop = THREE.LoopOnce; //不循环播放
  // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
  AnimationAction.play();//播放动画
})
// 创建一个时钟对象Clock
var clock = new THREE.Clock();

// 渲染函数
function render() {
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧

  if (mixer !== null) {
    //clock.getDelta()方法获得两帧的时间间隔
    // 更新混合器相关的时间
    mixer.update(clock.getDelta());
  }
}
render();
```
## 小案例

- 加载一个OBJ文件并进行贴图

```
var loader = new THREE.OBJLoader();
loader.load('./model.obj',function (obj) {
  //加载纹理贴图texture1.png
  var texture = new THREE.TextureLoader().load('texture1.png');
  
  // 颜色贴图中已经包含了光照信息，所以直接使用不受光照影响的基础网格材质MeshBasicMaterial
  obj.children[0].material= new THREE.MeshBasicMaterial({
    map:texture,//设置颜色纹理贴图
  })
  scene.add(obj);
})
```


# 帧动画

- 编辑关键帧并解析播放

使用关键帧KeyframeTrack和剪辑AnimationClip编写一个关键帧动画，然后调用操作AnimationAction、混合器AnimationMixer播放编写好的关键帧动画

一般的动画都是3维软件里面编辑好进行导出的，不需要编码实现

- 创建2个网格模型，并添加一个父对象

```
/**
 * 创建两个网格模型并设置一个父对象group
 */
mesh1.name = "Box"; //网格模型1命名
mesh2.name = "Sphere"; //网格模型2命名
group.add(mesh1); //网格模型添加到组中
group.add(mesh2); //网格模型添加到组中
```

- 编辑动画数据

```
/**
 * 编辑group子对象网格模型mesh1和mesh2的帧动画数据
 */
// 创建名为Box对象的关键帧数据
var times = [0, 10]; //关键帧时间数组，离散的时间点序列
var values = [0, 0, 0, 150, 0, 0]; //与时间点对应的值组成的数组

// 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
var posTrack = new THREE.KeyframeTrack('Box.position', times, values);

// 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
var colorKF = new THREE.KeyframeTrack('Box.material.color', [10, 20], [1, 0, 0, 0, 0, 1]);

// 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
var scaleTrack = new THREE.KeyframeTrack('Sphere.scale', [0, 20], [1, 1, 1, 3, 3, 3]);

// duration决定了默认的播放时间，一般取所有帧动画的最大时间
// duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
var duration = 20;

// 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间20
var clip = new THREE.AnimationClip("default", duration, [posTrack, colorKF, scaleTrack]);
```

- 播放动画数据，AnimationAction和混合器AnimationMixer两个API播放已有的帧动画数据

```
// group作为混合器的参数，可以播放group中所有子对象的帧动画
var mixer = new THREE.AnimationMixer(group);

// 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
var AnimationAction = mixer.clipAction(clip);

//通过操作Action设置播放方式
AnimationAction.timeScale = 20;//默认1，可以调节播放速度

// AnimationAction.loop = THREE.LoopOnce; //不循环播放
AnimationAction.play();//开始播放

```

- render函数修改

```
// 创建一个时钟对象Clock
var clock = new THREE.Clock();
// 渲染函数
function render() {
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧

  //clock.getDelta()方法获得两帧的时间间隔
  // 更新混合器相关的时间
  mixer.update(clock.getDelta());
}
render();
```

## 解析外部模型的动画

```
"object": {
  // 绑定动画的模型名称Box
  "name": "Box",
...
},
// 动画数据
"animations": [{
  "name": "default",
  "fps": 24,
  "tracks": [
    // 位置变化关键帧
    {
    "type": "vector3",
    "name": "Box.position",
    "keys": [{
      "value": [0, 0, 0],
      "time": 0
    }, {
      "value": [-100, 0, 0],
      "time": 50
    },...]
  },
  // 角度变化关键帧
  {
    "type": "quaternion",
    "name": "Box.quaternion",
    "keys": [{
      "value": [0, 0, 0, 0],
      "time": 0
    },...]
  },
  // 颜色变化关键帧
  {
    "type": "color",
    "name": "Box.material.color",
    "keys": [{
      "value": [1, 0, 0, 1],
      "time": 20
    }, ...]
  }]
}]
```

加载一个播放模型帧动画
```
// 通过ObjectLoader加载模型文件model.json
var loader = new THREE.ObjectLoader();

var mixer = null; //声明一个混合器变量

// 加载文件返回一个对象obj
loader.load("model.json", function(obj) {
  obj.scale.set(15, 15, 15);//缩放加载的模型

  scene.add(obj);

  // obj作为混合器的参数，可以播放obj包含的帧动画数据
  mixer = new THREE.AnimationMixer(obj);

  // obj.animations[0]：获得剪辑clip对象
  // // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
  var AnimationAction = mixer.clipAction(obj.animations[0]);

  AnimationAction.play();
});

```


```
// 创建一个时钟对象Clock
var clock = new THREE.Clock();
// 渲染函数
function render() {
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧

  if(mixer!==null){
    //clock.getDelta()方法获得两帧的时间间隔
    // 更新混合器相关的时间
    mixer.update(clock.getDelta());
  }
}
render();

```


- 滚动条手动控制动画播放，vue+element

```
<div id="app">
  <div class="block" style="display:inline;width:500px">
    <el-slider v-model="time" show-input :max=20 :step=0.01></el-slider>
  </div>
</div>
<script>
...
...

// 复习一下
// 关键帧KeyframeTrack、剪辑AnimationClip、操作AnimationAction、混合器AnimationMixer

  var mixer = new THREE.AnimationMixer(mesh);
  var AnimationAction = mixer.clipAction(clip);
  AnimationAction.loop = THREE.LoopOnce;
  AnimationAction.clampWhenFinished = true;

  //实例化vue
  vm = new Vue({
    el: "#app",
    data: {
      time: 0,
    },
    watch: {
      time:function (value) {
        // 开始结束时间设置为一样，相当于播放时间为0，直接跳转到时间点对应的状态
        AnimationAction.time = value; //操作对象设置开始播放时间
        clip.duration = AnimationAction.time;//剪辑对象设置播放结束时间
        AnimationAction.play(); //开始播放
      }
    },
  })
</script>
```

# 粒子系统模拟下雨

```
/**
 * 精灵创建下雨效果
 */
// 加载雨滴理贴图
var textureTree = new THREE.TextureLoader().load("rain.png");
// 批量创建表示雨滴的精灵模型
for (let i = 0; i < 400; i++) {
  var spriteMaterial = new THREE.SpriteMaterial({
    map:textureTree,//设置精灵纹理贴图
  });
  // 创建精灵模型对象
  var sprite = new THREE.Sprite(spriteMaterial);
  scene.add(sprite);
  // 控制精灵大小,
  sprite.scale.set(8, 10, 1); //// 只需要设置x、y两个分量就可以
  var k1 = Math.random() - 0.5;
  var k2 = Math.random() - 0.5;
  var k3 = Math.random() - 0.5;
  // 设置精灵模型位置，在整个空间上上随机分布
  sprite.position.set(200 * k1, 200*k3, 200 * k2)
}

```

把雨滴模型添加到组里面
```
// 创建一个组表示所有的雨滴
var group = new THREE.Group();
// 批量创建雨滴精灵模型
for (let i = 0; i < 400; i++) {
...
  group.add(sprite);
}
scene.add(group);//雨滴群组插入场景中
```


在渲染函数里面进行绘制
```
// 渲染函数
function render() {
  // 每次渲染遍历雨滴群组，刷新频率30~60FPS，两帧时间间隔16.67ms~33.33ms
  // 每次渲染都会更新雨滴的位置，进而产生动画效果
  group.children.forEach(sprite => {
    // 雨滴的y坐标每次减1
    sprite.position.y -= 1;
    if (sprite.position.y < 0) {
      // 如果雨滴落到地面，重置y，从新下落
      sprite.position.y = 200;
    }
  });
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render);//请求再次执行渲染函数render，渲染下一帧
}
```