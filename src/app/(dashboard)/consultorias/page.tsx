import { CalendarCheck } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ConsultoriasPage() {
  return (
    <ComingSoon
      icon={CalendarCheck}
      title="Consultorias"
      description="Cadastre e acompanhe as consultorias realizadas."
    />
  );
}
