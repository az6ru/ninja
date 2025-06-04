/**
 * @file: image-optimizer-app.tsx
 * @description: Основное приложение для загрузки, оптимизации и скачивания изображений
 * @dependencies: React, lucide-react, компоненты UI
 * @created: 2024-06-05
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Download,
  Plus,
  Image as ImageIcon,
  Combine,
  Clock,
  CheckCircle,
  Loader2,
  X,
  FileImage,
  Layers,
  Sparkles
} from "lucide-react";
import type { ImageFile, OptimizationSettings } from "@shared/schema";
import { Header } from "@/components/Header";

export function ImageOptimizerApp() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'keep' | 'jpeg' | 'png' | 'webp' | 'avif'>('keep');
  const [quality, setQuality] = useState([85]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [zipProgress, setZipProgress] = useState<number | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: ImageFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      originalSize: file.size,
    }));

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 30 * 1024 * 1024, // 30MB
  });

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const optimizeImages = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setShowResults(false);

    const settings: OptimizationSettings = {
      format: selectedFormat,
      quality: quality[0],
    };

    try {
      // Process images in batches for better UX
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // Update status to processing
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'processing' as const, progress: 0 } : img
        ));

        const formData = new FormData();
        formData.append('image', image.file);
        formData.append('settings', JSON.stringify(settings));

        try {
          const response = await fetch('/api/optimize', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Optimization failed');
          }

          const result = await response.json();
          
          if (result.success) {
            // Convert base64 back to blob for download
            const getOutputFormat = () => {
              if (settings.format === 'keep') {
                return image.file.type.split('/')[1];
              }
              return settings.format === 'jpeg' ? 'jpeg' : settings.format;
            };
            
            const optimizedBlob = new Blob(
              [Uint8Array.from(atob(result.optimizedImage), c => c.charCodeAt(0))],
              { type: `image/${getOutputFormat()}` }
            );

            setImages(prev => prev.map(img => 
              img.id === image.id ? {
                ...img,
                status: 'completed' as const,
                progress: 100,
                optimizedSize: result.optimizedSize,
                compressionRatio: result.compressionRatio,
                processingTime: result.processingTime,
                optimizedBlob,
              } : img
            ));
          } else {
            throw new Error(result.error || 'Optimization failed');
          }
        } catch (error) {
          setImages(prev => prev.map(img => 
            img.id === image.id ? {
              ...img,
              status: 'error' as const,
              error: error instanceof Error ? error.message : 'Unknown error',
            } : img
          ));
        }

        // Progress simulation happens during actual request processing
      }

      setShowResults(true);
      setImages(prev => {
        const completedCount = prev.filter(img => img.status === 'completed').length;
        toast({
          title: "Оптимизация завершена!",
          description: `${completedCount} изображений успешно оптимизировано.`,
        });
        return prev;
      });

    } catch (error) {
      toast({
        title: "Ошибка оптимизации",
        description: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Скроллим к результатам после появления
  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [showResults]);

  const downloadImage = (image: ImageFile) => {
    if (!image.optimizedBlob) return;

    const getFileName = () => {
      const originalName = image.file.name;
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      
      if (selectedFormat === 'keep') {
        return `optimized_${originalName}`;
      }
      
      const newExt = selectedFormat === 'jpeg' ? 'jpg' : selectedFormat;
      return `optimized_${nameWithoutExt}.${newExt}`;
    };

    const url = URL.createObjectURL(image.optimizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Обрезаем 'data:...;base64,'
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const downloadAllAsZip = async () => {
    const completedImages = images.filter(img => img.status === 'completed' && img.optimizedBlob);
    if (completedImages.length === 0) return;
    setZipProgress(0);
    setZipError(null);
    try {
      const formData = new FormData();
      completedImages.forEach((img, idx) => {
        const getFileName = () => {
          const originalName = img.file.name;
          const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
          if (selectedFormat === 'keep') {
            return `optimized_${originalName}`;
          }
          const newExt = selectedFormat === 'jpeg' ? 'jpg' : selectedFormat;
          return `optimized_${nameWithoutExt}.${newExt}`;
        };
        formData.append('files', img.optimizedBlob!, getFileName());
        setZipProgress(Math.round(((idx + 1) / completedImages.length) * 50)); // 0-50%: подготовка файлов
      });
      // Отправляем FormData на сервер
      const response = await fetch('/api/download-zip', {
        method: 'POST',
        body: formData,
      });
      setZipProgress(80); // 80% — сервер формирует архив
      if (!response.ok) {
        const errorText = await response.text();
        let reason = 'Не удалось создать ZIP файл';
        try {
          const errJson = JSON.parse(errorText);
          if (errJson.error) reason = errJson.error;
        } catch {}
        setZipError(reason);
        throw new Error(reason);
      }
      const blob = await response.blob();
      setZipProgress(100);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setTimeout(() => setZipProgress(null), 1000);
    } catch (error) {
      setZipProgress(null);
      setZipError(error instanceof Error ? error.message : String(error));
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const resetOptimizer = () => {
    setImages([]);
    setShowResults(false);
    setIsProcessing(false);
  };

  const formatButtons = [
    { value: 'keep', label: 'Сохранить исходный', icon: Sparkles },
    { value: 'jpeg', label: 'JPEG', icon: ImageIcon },
    { value: 'png', label: 'PNG', icon: FileImage },
    { value: 'webp', label: 'WebP', icon: Combine },
    { value: 'avif', label: 'AVIF', icon: Layers },
  ] as const;

  const completedImages = images.filter(img => img.status === 'completed');
  const totalOriginalSize = completedImages.reduce((sum, img) => sum + img.originalSize, 0);
  const totalOptimizedSize = completedImages.reduce((sum, img) => sum + (img.optimizedSize || 0), 0);
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const averageReduction = completedImages.length > 0 
    ? Math.round(completedImages.reduce((sum, img) => sum + (img.compressionRatio || 0), 0) / completedImages.length)
    : 0;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Upload Section */}
      {!showResults && (
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">Загрузите ваши изображения</h3>
              <p className="text-slate-600">Перетащите изображения сюда или нажмите для выбора файлов</p>
            </div>

            {/* Upload Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="text-blue-500 text-2xl" />
              </div>
              <h4 className="text-lg font-medium text-slate-700 mb-2">Перетащите изображения сюда</h4>
              <p className="text-slate-500 mb-4">
                или <span className="text-blue-500 font-medium">нажмите для выбора</span>
              </p>
              <p className="text-sm text-slate-400">Поддерживает JPEG, PNG, WebP, AVIF • Максимум 10МБ на файл</p>
            </div>

            {/* Format Options */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-slate-700 mb-4">Формат вывода</h4>
              <div className="flex flex-wrap gap-3">
                {formatButtons.map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={selectedFormat === value ? "default" : "outline"}
                    onClick={() => setSelectedFormat(value)}
                    className={`transition-colors ${
                      selectedFormat === value
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-medium text-slate-700">Качество сжатия</label>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {quality[0]}%
                </span>
              </div>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Меньший размер</span>
                <span>Лучшее качество</span>
              </div>
            </div>

            {/* Selected Images */}
            {images.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-slate-700 mb-4">Выбранные изображения ({images.length})</h4>
                <div className="divide-y divide-slate-200 mb-6">
                  {images.map((image) => {
                    const originalExt = image.file.name.split('.').pop()?.toLowerCase();
                    const isFormatChange = selectedFormat !== 'keep' && originalExt !== selectedFormat;
                    return (
                      <div key={image.id} className="flex items-center gap-6 py-6 relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-3 right-3 w-7 h-7 p-0 bg-slate-100 hover:bg-red-100 hover:text-red-600 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={image.preview}
                            alt={image.file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-slate-800 truncate">{image.file.name}</h5>
                          <div className="flex flex-wrap gap-4 text-sm mt-1">
                            <span className="text-slate-500">{(image.originalSize / 1024 / 1024).toFixed(2)} МБ</span>
                            {image.status === 'completed' && image.compressionRatio && (
                              <span className="text-green-600 font-medium">-{image.compressionRatio}%</span>
                            )}
                            {selectedFormat === 'keep' && (
                              <span className="text-gray-500 font-medium">Исходный формат</span>
                            )}
                            {isFormatChange && (
                              <span className="text-blue-500 font-medium">Формат: {originalExt?.toUpperCase()} → {selectedFormat.toUpperCase()}</span>
                            )}
                          </div>
                          {/* Status indicators */}
                          {image.status === 'processing' && (
                            <div className="flex items-center text-blue-600 text-sm mt-1">
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Обработка...
                            </div>
                          )}
                          {image.status === 'completed' && (
                            <div className="flex items-center text-green-600 text-sm mt-1">
                              <CheckCircle className="w-4 h-4 mr-1" /> Готово
                            </div>
                          )}
                          {image.status === 'error' && (
                            <div className="flex items-center text-red-600 text-sm mt-1">
                              <X className="w-4 h-4 mr-1" /> Ошибка
                            </div>
                          )}
                          {image.status === 'pending' && (
                            <div className="flex items-center text-slate-400 text-sm mt-1">
                              <Clock className="w-4 h-4 mr-1" /> Ожидание
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button
                  onClick={optimizeImages}
                  disabled={isProcessing}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Оптимизация изображений...
                    </>
                  ) : (
                    <>
                      <Combine className="w-4 h-4 mr-2" />
                      Оптимизировать {images.length} {images.length === 1 ? 'изображение' : images.length < 5 ? 'изображения' : 'изображений'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {showResults && completedImages.length > 0 && (
        <Card ref={resultsRef}>
          <CardContent className="p-8">
            {/* Individual Results List - теперь в начале карточки */}
            <div className="divide-y divide-slate-200 mb-8">
              {completedImages.map((image) => (
                <div key={image.id} className="flex items-center gap-6 py-6">
                  <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={image.preview}
                      alt={image.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 truncate">{image.file.name}</h4>
                    <div className="flex flex-wrap gap-4 text-sm mt-1">
                      <span className="text-slate-500">Оригинал: {(image.originalSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="text-green-600">Оптимизировано: {((image.optimizedSize || 0) / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="text-green-600 font-bold">Сжатие: {image.compressionRatio}%</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => downloadImage(image)}
                    className="ml-4 bg-blue-500 hover:bg-blue-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Скачать
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">Оптимизация завершена!</h3>
                <p className="text-slate-600">Изображения успешно оптимизированы</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {(totalSavings / 1024 / 1024).toFixed(1)} MB
                </div>
                <div className="text-sm text-slate-500">Экономия</div>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{completedImages.length}</div>
                <div className="text-sm text-slate-600">Обработано изображений</div>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Combine className="text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600">{averageReduction}%</div>
                <div className="text-sm text-slate-600">Среднее сжатие</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {completedImages.length > 0 
                    ? (completedImages.reduce((sum, img) => sum + (img.processingTime || 0), 0) / completedImages.length / 1000).toFixed(1)
                    : 0}s
                </div>
                <div className="text-sm text-slate-600">Среднее время обработки</div>
              </div>
            </div>

            {/* Download Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={downloadAllAsZip}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Скачать всё в ZIP
              </Button>
              {zipProgress !== null && (
                <div className="w-full mt-2">
                  <Progress value={zipProgress} />
                  <div className="text-xs text-gray-500 mt-1">Создание архива... {zipProgress}%</div>
                </div>
              )}
              {zipError && (
                <div className="w-full mt-2 text-red-600 text-xs">Ошибка: {zipError}</div>
              )}
              <Button
                onClick={resetOptimizer}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Оптимизировать ещё изображения
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
} 