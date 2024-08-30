"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";
import { storage } from "../../../lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

export default function ProductDetail({ params }) {
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${params.productId}`);
        setProduct(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
        setPrice(response.data.price);
      } catch (error) {
        console.error("Error fetching product:", error);
      }finally{
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.productId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { role } = jwt.decode(token);
      setRole(role);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!image || !croppedAreaPixels) return;

    const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(croppedImageUrl);
    setImage(null);

    // Upload to Firebase Storage
    const response = await fetch(croppedImageUrl);
    const blob = await response.blob();
    const imageRef = ref(
      storage,
      `product-images/<span class="math-inline">\{product\.\_id\}\-</span>{Date.now()}`
    );
    await uploadBytes(imageRef, blob);

    const newImage = await getDownloadURL(imageRef);
    setNewImageUrl(newImage);
  }, [image, croppedAreaPixels]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      return decoded?.userId;
    }
    return null;
  };

  const handleSubmit = async () => {
    setSubmitLoading(true)
    if (!product) return;

    const userId = getUserIdFromToken();

    const formData = new FormData();

    if (newImageUrl) {
      formData.append("image", newImageUrl);
    }
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("productId", product._id);
      formData.append("submittedBy", userId);
    const formDataObject = Object.fromEntries(formData);
    console.log(formDataObject,"ffffffff");
    

    try {
      if (role === "admin") {
        const response = await axios.put("/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const updatedData = response.data;
        setProduct(response.data.product);
        setName(response.data.product.name);
        setDescription(response.data.product.description);
        setPrice(response.data.product.price);
        setCroppedImage(null);
        setNewImageUrl(null);
        toast.success("Product updated successfully!");
      } else {
        const response = await axios.post("/api/products/review", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product update submitted for review!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }finally{
      setSubmitLoading(false)
    }
  };

  return (
    <div className="p-4 mx-auto max-w-5xl mt-10 bg-white rounded-lg shadow-md">
      {loading ? ( // Conditionally render spinner or content
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#4A90E2" loading={true} size={50} /> {/* Spinner */}
        </div>
      ) : (
        <>
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

      {product && (
        <div className="space-y-4 flex gap-8">
          <div className="flex flex-col gap-5 w-full">
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex ">
            <div className="w-full">
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Current Product Image
                </label>
                <img
                  src={product?.imageUrl}
                  alt={product?.name}
                  className="w-full max-w-md rounded-md mb-4"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Upload New Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
            </div>
          </div>

          {image && (
            <div className="relative w-full h-80 max-w-xl mx-auto mb-4">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                className="absolute inset-0"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                <button
                  onClick={handleCrop}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Crop
                </button>
                <button
                  onClick={() => setImage(null)}
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {croppedImage && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Cropped Image Preview
              </label>
              <img
                src={croppedImage}
                alt="Cropped"
                className="w-full max-w-md rounded-md"
              />
            </div>
          )}
        </div>
      )}
        </>
      )}
<button
      onClick={handleSubmit}
      className="bg-green-500 mt-5 text-white py-2 px-4 rounded flex items-center justify-center"
      disabled={submitLoading} 
    >
      {submitLoading ? (
        <ClipLoader color="#ffffff" loading={true} size={20} /> 
      ) : (
        role === "admin" ? "Update Product" : "Submit for Review"
      )}
    </button>
    </div>
  );
}
