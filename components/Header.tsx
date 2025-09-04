import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
            产品场景生成器
          </span>
        </h1>
        <p className="text-gray-400 mt-1">AI 驱动，秒速生成产品样机图</p>
      </div>
    </header>
  );
}