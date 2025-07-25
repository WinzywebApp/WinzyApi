import { FaGift, FaStar, FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const colours = [
  'text-yellow-400',
  'text-pink-400',
  'text-indigo-400',
  'text-rose-500',
  'text-green-400',
  'text-blue-400',
  'text-purple-500',
  'text-orange-400',
  'text-red-400',
  'text-cyan-400',
  'text-lime-400',
  'text-teal-400',
  'text-amber-400',
  'text-fuchsia-400',
  'text-emerald-400',
];

const icons = [FaGift, FaStar, FaHeart];

function randomLeft() {
  return Math.random() * window.innerWidth;
}

function randomDelay() {
  return Math.random() * 8; // delay between 0-8s
}

function randomSpinDuration() {
  return 1 + Math.random() * 3; // between 1s and 4s
}

export default function GiftRain() {
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGifts((old) => {
        const nextId = old.length > 0 ? old[old.length - 1].id + 1 : 1;
        const newGifts = [...old, {
          id: nextId,
          left: randomLeft(),
          delay: randomDelay(),
          spin: randomSpinDuration(),
          Icon: icons[nextId % icons.length],
          color: colours[nextId % colours.length],
        }].slice(-70); // keep last 70
        return newGifts;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fallSpin {
            0%   { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
            10%  { opacity: 1; }
            90%  { opacity: 1; }
            100% { transform: translateY(100vh) rotate(1440deg); opacity: 0; }
          }
          .animate-fall-spin {
            animation-name: fallSpin;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}
      </style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="relative w-full h-screen">
          {gifts.map(({ id, left, delay, spin, Icon, color }) => (
            <Icon
              key={id}
              className={`absolute top-0 ${color} animate-fall-spin`}
              style={{
                left: `${left}px`,
                animationDelay: `${delay}s`,
                animationDuration: `30s`,
                width: '15px',
                height: '15px',
                transformOrigin: 'center',
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
