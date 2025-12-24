import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { 
  Ticket, Star, Clock, Heart, Utensils, Camera, ShoppingBag, X, Gift, Check, Info, 
  Zap, Sparkles, UtensilsCrossed, Coffee, Cookie, Flower2, CreditCard, Wind, Music,
  Plane, Smile, Tv, Users, Lock, Calendar
} from 'lucide-react';

// --- CONFIGURAÇÕES GERAIS ---

const GLOBAL_VALID_UNTIL = "2026-12-25";

// --- DADOS: REGRAS (RULES) ---

const RAW_RULES = [
  {
    "id": "r_shop_300",
    "title": "Regras do 300zão",
    "description": [
      "Este cupom não pode ser usado em dois meses seguidos.",
      "Você pode juntar cupons para uma compra maior, mas precisamos combinar antes (negociável com carinho)."
    ]
  },
  {
    "id": "r_value_no_change",
    "title": "Sem Troco",
    "description": [
      "O valor do cupom é um teto. Se a compra for menor, não existe 'troco' ou saldo acumulado.",
      "Pode comprar mais de um item, desde que a soma caiba no valor do cupom."
    ]
  },
  {
    "id": "r_escape_24h",
    "title": "Aviso com antecedência",
    "description": [
      "Precisa avisar com pelo menos 1 dia de antecedência para eu me organizar e fugir do trabalho com estilo."
    ]
  },
  {
    "id": "r_escape_super",
    "title": "Modo emergência romântica",
    "description": [
      "Pode ser usado a qualquer momento: eu apareço onde você estiver (o mais rápido possível) para te ver.",
      "Se eu estiver em algo inadiável, eu aviso e corro assim que der — mas a prioridade é você."
    ]
  },
  {
    "id": "r_photo_60",
    "title": "Sessão sem pausa",
    "description": [
      "Ao resgatar, são 60 minutos contínuos de fotos — sem pausar e fracionar (vale a maratona).",
      "Você escolhe o lugar/estilo, eu viro fotógrafo oficial com orgulho."
    ]
  },
  {
    "id": "r_photo_no_same_day",
    "title": "Uma sessão por dia",
    "description": [
      "Para garantir a qualidade do fotógrafo (eu), não podemos usar dois cupons de fotos no mesmo dia."
    ]
  },
  {
    "id": "r_massage_no_same_day",
    "title": "Limite de Relaxamento",
    "description": [
      "A mão do massagista cansa! Não podemos usar mais de um cupom de massagem (comum ou tubarão) no mesmo dia."
    ]
  },
  {
    "id": "r_movie_no_same_day",
    "title": "Sessão Única",
    "description": [
      "Um filme por dia para a gente curtir bem o momento (e não dormir no segundo)."
    ]
  },
  {
    "id": "r_anime_max_24",
    "title": "Limite de Temporada",
    "description": [
      "Vale para uma temporada de até 24 episódios. Se for maior, a gente negocia o resto!"
    ]
  },
  {
    "id": "r_trip_30d_notice",
    "title": "Planejamento da Viagem",
    "description": [
      "Idealmente, avisar com 30 dias de antecedência para a gente organizar tudo perfeito.",
      "Se surgir uma oportunidade relâmpago, a gente tenta encaixar!"
    ]
  },
  {
    "id": "r_bouquet_10d",
    "title": "Janela do buquê",
    "description": [
      "Após resgatar, eu te dou um buquê dentro de 10 dias.",
      "O dia pode ser surpresa ou combinado — você manda no jeito."
    ]
  }
];

// --- DADOS: CUPONS ---

