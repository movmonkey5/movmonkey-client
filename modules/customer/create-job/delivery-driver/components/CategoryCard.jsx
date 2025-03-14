import { cn, rgbDataURL } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { X } from 'lucide-react'; // Add this import for the close icon

export default function CategoryCard({
  formik,
  categories,
  category,
  setSubCategory,
  setCurrentStep,
  isEditMode
}) {
  const isActive = 
    formik.values.category_slug === category?.slug || 
    formik.values.sub_category_slug?.startsWith(category?.slug);

  const isDisabled = isEditMode && !isActive;

  const handleCategorySelect = () => {
    if (isDisabled) {
      toast.error(
        <div className="flex items-start justify-between w-full">
          <div className="space-y-1.5">
            <p className="font-semibold">Category Change Not Allowed</p>
            <p className="text-sm text-gray-500">
              You cannot change the category in edit mode. If you want to deliver another item, please create a new job.
            </p>
          </div>
          <button 
            onClick={() => toast.dismiss()} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>,
        {
          duration: 5000,
          position: "top-center",
          className: "bg-white",
          style: {
            padding: '16px',
            minWidth: '360px'
          }
        }
      );
      return;
    }
    
    formik.setFieldValue("category_slug", category?.slug);
    setSubCategory(
      categories.find((c) => c.slug === category?.slug)?.options || [],
    );
    setCurrentStep(4);
  };

  return (
    <div
      onClick={handleCategorySelect}
      className={cn(
        "h-fit overflow-hidden rounded shadow-lg lg:m-4",
        isActive ? "border-2 border-primary" : "border-2 border-transparent",
        isDisabled 
          ? "opacity-50 cursor-not-allowed select-none" 
          : "cursor-pointer hover:shadow-xl transition-all",
      )}
    >
      <div className={isDisabled ? "pointer-events-none" : ""}>
        <Image
          src={category?.image || "/images/placeholder.png"}
          alt={category?.title}
          quality={100}
          width={500}
          height={500}
          priority
          loading="eager"
          placeholder="blur"
          blurDataURL={rgbDataURL(255, 255, 255)}
        />
      </div>
      <div
        className={cn(
          "px-2 py-4 text-center text-black lg:px-6",
          isActive ? "bg-primary" : "bg-gray-100",
          isDisabled && "bg-gray-200"
        )}>
        <div className="text-sm font-bold sm:text-sm lg:text-xl">
          {category?.title}
        </div>
        <p className="text-xs lg:text-base">{category?.description}</p>
      </div>
    </div>
  );
}


