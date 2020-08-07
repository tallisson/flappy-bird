console.log('Flappy Bird');

let frames = 0;

const somHit = new Audio(), somPulo = new Audio(), somJogo = new Audio();
somHit.src = './efeitos/hit.wav';
somPulo.src = './efeitos/pulo.wav';
somJogo.src = './efeitos/jogo.mp3';

const globais = {};
let telaAtiva = {};

const vScore = document.getElementsByClassName('v-score')[0];
let valueScore = 0;

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

function criaChao() {
  //[Chao]
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      /*console.log('[chao.x]', chao.x);
      console.log('[repeteEm]', repeteEm);
      console.log('[movimentacao]', movimentacao % repeteEm);*/

      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );    
    }
  };

  return chao;
}

//[Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {    
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  }
};

function fazColisao() {
  const flappyBirdY = globais.flappyBird.y + globais.flappyBird.altura;
  const chaoY = globais.chao.y;

  if(flappyBirdY >= chaoY) {
    if(telaAtiva.pauseSom) {
      telaAtiva.pauseSom();
    }
    return true;
  }
  return false;
}


function criaFlappyBird() {
  //[Flappy Bird]
  const flappyBird = {
    spriteX: 0, 
    spriteY: 0,
    largura: 33, 
    altura: 24, // Tamanho do recorte na sprite
    x: 10, 
    y: 50,
    pulo: 2.0,
    pula() {
      console.log('[devo pular]');
      console.log('[antes]', flappyBird.velocidade);
      somPulo.play();
      flappyBird.velocidade = -flappyBird.pulo;
      console.log('[depois]', flappyBird.velocidade);
    },
    gravidade: 0.05,
    velocidade: 0,
    atualiza() {
      if(fazColisao()) {
        console.log('Fez colisão');
        somHit.play();

        setTimeout(() => {
          mudaDeTela(Telas.INICIO);
        }, 500);
        return;
      }
      flappyBird.velocidade += flappyBird.gravidade;
      flappyBird.y += flappyBird.velocidade;
    },
    janelaDeTempo: 0,
    movimentoAtual: 0,
    atualizaMovimento() {
      if(frames - flappyBird.janelaDeTempo >= 10) {
        flappyBird.movimentoAtual = 
          (flappyBird.movimentoAtual < (flappyBird.movimentos.length - 1)) ? flappyBird.movimentoAtual + 1 : 0;
        flappyBird.janelaDeTempo = frames;
      }
    },
    movimentos: [
      { spriteX: 0, spriteY: 0 }, // asa para cima
      { spriteX: 0, spriteY: 26 }, // asa no meio
      { spriteX: 0, spriteY: 52 }, // asa para baixo
    ],
    desenha() {      
      flappyBird.atualizaMovimento();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.movimentoAtual];

      contexto.drawImage(
        sprites,
        spriteX, spriteY,
        flappyBird.largura, flappyBird.altura,
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  };
  return flappyBird;
}

//[mensagemGetReady]
const mensagemGetReady = {
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.spriteX, mensagemGetReady.spriteY,
      mensagemGetReady.largura, mensagemGetReady.altura,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.largura, mensagemGetReady.altura,
    );
  }
};

function criaCanos() {  
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    //espaco: 80,
    desenha() {
      canos.pares.forEach(function(par) {
        const espacamentoEntreCanos = 100;

        const canoCeuX = par.x;
        const canoCeuY = par.y; 

        // [Cano do Céu]
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + par.y; 
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
      
      if(globais.flappyBird.x >= par.x) {
        if(cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if(peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      /*valueScore += 4;
      vScore.innerHTML = valueScore;*/
      return false;
    },
    pares: [],
    atualiza() {
      const passou80Frames = (frames % 80 === 0);
      if(passou80Frames) {
        //console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function(par) {
        par.x = par.x - 2;

        if(canos.temColisaoComOFlappyBird(par)) {
          if(telaAtiva.pauseSom) {
            telaAtiva.pauseSom();
          }
          alert('Você perdeu!');
          mudaDeTela(Telas.INICIO);
        }

        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });

    }
  }
  return canos;
}

//
// Telas
//
function mudaDeTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
  if(telaAtiva.som) {
    telaAtiva.som();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {      
      planoDeFundo.desenha();
      globais.chao.desenha();  
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaDeTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};

Telas.JOGO = {
  desenha() {
    globais.flappyBird.atualiza();
    planoDeFundo.desenha(); 
    globais.chao.desenha();  
    globais.flappyBird.desenha();    
    globais.canos.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  keydown(keyCode) {
    if(keyCode == 32) {
      globais.flappyBird.pula();
    }
  },
  atualiza() {
    globais.flappyBird.atualiza();
    globais.chao.atualiza();
    globais.canos.atualiza();
  }, 
  som() {
    somJogo.play();
  },
  pauseSom() {
    somJogo.pause();
    somJogo.currentTime = 0;
  }
};

function loop() {  
  telaAtiva.desenha();
  if(telaAtiva.atualiza) {
    telaAtiva.atualiza();
  }
  
  frames++;
  requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

window.addEventListener('keydown', (event) => {
  if(telaAtiva.keydown) {
    telaAtiva.keydown(event.keyCode);
  }
});

class Game {
  _screen;

  constructor(screen = Telas.INICIO) {
    this._screen = screen;
    telaAtiva = screen;
    if(telaAtiva.inicializa) {
      telaAtiva.inicializa();
    }
    if(telaAtiva.som) {
      telaAtiva.som();
    }
  }

  loop() {
    telaAtiva.desenha();
    if(telaAtiva.atualiza) {
      telaAtiva.atualiza();
    }
    
    frames++;
    requestAnimationFrame(loop);
  }
}

//mudaDeTela(Telas.INICIO);
//loop();
const game = new Game();
game.loop();