const RAW_COUPONS = [
  // --- COMPRAS (300zão) ---
  {
    "id": "cp_shop_300_01",
    "title": "Cupom do 300zão — Parte I",
    "subtitle": "Você escolhe. O Vivico sorri e paga.",
    "description": "Vale R$300 em compras do jeitinho que a YAYA quiser. Pode ser mimo, utilidade, beleza, decoração… você decide.",
    "type": "compras",
    "tags": ["compras", "presentes"],
    "isActive": true,
    "ruleIds": ["r_shop_300", "r_value_no_change"]
  },
  {
    "id": "cp_shop_300_02",
    "title": "Cupom do 300zão — Parte II",
    "subtitle": "Mais um pra você gastar sem culpa.",
    "description": "Vale R$300 em compras. Se for algo muito grande, dá pra combinar de juntar cupons (com negociação e beijo).",
    "type": "compras",
    "tags": ["compras", "presentes"],
    "isActive": true,
    "ruleIds": ["r_shop_300", "r_value_no_change"]
  },
  {
    "id": "cp_shop_300_03",
    "title": "Cupom do 300zão — Final Boss",
    "subtitle": "O último… (ou o primeiro a ser usado?)",
    "description": "Vale R$300 em compras. Use com sabedoria… ou com impulsividade gostosa.",
    "type": "compras",
    "tags": ["compras", "presentes"],
    "isActive": true,
    "ruleIds": ["r_shop_300", "r_value_no_change"]
  },
  {
    "id": "cp_makeup_300",
    "title": "Vale Maquiagem",
    "subtitle": "Para realçar o que já é lindo.",
    "description": "Vale R$300 exclusivo para itens de maquiagem. Quero ver você se sentindo ainda mais maravilhosa.",
    "type": "compras",
    "tags": ["compras", "beleza"],
    "isActive": true,
    "ruleIds": ["r_shop_300", "r_value_no_change"]
  },

  // --- ESPECIAL 4 ANOS ---
  {
    "id": "cp_surprise_4years",
    "title": "Surpresa de 4 Anos",
    "subtitle": "Um segredo guardado para 01/08/2026.",
    "description": "Este cupom guarda algo muito especial para comemorar nossos 4 anos juntos. Aguarde até a data para descobrir o que o Vivico preparou.",
    "type": "especial",
    "tags": ["surpresa", "amor", "4 anos"],
    "isActive": true,
    "availableFrom": "2026-08-01",
    "ruleIds": []
  },

  // --- ESCAPES / TEMPO ---
  {
    "id": "cp_escape_01",
    "title": "Fuga do Trabalho — Edição Fofa",
    "subtitle": "O Vivico some do mundo e aparece pra YAYA.",
    "description": "Você pode resgatar pra eu dar uma escapada do trabalho e ficar com você. Só preciso de um aviso pra organizar tudo direitinho.",
    "type": "tempo",
    "tags": ["tempo", "romance", "prioridade"],
    "isActive": true,
    "ruleIds": ["r_escape_24h"]
  },
  {
    "id": "cp_escape_02",
    "title": "Fuga do Trabalho — Missão Secreta",
    "subtitle": "Uma desculpa bem contada e um abraço bem dado.",
    "description": "Você resgata e eu encaixo um tempo pra estar com você, mesmo no meio da correria.",
    "type": "tempo",
    "tags": ["tempo", "romance", "prioridade"],
    "isActive": true,
    "ruleIds": ["r_escape_24h"]
  },
  {
    "id": "cp_escape_super_01",
    "title": "SUPER FUGA — Teleporte Romântico",
    "subtitle": "Usou, o Vivico vai. Simples assim.",
    "description": "Cupom especial: você pode usar a qualquer hora, e eu apareço onde você estiver pra te ver.",
    "type": "tempo",
    "tags": ["tempo", "romance", "lendario"],
    "isActive": true,
    "ruleIds": ["r_escape_super"]
  },

  // --- FOTOS ---
  {
    "id": "cp_photo_01",
    "title": "1 Hora de Fotos — Sessão I",
    "subtitle": "A YAYA brilha. O Vivico clica.",
    "description": "Uma hora inteira de fotos com você mandando no estilo. Sem pausas — é sessão de verdade.",
    "type": "experiencia",
    "tags": ["fotos", "experiencias", "carinho"],
    "isActive": true,
    "ruleIds": ["r_photo_60", "r_photo_no_same_day"]
  },
  {
    "id": "cp_photo_02",
    "title": "1 Hora de Fotos — Sessão II",
    "subtitle": "Modo fotógrafo ativado.",
    "description": "Uma hora contínua de fotos. Pode ser rua, café, parque, casa… você escolhe o cenário.",
    "type": "experiencia",
    "tags": ["fotos", "experiencias", "carinho"],
    "isActive": true,
    "ruleIds": ["r_photo_60", "r_photo_no_same_day"]
  },
  {
    "id": "cp_photo_03",
    "title": "1 Hora de Fotos — Sessão III",
    "subtitle": "A última… (ou a mais épica).",
    "description": "Uma hora seguida de fotos pra você ter um álbum inteiro de lembranças lindas.",
    "type": "experiencia",
    "tags": ["fotos", "experiencias", "carinho"],
    "isActive": true,
    "ruleIds": ["r_photo_60", "r_photo_no_same_day"]
  },

  // --- MASSAGENS ---
  {
    "id": "cp_massage_01",
    "title": "Massagem no Pé — 20 min (I)",
    "subtitle": "Spa caseiro, edição amor.",
    "description": "20 minutos de massagem no pé, do jeitinho que você gosta.",
    "type": "carinho",
    "tags": ["carinho", "bem-estar"],
    "isActive": true,
    "ruleIds": ["r_massage_no_same_day"]
  },
  {
    "id": "cp_massage_02",
    "title": "Massagem no Pé — 20 min (II)",
    "subtitle": "Relaxamento garantido para a YAYA.",
    "description": "Mais 20 minutos de massagem no pé. Você só precisa resgatar.",
    "type": "carinho",
    "tags": ["carinho", "bem-estar"],
    "isActive": true,
    "ruleIds": ["r_massage_no_same_day"]
  },
  {
    "id": "cp_massage_03",
    "title": "Massagem no Pé — 20 min (III)",
    "subtitle": "Fechamento de luxo.",
    "description": "20 minutos de massagem no pé. Porque você merece muito.",
    "type": "carinho",
    "tags": ["carinho", "bem-estar"],
    "isActive": true,
    "ruleIds": ["r_massage_no_same_day"]
  },
  // Massagens Tubarão (5x)
  {
    "id": "cp_massage_shark_01",
    "title": "Massagem 🦈 Tubarão (I)",
    "subtitle": "A famosa. A inigualável.",
    "description": "Aquela massagem especial 🦈 que você adora.",
    "type": "carinho",
    "tags": ["carinho", "tubarão"],
    "isActive": true,
    "ruleIds": ["r_massage_no_same_day"]
  },
  {
    "id": "cp_massage_shark_02",
    "title": "Massagem 🦈 Tubarão (II)",
    "subtitle": "Mordidinhas de amor.",
    "description": "Mais uma sessão da massagem 🦈.",
    "type": "carinho",
    "tags": ["carinho", "tubarão"],
    "isActive": true,
    "ruleIds": ["r_massage_no_same_day"]
  },
  {
    "id": "cp_massage_shark_03",
    "title": "Massagem 🦈 Tubarão (III)",
    "subtitle": "Relaxamento predador.",
    "description": "Sessão de massagem 🦈 garantida.",
    "type": "carinho",
    "tags": ["carinho", "tubarão"],
    "isActive": true,
    "ruleIds": ["r_massage_no_same_day"]
  },
  {
    "id": "cp_massage_shark_04",
    "title": "Massagem 🦈 Tubarão (IV)",
    "subtitle": "Cuidado com o tubarão.",
    "description": "Sessão de massagem 🦈 do Vivico.",
    "type": "carinho",
    "tags": ["carinho", "tubarão"],
    "isActive": true,
    "ruleIds": ["r_massage_no_same_day"]
  },
  {
    "id": "cp_massage_shark_05",
    "title": "Massagem 🦈 Tubarão (V)",
    "subtitle": "A última da temporada.",
    "description": "Encerramento com chave de ouro da massagem 🦈.",
    "type": "carinho",
    "tags": ["carinho", "tubarão"],
    "isActive": true,
    "ruleIds": ["r_massage_no_same_day"]
  },

  // --- COMIDA & ENCONTROS ---
  {
    "id": "cp_dinner_01",
    "title": "Almoço ou Jantar Completo (I)",
    "subtitle": "Entrada, prato, sobremesa… tudo incluso.",
    "description": "Você escolhe o restaurante e a gente faz uma refeição bem gostosa: entrada + principal + sobremesa. Sem economizar no prazer.",
    "type": "comida",
    "tags": ["comida", "encontro", "experiencias"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_dinner_02",
    "title": "Almoço ou Jantar Completo (II)",
    "subtitle": "Repetir é viver.",
    "description": "Mais uma refeição com tudo incluso. Você escolhe o lugar e o Vivico cuida do resto.",
    "type": "comida",
    "tags": ["comida", "encontro", "experiencias"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_dinner_home_01",
    "title": "Jantar Romântico em Casa (I)",
    "subtitle": "Eu cozinho, eu sirvo, eu lavo.",
    "description": "Escolhemos o menu juntos, eu preparo tudo com amor e você não encosta na louça.",
    "type": "comida",
    "tags": ["casa", "romance", "experiencias"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_dinner_home_02",
    "title": "Jantar Romântico em Casa (II)",
    "subtitle": "Restaurante do Vivico.",
    "description": "Mais uma noite especial em casa, com serviço completo do seu namorado.",
    "type": "comida",
    "tags": ["casa", "romance", "experiencias"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_dinner_home_03",
    "title": "Jantar Romântico em Casa (III)",
    "subtitle": "Menu exclusivo da YAYA.",
    "description": "Terceira rodada do Chef Vivico. Prato principal: Amor.",
    "type": "comida",
    "tags": ["casa", "romance", "experiencias"],
    "isActive": true,
    "ruleIds": []
  },

  // --- CAFÉ & DOCES ---
  {
    "id": "cp_coffee_01",
    "title": "Café dos Sonhos — Rodada I",
    "subtitle": "Qualquer café, qualquer pedido.",
    "description": "Você escolhe onde tomar e pode pedir o que quiser, à vontade.",
    "type": "comida",
    "tags": ["cafe", "comida", "passeio"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_coffee_02",
    "title": "Café dos Sonhos — Rodada II",
    "subtitle": "Um café pra aquecer a alma.",
    "description": "Escolhe o lugar, escolhe o pedido — o objetivo é ser um momento bom com você.",
    "type": "comida",
    "tags": ["cafe", "comida", "passeio"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_coffee_03",
    "title": "Café dos Sonhos — Rodada III",
    "subtitle": "Último cupom, mas nunca último café.",
    "description": "Mais um café à vontade, em qualquer lugar que você escolher.",
    "type": "comida",
    "tags": ["cafe", "comida", "passeio"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_tea_home_01",
    "title": "Chá da Tarde em Casa (I)",
    "subtitle": "Xícaras, biscoitos e nós dois.",
    "description": "Um momento calmo em casa, com chá quentinho e carinho.",
    "type": "comida",
    "tags": ["casa", "carinho", "encontro"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_tea_home_02",
    "title": "Chá da Tarde em Casa (II)",
    "subtitle": "Pausa para o amor.",
    "description": "Mais um chazinho da tarde preparado especialmente pra você.",
    "type": "comida",
    "tags": ["casa", "carinho", "encontro"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_tea_home_03",
    "title": "Chá da Tarde em Casa (III)",
    "subtitle": "Aconchego garantido.",
    "description": "Terceiro encontro de chá em casa. Só love.",
    "type": "comida",
    "tags": ["casa", "carinho", "encontro"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_tea_home_04",
    "title": "Chá da Tarde em Casa (IV)",
    "subtitle": "Doçura na medida certa.",
    "description": "Preparo tudo pra gente curtir a tarde juntinhos.",
    "type": "comida",
    "tags": ["casa", "carinho", "encontro"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_tea_home_05",
    "title": "Chá da Tarde em Casa (V)",
    "subtitle": "O último chá (desse pacote).",
    "description": "Fechando a série de chás da tarde com muito chamego.",
    "type": "comida",
    "tags": ["casa", "carinho", "encontro"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_sweet_01",
    "title": "Vale um Docinho — Resgate I",
    "subtitle": "Tristezinha? O Vivico manda açúcar.",
    "description": "Se você estiver meio pra baixo (ou só com vontade), eu mando um docinho/comidinha gostosa onde você estiver.",
    "type": "carinho",
    "tags": ["docinho", "carinho", "cuidado"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_sweet_02",
    "title": "Vale um Docinho — Resgate II",
    "subtitle": "Um agrado surpresa, autorizado.",
    "description": "Você resgata e eu escolho (ou você escolhe) um docinho pra chegar aí e melhorar o dia.",
    "type": "carinho",
    "tags": ["docinho", "carinho", "cuidado"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_sweet_03",
    "title": "Vale um Docinho — Resgate III",
    "subtitle": "Doce final, sorriso garantido.",
    "description": "Mais um resgate de docinho/agrado entregue onde você estiver.",
    "type": "carinho",
    "tags": ["docinho", "carinho", "cuidado"],
    "isActive": true,
    "ruleIds": []
  },

  // --- PASSEIOS & ENTRETENIMENTO ---
  {
    "id": "cp_plaza_01",
    "title": "Volta na Praça + Água de Coco (I)",
    "subtitle": "Simplicidade que a gente ama.",
    "description": "Um passeio leve, conversa boa e hidratação por minha conta.",
    "type": "passeio",
    "tags": ["passeio", "leve", "carinho"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_plaza_02",
    "title": "Volta na Praça + Água de Coco (II)",
    "subtitle": "Vento no rosto e mão dada.",
    "description": "Mais uma voltinha pra relaxar a cabeça e curtir a companhia.",
    "type": "passeio",
    "tags": ["passeio", "leve", "carinho"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_plaza_03",
    "title": "Volta na Praça + Água de Coco (III)",
    "subtitle": "O clássico nunca falha.",
    "description": "Terceira volta na praça. Água de coco geladinha inclusa.",
    "type": "passeio",
    "tags": ["passeio", "leve", "carinho"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_movie_01",
    "title": "Filme do jeito que a YAYA quiser (I)",
    "subtitle": "Eu assisto, eu comento, eu curto.",
    "description": "Você escolhe o filme (qualquer um!) e eu assisto feliz da vida com você.",
    "type": "entretenimento",
    "tags": ["filme", "casa", "lazer"],
    "isActive": true,
    "ruleIds": ["r_movie_no_same_day"]
  },
  {
    "id": "cp_movie_02",
    "title": "Filme do jeito que a YAYA quiser (II)",
    "subtitle": "Pipoca e sua escolha.",
    "description": "Mais um vale-filme soberano. Sua escolha é uma ordem.",
    "type": "entretenimento",
    "tags": ["filme", "casa", "lazer"],
    "isActive": true,
    "ruleIds": ["r_movie_no_same_day"]
  },
  {
    "id": "cp_movie_03",
    "title": "Filme do jeito que a YAYA quiser (III)",
    "subtitle": "Sessão de cinema em casa.",
    "description": "Terceiro filme à sua escolha. Prometo não reclamar do gênero!",
    "type": "entretenimento",
    "tags": ["filme", "casa", "lazer"],
    "isActive": true,
    "ruleIds": ["r_movie_no_same_day"]
  },
  {
    "id": "cp_dorama_01",
    "title": "Maratona de Dorama (I)",
    "subtitle": "Do primeiro ao último episódio.",
    "description": "Vou assistir um dorama inteiro com você, até o fim, comentando e torcendo pelo casal.",
    "type": "entretenimento",
    "tags": ["série", "casa", "amor"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_dorama_02",
    "title": "Maratona de Dorama (II)",
    "subtitle": "Mais drama, mais romance.",
    "description": "Mais um dorama completo na conta. Preparado para as emoções.",
    "type": "entretenimento",
    "tags": ["série", "casa", "amor"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_anime_01",
    "title": "Temporada de Anime (I)",
    "subtitle": "Você escolhe, nós assistimos.",
    "description": "Vale uma temporada inteira de anime (até 24 eps) escolhida por você.",
    "type": "entretenimento",
    "tags": ["anime", "série", "lazer"],
    "isActive": true,
    "ruleIds": ["r_anime_max_24"]
  },
  {
    "id": "cp_anime_02",
    "title": "Temporada de Anime (II)",
    "subtitle": "Otakus apaixonados.",
    "description": "Segunda temporada de anime à sua escolha.",
    "type": "entretenimento",
    "tags": ["anime", "série", "lazer"],
    "isActive": true,
    "ruleIds": ["r_anime_max_24"]
  },
  {
    "id": "cp_friends_night",
    "title": "Saída com as Amigas",
    "subtitle": "Divirta-se, o Vivico banca.",
    "description": "Cartão liberado (até R$200) para você curtir com as amigas. Transporte e consumação inclusos.",
    "type": "lazer",
    "tags": ["amigas", "lazer", "livre"],
    "isActive": true,
    "ruleIds": ["r_value_no_change"]
  },

  // --- VIAGEM & PRESENTES ---
  {
    "id": "cp_weekend_trip",
    "title": "Viagem de Final de Semana",
    "subtitle": "Destino escolhido pela YAYA.",
    "description": "Um fim de semana só nosso. Vamos planejar juntos o destino que você quiser.",
    "type": "viagem",
    "tags": ["viagem", "amor", "experiencias"],
    "isActive": true,
    "ruleIds": ["r_trip_30d_notice"]
  },
  {
    "id": "cp_bouquet_01",
    "title": "Vale Buquê",
    "subtitle": "Flores pra lembrar que eu te amo.",
    "description": "Após resgatar, eu te dou um buquê dentro de 10 dias. Pode ser surpresa ou combinado — você manda.",
    "type": "presentes",
    "tags": ["flores", "presentes", "romance"],
    "isActive": true,
    "ruleIds": ["r_bouquet_10d"]
  }
];

// Map icons to coupons based on ID pattern
const getIconForCoupon = (id: string, tags: string[]) => {
  if (id.includes('surprise')) return Lock;
  if (tags.includes('tubarão')) return Users; // Placeholder for Shark vibe, or use simple distinct icon
  if (id.includes('shop') || id.includes('makeup')) return ShoppingBag;
  if (id.includes('friends')) return Sparkles;
  if (id.includes('escape_super')) return Zap;
  if (id.includes('escape')) return Clock;
  if (id.includes('photo')) return Camera;
  if (id.includes('massage')) return Star;
  if (id.includes('dinner')) return UtensilsCrossed;
  if (id.includes('coffee')) return Coffee;
  if (id.includes('tea')) return Coffee; // Tea uses coffee icon or similar
  if (id.includes('sweet')) return Cookie;
  if (id.includes('bouquet')) return Flower2;
  if (id.includes('trip')) return Plane;
  if (id.includes('plaza')) return Wind;
  if (id.includes('movie') || id.includes('dorama') || id.includes('anime')) return Tv;
  return Gift;
};

const COUPONS = RAW_COUPONS.map(c => ({
  ...c,
  icon: getIconForCoupon(c.id, c.tags)
}));

const ALL_TAGS = ['Todos', ...Array.from(new Set(COUPONS.flatMap(c => c.tags)))];

// --- UTILS: LOCAL STORAGE HOOK ---

function useCouponsState() {
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('christmas_coupons_redeemed');
      if (stored) {
        setRedeemedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
    setIsLoaded(true);
  }, []);

  const redeemCoupon = (id: string) => {
    const newIds = [...redeemedIds, id];
    setRedeemedIds(newIds);
    localStorage.setItem('christmas_coupons_redeemed', JSON.stringify(newIds));
  };

  return { redeemedIds, redeemCoupon, isLoaded };
}

// --- UTILS: DATE CHECK ---
const isCouponLocked = (availableFrom?: string) => {
    if (!availableFrom) return false;
    const today = new Date();
    // Reset time to ensure we compare dates only if needed, 
    // but typically raw comparison works for "future date".
    // Parsing 'YYYY-MM-DD' works in constructor.
    const availableDate = new Date(availableFrom);
    return today < availableDate;
};

// --- COMPONENT: SNOW OVERLAY ---

const SnowOverlay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; r: number; d: number }[] = [];
    const maxParticles = 50;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1, // radius
        d: Math.random() * maxParticles, // density
      });
    }

    let animationFrameId: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
      animationFrameId = requestAnimationFrame(draw);
    }

    function update() {
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        p.y += Math.cos(p.d) + 0.5 + p.r / 3; // Slower fall
        p.x += Math.sin(0.01 * p.y); // Slight wind

        if (p.y > height) {
          particles[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d };
        }
      }
    }

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-50" 
    />
  );
};

// --- COMPONENT: COUPON CARD (Ticket Style) ---

const CouponCard: React.FC<{ data: typeof COUPONS[0], isRedeemed: boolean, onClick: () => void, index: number }> = ({ data, isRedeemed, onClick, index }) => {
  const locked = isCouponLocked(data.availableFrom);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30, rotate: index % 2 === 0 ? -1 : 1 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      transition={{ 
        delay: index * 0.08, 
        type: 'spring', 
        damping: 15,
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02, 
        rotate: isRedeemed ? 0 : (Math.random() - 0.5) * 2,
        transition: { type: 'spring', stiffness: 400 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full cursor-pointer group mb-4 transition-all duration-300 select-none
        ${isRedeemed ? 'opacity-60 grayscale filter' : ''}
        ${locked ? 'grayscale-[0.5] opacity-90' : ''}`}
    >
      {/* Container with Scalloped Edges (Mask) */}
      <div className={`relative w-full h-36 mask-scallop-vertical overflow-hidden
          ${isRedeemed ? 'bg-zinc-800' : (locked ? 'bg-gradient-to-br from-zinc-700 to-zinc-900' : 'bg-gradient-to-br from-velvet to-burgundy shadow-xl')}`}>
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none"></div>
        
        {/* Inner Border (Dashed) */}
        <div className="absolute inset-3 border border-dashed border-white/20 rounded-lg pointer-events-none"></div>

        <div className="relative p-5 flex items-center justify-between gap-4 h-full pl-6 pr-6">
            {/* Left Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm
                        ${isRedeemed ? 'text-zinc-500 bg-zinc-900 border border-zinc-700' : 'text-gold-light bg-black/20 border border-gold/20'}`}>
                        {data.tags[0]}
                    </span>
                    {locked && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm text-zinc-300 bg-black/40 border border-zinc-500">
                           <Lock size={8} /> Bloqueado
                        </span>
                    )}
                </div>
                <h3 className={`serif text-xl sm:text-2xl font-semibold leading-tight mb-1 truncate
                    ${isRedeemed ? 'text-zinc-500' : 'text-cream drop-shadow-sm'}`}>
                    {data.title}
                </h3>
                <p className={`text-sm truncate font-light
                    ${isRedeemed ? 'text-zinc-600' : 'text-white/70'}`}>
                    {data.subtitle}
                </p>
            </div>

            {/* Vertical Separator Line */}
            <div className="h-20 w-px bg-white/10 mx-2 dashed-line hidden sm:block"></div>

            {/* Right Icon (Golden Stamp Style) */}
            <div className={`flex-shrink-0 w-16 h-16 flex items-center justify-center relative`}>
                {/* Stamp Circle Background */}
                <div className={`absolute inset-0 rounded-full border-2 
                    ${isRedeemed ? 'border-zinc-700 bg-zinc-800' : 'border-gold/60 bg-gradient-to-br from-gold/20 to-transparent shadow-inner'}`}></div>
                
                {/* Icon */}
                <data.icon 
                    size={32} 
                    strokeWidth={1.2} 
                    className={`relative z-10 drop-shadow-md transform -rotate-12
                        ${isRedeemed ? 'text-zinc-600' : 'text-gold-light'}`} 
                />
            </div>
        </div>
      </div>

      {/* Stamp if redeemed (Overlaid on top) */}
      {isRedeemed && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <motion.div 
            initial={{ scale: 2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 0.9, rotate: -15 }}
            className="border-4 border-white text-white font-bold text-xl uppercase tracking-widest px-6 py-2 rounded-lg backdrop-blur-[2px] shadow-lg"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Resgatado
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// --- COMPONENT: REDEMPTION MODAL ---

const RedemptionModal = ({ coupon, isRedeemed, onClose, onRedeem }: { coupon: typeof COUPONS[0], isRedeemed: boolean, onClose: () => void, onRedeem: () => void }) => {
  const [tearState, setTearState] = useState<'idle' | 'tearing' | 'torn'>('idle');
  const locked = isCouponLocked(coupon.availableFrom);
  
  // Confetti effect - More Intense
  const triggerIntenseConfetti = () => {
    const colors = ['#d4af37', '#ff0000', '#ffffff', '#0f392b', '#FFD700'];
    const particleCount = 100;
    
    for(let i=0; i<particleCount; i++) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.left = '50%';
        el.style.top = '60%'; // Start lower
        el.style.width = Math.random() > 0.5 ? '10px' : '6px';
        el.style.height = Math.random() > 0.5 ? '10px' : '6px';
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.zIndex = '9999';
        el.style.pointerEvents = 'none';
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(el);
        
        // Physics simulation using Web Animations API
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 400;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 200; // biased upwards

        const anim = el.animate([
            { transform: `translate(-50%, -50%) scale(0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(calc(-50% + ${tx * 0.5}px), calc(-50% + ${ty * 0.5}px)) scale(1.2) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.4 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty + 400}px)) scale(0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 1500 + Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        });
        
        anim.onfinish = () => el.remove();
    }
  };

  const y = useMotionValue(0);
  const tearOpacity = useTransform(y, [0, 100], [1, 0.5]);
  const tearScale = useTransform(y, [0, 150], [1, 0.9]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (locked) return;
    if (info.offset.y > 100) { // Dragged down enough
      setTearState('torn');
      triggerIntenseConfetti();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([100, 50, 100]);
      // Small delay before marking as redeemed in React state to allow animation to play
      setTimeout(() => {
        onRedeem();
      }, 800);
    } 
  };

  // Date formatting for lock message
  const availableDateFormatted = coupon.availableFrom 
    ? new Date(coupon.availableFrom).toLocaleDateString('pt-BR') 
    : '';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-deep-green/95 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        layoutId={`card-${coupon.id}`}
        className="relative w-full max-w-md bg-transparent flex flex-col items-center max-h-[85vh] sm:max-h-[90vh]"
        initial={{ scale: 0.8, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* TOP PART (Safe Zone) */}
        <div className="w-full bg-cream rounded-t-xl shadow-2xl relative z-20 flex flex-col min-h-0">
             {/* Header Image Area / Pattern */}
            <div className={`h-36 sm:h-44 relative overflow-hidden flex items-center justify-center shrink-0 group rounded-t-xl
                ${locked ? 'bg-zinc-800' : 'bg-gradient-to-br from-velvet to-burgundy'}`}>
                {/* Animated Particles in Header */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-gold rounded-full opacity-40"
                            initial={{ 
                                x: Math.random() * 400 - 200, 
                                y: Math.random() * 200, 
                                scale: Math.random() * 0.5 + 0.2 
                            }}
                            animate={{ 
                                y: [null, -50],
                                opacity: [0.4, 0]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 2 + Math.random() * 3,
                                ease: "linear"
                            }}
                            style={{
                                width: Math.random() * 6 + 2,
                                height: Math.random() * 6 + 2,
                                left: '50%',
                                top: '50%'
                            }}
                        />
                    ))}
                </div>

                {/* Noise Texture */}
                <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay"></div>
                
                <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', 
                    backgroundSize: '24px 24px' 
                }}></div>
                
                {/* Icon */}
                <motion.div 
                    animate={locked ? {} : { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="z-10 drop-shadow-2xl bg-black/20 p-5 sm:p-6 rounded-full border border-gold/30 backdrop-blur-sm shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                >
                    {locked ? (
                        <Lock size={48} strokeWidth={1} className="text-zinc-400 sm:w-16 sm:h-16" />
                    ) : (
                        <coupon.icon size={48} strokeWidth={1} className="text-gold-light sm:w-16 sm:h-16" />
                    )}
                </motion.div>

                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors z-20"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content with Scroll */}
            <div className="p-5 sm:p-6 bg-cream relative overflow-y-auto custom-scrollbar flex-1 overscroll-contain">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-burgundy mb-2 block">
                        {coupon.tags.join(' • ')}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">
                        Válido até 25/12/2026
                    </span>
                </div>
                
                <h2 className="serif text-3xl sm:text-4xl font-bold text-forest mb-2 leading-none">
                    {coupon.title}
                </h2>
                <p className="text-lg text-burgundy/80 font-serif italic mb-6">
                    {coupon.subtitle}
                </p>
                
                <div className="space-y-6 pb-2">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Descrição</h4>
                        <p className="text-slate-700 leading-relaxed text-base">
                            {coupon.description}
                        </p>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900/60 mb-3">
                            <Info size={14} /> Regras de Uso
                        </h4>
                        {coupon.ruleIds.length > 0 ? (
                            <div className="space-y-3">
                                {coupon.ruleIds.map(ruleId => {
                                    const rule = RAW_RULES.find(r => r.id === ruleId);
                                    return rule ? (
                                        <div key={ruleId}>
                                            <p className="text-[10px] font-bold text-amber-800/80 uppercase mb-1 tracking-wider">{rule.title}</p>
                                            <ul className="space-y-1">
                                                {rule.description.map((desc, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-amber-900/70">
                                                        <span className="text-amber-500 mt-1.5 text-[8px]">●</span>
                                                        {desc}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-amber-900/60 italic">Sem regras específicas. Aproveite com moderação (ou não)!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* SLAMMING STAMP ANIMATION (Positioned absolutely over the Top Part container) */}
            {isRedeemed && (
                <motion.div 
                    initial={{ scale: 3, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: -15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                >
                    <div className="border-8 border-burgundy/80 text-burgundy/90 font-bold text-4xl uppercase tracking-widest px-8 py-4 rounded-xl bg-cream/40 backdrop-blur-[1px] shadow-2xl mix-blend-multiply" style={{ transform: 'rotate(-15deg)' }}>
                        RESGATADO
                    </div>
                </motion.div>
            )}
            
            {/* Perforation Line SVG */}
            <div className="w-full h-4 bg-cream relative z-20 shrink-0">
                 <svg width="100%" height="16" viewBox="0 0 100 16" preserveAspectRatio="none" className="absolute bottom-[-1px] left-0 w-full block text-cream drop-shadow-sm">
                    <path d="M0,0 L0,16 L100,16 L100,0" fill="currentColor" />
                 </svg>
                 {/* Dashed Cut Line */}
                 <div className="absolute bottom-0 w-full border-b-2 border-dashed border-slate-300"></div>
            </div>
        </div>

        {/* BOTTOM PART (Tearable Footer) */}
        {!isRedeemed && tearState !== 'torn' && (
            <motion.div 
                style={locked ? {} : { y, opacity: tearOpacity, scale: tearScale }}
                drag={locked ? false : "y"}
                dragConstraints={{ top: 0, bottom: 150 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className={`w-full rounded-b-xl shadow-xl overflow-hidden relative z-10 shrink-0 border-t border-transparent transition-colors
                    ${locked ? 'bg-zinc-200 cursor-not-allowed' : 'bg-slate-100 cursor-grab active:cursor-grabbing'}`}
            >
                {/* Jagged Edge Top */}
                <div className="absolute top-[-8px] w-full h-4 z-20">
                     {/* Visual jagged line simulation */}
                     <div className={`w-full h-full bg-[length:20px_20px] ${locked 
                        ? 'bg-[linear-gradient(45deg,transparent_33.333%,#e4e4e7_33.333%,#e4e4e7_66.667%,transparent_66.667%),linear-gradient(-45deg,transparent_33.333%,#e4e4e7_33.333%,#e4e4e7_66.667%,transparent_66.667%)]' 
                        : 'bg-[linear-gradient(45deg,transparent_33.333%,#f1f5f9_33.333%,#f1f5f9_66.667%,transparent_66.667%),linear-gradient(-45deg,transparent_33.333%,#f1f5f9_33.333%,#f1f5f9_66.667%,transparent_66.667%)]'}`}></div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                    {locked ? (
                        <>
                             <div className="text-zinc-400 mb-2">
                                <Lock size={24} />
                            </div>
                            <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] mb-1">
                                Bloqueado até {availableDateFormatted}
                            </p>
                            <p className="text-[10px] text-zinc-400">
                                Aguarde a data especial...
                            </p>
                        </>
                    ) : (
                        <>
                            <motion.div 
                                animate={{ y: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-gold mb-2"
                            >
                                <Wind className="rotate-90" />
                            </motion.div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">
                                Puxe para baixo para resgatar
                            </p>
                            <p className="text-[10px] text-slate-300">
                                (Cuidado, é viciante)
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        )}
        
        {isRedeemed && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 shrink-0"
            >
                <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-cream px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs border border-white/20 backdrop-blur-md transition-colors shadow-lg">
                    Fechar
                </button>
            </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const { redeemedIds, redeemCoupon, isLoaded } = useCouponsState();
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [selectedCoupon, setSelectedCoupon] = useState<typeof COUPONS[0] | null>(null);

  const filteredCoupons = useMemo(() => {
    return COUPONS.filter(c => 
      selectedTag === 'Todos' ? true : c.tags.includes(selectedTag)
    );
  }, [selectedTag]);

  // Prevent hydration mismatch by waiting for load
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-deep-green text-cream relative overflow-x-hidden selection:bg-gold selection:text-white font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-b from-deep-green to-black z-0"></div>
      <div className="fixed inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #1a4d3a, transparent 70%)' }}></div>
      
      <SnowOverlay />

      <main className="relative z-10 max-w-xl mx-auto min-h-screen flex flex-col pb-12">
        {/* Header */}
        <header className="pt-12 pb-8 px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="inline-block mb-4 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20">
                    <Gift size={28} className="text-gold" />
                </div>
                <h1 className="serif text-4xl sm:text-5xl font-medium text-cream mb-2 drop-shadow-md tracking-tight">
                    Feliz Natal, YAYA <span className="text-4xl align-middle filter drop-shadow">🎄</span>
                </h1>
                <p className="text-cream/70 font-light text-base max-w-xs mx-auto leading-relaxed">
                    Do teu Vivico — um presente que dura o ano inteiro.
                </p>
                <p className="text-gold/60 text-[10px] uppercase tracking-widest mt-3 font-bold">
                    Rumo aos nossos 4 anos em 01/08/2026 ❤️
                </p>
                
                {/* Global Expiration Badge */}
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40">
                    <Calendar size={10} />
                    <span>Válido até 25/12/2026</span>
                </div>
            </motion.div>
        </header>

        {/* Filters */}
        <div className="px-6 mb-8 relative">
            {/* Fade masks for scroll */}
            <div className="absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-deep-green to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-deep-green to-transparent z-20 pointer-events-none"></div>
            
            <p className="px-2 mb-2 text-[10px] uppercase tracking-widest text-white/30 font-bold">Escolhe uma categoria, YAYA:</p>
            <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar scroll-smooth">
                {ALL_TAGS.map((tag, i) => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`
                            whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 border uppercase tracking-wider
                            ${selectedTag === tag 
                                ? 'bg-cream text-deep-green border-cream shadow-[0_0_15px_rgba(253,251,247,0.2)] scale-105' 
                                : 'bg-white/5 text-cream/60 border-white/10 hover:bg-white/10 hover:text-cream'}
                        `}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>

        {/* List */}
        <div className="flex-1 px-5">
            <AnimatePresence mode="popLayout">
                {filteredCoupons.map((coupon, index) => (
                    <CouponCard 
                        key={coupon.id} 
                        data={coupon} 
                        index={index}
                        isRedeemed={redeemedIds.includes(coupon.id)}
                        onClick={() => setSelectedCoupon(coupon)}
                    />
                ))}
            </AnimatePresence>
            
            {filteredCoupons.length === 0 && (
                <div className="text-center py-20 text-white/30 flex flex-col items-center">
                    <ShoppingBag size={48} className="mb-4 opacity-50" />
                    <p className="serif text-xl">Nenhum cupom encontrado.</p>
                </div>
            )}
        </div>
        
        {/* Footer Note */}
        <footer className="mt-12 text-center text-white/20 text-[10px] uppercase tracking-widest pb-8">
            <p>Feito com amor pelo Vivico ❤️</p>
        </footer>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCoupon && (
            <RedemptionModal 
                coupon={selectedCoupon} 
                isRedeemed={redeemedIds.includes(selectedCoupon.id)}
                onClose={() => setSelectedCoupon(null)}
                onRedeem={() => redeemCoupon(selectedCoupon.id)}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- STYLE UTILS & RENDER ---

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}