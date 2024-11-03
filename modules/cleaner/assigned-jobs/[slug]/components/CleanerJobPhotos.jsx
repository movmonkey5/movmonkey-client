import Image from "next/image";

export default function CleanerJobPhotos({ photos }) {
  return (
    <div className="mt-4">
      <div className="flex w-full flex-wrap gap-2 rounded">
        {photos?.length > 0 &&
          photos.map((photo, index) => (
            <Image
              key={index}
              src={photo?.image}
              className="aspect-video rounded object-cover sm:w-72"
              alt={photo?.slug}
              width={1000}
              height={1000}
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
    </div>
  );
}
