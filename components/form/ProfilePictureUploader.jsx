"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import UploadIcon from "../icon/UploadIcon";
import { Button } from "../ui/button";
import Image from "next/image";
import { X } from "lucide-react";

export default function ProfilePictureUploader({
  files,
  setFiles,
  maxFiles = 1,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles((prevFiles) => {
        const remainingSlots = maxFiles - prevFiles.length;
        const newFiles = acceptedFiles.slice(0, remainingSlots).map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
        return [...prevFiles, ...newFiles];
      });
    },
    [maxFiles, setFiles],
  );

  const removeFile = (fileIndex) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex),
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: maxFiles,
  });

  return (
    <>
      {files.length !== maxFiles && (
        <div
          {...getRootProps()}
          className="size-52 rounded-xl border-4 border-dashed border-secondary p-4"
        >
          <input {...getInputProps()} />

          <div className="text-center">
            <div className="my-1 flex justify-center">
              <UploadIcon className={"size-10"} />
            </div>
            {isDragActive ? (
              <p className="text-lg font-semibold">
                Drop the files here...
                <br /> OR
              </p>
            ) : (
              <p className="text-lg font-semibold">
                Drag and Drop your files here <br /> OR
              </p>
            )}
            <div className="mt-2">
              <Button type="button" variant="secondary" className="h-6">
                Browse
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative size-52 overflow-hidden rounded-xl border-2 border-secondary "
          >
            <Image
              src={file.preview}
              alt="preview"
              className="aspect-video size-52 rounded object-cover"
              width={500}
              height={500}
              quality={100}
            />

            <div onClick={() => removeFile(index)}>
              <X className="absolute right-2 top-2 size-5 cursor-pointer rounded-full bg-red-500 p-1 text-white" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
