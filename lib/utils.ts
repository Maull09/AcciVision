import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import provinces from "@/db/location/provinces.json";
import cctvData from "@/db/cctv/bandung.json";
import regencies from "@/db/location/regencies.json";
import districts from "@/db/location/districts.json";
interface RegencyData {
  id: string;
  name: string;
  province_id: string;
  alt_name: string;
  latitude: number;
  longitude: number;
}

interface DistrictData {
  id: string;
  name: string;
  regency_id: string;
  latitude: number | null;
  longitude: number | null;
  alt_name: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function fetchProvinces() {
  return provinces;
}

export function fetchRegenciesByProvince(provinceId: string) {
  return regencies.filter((regency: RegencyData) => regency.province_id === provinceId);
}

export function fetchDistrictsByRegency(regencyId: string) {
  return districts.filter((district: DistrictData) => district.regency_id === regencyId);
}

export const fetchCCTVData = () => {
  return cctvData; // Mengembalikan data langsung dari JSON
};

export function getProvinceNameById(provinceId: string): string | undefined {
  const province = provinces.find((p) => p.id === provinceId);
  return province?.name;
}
  
export function getCityNameById(cityId: string): string | undefined {
  const city = regencies.find((r) => r.id === cityId);
  return city?.name;
}
  
export function getDistrictNameById(districtId: string): string | undefined {
  const district = districts.find((d) => d.id === districtId);
  return district?.name;
}