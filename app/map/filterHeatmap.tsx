import React, { useEffect, useState } from "react";
import { fetchProvinces, fetchRegenciesByProvince, fetchDistrictsByRegency } from "@/lib/utils";

interface FilterControlsProps {
  selectedFilters: { province: string; city: string; district: string };
  onFilterChange: (filters: { province: string; city: string; district: string }) => void;
}

export function FilterControls({ selectedFilters, onFilterChange }: FilterControlsProps) {
  const [provinces, setProvinces] = useState<{ id: string; name: string; alt_name: string; latitude: number; longitude: number; }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string; alt_name: string; latitude: number; longitude: number; }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string; alt_name: string; latitude: number | null; longitude: number | null; }[]>([]);

  useEffect(() => {
    const loadProvinces = () => {
      const data = fetchProvinces();
      setProvinces(data);
    };
    loadProvinces()
  }, []);

  useEffect(() => {
    const loadCities = () => {
      if (selectedFilters.province) {
        const data = fetchRegenciesByProvince(selectedFilters.province);
        setCities(data);
        setDistricts([]);
      } else {
        setCities([]);
        setDistricts([]);
      }
    };
    loadCities()
  }, [selectedFilters.province]);

  useEffect(() => {
    const loadDistricts = () => {
      if (selectedFilters.city) {
        const data = fetchDistrictsByRegency(selectedFilters.city);
        setDistricts(data);
      } else {
        setDistricts([]);
      }
    };
    loadDistricts()
  }, [selectedFilters.city]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ province: e.target.value, city: "", district: "" });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...selectedFilters, city: e.target.value, district: "" });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...selectedFilters, district: e.target.value });
  };

  return (
    <div className="mb-5 flex flex-col md:flex-row gap-4">
      <select value={selectedFilters.province} onChange={handleProvinceChange}>
        <option value="">All Provinces</option>
        {provinces.map((province) => (
          <option key={province.id} value={province.id}>
            {province.name}
          </option>
        ))}
      </select>
      <select value={selectedFilters.city} onChange={handleCityChange} disabled={!cities.length}>
        <option value="">All Cities</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      <select value={selectedFilters.district} onChange={handleDistrictChange} disabled={!districts.length}>
        <option value="">All Districts</option>
        {districts.map((district) => (
          <option key={district.id} value={district.id}>
            {district.name}
          </option>
        ))}
      </select>
    </div>
  );
}
