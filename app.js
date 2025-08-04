// Constantes para configuração do jogo
const NUMERO_LIMITE = 10;
const NUMERO_MINIMO = 1;

// Estado do jogo encapsulado em um objeto
const jogo = {
    listaDeNumerosSorteados: [],
    numeroSecreto: null,
    tentativas: 1,
    
    // Método para inicializar o jogo
    inicializar() {
        this.numeroSecreto = this.gerarNumeroAleatorio();
        this.tentativas = 1;
        this.exibirMensagemInicial();
    },
    
    // Método para gerar número aleatório sem repetição
    gerarNumeroAleatorio() {
        // Se todos os números já foram sorteados, reinicia a lista
        if (this.listaDeNumerosSorteados.length === NUMERO_LIMITE) {
            this.listaDeNumerosSorteados = [];
        }
        
        let numeroEscolhido;
        // Gera números até encontrar um que não foi sorteado
        do {
            numeroEscolhido = Math.floor(Math.random() * NUMERO_LIMITE) + NUMERO_MINIMO;
        } while (this.listaDeNumerosSorteados.includes(numeroEscolhido));
        
        this.listaDeNumerosSorteados.push(numeroEscolhido);
        console.log('Números já sorteados:', this.listaDeNumerosSorteados);
        return numeroEscolhido;
    },
    
    // Método para reiniciar o jogo
    reiniciar() {
        this.numeroSecreto = this.gerarNumeroAleatorio();
        this.tentativas = 1;
        exibirMensagemInicial();
        utils.habilitarBotaoReiniciar(false);
        utils.limparCampoInput();
    }
};

// Utilitários para manipulação do DOM
const utils = {
    // Função para exibir texto na tela com síntese de voz
    exibirTextoNaTela(seletor, texto) {
        const elemento = document.querySelector(seletor);
        if (!elemento) {
            console.error(`Elemento com seletor "${seletor}" não encontrado`);
            return;
        }
        
        elemento.innerHTML = texto;
        
        // Verifica se o ResponsiveVoice está disponível antes de usar
        if (typeof responsiveVoice !== 'undefined') {
            responsiveVoice.speak(texto, 'Brazilian Portuguese Female', { rate: 1.2 });
        }
    },
    
    // Função para obter o valor do input de forma segura
    obterValorInput() {
        const input = document.querySelector('input[type="number"]');
        if (!input) {
            console.error('Campo de input não encontrado');
            return null;
        }
        
        const valor = parseInt(input.value, 10);
        return isNaN(valor) ? null : valor;
    },
    
    // Função para limpar o campo de input
    limparCampoInput() {
        const input = document.querySelector('input[type="number"]');
        if (input) {
            input.value = '';
            input.focus(); // Coloca o foco de volta no input
        }
    },
    
    // Função para habilitar/desabilitar o botão reiniciar
    habilitarBotaoReiniciar(habilitar) {
        const botao = document.getElementById('reiniciar');
        if (botao) {
            botao.disabled = !habilitar;
        }
    },
    
    // Validação do valor do chute
    validarChute(chute) {
        if (chute === null) {
            return { valido: false, mensagem: 'Por favor, digite um número válido' };
        }
        
        if (chute < NUMERO_MINIMO || chute > NUMERO_LIMITE) {
            return { 
                valido: false, 
                mensagem: `Digite um número entre ${NUMERO_MINIMO} e ${NUMERO_LIMITE}` 
            };
        }
        
        return { valido: true };
    }
};

// Função principal para verificar o chute
function verificarChute() {
    const chute = utils.obterValorInput();
    const validacao = utils.validarChute(chute);
    
    // Se o chute não é válido, exibe mensagem de erro
    if (!validacao.valido) {
        utils.exibirTextoNaTela('p', validacao.mensagem);
        return;
    }
    
    // Verifica se acertou
    if (chute === jogo.numeroSecreto) {
        processarAcerto();
    } else {
        processarErro(chute);
    }
}

// Função para processar quando o jogador acerta
function processarAcerto() {
    utils.exibirTextoNaTela('h1', 'Parabéns! Você acertou!');
    
    const palavraTentativa = jogo.tentativas === 1 ? 'tentativa' : 'tentativas';
    const mensagemTentativas = `Você descobriu o número secreto com ${jogo.tentativas} ${palavraTentativa}!`;
    
    utils.exibirTextoNaTela('p', mensagemTentativas);
    utils.habilitarBotaoReiniciar(true);
}

// Função para processar quando o jogador erra
function processarErro(chute) {
    const dica = chute > jogo.numeroSecreto ? 
        'O número secreto é menor que ' + chute : 
        'O número secreto é maior que ' + chute;
    
    utils.exibirTextoNaTela('p', dica);
    jogo.tentativas++;
    utils.limparCampoInput();
}

// Função para exibir a mensagem inicial
function exibirMensagemInicial() {
    utils.exibirTextoNaTela('h1', 'Jogo do número secreto');
    utils.exibirTextoNaTela('p', `Escolha um número entre ${NUMERO_MINIMO} e ${NUMERO_LIMITE}`);
}

// Função para reiniciar o jogo (chamada pelo botão)
function reiniciarJogo() {
    jogo.reiniciar();
}

// Melhor experiência do usuário
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o jogo quando a página carrega
    jogo.inicializar();
    
    // Permite pressionar Enter para fazer o chute
    const input = document.querySelector('input[type="number"]');
    if (input) {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                verificarChute();
            }
        });
        
        // Coloca o foco no input quando a página carrega
        input.focus();
    }
});




