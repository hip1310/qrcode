import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import CustomFileInput from "./CustomFileInput";

const QRCodeScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedQR, setScannedQR] = useState<string | undefined>();
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | undefined>(
    undefined
  );
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);

  const openCamera = async () => {
    try {
      setIsCameraVisible(true);
      setIsFileUpload(false);
      setScannedQR(undefined);
      // This method will trigger user permissions
      const cameraId = await Html5Qrcode.getCameras()
        .then((cameras) => {
          if (cameras && cameras.length) {
            // Check if there is a rear camera
            const rearCamera = cameras.find(
              (camera) =>
                camera.label.toLowerCase().includes("back") ||
                camera.label.toLowerCase().includes("rear")
            );
            if (rearCamera) {
              return rearCamera.id;
            }
            return cameras[0].id;
          }
          return "";
        })
        .catch((err) => {
          // handle err
          console.log("error:", err);
        });
      if (!cameraId) return;
      const html5QrCode = new Html5Qrcode("qr-reader");
      setHtml5QrCode(html5QrCode);
      html5QrCode
        .start(
          cameraId,
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
            qrbox: { width: 100, height: 100 }, // Optional, if you want bounded box UI
          },
          (decodedText, decodedResult) => {
            setScannedQR(decodedText as string);
            closeCamera();
          },
          (errorMessage) => {
            // parse error
            console.log("errorMessage:", errorMessage);
          }
        )
        .catch((err) => {
          setIsCameraVisible(false);
          console.log("error:", err);
          // Start failed, handle it.
        });
    } catch (err) {
      setIsCameraVisible(false);
      console.log("error:", err);
    }
  };

  const closeCamera = () => {
    setIsCameraVisible(false);
    if (!html5QrCode) return;
    html5QrCode
      .stop()
      .then((ignore) => {
        // QR Code scanning is stopped.
      })
      .catch((err) => {
        // Stop failed, handle it.
      });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCode
        .scanFile(file, true)
        .then((decodedText) => {
          // success, use decodedText
          setScannedQR(decodedText as string);
          setIsFileUpload(true);
        })
        .catch((err) => {
          // failure, handle it.
          console.log(`Error scanning file. Reason: ${err}`);
        });
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div>
        <h1 className="text-4xl">QR Code Scanner</h1>
        <div id="reader" className={`${!isFileUpload ? "hidden" : ""}`}></div>
        {isCameraVisible ? (
          <div
            id="qr-reader"
            style={{ maxWidth: "100%", height: "30%" }}
            className={`${isFileUpload ? "hidden" : ""}`}
          >
            <video ref={videoRef} style={{ width: "100%", height: "10%" }} />
          </div>
        ) : (
          !isFileUpload && (
            <>
              <div className="max-w-full h-[200px] flex items-center justify-center">
                Scan Qr
              </div>
            </>
          )
        )}
        {scannedQR && (
          <>
            <p>Scanned QR Code Result :</p>
            <pre>{scannedQR}</pre>
          </>
        )}
        <div className="flex gap-2 flex-col mt-2">
          {!isCameraVisible && (
            <button
              onClick={() => {
                openCamera();
              }}
              className="bg-black text-white px-2 py-1 rounded"
            >
              Scan using camera Directly
            </button>
          )}
          {isCameraVisible && (
            <button
              onClick={() => {
                closeCamera();
              }}
              className="bg-black text-white px-2 py-1 rounded"
            >
              Stop Camera
            </button>
          )}
        </div>
        <br />

        <CustomFileInput handleFileUpload={handleFileUpload} />
      </div>
    </div>
  );
};

export default QRCodeScanner;
