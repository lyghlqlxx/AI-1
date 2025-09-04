import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SceneSelector from './components/SceneSelector';
import ResultDisplay from './components/ResultDisplay';
import { generateScene } from './services/geminiService';
import { SCENES } from './constants';
import type { UploadedImage } from './types';
import SparklesIcon from './components/icons/SparklesIcon';

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setGeneratedImage(null); // Clear previous result on new upload
  };

  const handleSceneSelect = (id: string) => {
    setSelectedSceneId(id);
    setGeneratedImage(null); // Clear previous result on new scene selection
  };

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage || !selectedSceneId) {
      setError("请上传产品图片并选择一个场景。");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const selectedScene = SCENES.find(s => s.id === selectedSceneId);
    if (!selectedScene) {
      setError("未找到所选场景。");
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateScene(uploadedImage, selectedScene.prompt);
      if (result.image) {
        setGeneratedImage(`data:image/png;base64,${result.image}`);
      } else {
         setError(result.text || "AI 未能生成图片。请尝试不同的场景或产品图片。");
      }
    } catch (err) {
      console.error(err);
      setError("生成图片时发生错误。请重试。");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, selectedSceneId]);
  
  const isGenerationDisabled = !uploadedImage || !selectedSceneId || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 xl:col-span-3 bg-gray-800 rounded-xl p-6 shadow-2xl flex flex-col gap-8 h-fit">
            <div>
              <h2 className="text-xl font-bold mb-4 text-cyan-400">1. 上传产品</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 text-cyan-400">2. 选择场景</h2>
              <SceneSelector
                selectedSceneId={selectedSceneId}
                onSceneSelect={handleSceneSelect}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-cyan-400">3. 生成</h2>
               <button
                  onClick={handleGenerate}
                  disabled={isGenerationDisabled}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-lg rounded-lg transition-all duration-300
                    ${isGenerationDisabled 
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                      : 'bg-cyan-500 hover:bg-cyan-400 text-gray-900 shadow-lg shadow-cyan-500/30 transform hover:scale-105'}`}
                >
                  <SparklesIcon />
                  {isLoading ? '生成中...' : '生成场景'}
                </button>
            </div>

          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-8 xl:col-span-9 bg-gray-800/50 rounded-xl p-6 shadow-2xl min-h-[60vh] flex items-center justify-center">
            <ResultDisplay
              generatedImage={generatedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
}