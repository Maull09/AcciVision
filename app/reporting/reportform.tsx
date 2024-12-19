"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { insertReport, insertNotification
 } from "@/lib/api";
import { fetchProvinces, fetchRegenciesByProvince,
  fetchDistrictsByRegency
 } from "@/lib/utils";

interface ReportFormProps {
  filters: { province: string; city: string; district: string };
  onSubmit: (formData: FormData) => Promise<void>;
  submitting: boolean;
}

export default function ReportForm({
  filters,
  onSubmit,
  submitting,
}: ReportFormProps) {

  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const {user} = useUser();
  const userId = user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Prepare data
    const provinces = fetchProvinces();
    const cities = fetchRegenciesByProvince(filters.province);
    const districts = fetchDistrictsByRegency(filters.city);
    
    // Fetch the name of the selected province, city, and district
    const selectedProvince = provinces.find(
      (province) => province.id === filters.province
    )?.name;

    const selectedCity = cities.find(
      (city) => city.id === filters.city
    )?.name;

    const selectedDistrict = districts.find(
      (district) => district.id === filters.district
    )?.name;

    formData.append("province", selectedProvince || "");
    formData.append("city", selectedCity || "");
    formData.append("district", selectedDistrict || "");
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }
    if (userId) {
      formData.append("userId", userId);
    }
    await onSubmit(formData);
    setDescription(""); // Reset form fields
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-bold mb-1">Deskripsi</label>
        <textarea
          name="description"
          value={description}
          onChange={handleDescriptionChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block font-bold mb-1">Unggah Gambar</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={submitting}
      >
        {submitting ? "Mengirim..." : "Kirim Laporan"}
      </button>
    </form>
  );
}

