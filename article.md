# THREE.js设置背景图和播放动画学习 | 大帅老猿threejs特训

## 本文能学到什么
作者的three.js属于入门的，最近跟着大帅的训练营，学习了three.js如何设置全景图背景和播放动画，本文章使用的模型和图片都是事先提供好的，我们只需要实现加载背景图、加载模型和播放动画即可

## 具体实现

### 初始化
首先我们按照常规，生成scene、camera和renderer

```javascript
let scene, camera, renderer
function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0.6, 0.6, 1);
    document.body.appendChild(renderer.domElement);

}

init()
```

### 加载模型

```javascript

function loadModel() {
    const gltfLoader = new GLTFLoader()
    gltfLoader.load('../resources/models/donuts.glb', gltf => {
        scene.add(gltf.scene);
    });
}

loadmodel()

```

### 初始化控制器

```javascript
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}
initControls()
```

### 渲染
```javascript
function animate() {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(animate)
}
```

### 模拟太阳光
这时候整个场景事黑色的，我们加个directionLight，模拟太阳光
```javascript
function init() {
    ...
    const directionLight = new THREE.DirectionalLight(0xffffff, 0.4);
    scene.add(directionLight);
}
```

### 加载背景图
```javascript
function loadBackground() {
    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('../resources/hdr/sky.hdr', function (texture) {
        scene.background = texture;
    });
}

loadModel()
loadBackground()
```
首先这里使用hdr，hdr比普通的jpg和png，在光亮很强或者很暗的地方，能够展示更多的细节，而普通的jpg、png就只能显示白色或者黑色
我们单纯的给scene设置背景，就是固定的背景，我们希望变成全景图的背景，需要设置几个值，这几个值的含义如下：
* ```THREE.EquirectangularReflectionMapping```叫做经纬线映射贴图，设置这个值，就能实现图片全景展示
* ```scene.environment = texture;```若该值不为null，则该纹理贴图将会被设为场景中所有物理材质的环境贴图。 然而，该属性不能够覆盖已存在的、已分配给 MeshStandardMaterial.envMap 的贴图。默认为null。
* ```renderer.outputEncoding```属性控制输出渲染编码。默认情况下，outputEncoding的值为THREE.LinearEncoding，看起来还行但是不真实，将值改为```THREE.sRGBEncoding```后效果会更真实


```javascript
function loadBackground() {
    ...
    rgbeLoader.load('../resources/hdr/sky.hdr', function (texture) {
        scene.background = texture;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        renderer.outputEncoding = THREE.sRGBEncoding;
    });
}
```

### 播放动画
先补充一些知识点：
* 我们使用软件制作模型的时候，通常有两种动画制作的模式：变形动画和骨骼动画。我们这里用到的是变形动画，就不展开骨骼动画了。
* 使用变形动画，你需要定义网格变形之后的状态，或者说是关键位置。对于变形目标，所有的顶点位置都会被存储下来。你所需要做的是将所有的顶点从一个位置移动到另一个定义好的关键位置，并重复该过程。
* 变形动画优点是能够得到更好的效果，因为它将每一个动作每一个顶点的位置都存储了下来，这样相应的缺点是会造成文件变大。
* ```AnimationMixer```对象是场景中特定对象的动画播放器。当场景中的多个对象独立动画时，可以为每个对象使用一个AnimationMixer。我们需要透过这个对象实现动画。
* 再用AnimationMixer对象的clipAction方法生成可以控制执行动画的实例。
* 我们的动画只需要执行一次，所以设置```action.loop = THREE.LoopOnce```
* 我们需要在动画结束后，保持结束动画的状态，需要设置```action.clampWhenFinished = true```

```javascript
gltfLoader.load('../resources/models/donuts.glb', gltf => {
        scene.add(gltf.scene);

        mixer = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        clips.forEach(clip => {
            const action = mixer.clipAction(clip);
            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true
            action.play()
        })
    });
```
### 自动旋转
因为是一个观赏性的物品，我们给我们的甜甜圈加上自动旋转
```javascript

function loadModel() {
    ...
    gltfLoader.load('../resources/models/donuts.glb', gltf => {
        donuts = gltf.scene;
        scene.add(donuts);
        mixer = new THREE.AnimationMixer(donuts);
        ...
    });
}

function animate() {
    ...
    if (donuts){
        donuts.rotation.y += 0.01;
    }
    ...
}

```

## 结尾
我们的基本功能都实现了，我认为重点是加载背景图和播放动画两个点需要重点学习，虽然代码简单，但是需要理解的内容还是不少的。
附上github地址：https://github.com/luch1994/three-demos
最后，加入猿创营 (v:dashuailaoyuan)，一起交流学习