import StatsGrid from "@/components/dashboard/StatsGrid";

const patientStats = [
  {
    title: "Upcoming",
    value: 3,
  },
  {
    title: "Past Visits",
    value: 12,
  },
  {
    title: "Total Paid",
    value: 840,
    suffix: "$",
  },
  {
    title: "Favorite Doctors",
    value: 4,
  },
];
const PatientHomePage = () => {
  return (
    <div>
      <StatsGrid stats={patientStats} />

      
    </div>
  );
};

export default PatientHomePage;