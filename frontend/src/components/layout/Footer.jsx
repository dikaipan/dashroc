import React from 'react';
import { Mail, Phone, MapPin, GitHub, Link, Globe } from 'react-feather';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Company Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">RD</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">ROC DASH</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Platform manajemen data mesin dan engineer untuk optimalisasi operasional bisnis.
            </p>
            <div className="flex gap-2">
              <a href="https://github.com/dikaipan" className="w-7 h-7 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <GitHub size={14} className="text-slate-300" />
              </a>
              <a href="#" className="w-7 h-7 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Link size={14} className="text-slate-300" />
              </a>
              <a href="#" className="w-7 h-7 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Globe size={14} className="text-slate-300" />
              </a>
            </div>
          </div>

          

          
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-slate-400 text-xs">
              {currentYear} <span className="text-blue-400 font-semibold">ROC DASH</span>. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-400 text-xs transition-colors">
                Privacy
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 text-xs transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </footer>
  );
};

export default Footer;