if (!window.ethereum) {
  alert("MetaMask no está instalada. Por favor, instálala y recarga la página.");
}

const provider = new ethers.BrowserProvider(window.ethereum);
let signer;
let contrato;

const abi = [
  "function crearTarea(string calldata _descripcion)",
  "function completarTarea(uint256 _index)",
  "event TareaCreada(address indexed usuario, string descripcion, uint256 fecha)",
  "event TareaCompletada(address indexed usuario, uint256 index)"
];

const direccionContrato = "0xB40C97862606F96C439703A5D3BC785df974d24F";

let eventosRegistrados = false; 

async function conectar() {
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contrato = new ethers.Contract(direccionContrato, abi, signer);
  console.log(eventosRegistrados);
  if(!eventosRegistrados){
    console.log(eventosRegistrados);
    eventosRegistrados = true;
    console.log(eventosRegistrados);
    contrato.on("TareaCreada", (usuario,descripcion,fecha)=>{
        let lista = document.getElementById("listaTareas");
        let item = document.createElement("li");
        let button = document.createElement("div");
        button.innerHTML=`<button onclick="completarTarea()">Completar</button>`;
        item.innerText=`Usuario: ${usuario}, Descripcion: ${descripcion}, Fecha: ${fecha}`;
        lista.append(item);
        lista.append(button);
    });
    contrato.on("TareaCompletada", (usuario,index)=>{
          let lista = document.getElementById("listaTareasCompletadas");
          let item = document.createElement("li");
          item.innerText=`Usuario: ${usuario}, Index: ${index}`;
          lista.append(item);
    });
  }
}

async function crearTarea() {
    let valor = document.getElementById("valorTarea").value;
    await contrato.crearTarea(valor);
}

async function completarTarea() {
  await contrato.completarTarea(1);
}

conectar();