import { getMockIncidentsWithQuality } from "@/server/services/incidents-service";
import { UploadWorkspace } from "../_sections/upload-workspace";

export async function IntakeHub() {
  const { incidents, quality } = await getMockIncidentsWithQuality();

  return <UploadWorkspace incidents={incidents} quality={quality} />;
}
