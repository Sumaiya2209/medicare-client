import Image from "next/image";
import DoctorsImg from "@/images/doctors_team.png";
import { Icon } from "@gravity-ui/uikit";
import { ShieldCheck, CrownDiamond, HeartPulse } from "@gravity-ui/icons";

const features = [
  {
    icon: ShieldCheck,
    title: "22 Years' Experience",
  },
  {
    icon: CrownDiamond,
    title: "Medical Excellence",
  },
  {
    icon: HeartPulse,
    title: "In-person or online care",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl my-20 rounded-2xl bg-white shadow-2xl mx-auto p-15 px-6 border-2">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-4">
            Why MediCare Connect
          </p>

          <h2 className="text-4xl font-bold text-[#0B1F3A] leading-tight mb-10">
            Simple, supportive <br /> healthcare
          </h2>

          <div className="space-y-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-slate-100 rounded-xl px-5 py-5 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              >
                <div className="text-[#3B3F8C]">
                  <Icon data={f.icon} size={22} />
                </div>
                <p className="font-semibold text-[#0B1F3A] text-base">
                  {f.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Image */}
        <div>
          <Image
            src={DoctorsImg}
            alt="Medical team"
            width={700}
            height={500}
            className="w-full h-[480px] object-cover rounded-2xl"
          />
        </div>

      </div>
    </section>
  );
}