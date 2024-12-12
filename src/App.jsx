import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaQrcode } from 'react-icons/fa';
import "./App.css";

function App() {
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState("");
  const [qrSize, setQrSize] = useState("");
  const [errors, setErrors] = useState({});

  // Validate input fields
  const validate = () => {
    const validationErrors = {};
    if (!qrData.trim()) {
      validationErrors.qrData = "Please enter data for the QR code.";
    }
    if (!qrSize.trim() || isNaN(qrSize) || qrSize <= 0) {
      validationErrors.qrSize = "Please enter a valid size (e.g., 150).";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  async function generateQR() {
    if (!validate()) return;
    setLoading(true);
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}`;
      setImg(url);
    } catch (error) {
      console.log("Error Generate QR code " + error);
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    fetch(img)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="text-primary">QR Code Generator <FaQrcode className='text-light' />
        </h1>
        <p className="lead text-light">Generate and download QR codes effortlessly</p>
      </div>

      <div className="card mx-auto p-4 shadow-sm" style={{ maxWidth: '600px' }}>
        {loading && <p className="text-center text-warning">Please wait...</p>}
        {img && (
          <div className="text-center mb-3">
            <img src={img} alt="QR Code" className="img-fluid rounded shadow-sm" />
          </div>
        )}

        <form noValidate>
          <div className="form-group mb-3">
            <label htmlFor="dataInput" className="form-label">
              Data for QR code:
            </label>
            <input
              type="text"
              id="dataInput"
              className={`form-control ${errors.qrData ? 'is-invalid' : ''}`}
              value={qrData}
              placeholder="Enter your URL or text"
              onChange={(e) => setQrData(e.target.value)}
            />
            {errors.qrData && <div className="invalid-feedback">{errors.qrData}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="sizeInput" className="form-label">
              Image Size (e.g., 150):
            </label>
            <input
              type="text"
              id="sizeInput"
              className={`form-control ${errors.qrSize ? 'is-invalid' : ''}`}
              value={qrSize}
              placeholder="Enter the size of the QR code"
              onChange={(e) => setQrSize(e.target.value)}
            />
            {errors.qrSize && <div className="invalid-feedback">{errors.qrSize}</div>}
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              disabled={loading}
              onClick={generateQR}
            >
              Generate QR Code
            </button>
            <button
              type="button"
              className="btn btn-sm btn-success"
              disabled={!img}
              onClick={downloadQR}
            >
              Download QR Code
            </button>
          </div>
        </form>
      </div>

      <footer className="text-center mt-5">
        <p className="text-white">
          Designed by{' '}
          <a href="https://github.com/Mohanprasath-R" target="_blank" rel="noopener noreferrer">
            Mohanprasath
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;