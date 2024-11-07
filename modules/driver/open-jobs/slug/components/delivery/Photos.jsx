import Image from "next/image";
import { useState } from "react";

export default function CleanerJobPhotos({ photos }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setCurrentIndex(0);
  };

  const showPrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : photos.length - 1,
    );
  };

  const showNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < photos.length - 1 ? prevIndex + 1 : 0,
    );
  };

  return (
    <div className="mt-4">
      <div className="flex w-full flex-wrap gap-2 rounded">
        {photos?.length > 0 &&
          photos.map((photo, index) => (
            <Image
              key={index}
              src={photo?.image}
              className="aspect-video cursor-pointer rounded object-cover sm:w-72"
              alt={photo?.slug}
              width={1000}
              height={1000}
              onClick={() => openLightbox(index)}
            />
          ))}
      </div>

      {!photos?.length && (
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-1 text-center">
          <h3 className="text-center text-2xl font-bold tracking-tight">
            No photos uploaded
          </h3>
          <p className="text-muted-foreground text-center text-sm">
            The customer has not uploaded any photos yet.
          </p>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <button
              className="absolute right-2 top-2 text-2xl text-white"
              onClick={closeLightbox}
            >
              &times;
            </button>
            <Image
              src={photos[currentIndex]?.image}
              alt="Enlarged view"
              width={1000}
              height={1000}
              className="max-h-[90vh] max-w-[90vw] rounded object-contain"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={showPrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-2 text-xl text-white"
                >
                  &#8592;
                </button>
                <button
                  onClick={showNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-2 text-xl text-white"
                >
                  &#8594;
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
