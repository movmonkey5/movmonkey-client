import { cn } from "@/lib/utils";
import MovMonkey from "../icon/MovMonkey";

const Loading = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
  </div>
);

export default Loading;
