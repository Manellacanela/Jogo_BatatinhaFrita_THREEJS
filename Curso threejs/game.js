
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


const loader = new THREE.GLTFLoader();


loader.load("../tree/scene.gltf",function(gltf){
	scene.add(gltf.scene);
	gltf.scene.scale.set(16, 16, 16);
	gltf.scene.position.set(0, -1, 0);
})


class Player{
	constructor(){
		const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
		const material = new THREE.MeshBasicMaterial({color: 0xffffff});
		const player = new THREE.Mesh(geometry,material);
		scene.add(player);
		this.player = player;

		player.position.x = 3;
		player.position.y = 0;
		player.position.z = 0;

		this.playerInfo={
			positionX: 6,
			velocity: 0
		}
	}

	anda(){
		this.playerInfo.velocity = 0.1;
	}

	update(){
		this.checa();
		this.playerInfo.positionX -= this.playerInfo.velocity;
		this.player.position.x = this.playerInfo.positionX
	}

	para(){
		this.playerInfo.velocity = 0;
	}

	checa(){
		if(this.playerInfo.velocity>0 && !tadecostas){
		    text.innerText = "Você perdeu!"
			gamestatus = "fimdejogo"
		}
		if(this.playerInfo.positionX < -6){
			text.innerText = "Você ganhou!"
			gamestatus = "fimdejogo"
		}
	}
}


function delay(ms){
	return new Promise(resolve => setTimeout(resolve,ms));
}


class boneca{
	constructor(){
		loader.load("../model/scene.gltf", (gltf)=>{
		scene.add(gltf.scene);
		gltf.scene.scale.set(0.4, 0.4, 0.4);
		gltf.scene.position.set(0, -1, -1);
		this.Boneca1 = gltf.scene;
})
	}

	praTras(){
		gsap.to(this.Boneca1.rotation, {y:-3.15, duration: 1});
		setTimeout(()=>tadecostas=true,150);
	}

	praFrente(){
		gsap.to(this.Boneca1.rotation, {y:0, duration: 1});
		setTimeout(()=>tadecostas=false, 450);
	}

	async start(){
		this.praTras();
		await delay((Math.random()*1000)+2000);
		this.praFrente();
		await delay((Math.random()*1000)+1000);
		this.start();
	}
}

let Player1 = new Player();
let Boneca1 = new boneca();
const text = document.querySelector(".text");
const tmaximo = 100;
let gamestatus = "esperando";
let tadecostas = true;

async function init(){
	await delay(500);
	text.innerText = "Começando em 3";
	await delay(500);
	text.innerText = "Começando em 2";
	await delay(500);
	text.innerText = "Começando em 1";
	await delay(500);
	text.innerText = "VAI!";
	startGame();
}

function startGame(){
	gamestatus = "jogando"
	Boneca1.start();
	setTimeout(()=>{
		if(gamestatus != "fimdejogo"){
			text.innerText = "Timeout!"
			gamestatus = "fimdejogo"
		}
	}, tmaximo*1000)
}

init()



const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

renderer.setClearColor(0x8601af,1);


camera.position.z = 5;

function animate(){
	if(gamestatus == "fimdejogo") return
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	Player1.update();
}

animate();


window.addEventListener('resize', onWindowResize, false)


function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight)
}


window.addEventListener('keydown', function(e){
	if(gamestatus != "jogando") return;
	if(e.keyCode == 37){
		Player1.anda();
	}
})


window.addEventListener('keyup',function(e){
	if(e.keyCode == 37){
		Player1.para()
	}
})