"use client";

import React, { useEffect, useState } from "react";
import { fetchProvinces, fetchRegenciesByProvince, fetchDistrictsByRegency, fetchCCTVData } from "@/lib/utils";
import HlsPlayer from "react-hls-player";

interface FilterControlsProps {
    selectedFilters: {
      province: string;
      city: string;
      district: string;
      cctvName: string;
    };
    onFilterChange: (filters: {
      province: string;
      city: string;
      district: string;
      cctvName: string;
    }) => void;
  }

export function FilterControls({ selectedFilters, onFilterChange }: FilterControlsProps) {
    const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
    const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
    const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
    const [cctvs, setCctvs] = useState<{ id: string; cctv_name: string; lat: string; lng: string; stream_cctv: string }[]>([]);
  
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
  
    useEffect(() => {
      const loadCctvs = () => {
        const data = fetchCCTVData();
        setCctvs(data);
      };
      loadCctvs()
    }, []);
  
    const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({
        province: event.target.value,
        city: "",
        district: "",
        cctvName: "",
      });
    };
  
    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({
        ...selectedFilters,
        city: event.target.value,
        district: "",
        cctvName: "",
      });
    };
  
    const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({
        ...selectedFilters,
        district: event.target.value,
        cctvName: "",
      });
    };
  
    const handleCCTVNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({
        ...selectedFilters,
        cctvName: event.target.value,
      });
    };
  
    return (
      <div className="mb-5 flex flex-col md:flex-row gap-4">
        <select
          value={selectedFilters.province}
          onChange={handleProvinceChange}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">All Provinces</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
  
        <select
          value={selectedFilters.city}
          onChange={handleCityChange}
          disabled={!cities.length}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
  
        <select
          value={selectedFilters.district}
          onChange={handleDistrictChange}
          disabled={!districts.length}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">All Districts</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
  
        <select
          value={selectedFilters.cctvName}
          onChange={handleCCTVNameChange}
          className="px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">All CCTV Names</option>
          {cctvs.map((cctv) => (
            <option key={cctv.id} value={cctv.cctv_name}>
              {cctv.cctv_name}
            </option>
          ))}
        </select>
      </div>
    );
  }