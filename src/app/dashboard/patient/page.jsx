import StatsGrid from "@/components/dashboard/StatsGrid";
import UpcomingAppointments from "@/components/dashboard/PatientUpcomingAppointments";

import {
  HeartPulse,
  Stethoscope,
  Person,
} from "@gravity-ui/icons";

const appointments = [
  {
    id: 1,
    doctorName: "Dr. Anika Hossain",
    specialty: "Cardiology",
    hospital: "Apollo Hospital",
    date: "Jun 23",
    time: "10:30",
    status: "Confirmed",
    icon: <HeartPulse />,
  },
  {
    id: 2,
    doctorName: "Dr. Farhan Kabir",
    specialty: "Neurology",
    hospital: "Square Hospital",
    date: "Jun 27",
    time: "16:00",
    status: "Pending Payment",
    icon: <Stethoscope />,
  },
  {
    id: 3,
    doctorName: "Dr. Nusrat Jahan",
    specialty: "Orthopedics",
    hospital: "United Hospital",
    date: "Jul 02",
    time: "09:15",
    status: "Confirmed",
    icon: <Person />,
  },
];

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
       <UpcomingAppointments
      appointments={appointments}
    />
      
    </div>
  );
};

export default PatientHomePage;