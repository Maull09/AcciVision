import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-screen-lg mx-auto px-8 margin-bot gap-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center lg:flex-row gap-8 py-8">
        <div className="relative w-[360px] h-[360px] lg:w-[524px] lg:h-[424px]">
          <Image src="/resolving-car-accident.jpg" alt="Hero" fill />
        </div>
        <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <h1 className="text-xl font-bold text-neutral-600 max-w-[480px] lg:text-3xl">
            Solusi Modern untuk Deteksi dan Pelaporan Kecelakaan Secara Real-Time!
          </h1>
          <div className="flex flex-col items-center w-full max-w-[330px] gap-3">
            <ClerkLoading>
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            </ClerkLoading>

            <ClerkLoaded>
              <SignedOut>
                <SignUpButton mode="modal" afterSignInUrl="/home" afterSignUpUrl="/home">
                  <Button size="lg" variant="secondary" className="w-full">
                    Daftar Sekarang
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal" afterSignInUrl="/home" afterSignUpUrl="/home">
                  <Button size="lg" variant="primaryOutline" className="w-full">
                    Saya Sudah Punya Akun
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" variant="secondary" className="w-full" asChild>
                  <Link href="/home">Masuk ke Home</Link>
                </Button>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <section className="flex flex-col items-center justify-center gap-8 min-h-screen py-20 lg:flex-row max-w-screen-lg mx-auto">
        <img
          src="/road_accident_illustration.jpg"
          alt="Illustration of accident detection"
          className="w-1/2 max-w-sm"
        />
        <div className="ml-8 text-left">
          <h2 className="text-4xl font-bold text-blue-500 leading-tight">
            Deteksi Real-Time. <br />
            Cepat dan Akurat.
          </h2>
          <p className="mt-4 text-gray-600">
            AcciVision menggunakan teknologi terkini untuk mendeteksi kecelakaan
            secara real-time. Dengan analisis berbasis AI, kami memastikan laporan
            kecelakaan sampai ke pihak yang tepat dengan cepat.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="flex flex-col items-center justify-center gap-8 min-h-screen py-20 lg:flex-row-reverse max-w-screen-lg mx-auto">
        <img
          src="/accident-report.jpg"
          alt="Illustration of user reporting"
          className="w-1/2 max-w-sm"
        />
        <div className="mr-8 text-right">
          <h2 className="text-4xl font-bold text-blue-500 leading-tight">
            Laporan Mudah <br />
            Hanya Dalam Hitungan Detik
          </h2>
          <p className="mt-4 text-gray-600">
            Kami menyediakan antarmuka sederhana untuk pelaporan kecelakaan. 
            Cukup dengan beberapa klik, Anda dapat mengirim laporan lengkap 
            dengan lokasi, deskripsi, dan bukti pendukung.
          </p>
        </div>
      </section>
    </div>
  );
}
