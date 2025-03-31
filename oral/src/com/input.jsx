// import React, { useState } from "react";

// const GumDiseasePrediction = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [result, setResult] = useState(null);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [imageError, setImageError] = useState("");

//   // ✅ Handle Image Upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
//       setSelectedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setImageError("");
//     } else {
//       setImageError("Invalid file format. Please upload a JPG or PNG image.");
//     }
//   };

//   // ✅ Handle Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedImage) {
//       alert("Please upload an oral cavity image for analysis.");
//       return;
//     }

//     setAnalyzing(true);
//     setResult(null);

//     const formData = new FormData();
//     formData.append("file", selectedImage);

//     try {
//       const response = await fetch("http://127.0.0.1:5000/predict", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setResult(data);
//       } else {
//         setResult({ error: "Failed to analyze image." });
//       }
//     } catch (error) {
//       setResult({ error: "Error connecting to the server." });
//       console.error("Analysis error:", error);
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   return (
//     <div className="space-y-4 p-6 bg-gray-100 min-h-screen">
//       {/* ✅ Upload Section */}
//       <div className="bg-blue-50 p-4 rounded-lg">
//         <h2 className="text-lg font-semibold text-blue-800 mb-2">Oral Imaging</h2>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white">
//           <input
//             type="file"
//             accept="image/jpeg,image/jpg,image/png"
//             onChange={handleImageChange}
//             className="hidden"
//             id="image-input"
//           />
//           <label
//             htmlFor="image-input"
//             className="block cursor-pointer text-blue-600 hover:text-blue-800"
//           >
//             {previewUrl ? "Replace Image" : "Upload Oral Cavity Image (JPG/PNG only)"}
//           </label>

//           {imageError && <p className="mt-2 text-red-600 text-sm">{imageError}</p>}

//           {previewUrl ? (
//             <div className="mt-4">
//               <img
//                 src={previewUrl}
//                 alt="Oral cavity preview"
//                 className="max-w-full max-h-64 mx-auto rounded"
//               />
//             </div>
//           ) : (
//             <div className="mt-4 text-gray-500 text-sm">
//               <p>Upload clear images of gums, preferably well-lit and focused.</p>
//               <p>Accepted formats: JPG, PNG only.</p>
//               <p>Recommended: Multiple angles of affected areas.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ✅ Analyze Button */}
//       <button
//         onClick={handleSubmit}
//         disabled={analyzing || !selectedImage || imageError}
//         className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
//           analyzing || !selectedImage || imageError
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-700 hover:bg-blue-800"
//         }`}
//       >
//         {analyzing ? "Analyzing Image..." : "Analyze for Gum Disease"}
//       </button>

//       {/* ✅ Result Section */}
//       {result && (
//         <div className="mt-8 border-t pt-6">
//           <h2 className="text-xl font-bold text-blue-800 mb-4">Analysis Results</h2>

//           {result.error ? (
//             <div className="bg-red-50 p-4 rounded-lg text-red-700">
//               <p className="font-medium">Error: {result.error}</p>
//             </div>
//           ) : (
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <div className="grid md:grid-cols-2 gap-4">
//                 {/* ✅ Detected Conditions */}
//                 <div>
//                   <h3 className="font-medium text-blue-800">Detected Condition</h3>
//                   <div className="mt-2 space-y-1">
//                     <div className="flex items-center">
//                       <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
//                       <span className="text-sm">
//                         <strong>Prediction:</strong> {result.prediction}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ✅ Confidence Scores */}
//                 <div>
//                   <h3 className="font-medium text-blue-800">Confidence Scores</h3>
//                   <ul className="mt-2 space-y-1">
//                     {result.confidence &&
//                       Object.entries(result.confidence).map(([key, value]) => (
//                         <li key={key} className="flex items-center">
//                           <span className="h-3 w-3 rounded-full bg-gray-500 mr-2"></span>
//                           <span className="text-sm">
//                             {key}: {value}
//                           </span>
//                         </li>
//                       ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* ✅ Confidence Bar */}
//               <div className="mt-4">
//                 <h3 className="font-medium text-blue-800">Confidence Score</h3>
//                 <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
//                   <div
//                     className="bg-blue-600 h-4 rounded-full"
//                     style={{
//                       width: `${
//                         parseFloat(result.confidence?.[result.prediction] || 0)
//                       }%`,
//                     }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Analysis confidence: {result.confidence?.[result.prediction] || "0"}%
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ✅ Footer */}
//       <footer className="mt-8 pt-4 border-t text-sm text-gray-500">
//         <p>
//           This tool is designed to assist dental professionals and is not intended to replace
//           professional diagnosis.
//         </p>
//         <p>Always consult with a qualified dentist for proper evaluation and treatment.</p>
//       </footer>
//     </div>
//   );
// };

