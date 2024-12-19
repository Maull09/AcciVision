import React, { useEffect, useState } from "react";
import {
  fetchProvinces,
  fetchRegenciesByProvince,
  fetchDistrictsByRegency,
} from "@/lib/utils";

interface FilterControlsProps {
  selectedFilters: { province: string; city: string; district: string };
  onFilterChange: (filters: { province: string; city: string; district: string }) => void;
}

export default function FilterControls({ selectedFilters, onFilterChange }: FilterControlsProps) {
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    const loadProvinces = () => {
      try {
        const data = fetchProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    const loadCities = () => {
      if (selectedFilters.province) {
        setLoadingCities(true);
        try {
          const data = fetchRegenciesByProvince(selectedFilters.province);
          setCities(data);
          setDistricts([]); // Reset districts when province changes
        } catch (error) {
          console.error("Error fetching cities:", error);
        } finally {
          setLoadingCities(false);
        }
      } else {
        setCities([]);
        setDistricts([]);
      }
    };
    loadCities();
  }, [selectedFilters.province]);

  useEffect(() => {
    const loadDistricts = () => {
      if (selectedFilters.city) {
        setLoadingDistricts(true);
        try {
          const data = fetchDistrictsByRegency(selectedFilters.city);
          setDistricts(data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoadingDistricts(false);
        }
      } else {
        setDistricts([]);
      }
    };
    loadDistricts();
  }, [selectedFilters.city]);

  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ province: event.target.value, city: "", district: "" });
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...selectedFilters, city: event.target.value, district: "" });
  };

  const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...selectedFilters, district: event.target.value });
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Province Dropdown */}
      <div>
        <label className="block font-semibold mb-1">Provinsi</label>
        <select
          value={selectedFilters.province}
          onChange={handleProvinceChange}
          className="w-full p-2 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Pilih Provinsi</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      <div>
        <label className="block font-semibold mb-1">Kota</label>
        <select
          value={selectedFilters.city}
          onChange={handleCityChange}
          disabled={!cities.length}
          className="w-full p-2 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Pilih Kota</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* District Dropdown */}
      <div>
        <label className="block font-semibold mb-1">Kecamatan</label>
        <select
          value={selectedFilters.district}
          onChange={handleDistrictChange}
          disabled={!districts.length}
          className="w-full p-2 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Pilih Kecamatan</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
