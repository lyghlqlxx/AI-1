
import React from 'react';
import { SCENES } from '../constants';

interface SceneSelectorProps {
  selectedSceneId: string | null;
  onSceneSelect: (id: string) => void;
}

export default function SceneSelector({ selectedSceneId, onSceneSelect }: SceneSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SCENES.map((scene) => (
        <button
          key={scene.id}
          onClick={() => onSceneSelect(scene.id)}
          className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
            ${selectedSceneId === scene.id ? 'border-cyan-400 scale-105 shadow-lg' : 'border-transparent hover:border-cyan-600'}`}
        >
          <img src={scene.imageUrl} alt={scene.name} className="w-full h-24 object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-end p-2">
            <p className="text-white text-xs font-bold">{scene.name}</p>
          </div>
           {selectedSceneId === scene.id && (
            <div className="absolute inset-0 bg-cyan-500/30"></div>
          )}
        </button>
      ))}
    </div>
  );
}
