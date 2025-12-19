// ================================
// ANIMAÇÃO DE ESCRITA NO TÍTULO
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const titleElement = document.getElementById("letter-title");
  const continueButton = document.getElementById("continue-button");
  const letterCard = document.querySelector(".letter-card");
  const heartsLayer = document.querySelector(".floating-hearts-layer");
  const musicToggle = document.getElementById("music-toggle");
  const backgroundMusic = document.getElementById("background-music");
  const clickSound = document.getElementById("click-sound");
  const continueMessage = document.getElementById("continue-message");
  const reasonItems = document.querySelectorAll(".reason-item");

  // ================================
  // ANIMAÇÃO DE ESCRITA NO TÍTULO
  // ================================

  if (titleElement) {
    const fullText = titleElement.textContent.trim();
    let currentIndex = 0;

    // Limpa o texto inicial para começar a "digitar"
    titleElement.textContent = "";
    titleElement.classList.add("typing");

    const typingSpeed = 70; // milissegundos entre cada letra

    function typeNextChar() {
      if (currentIndex < fullText.length) {
        titleElement.textContent += fullText[currentIndex];
        currentIndex += 1;
        window.setTimeout(typeNextChar, typingSpeed);
      } else {
        // Conclui a escrita e remove o cursor piscando
        titleElement.classList.remove("typing");
        titleElement.classList.add("typing-done");

        // Começa a animação suave do botão de liquid glass
        if (continueButton) {
          continueButton.classList.add("pulse");
        }
      }
    }

    // Inicia a animação com um pequeno delay para ficar mais dramático
    window.setTimeout(typeNextChar, 750);
  }

  // ================================
  // MOVIMENTO DA CARTA COM O MOUSE
  // ================================

  if (letterCard) {
    letterCard.classList.add("tilted");

    let mouseX = 0;
    let mouseY = 0;
    let cardRect = null;
    let ticking = false;

    function updateCardTilt() {
      ticking = false;
      if (!cardRect) return;

      const centerX = cardRect.left + cardRect.width / 2;
      const centerY = cardRect.top + cardRect.height / 2;

      const relX = (mouseX - centerX) / (cardRect.width / 2); // -1 a 1
      const relY = (mouseY - centerY) / (cardRect.height / 2); // -1 a 1

      const maxTilt = 6; // graus
      const rotateX = relY * -maxTilt;
      const rotateY = relX * maxTilt;

      letterCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;
    }

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cardRect) {
        cardRect = letterCard.getBoundingClientRect();
      }

      if (!ticking) {
        window.requestAnimationFrame(updateCardTilt);
        ticking = true;
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", () => {
      cardRect = letterCard.getBoundingClientRect();
    });
  }

  // ====================================
  // RASTRO BRILHANTE DO MOUSE
  // ====================================

  let lastSparkleTime = 0;
  const sparkleInterval = 40; // ms entre brilhos

  function createCursorSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "cursor-sparkle";
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    document.body.appendChild(sparkle);

    sparkle.addEventListener(
      "animationend",
      () => {
        sparkle.remove();
      },
      { once: true }
    );
  }

  window.addEventListener("mousemove", (e) => {
    const now = performance.now();
    if (now - lastSparkleTime < sparkleInterval) return;
    lastSparkleTime = now;
    createCursorSparkle(e.clientX, e.clientY);
  });

  // ====================================
  // CORAÇÕES VINHO SUBINDO NO FUNDO
  // ====================================

  if (heartsLayer) {
    function createFloatingHeart() {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = "♥";

      const randomLeft = Math.random() * 100; // 0 a 100 vw
      const duration = 7 + Math.random() * 5; // 7 a 12 segundos
      const delay = Math.random() * 2; // atraso pequeno
      const scale = 0.7 + Math.random() * 0.9;
      const opacity = 0.5 + Math.random() * 0.5;

      heart.style.left = `${randomLeft}vw`;
      heart.style.animationDuration = `${duration}s`;
      heart.style.animationDelay = `${delay}s`;
      heart.style.transform = `scale(${scale})`;
      heart.style.opacity = `${opacity}`;

      heartsLayer.appendChild(heart);

      heart.addEventListener(
        "animationend",
        () => {
          heart.remove();
        },
        { once: true }
      );
    }

    // Cria alguns corações iniciais
    for (let i = 0; i < 10; i++) {
      setTimeout(createFloatingHeart, i * 400);
    }

    // Cria corações continuamente de forma suave
    setInterval(() => {
      createFloatingHeart();
    }, 1500);
  }

  // ====================================
  // CONTROLE DE MÚSICA (PLAY/PAUSE)
  // ====================================

  if (musicToggle && backgroundMusic) {
    let isPlaying = false;

    // Muitos navegadores bloqueiam autoplay, então só toca ao clicar
    musicToggle.addEventListener("click", async () => {
      try {
        if (!isPlaying) {
          await backgroundMusic.play();
          isPlaying = true;
          musicToggle.classList.add("playing");
        } else {
          backgroundMusic.pause();
          isPlaying = false;
          musicToggle.classList.remove("playing");
        }
      } catch (error) {
        // Se der algum erro (por exemplo, arquivo não encontrado), não quebra o site
        console.warn("Não foi possível tocar a música:", error);
      }
    });
  }

  // ====================================
  // SOM SUAVE AO CLICAR NA PÁGINA
  // ====================================

  if (clickSound) {
    // reduz um pouco o volume pra não ficar irritante
    clickSound.volume = 0.3;

    // Delay em milissegundos para ajustar o momento do som em relação ao clique
    // 0 = toca imediatamente no clique
    const CLICK_SOUND_DELAY_MS = 0;

    document.addEventListener("click", (event) => {
      const target = event.target;

      // Evita som duplicado no próprio botão de música
      if (target === musicToggle || (musicToggle && musicToggle.contains(target))) {
        return;
      }

      try {
        // Reinicia o áudio do começo
        clickSound.currentTime = 0;

        // Toca com um pequeno delay para podermos ajustar a sensação de tempo
        window.setTimeout(() => {
          clickSound.play().catch((error) => {
            console.warn("Não foi possível tocar o som de clique:", error);
          });
        }, CLICK_SOUND_DELAY_MS);
      } catch (error) {
        console.warn("Não foi possível preparar o som de clique:", error);
      }
    });
  }

  // ====================================
  // AÇÃO DO BOTÃO "CONTINUAR..."
  // ====================================

  if (continueButton && letterCard && continueMessage) {
    const cuteMessages = [
      "Ok, mas promete não rir de mim quando ver o resto? 💌",
      "Tá, mas se prepara: meu nível de amor vai aumentar a cada clique. 💜",
      "Continua, mas lembra: você que começou deixando tudo especial assim. ✨",
    ];

    let messageIndex = 0;
    let clickCount = 0;

    continueButton.addEventListener("click", () => {
      clickCount += 1;

      // Pequeno zoom/brilho na carta
      letterCard.style.transition =
        "transform 0.18s ease-out, box-shadow 0.18s ease-out";
      letterCard.style.boxShadow =
        "0 32px 65px rgba(48, 30, 18, 0.75), 0 0 0 1px rgba(103, 72, 46, 0.9)";
      letterCard.style.transform += " translateY(-1px) scale(1.01)";

      // volta suavemente ao normal
      setTimeout(() => {
        letterCard.style.boxShadow =
          "0 26px 55px rgba(48, 30, 18, 0.55), 0 0 0 1px rgba(103, 72, 46, 0.6)";
        letterCard.style.transform = letterCard.style.transform.replace(
          " translateY(-1px) scale(1.01)",
          ""
        );
      }, 220);

      // Atualiza mensagem fofinha
      const text = cuteMessages[messageIndex];
      messageIndex = (messageIndex + 1) % cuteMessages.length;

      continueMessage.textContent = text;
      continueMessage.classList.add("visible");

      // Depois de alguns cliques, vai para a página dos motivos
      if (clickCount >= 3) {
        window.location.href = "motivos.html";
      }
    });
  }

  // ====================================
  // ANIMAÇÃO DOS 3 MOTIVOS AO ENTRAR
  // ====================================

  if (reasonItems && reasonItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    reasonItems.forEach((item) => observer.observe(item));
  }

  // ====================================
  // BOTÃO "SIM" QUE FOGE (PÁGINA DO PEDIDO)
  // ====================================

  const pedidoArea = document.getElementById("pedido-area");
  const yesButton = document.getElementById("yes-button");
  const noButton = document.getElementById("no-button");
  const contratoOverlay = document.getElementById("contrato-overlay");
  const contratoClose = document.getElementById("contrato-close");

  if (pedidoArea && yesButton) {
    let areaRect = null;
    let fleeEnabled = true;
    let triggerDistance = 90; // distância inicial para o botão fugir
    let lastMoveTime = 0;

    function updateAreaRect() {
      areaRect = pedidoArea.getBoundingClientRect();
    }

    updateAreaRect();
    window.addEventListener("resize", updateAreaRect);

    function moveYesButtonRandom() {
      if (!areaRect || !fleeEnabled) return;

      const now = performance.now();
      // não deixa ele se mover muitas vezes seguidas em menos de 150ms
      if (now - lastMoveTime < 150) return;
      lastMoveTime = now;

      const buttonRect = yesButton.getBoundingClientRect();
      const buttonWidth = buttonRect.width;
      const buttonHeight = buttonRect.height;

      const padding = 10;

      const maxX = areaRect.width - buttonWidth - padding;
      const maxY = areaRect.height - buttonHeight - padding;

      const newX = padding + Math.random() * Math.max(maxX, padding);
      const newY = padding + Math.random() * Math.max(maxY, padding);

      yesButton.style.left = `${newX}px`;
      yesButton.style.top = `${newY}px`;
    }

    // Posição inicial razoável
    moveYesButtonRandom();

    // Quando o mouse se aproxima do botão, ele foge (um pouco mais fácil de alcançar)
    pedidoArea.addEventListener("mousemove", (event) => {
      if (!fleeEnabled) return;

      const buttonRect = yesButton.getBoundingClientRect();
      const distanceX = event.clientX - (buttonRect.left + buttonRect.width / 2);
      const distanceY = event.clientY - (buttonRect.top + buttonRect.height / 2);
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < triggerDistance) {
        moveYesButtonRandom();
      }
    });

    // Ao clicar em "Sim", mostra o contrato, para de fugir e toca música + celebração
    yesButton.addEventListener("click", () => {
      fleeEnabled = false;

      // Garante música tocando em loop quando o contrato abrir
      if (backgroundMusic) {
        backgroundMusic.loop = true;
        backgroundMusic
          .play()
          .catch((error) =>
            console.warn("Não foi possível tocar a música ao abrir contrato:", error)
          );
      }

      if (contratoOverlay) {
        contratoOverlay.classList.add("visible");
        // dispara celebração contínua
        startCelebration();
      }
    });
  }

  // Clique no botão "Não" – sacode e muda de texto/formato
  if (noButton) {
    let noClickCount = 0;
    const noTexts = [
      "Tem certeza? 😳",
      "Pensa de novo… 😒",
      "Resposta errada. Tenta outra vez. 🙃",
      "Última chance hein… 😤",
      "Ok, agora você é obrigado a clicar no Sim. 💜",
    ];

    noButton.addEventListener("click", () => {
      noClickCount += 1;

      // Muda texto
      const index = Math.min(noClickCount - 1, noTexts.length - 1);
      noButton.textContent = noTexts[index];

      // Muda formato/cor a cada clique
      const variant = noClickCount % 3;
      if (variant === 0) {
        noButton.style.borderRadius = "999px";
        noButton.style.transform = "scale(1)";
      } else if (variant === 1) {
        noButton.style.borderRadius = "12px";
        noButton.style.transform = "scale(0.96)";
      } else {
        noButton.style.borderRadius = "30px";
        noButton.style.transform = "scale(1.04)";
      }

      // Aplica animação de shake
      noButton.classList.remove("shake");
      // força reflow para reiniciar animação
      void noButton.offsetWidth;
      noButton.classList.add("shake");

      // A cada clique em "Não", o botão "Sim" fica mais fácil de clicar
      if (yesButton) {
        // diminui bastante a distância de fuga
        triggerDistance = Math.max(20, triggerDistance - 35);

        // depois de poucos "nãos", desliga a fuga de vez
        if (noClickCount >= 2) {
          fleeEnabled = false;
        }
      }
    });
  }

  // Fecha o contrato
  if (contratoOverlay && contratoClose) {
    contratoClose.addEventListener("click", () => {
      contratoOverlay.classList.remove("visible");
      stopCelebration();

       // Vai para a página final depois de um pequeno delay
       setTimeout(() => {
         window.location.href = "final.html";
       }, 350);
    });
  }

  // ====================================
  // CELEBRAÇÃO: PÉTALAS, TAÇAS E BRILHINHOS
  // ====================================

  let celebrationIntervalId = null;

  function startCelebration() {
    if (celebrationIntervalId !== null) return;

    // Rajada inicial
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        createRosePetal();
        if (i % 5 === 0) createWineGlass();
        if (i % 3 === 0) createFallingSparkle();
      }, i * 80);
    }

    // Loop contínuo suave
    celebrationIntervalId = setInterval(() => {
      createRosePetal();
      if (Math.random() < 0.4) createWineGlass();
      if (Math.random() < 0.7) createFallingSparkle();
    }, 550);
  }

  function stopCelebration() {
    if (celebrationIntervalId !== null) {
      clearInterval(celebrationIntervalId);
      celebrationIntervalId = null;
    }
  }

  function createRosePetal() {
    const petal = document.createElement("div");
    petal.className = "rose-petal";

    const startLeft = Math.random() * 100; // vw
    const duration = 4 + Math.random() * 2;

    petal.style.left = `${startLeft}vw`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.opacity = (0.7 + Math.random() * 0.3).toString();
    petal.style.transform = `rotate(${Math.random() * 180}deg)`;

    document.body.appendChild(petal);

    petal.addEventListener(
      "animationend",
      () => {
        petal.remove();
      },
      { once: true }
    );
  }

  function createWineGlass() {
    const glass = document.createElement("div");
    glass.className = "wine-glass";
    glass.textContent = "🍷";

    const startLeft = Math.random() * 100; // vw
    const duration = 4 + Math.random() * 3;

    glass.style.left = `${startLeft}vw`;
    glass.style.animationDuration = `${duration}s`;

    document.body.appendChild(glass);

    glass.addEventListener(
      "animationend",
      () => {
        glass.remove();
      },
      { once: true }
    );
  }

  function createFallingSparkle() {
    const spark = document.createElement("div");
    spark.className = "falling-sparkle";

    const startLeft = Math.random() * 100; // vw
    const duration = 3 + Math.random() * 2;

    spark.style.left = `${startLeft}vw`;
    spark.style.animationDuration = `${duration}s`;

    document.body.appendChild(spark);

    spark.addEventListener(
      "animationend",
      () => {
        spark.remove();
      },
      { once: true }
    );
  }
});

