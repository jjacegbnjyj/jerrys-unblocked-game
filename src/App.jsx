/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Gamepad2, Search, X, Maximize2, ArrowLeft } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // In a real app we might fetch this, but here we import it
    setGames(gamesData);
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setSelectedGame(null)}
          >
            <div className="p-2 bg-emerald-500 rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-zinc-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Unblocked<span className="text-emerald-500">Hub</span></h1>
          </div>

          <div className="hidden md:flex relative w-full max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-emerald-400 transition-colors">Request Game</button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedGame ? (
          /* Game Player View */
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Library
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
              {isFullscreen && (
                <button 
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-[60] p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              <iframe
                src={selectedGame.iframeUrl}
                className="w-full h-full border-none"
                title={selectedGame.title}
                allow="autoplay; fullscreen; keyboard"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold">{selectedGame.title}</h2>
              <p className="text-zinc-400 max-w-2xl">{selectedGame.description}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">You might also like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {games.filter(g => g.id !== selectedGame.id).slice(0, 6).map(game => (
                  <div 
                    key={game.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 border border-zinc-800 group-hover:border-emerald-500/50 transition-colors">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h4 className="text-sm font-medium truncate">{game.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Library View */
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black tracking-tighter mb-2">POPULAR GAMES</h2>
                <p className="text-zinc-400">Hand-picked unblocked games for your break.</p>
              </div>
              <div className="flex gap-2">
                {['All', 'Action', 'Puzzle', 'Sports', 'Retro'].map(category => (
                  <button 
                    key={category}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === 'All' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <div 
                  key={game.id}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] cursor-pointer"
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={game.thumbnail} 
                      alt={game.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                      <span className="px-2 py-0.5 bg-zinc-800 text-[10px] font-bold uppercase tracking-wider rounded text-zinc-400">HTML5</span>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{game.description}</p>
                    <button className="w-full py-2.5 bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-zinc-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                      Play Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-zinc-900 rounded-full mb-4">
                  <Search className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">No games found</h3>
                <p className="text-zinc-500">Try searching for something else or request a game.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-900 py-12 bg-zinc-950">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-500" />
            <span className="font-bold tracking-tight">UnblockedHub © 2026</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
