import { useState, useEffect } from 'react';
import { FaRocket, FaClock } from 'react-icons/fa';

export const LaunchCountdown = () => {
  const launchDate = new Date('2025-11-17T22:00:00Z'); // 17/11/2025 às 22:00 UTC
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLaunched: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = launchDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLaunched: true
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isLaunched: false
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isLaunched) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#00E676] via-[#00B359] to-[#00A855] rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-[#00E676] mb-6 sm:mb-8">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <FaRocket className="text-white text-4xl sm:text-5xl animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            🎉 PrimeCoin Está ao Vivo! 🎉
          </h2>
          <p className="text-white/90 text-sm sm:text-lg font-medium">
            Conecte sua carteira e comece a investir agora!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1E2635] via-[#242D3E] to-[#1A2332] rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-[#FFB800] mb-6 sm:mb-8">
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#FFB800]/5 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-[#00D9D9]/5 rounded-full blur-3xl -ml-28 -mb-28 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-[#FFB800] to-[#FFA726] p-4 rounded-2xl shadow-lg">
              <FaClock className="text-white text-3xl sm:text-4xl animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Lançamento Oficial PrimeCoin (PSC)
          </h2>
          <p className="text-[#FFB800] text-base sm:text-lg font-bold mb-1">
            17 de Novembro de 2025 às 22:00 UTC
          </p>
          <p className="text-[#A8B2C1] text-xs sm:text-sm">
            (19:00 Horário de Brasília)
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {/* Days */}
          <div className="bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl p-4 sm:p-6 border border-[#FFB800]/30 shadow-lg">
            <div className="text-3xl sm:text-5xl font-bold text-[#FFB800] mb-1 sm:mb-2">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs text-[#A8B2C1] uppercase font-semibold">
              Dias
            </div>
          </div>

          {/* Hours */}
          <div className="bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl p-4 sm:p-6 border border-[#00D9D9]/30 shadow-lg">
            <div className="text-3xl sm:text-5xl font-bold text-[#00D9D9] mb-1 sm:mb-2">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs text-[#A8B2C1] uppercase font-semibold">
              Horas
            </div>
          </div>

          {/* Minutes */}
          <div className="bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl p-4 sm:p-6 border border-[#00E676]/30 shadow-lg">
            <div className="text-3xl sm:text-5xl font-bold text-[#00E676] mb-1 sm:mb-2">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs text-[#A8B2C1] uppercase font-semibold">
              Min
            </div>
          </div>

          {/* Seconds */}
          <div className="bg-gradient-to-br from-[#0D1F32] to-[#1A2332] rounded-2xl p-4 sm:p-6 border border-[#FF4757]/30 shadow-lg">
            <div className="text-3xl sm:text-5xl font-bold text-[#FF4757] mb-1 sm:mb-2">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs text-[#A8B2C1] uppercase font-semibold">
              Seg
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="bg-[#0D1F32]/50 rounded-xl p-3 sm:p-4 border border-[#2A3548]">
            <div className="text-[#00D9D9] font-bold text-sm sm:text-base mb-1">Preço Inicial</div>
            <div className="text-white text-xs sm:text-sm">$0.00001 USDT</div>
          </div>
          <div className="bg-[#0D1F32]/50 rounded-xl p-3 sm:p-4 border border-[#2A3548]">
            <div className="text-[#00E676] font-bold text-sm sm:text-base mb-1">Plataforma</div>
            <div className="text-white text-xs sm:text-sm">PancakeSwap</div>
          </div>
          <div className="bg-[#0D1F32]/50 rounded-xl p-3 sm:p-4 border border-[#2A3548]">
            <div className="text-[#FFB800] font-bold text-sm sm:text-base mb-1">Blockchain</div>
            <div className="text-white text-xs sm:text-sm">BSC (BEP-20)</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <p className="text-[#A8B2C1] text-sm sm:text-base mb-3">
            Prepare sua carteira e tenha USDT (BEP-20) disponível para não perder o lançamento!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="https://t.me/Primestakegroup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#00D9D9] to-[#00A3A3] hover:from-[#00B8B8] hover:to-[#008888] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              📱 Entrar no Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
