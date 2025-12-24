import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useMotionValue, useAnimation, PanInfo } from 'framer-motion';
import { 
  Ticket, Star, Clock, Heart, Utensils, Camera, ShoppingBag, X, Gift, Check, Info, 
  Zap, Sparkles, UtensilsCrossed, Coffee, Cookie, Flower2, CreditCard, Wind
} from 'lucide-react';

// --- DATA: RULES & COUPONS ---

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
    "id": "r_bouquet_10d",
    "title": "Janela do buquê",
    "description": [
      "Após resgatar, eu te dou um buquê dentro de 10 dias.",
      "O dia pode ser surpresa ou combinado — você manda no jeito."
    ]
  }
];

const RAW_COUPONS = [
  {
    "id": "cp_shop_300_01",
    "title": "Cupom do 300zão — Parte I",
    "subtitle": "Você escolhe. Eu sorrio e pago.",
    "description": "Vale R$300 em compras do jeitinho que você quiser. Pode ser mimo, utilidade, beleza, decoração… você decide.",
    "type": "compras",
    "tags": ["compras", "presentes"],
    "isActive": true,
    "ruleIds": ["r_shop_300"]
  },
  {
    "id": "cp_shop_300_02",
    "title": "Cupom do 300zão — Parte II",
    "subtitle": "Mais um pra você gastar sem culpa.",
    "description": "Vale R$300 em compras. Se for algo muito grande, dá pra combinar de juntar cupons (com negociação e beijo).",
    "type": "compras",
    "tags": ["compras", "presentes"],
    "isActive": true,
    "ruleIds": ["r_shop_300"]
  },
  {
    "id": "cp_shop_300_03",
    "title": "Cupom do 300zão — Final Boss",
    "subtitle": "O último… (ou o primeiro a ser usado?)",
    "description": "Vale R$300 em compras. Use com sabedoria… ou com impulsividade gostosa.",
    "type": "compras",
    "tags": ["compras", "presentes"],
    "isActive": true,
    "ruleIds": ["r_shop_300"]
  },

  {
    "id": "cp_escape_01",
    "title": "Fuga do Trabalho — Edição Fofa",
    "subtitle": "Eu sumo do mundo e apareço pra você.",
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
    "subtitle": "Usou, eu vou. Simples assim.",
    "description": "Cupom especial: você pode usar a qualquer hora, e eu apareço onde você estiver pra te ver.",
    "type": "tempo",
    "tags": ["tempo", "romance", "lendario"],
    "isActive": true,
    "ruleIds": ["r_escape_super"]
  },

  {
    "id": "cp_photo_01",
    "title": "1 Hora de Fotos — Sessão I",
    "subtitle": "Você brilha. Eu clico.",
    "description": "Uma hora inteira de fotos com você mandando no estilo. Sem pausas — é sessão de verdade.",
    "type": "experiencia",
    "tags": ["fotos", "experiencias", "carinho"],
    "isActive": true,
    "ruleIds": ["r_photo_60"]
  },
  {
    "id": "cp_photo_02",
    "title": "1 Hora de Fotos — Sessão II",
    "subtitle": "Modo fotógrafo ativado.",
    "description": "Uma hora contínua de fotos. Pode ser rua, café, parque, casa… você escolhe o cenário.",
    "type": "experiencia",
    "tags": ["fotos", "experiencias", "carinho"],
    "isActive": true,
    "ruleIds": ["r_photo_60"]
  },
  {
    "id": "cp_photo_03",
    "title": "1 Hora de Fotos — Sessão III",
    "subtitle": "A última… (ou a mais épica).",
    "description": "Uma hora seguida de fotos pra você ter um álbum inteiro de lembranças lindas.",
    "type": "experiencia",
    "tags": ["fotos", "experiencias", "carinho"],
    "isActive": true,
    "ruleIds": ["r_photo_60"]
  },

  {
    "id": "cp_massage_01",
    "title": "Massagem no Pé — 20 min (I)",
    "subtitle": "Spa caseiro, edição amor.",
    "description": "20 minutos de massagem no pé, do jeitinho que você gosta.",
    "type": "carinho",
    "tags": ["carinho", "bem-estar"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_massage_02",
    "title": "Massagem no Pé — 20 min (II)",
    "subtitle": "Relaxamento garantido.",
    "description": "Mais 20 minutos de massagem no pé. Você só precisa resgatar.",
    "type": "carinho",
    "tags": ["carinho", "bem-estar"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_massage_03",
    "title": "Massagem no Pé — 20 min (III)",
    "subtitle": "Fechamento de luxo.",
    "description": "20 minutos de massagem no pé. Porque você merece muito.",
    "type": "carinho",
    "tags": ["carinho", "bem-estar"],
    "isActive": true,
    "ruleIds": []
  },

  {
    "id": "cp_dinner_01",
    "title": "Jantar Completo — Noite I",
    "subtitle": "Entrada, prato, sobremesa… tudo incluso.",
    "description": "Você escolhe o restaurante e a gente faz uma noite bem gostosa: entrada + principal + sobremesa. Sem economizar no prazer.",
    "type": "comida",
    "tags": ["comida", "encontro", "experiencias"],
    "isActive": true,
    "ruleIds": []
  },
  {
    "id": "cp_dinner_02",
    "title": "Jantar Completo — Noite II",
    "subtitle": "Repetir é viver.",
    "description": "Mais uma noite com tudo incluso. Você escolhe o lugar e eu cuido do resto.",
    "type": "comida",
    "tags": ["comida", "encontro", "experiencias"],
    "isActive": true,
    "ruleIds": []
  },

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
    "id": "cp_sweet_01",
    "title": "Vale um Docinho — Resgate I",
    "subtitle": "Tristezinha? Eu mando açúcar e amor.",
    "description": "Se você estiver meio pra baixo (ou só com vontade), eu mando um docinho/comidinha gostosa onde você estiver (tipo iFood).",
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
const getIconForCoupon = (id: string) => {
  if (id.includes('shop')) return ShoppingBag;
  if (id.includes('escape_super')) return Zap;
  if (id.includes('escape')) return Clock;
  if (id.includes('photo')) return Camera;
  if (id.includes('massage')) return Sparkles;
  if (id.includes('dinner')) return UtensilsCrossed;
  if (id.includes('coffee')) return Coffee;
  if (id.includes('sweet')) return Cookie;
  if (id.includes('bouquet')) return Flower2;
  return Gift;
};

const COUPONS = RAW_COUPONS.map(c => ({
  ...c,
  icon: getIconForCoupon(c.id)
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 50 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full cursor-pointer group mb-4 transition-all duration-300 select-none
        ${isRedeemed ? 'opacity-60 grayscale filter' : 'hover:-translate-y-1'}`}
    >
      {/* Container with Scalloped Edges (Mask) */}
      <div className={`relative w-full h-36 mask-scallop-vertical overflow-hidden
          ${isRedeemed ? 'bg-zinc-800' : 'bg-gradient-to-br from-velvet to-burgundy shadow-xl'}`}>
        
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
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const controls = useAnimation();
  
  // Confetti effect
  const triggerConfetti = () => {
    // Simple DOM confetti simulation
    const colors = ['#d4af37', '#721121', '#ffffff'];
    for(let i=0; i<40; i++) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.left = '50%';
        el.style.top = '50%';
        el.style.width = '8px';
        el.style.height = '8px';
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
        el.style.zIndex = '9999';
        el.style.pointerEvents = 'none';
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        document.body.appendChild(el);
        
        const destX = (Math.random() - 0.5) * 600;
        const destY = (Math.random() - 0.5) * 600 - 100; // Tend upwards
        
        const anim = el.animate([
            { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
            { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 800,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });
        
        anim.onfinish = () => el.remove();
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 180) { // Threshold to redeem
      triggerConfetti();
      onRedeem();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([50, 50, 50]);
    } else {
      controls.start({ x: 0 }); // Reset
    }
  };

  const handleDrag = (event: any, info: PanInfo) => {
    setDragProgress(Math.min(Math.max(info.offset.x / 200, 0), 1));
  };

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
        className="relative w-full max-w-md bg-cream rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
      >
        {/* Header Image Area / Pattern */}
        <div className="h-40 bg-gradient-to-br from-velvet to-burgundy relative overflow-hidden flex items-center justify-center shrink-0">
             {/* Noise Texture */}
            <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay"></div>
            
            <div className="absolute inset-0 opacity-20" style={{ 
                backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
            }}></div>
            
            <div className="z-10 drop-shadow-2xl filter transform hover:scale-105 transition-transform duration-300 bg-black/20 p-6 rounded-full border border-gold/30 backdrop-blur-sm">
                <coupon.icon size={64} strokeWidth={1} className="text-gold-light" />
            </div>

            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors z-20"
            >
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-cream">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-burgundy mb-2 block">
                    {coupon.tags.join(' • ')}
                </span>
                {isRedeemed && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full uppercase tracking-wider">
                        <Check size={12} /> Resgatado
                    </span>
                )}
            </div>
            
            <h2 className="serif text-3xl sm:text-4xl font-bold text-forest mb-2 leading-none">
                {coupon.title}
            </h2>
            <p className="text-lg text-burgundy/80 font-serif italic mb-6">
                {coupon.subtitle}
            </p>
            
            <div className="space-y-6">
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

        {/* Footer / Interaction Area */}
        <div className="p-6 bg-white border-t border-slate-100 relative shrink-0">
            {isRedeemed ? (
                <div className="text-center py-2">
                    <p className="text-slate-500 text-sm italic serif mb-4">"Espero que você tenha aproveitado muito! ❤️"</p>
                    <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm uppercase tracking-wide hover:bg-slate-200 transition-colors">
                        Voltar
                    </button>
                </div>
            ) : (
                <div className="relative">
                     {/* Stub Tearing Interaction */}
                     <div className="w-full h-16 bg-slate-100 rounded-full overflow-hidden relative flex items-center shadow-inner border border-slate-200">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pl-8">
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] opacity-60">
                                Deslize para abrir
                            </span>
                        </div>
                        
                        {/* Progress Fill */}
                        <motion.div 
                            className="absolute left-0 top-0 bottom-0 bg-gold/30"
                            style={{ width: `${dragProgress * 100}%` }}
                        />

                        {/* Draggable Handle */}
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 280 }} // Approximate width constraint
                            dragElastic={0.05}
                            dragMomentum={false}
                            onDrag={handleDrag}
                            onDragEnd={handleDragEnd}
                            animate={controls}
                            whileTap={{ cursor: "grabbing" }}
                            className="absolute left-1.5 h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center z-20 cursor-grab border border-slate-100 ring-2 ring-gold/20"
                        >
                            <Gift size={20} className="text-gold" />
                        </motion.div>
                     </div>
                     <p className="text-center text-[10px] text-slate-400 mt-3">
                         Ao deslizar completamente, o cupom será marcado como usado.
                     </p>
                </div>
            )}
        </div>
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
                <h1 className="serif text-5xl font-medium text-cream mb-2 drop-shadow-md tracking-tight">
                    Cupons de Natal <span className="text-4xl align-middle filter drop-shadow">🎄</span>
                </h1>
                <p className="text-cream/70 font-light text-base max-w-xs mx-auto leading-relaxed">
                    Um presente especial que dura o ano inteiro. <br/>Feito com amor.
                </p>
            </motion.div>
        </header>

        {/* Filters */}
        <div className="px-6 mb-8 relative">
            {/* Fade masks for scroll */}
            <div className="absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-deep-green to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-deep-green to-transparent z-20 pointer-events-none"></div>
            
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
            <p>Feito exclusivamente para você ❤️</p>
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