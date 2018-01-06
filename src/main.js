var camera, scene, renderer,light;
var geometry, material, mesh;

var clock = new THREE.Clock();

var mixers = [];

// test cube
// initCube();
// animate();

initLoadFbx()

function initLoadFbx() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    scene = new THREE.Scene();

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    var onProgress = function( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };

    var onError = function( xhr ) {
        console.error( xhr );
    };

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    var loader = new THREE.FBXLoader( manager );

    loader.load( 'res/models/fbx/xsi_man_skinning.fbx', function( object ) {
        object.mixer = new THREE.AnimationMixer( object );
        mixers.push( object.mixer );

        var action = object.mixer.clipAction( object.animations[ 0 ] );
        action.play();

        scene.add( object );
    }, onProgress, onError );

    light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    camera.position.set( 2, 18, 28 );

    animate();
}

function render() {
    renderer.render(scene,camera);
}

function initCube() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );

    if ( mixers.length > 0 ) {
        for ( var i = 0; i < mixers.length; i ++ ) {
            mixers[ i ].update( clock.getDelta() );
        }
    }

    render();

    // requestAnimationFrame( animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    // renderer.render( scene, camera );
}