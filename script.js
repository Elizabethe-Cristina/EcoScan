const video = document.getElementById('webcam');
const btnScan = document.getElementById('btn-scan');
const btnBusca = document.getElementById('btn-busca');
const inputBusca = document.getElementById('input-busca');
const status = document.getElementById('status');
const resultContainer = document.getElementById('result-container');


let model;

// 1. Banco de Dados Local (Regras Rápidas e Português)
const traducoes = {
    "water bottle": "garrafa de água",
    "beer bottle": "garrafa de cerveja",
    "wine bottle": "garrafa de vidro",
    "coffee mug": "caneca",
    "laptop": "notebook/eletrônico",
    "packet": "embalagem/pacote",
    "mobile phone": "celular",
    "ashcan": "lata de lixo"
};
const dbDescarte = {
    "garrafa": { material: "Plástico/Vidro", instrucao: "Se for plástico (PET), cesto VERMELHO. Se for vidro, cesto VERDE." },
    "papel": { material: "Papel", instrucao: "Cesto AZUL. Não pode estar sujo de gordura ou comida." },
    "lata": { material: "Metal", instrucao: "Cesto AMARELO. Amasse para facilitar a reciclagem." },
    "plastico": { material: "Plástico", instrucao: "Cesto VERMELHO. Lave para retirar resíduos." },
    "copo": { material: "Misto", instrucao: "Se for plástico descartável, cesto VERMELHO. Se for vidro, cesto VERDE." },
    "pilha": { material: "Logística Reversa", instrucao: "Perigoso! Descarte em coletores específicos de farmácias ou mercados." }
};



// 2. Iniciar Câmera
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        return new Promise(resolve => video.onloadedmetadata = () => resolve());
    } catch (err) {
        status.innerText = "Erro: Câmera não acessível.";
    }
}

// 3. Carregar IA
async function init() {
    await setupCamera();
    status.innerText = "Carregando Inteligência Artificial...";
    model = await mobilenet.load();
    status.innerText = "IA Pronta! Aponte ou digite o item.";
    btnScan.disabled = false;
}

// 4. API Externa (Open Food Facts)
async function buscarNaAPIExterna(nome) {
    status.innerText = "Consultando base de dados global...";
    try {
        const url = `https://br.openfoodfacts.org/cgi/search.pl?search_terms=${nome}&search_simple=1&action=process&json=1&fields=product_name,packaging`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
            const p = data.products[0];
            return {
                material: p.packaging || "Misto",
                instrucao: `Produto: ${p.product_name}. Material sugerido: ${p.packaging || 'Misto'}. Descarte conforme o material predominante.`
            };
        }
    } catch (e) { console.error("Erro na API", e); }
    return null;
}

// 5. Exibir Resultado Final
function normalizar(txt) {
    return txt
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

const sinonimos = {
    "pet": "garrafa",
    "garrafa pet": "garrafa",
    "plastico": "plastico",
    "plástico": "plastico",
    "papelao": "papel",
    "papelão": "papel",
    "aluminio": "lata",
    "alumínio": "lata",
    "metal": "lata",
    "vidro": "garrafa",
    "bateria": "pilha"
};

async function exibirResultado(label) {
    resultContainer.classList.add('hidden');

    let termoOriginal = normalizar(label);

    let termoTraduzido =
        normalizar(traducoes[termoOriginal] || termoOriginal);

    if (sinonimos[termoTraduzido]) {
        termoTraduzido = sinonimos[termoTraduzido];
    }

    document.getElementById('obj-name').innerText = label;

    let info = null;

    for (let chave in dbDescarte) {
        if (
            termoTraduzido.includes(chave) ||
            chave.includes(termoTraduzido)
        ) {
            info = dbDescarte[chave];
            break;
        }
    }

    if (!info) {
        info = await buscarNaAPIExterna(label);
    }

    resultContainer.classList.remove('hidden');

    if (info) {
        document.getElementById('eco-badge').innerText = info.material;
        document.getElementById('descarte-instrucao').innerText = info.instrucao;
        status.innerText = "Item identificado!";
    } else {
        document.getElementById('eco-badge').innerText = "Desconhecido";
        document.getElementById('descarte-instrucao').innerText =
            "Use as lixeiras padrão de reciclagem.";
        status.innerText = "Não encontrado.";
    }
}

// Eventos
btnScan.addEventListener('click', async () => {
    status.innerText = "Analisando...";
    const predictions = await model.classify(video);
    exibirResultado(predictions[0].className);
});

btnBusca.addEventListener('click', () => {
    if(inputBusca.value) exibirResultado(inputBusca.value);
});

inputBusca.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && inputBusca.value) exibirResultado(inputBusca.value);
});

// Start
init();