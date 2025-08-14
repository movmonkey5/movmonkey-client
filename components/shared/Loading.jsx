import { cn } from "@/lib/utils";
import MovMonkey from "../icon/MovMonkey";

const Loading = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div 
      className="relative w-24 h-24"
      style={{
        animation: 'fadeInOut 2s ease-in-out infinite'
      }}
    >
      <MovMonkey className="w-full h-full text-secondary" />
    </div>
    <style jsx>{`
      @keyframes fadeInOut {
        0% { opacity: 0.2; transform: scale(0.95); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0.2; transform: scale(0.95); }
      }
    `}</style>
  </div>
);

export default Loading;