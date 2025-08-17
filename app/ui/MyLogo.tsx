import { SparklesIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function MyLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center gap-2 leading-none`}
    >
      {/* Softer, girly accent with color + sparkle */}
      <SparklesIcon className="h-12 w-12 text-pink-400 animate-pulse" />
      
      <p className="text-[42px] font-bold text-pink-500 tracking-wide drop-shadow-md">
        Bhope
      </p>
    </div>
  );
}
