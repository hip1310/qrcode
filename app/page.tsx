"use client";
import QRCodeScanner from "./components/QRCodeScanner";

export default function Home() {
  return (
    <div className="App h-screen">
      <QRCodeScanner />
    </div>
  );
}
