import { Html5Qrcode } from "html5-qrcode";
import { useRef, useState } from "react";

const QRCode: React.FC = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedQR, setScannedQR] = useState<string | undefined>();
  const [viewScanner, setViewScanner] = useState<boolean>(false);

  const handleScanClick = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleTakePhoto = () => {
    setViewScanner(true);
    openCamera();
    handleScanClick();
  };

  const openCamera = async () => {
    try {
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
      html5QrCode
        .start(
          cameraId,
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
            qrbox: { width: 100, height: 100 }, // Optional, if you want bounded box UI
          },
          (decodedText, decodedResult) => {
            setScannedQR(decodedText as string);
            closeCamera(html5QrCode);
          },
          (errorMessage) => {
            // parse error
            console.log("errorMessage:", errorMessage);
          }
        )
        .catch((err) => {
          console.log("error:", err);
          // Start failed, handle it.
        });
    } catch (err) {
      console.log("error:", err);
    }
  };

  const closeCamera = (html5QrCode: Html5Qrcode) => {
    console.log("handleCloseCamera");
    if (!html5QrCode) return;
    html5QrCode
      .stop()
      .then((ignore) => {
        // QR Code scanning is stopped.
        setViewScanner(false);
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
          handleScanClick();
        })
        .catch((err) => {
          // failure, handle it.
          console.log(`Error scanning file. Reason: ${err}`);
          alert(`Error scanning file. Reason: ${err}`);
        });
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div>
        {viewScanner ? (
          <h1 className="text-4xl flex gap-2 items-center">
            <div
              onClick={() => {
                setViewScanner(false);
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 12H21"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            Scan Any QR Code
          </h1>
        ) : (
          <h1 className="text-4xl">QR Code Scanner</h1>
        )}

        <div id="reader" className="hidden" />

        {scannedQR && (
          <div className="mt-10">
            <p>Scanned QR Code Result :</p>
            <pre>{scannedQR}</pre>
          </div>
        )}
        {!viewScanner && (
          <div className="mt-10  relative inline-block text-left w-full">
            <button
              onClick={handleScanClick}
              className="bg-gray-950 text-white px-2 py-1 rounded hover:bg-gray-800 focus:outline-none w-full"
            >
              Scan
            </button>
            {dropdownVisible && (
              <div className="origin-top-right absolute left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 w-full">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    onClick={handleFileUploadClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-b-2"
                    role="menuitem"
                  >
                    <div className="flex justify-between items-center">
                      <p>Choose Image</p>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4ZM21 18H3V6H21V18ZM5 16L8.5 11L11.5 15.01L14.5 11L19 16H5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleTakePhoto();
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    <div className="flex justify-between items-center">
                      <p>Take Photo</p>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5C10.9 5 10 5.9 10 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7H14C14 5.9 13.1 5 12 5ZM12 17C10.3 17 9 15.7 9 14C9 12.3 10.3 11 12 11C13.7 11 15 12.3 15 14C15 15.7 13.7 17 12 17ZM12 13C11.4 13 11 13.4 11 14C11 14.6 11.4 15 12 15C12.6 15 13 14.6 13 14C13 13.4 12.6 13 12 13ZM16.5 11C15.7 11 15 10.3 15 9.5C15 8.7 15.7 8 16.5 8C17.3 8 18 8.7 18 9.5C18 10.3 17.3 11 16.5 11Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>
        )}

        {viewScanner && (
          <div>
            <div
              id="qr-reader"
              className="mt-10"
              style={{ maxWidth: "100%", height: "40%" }}
            >
              <video ref={videoRef} style={{ width: "100%", height: "10%" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCode;
