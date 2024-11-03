export default function Video({ videos }) {
  return (
    <div className="mt-4">
      <div className="flex h-auto flex-wrap gap-2 rounded">
        {videos?.length
          ? videos.map((video, index) => (
              <video
                key={index}
                src={video?.video}
                controls
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
                className="aspect-video w-full rounded object-cover sm:w-72"
              />
            ))
          : null}
      </div>

      {!videos?.length && (
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-1 text-center">
          <h3 className="text-center text-2xl font-bold tracking-tight">
            No videos uploaded
          </h3>
          <p className="text-muted-foreground text-center text-sm">
            The customer has not uploaded any videos yet.
          </p>
        </div>
      )}
    </div>
  );
}
