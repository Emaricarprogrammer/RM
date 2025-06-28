import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { CoursesSection } from "./CoursesSection.jsx";
import { Footer } from "@/app/_components/Footer";
import { TargetAudienceSection } from "./TargetAudienceSection";
import { BenefitsSection } from "./BenefitsSection";
import { GetAllCourses } from "@/api/Courses/allCourses";
import { ErrorPage } from "@/app/_components/ErrorPage";

export default async function Landing() {

  const result = await GetAllCourses()

  if (!result)
  {
    return (
      <ErrorPage message="Ocorreu um erro ao carregar esta página, tente novamente"/>
    )
  }
 
  const courses = result.response.map(course => ({
    id: course.id_course,
    title: course.title || 'Curso sem título',
    description: course.description || '',
    category: course.category || 'Outros',
    type: course.course_type,
    releaseDate: course.createdAt,
    price: course.price || 0,
    image: course.image_url,
    duration: course.duration ? `${course.duration} horas` :"não especificado",
    instructor: course.instructors_datas.full_name || 'Instrutor não especificado',
    instructorId: course.instructors_datas?.id_instructor || '0',
  }))



  return (
    <div className="bg-slate-50">
      <Navbar />

      <main className="overflow-hidden">
        <HeroSection />
        <FeaturesSection />
        <CoursesSection courses={courses} />
        <TargetAudienceSection />
        <BenefitsSection />
      </main>

      <Footer />
    </div>
  );
}