import React from 'react';

interface ResultDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
    <p className="mt-4 text-lg font-semibold text-gray-300">正在生成您的场景...</p>
    <p className="text-sm text-gray-400">AI 正在努力工作中，请稍候。</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="w-full max-w-lg bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
    <strong className="font-bold">出错了！</strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

const Placeholder: React.FC = () => (
    <div className="text-center text-gray-500">
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-2xl font-bold text-gray-300">您的杰作即将诞生</h3>
        <p className="mt-2">上传产品并选择场景即可开始。</p>
    </div>
);

export default function ResultDisplay({ generatedImage, isLoading, error }: ResultDisplayProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {isLoading && <LoadingSpinner />}
      {!isLoading && error && <ErrorDisplay message={error} />}
      {!isLoading && !error && generatedImage && (
        <img src={generatedImage} alt="生成的产品场景图" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
      )}
      {!isLoading && !error && !generatedImage && <Placeholder />}
    </div>
  );
}