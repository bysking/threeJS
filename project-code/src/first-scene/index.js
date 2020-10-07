/**
 * cpx 第一个场景示例代码
 */

 const WINDOW_INNER_WIDTH = window.innerWidth; // 宽
 const WINDOW_INNER_HEIGHT = window.innerHeight; // 高

 let rendererIns = null; //渲染器实例
 let scenIns = null; // 场景实例
 let cameraIns = null; // 场景实例
 let rotateCube = null;

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

    // 添加坐标轴
    addAxies(scenIns);
    addPanel(scenIns);
    rotateCube = createCube(scenIns);
    createSphere(scenIns);

    // 设置摄像机指向
    cameraIns.position.set(-30, 40, 30);
    cameraIns.lookAt(scenIns.position);

    // html节点进行渲染器挂载
    document.getElementById(domId).appendChild(rendererIns.domElement);

    // 场景渲染
    // rendererIns.render(scenIns, cameraIns);
    // render();

    // 使用轨道控制器
    let controls = new THREE.OrbitControls(cameraIns,rendererIns.domElement);//创建控件对象
    controls.addEventListener('change', render);//监听鼠标、键盘事件
 }

 // 添加坐标轴
 function addAxies (scene, option = {}) {
    let axes = new THREE.AxesHelper(option.width || 20);
    scene.add(axes);
 }

 // 添加平面
 function addPanel (scene, option = {}) {
       let { width = 60, height = 20, color=0xAAAAAA } = option;

       // 创建几何体
       let planeGeometry = new THREE.PlaneGeometry(width, height); // 宽高

       // 创建材质
       let planeMaterial = new THREE.MeshBasicMaterial({
           color: color
       });

       // 生成平面
       let plane = new THREE.Mesh(planeGeometry, planeMaterial);
   
       // rotate and position the plane
       plane.rotation.x = -0.5 * Math.PI;
       plane.position.set(15, 0, 0);
   
       // add the plane to the scenee
       scene.add(plane);  
 }

 // 创建立方体
 function createCube (scene,  option = {}) {
       // create a cube
       var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
       var cubeMaterial = new THREE.MeshBasicMaterial({
           color: 0xFF0000,
           wireframe: true // 线框
       });
       var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
   
       // position the cube
       cube.position.set(-4, 3, 0);
   
       // add the cube to the scene
       scene.add(cube);
       return   cube;
 }

 // 创建球体
 function createSphere (scene, option = {}) {
    // create a sphere
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777FF,
        wireframe: true
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.set(20, 4, 2);

    // add the sphere to the scene
    scene.add(sphere);
 }

 // 渲染函数
function render() {
    rendererIns.render(scenIns, cameraIns);//执行渲染操作
    rotateCube.rotateY(0.01);//每次绕y轴旋转0.01弧度
    requestAnimationFrame(render);//请求再次执行渲染函数render
}

