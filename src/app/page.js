import Banner from "@/components/Home/Banner";
import FeaturedDoctors from "@/components/Home/FeaturedDoctors";
import MedicalSpecializations from "@/components/Home/MedicalSpecializations";
import MedicalTips from "@/components/Home/MedicalTips";
import PlatformStats from "@/components/Home/PlatformStats";
import Testimonials from "@/components/Home/Testimonials";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Banner />
    <MedicalSpecializations />
    <FeaturedDoctors />
    <MedicalTips />
    <Testimonials />
    <PlatformStats />
    <WhyChooseUs />
    </>
  );
}