// export default GumDiseasePrediction;


import React, { useState } from "react";
import './input.css';

const GumDiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [imageError, setImageError] = useState("");

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageError("");
    } else {
      setImageError("Invalid file format. Please upload a JPG or PNG image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedImage) {
      alert("Please upload an oral cavity image for analysis.");
      return;
    }
  
    setAnalyzing(true);
    setResult(null);
  
    const formData = new FormData();
    formData.append("file", selectedImage);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-cam", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        // ✅ Check if image response or JSON
        const contentType = response.headers.get("Content-Type");
  
        if (contentType.startsWith("image")) {
          // If image is returned (CAM), create URL
          const blob = await response.blob();
          const imgUrl = URL.createObjectURL(blob);
  
          // ✅ Fetch Metadata using /predict endpoint
          const metaResponse = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData,
          });
  
          if (metaResponse.ok) {
            const metaData = await metaResponse.json();
            // ✅ Combine image and metadata
            setResult({
              ...metaData,
              visualization: imgUrl,
            });
          } else {
            setResult({ error: "Failed to fetch prediction metadata." });
          }
        } else {
          // If JSON returned directly
          const data = await response.json();
          setResult(data);
          console.log(data);

        }
      } else {
        setResult({ error: "Failed to analyze image." });
      }
    } catch (error) {
      setResult({ error: "Error connecting to the server." });
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };
  
  

  return (
    <div className="space-y-4 p-6 bg-gray-100 min-h-screen">
      {/* ✅ Upload Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Oral Imaging</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            className="hidden"
            id="image-input"
          />
          <label
            htmlFor="image-input"
            className="block cursor-pointer text-blue-600 hover:text-blue-800"
          >
            {previewUrl ? "Replace Image" : "Upload Oral Cavity Image (JPG/PNG only)"}
          </label>

          {imageError && <p className="mt-2 text-red-600 text-sm">{imageError}</p>}

          {previewUrl ? (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Oral cavity preview"
                className="max-w-full max-h-64 mx-auto rounded"
              />
            </div>
          ) : (
            <div className="mt-4 text-gray-500 text-sm">
              <p>Upload clear images of gums, preferably well-lit and focused.</p>
              <p>Accepted formats: JPG, PNG only.</p>
              <p>Recommended: Multiple angles of affected areas.</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Analyze Button */}
      <button
        onClick={handleSubmit}
        disabled={analyzing || !selectedImage || imageError}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          analyzing || !selectedImage || imageError
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-700 hover:bg-blue-800"
        }`}
      >
        {analyzing ? "Analyzing Image..." : "Analyze for Gum Disease"}
      </button>
{/* ✅ Result Section */}
{result && (
  <div className="mt-8 border-t pt-6">
    <h2 className="text-xl font-bold text-blue-800 mb-4">Analysis Results</h2>

    {result.error ? (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        <p className="font-medium">Error: {result.error}</p>
      </div>
    ) : (
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="grid md:grid-cols-2 gap-4">
          {/* ✅ Detected Conditions */}
          <div>
            <h3 className="font-medium text-blue-800">Detected Condition</h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-sm">
                  <strong>Prediction:</strong> {result.prediction}
                </span>
              </div>
            </div>
          </div>

          {/* ✅ Confidence Scores */}
          <div>
            <h3 className="font-medium text-blue-800">Confidence Scores</h3>
            <ul className="mt-2 space-y-1">
              {result.confidence &&
                Object.entries(result.confidence).map(([key, value]) => (
                  <li key={key} className="flex items-center">
                    <span className="h-3 w-3 rounded-full bg-gray-500 mr-2"></span>
                    <span className="text-sm">
                      {key}: {value}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* ✅ Confidence Bar */}
        <div className="mt-4">
          <h3 className="font-medium text-blue-800">Confidence Score</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{
                width: `${
                  parseFloat(result.confidence?.[result.prediction] || 0)
                }%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Analysis confidence: {result.confidence?.[result.prediction] || "0"}%
          </p>
        </div>

        {/* ✅ CAM Visualization */}
        {result.visualization && (
          <div className="mt-6">
            <h3 className="font-medium text-blue-800 mb-2">CAM Visualization</h3>
            <img
              src={result.visualization}
              alt="CAM visualization"
              className="w-full max-w-md mx-auto rounded-lg"
            />
          </div>
        )}
      </div>
    )}
  </div>
)}


      {/* ✅ Footer */}
      <footer className="mt-8 pt-4 border-t text-sm text-gray-500">
        <p>
          This tool is designed to assist dental professionals and is not intended to replace
          professional diagnosis.
        </p>
        <p>Always consult with a qualified dentist for proper evaluation and treatment.</p>
      </footer>
    </div>
  );
};

export default GumDiseasePrediction;
