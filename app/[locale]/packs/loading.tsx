export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div className="h-full bg-zinc-900 dark:bg-white animate-pulse w-full origin-left animate-[loading_1.5s_infinite]" />
      
      {/* Добавляем анимацию через глобальные классы Tailwind */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}} />
    </div>
  )
}