"use client";

import React, { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Camera, FileText, Trash, X } from "lucide-react";

const OcrExtractor = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleGallerySelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    } else {
      setImage(null);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Unable to access camera. Please grant permissions.");
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleExtractText = () => {
    if (!image) return;

    setLoading(true);
    Tesseract.recognize(image, "eng", {}).then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    });
  };

  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert("Extracted text copied to clipboard!");
    }
  };

  const removeImage = () => {
    setImage(null);
    setText("");
  };
  return (
    <>
      <div className="p-4 min-h-screen w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div className="max-w-3xl mx-auto backdrop-blur-lg bg-white/30 border border-white/10 shadow-lg rounded-xl p-8 w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Image to Text Extractor
          </h1>

          <div className="flex flex-col items-center gap-4">
            {!image && !isCameraActive && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="bg-white/20 text-white border border-white/30 rounded-md py-2 px-4 hover:bg-white/30 transition flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Select Image
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {/* <DropdownMenuItem>
                    <label
                      htmlFor="galleryInput"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      Gallery
                    </label>
                    <input
                      id="galleryInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      name="image"
                      onChange={handleGallerySelect}
                    />
                  </DropdownMenuItem> */}

                  <DropdownMenuItem>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Camera
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {isCameraActive && (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full aspect-video object-cover rounded-md shadow-md"
                />
                <button
                  onClick={captureImage}
                  className="absolute top-2 right-2 bg-white/80 text-blue-500 rounded-full p-1 shadow-md hover:bg-blue-100 transition"
                >
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="absolute top-2 left-2 bg-white/80 text-red-500 rounded-full p-1 shadow-md hover:bg-red-100 transition"
                >
                  Stop
                </button>
              </div>
            )}
            {!image && (
              <div className="bg-white/20 text-white border border-white/30 rounded-md py-2 px-4 hover:bg-white/30 transition flex items-center gap-2 cursor-pointer -mt-2">
                <label
                  htmlFor="galleryInput"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Gallery
                </label>
                <input
                  id="galleryInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="image"
                  onChange={handleGallerySelect}
                />
              </div>
            )}
            {image && (
              <div className="relative w-full max-w-sm">
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full rounded-lg shadow-md"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/80 text-red-500 rounded-full p-1 shadow-md hover:bg-red-100 transition"
                >
                  <Trash className="w-6 h-6" />
                </button>
              </div>
            )}

            <button
              onClick={handleExtractText}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r mt-12 from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:opacity-90 transition shadow-md"
              disabled={loading || !image}
            >
              {loading ? "Processing..." : "Extract & Copy Text"}
            </button>
          </div>
          {text && (
            <div className="mt-6 p-4 bg-white/20 text-white rounded-md shadow-md">
              <h3 className="font-bold text-lg mb-2">Extracted Text:</h3>
              <pre className="whitespace-pre-wrap">{text}</pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-1 px-4 rounded-md hover:opacity-90 transition shadow-md"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
      {/* <div>
        <h1>File Input Test</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleGallerySelect}
          style={{ marginBottom: "20px" }}
        />
        {image && (
          <div>
            <p>Image Preview:</p>
            <img src={image} alt="Preview" style={{ maxWidth: "300px" }} />
          </div>
        )}
      </div> */}
    </>
  );
};

export default OcrExtractor;
