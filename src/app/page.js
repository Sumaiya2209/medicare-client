import Banner from "@/components/Home/Banner";
import FeatureDoctor from "@/components/Home/FeatureDoctor";
import MedicalSpecializations from "@/components/Home/MedicalSpecializations";
import MedicalTips from "@/components/Home/MedicalTips";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Banner />
    <MedicalSpecializations />
    <FeatureDoctor />
    <MedicalTips />
    <WhyChooseUs />
    </>
  );
}
