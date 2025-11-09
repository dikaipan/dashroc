import React, { useState, useEffect, useMemo } from "react";
import { LogOut, User as UserIcon } from 'react-feather';
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

// Random Quotes Collection
const QUOTES = [
  { text: "Excellence is not a destination; it is a continuous journey.", author: "Brian Tracy" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Unknown" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
  { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
  { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
  { text: "Dream it. Believe it. Build it.", author: "Unknown" }
];

const Header = ({collapsed=false, onToggle=()=>{}}) => {
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();
  
  // Real-time clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Random quote on mount (changes on refresh)
  const randomQuote = useMemo(() => {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }, []);
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time and date
  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className={`
      mx-4 mt-3 rounded-xl border shadow-md transition-all duration-300 relative z-40
      ${isDark 
        ? 'bg-[var(--card-bg)] border-slate-700/50' 
        : 'bg-white border-gray-200'
      }
    `}>
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Clock & Date - Compact */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className={`
              p-2.5 rounded-lg
              ${isDark 
                ? 'bg-blue-500/10 border border-blue-500/30' 
                : 'bg-blue-50 border border-blue-200'
              }
            `}>
              <span className="text-3xl">⏱</span>
            </div>
            <div>
              <div className={`
                text-2xl font-bold font-mono
                ${isDark ? 'text-blue-400' : 'text-blue-600'}
              `}>
                {formattedTime}
              </div>
              <div className={`
                text-sm
                ${isDark ? 'text-slate-500' : 'text-gray-500'}
              `}>
                {formattedDate}
              </div>
            </div>
          </div>
          
          {/* Center: Quote - Inline & Compact */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`
              p-2 rounded-md
              ${isDark 
                ? 'bg-purple-500/10 border border-purple-500/30' 
                : 'bg-purple-50 border border-purple-200'
              }
            `}>
              <span className="text-xl">💡</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`
                text-sm italic truncate
                ${isDark ? 'text-slate-400' : 'text-gray-600'}
              `} title={randomQuote.text}>
                "{randomQuote.text}"
              </p>
            </div>
          </div>
          
          {/* Right: User Menu */}
          <div className="flex items-center gap-3 min-w-fit">
            {/* User Menu */}
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-md border
              ${isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-gray-50 border-gray-200'
              }
            `}>
              <UserIcon size={16} className={isDark ? 'text-slate-400' : 'text-gray-600'} />
              <span className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {user?.name || 'User'}
              </span>
              <button
                onClick={logout}
                className={`
                  p-1.5 rounded transition-colors
                  ${isDark 
                    ? 'hover:bg-red-500/20 text-red-400' 
                    : 'hover:bg-red-50 text-red-600'
                  }
                `}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
