🌿 EcoScan - Descarte Inteligente
O EcoScan é uma aplicação web progressiva que utiliza Inteligência Artificial para auxiliar cidadãos no descarte correto de resíduos. Através da câmera do celular ou busca textual, o sistema identifica o material e indica a lixeira de reciclagem correspondente (padrão brasileiro de cores) ou orientações de logística reversa.

🚀 Funcionalidades
Reconhecimento Visual: Identificação de objetos em tempo real utilizando a câmera e o modelo MobileNet.

Busca Inteligente: Pesquisa manual por nome do item com normalização de texto (ignora acentos e maiúsculas).

Integração com API: Consulta automática à base de dados global Open Food Facts para produtos não listados localmente.

Base de Conhecimento Local: Regras rápidas para itens comuns como garrafas PET, latinhas e pilhas.

🛠️ Tecnologias Utilizadas
Frontend: HTML5, CSS3 (Variáveis modernas) e JavaScript Assíncrono.

Inteligência Artificial:

TensorFlow.js

MobileNet v2 (Modelo pré-treinado para classificação de imagens).

API Externa: Open Food Facts API.

🧠 Lógica de Implementação
O projeto utiliza um fluxo de decisão em três camadas para garantir que o usuário nunca fique sem resposta:

Dicionário de Tradução: Converte a saída do MobileNet (em inglês) para o português.

Banco de Dados Local (dbDescarte): Verifica se o termo traduzido corresponde a uma regra de descarte pré-definida.

Fallback API: Caso o item seja um produto industrializado desconhecido pela base local, o sistema consulta o Open Food Facts para tentar identificar o material da embalagem.

📄 Licença
Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

⭐ Projeto desenvolvido para promover a sustentabilidade através da tecnologia.
