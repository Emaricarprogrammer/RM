import { Footer } from "@/app/_components/Footer";
import { InstructorsCarousel } from "./InstructorsCarousel";
import { OngoingCourses } from "./OngoingCourses";
import { StudentData } from "./StudentData";

export default function EmployeeDetail() {
  return (
    <div className="w-full min-h-screen">
      <div className="bg-gray-50 py-12 px-3 sm:px-4 md:px-8">
        <div className="space-y-12 md:space-y-16">
          <StudentData />
          <OngoingCourses />
          <InstructorsCarousel />
        </div>
      </div>

      <Footer />
    </div>
  );
}
