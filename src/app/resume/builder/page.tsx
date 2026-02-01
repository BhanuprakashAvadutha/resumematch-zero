import { ResumeProvider } from "@/components/resume/ResumeContext";
import ResumeEditorLayout from "@/components/resume/ResumeEditorLayout";

export default function ResumeBuilderPage() {
    return (
        <main className="pt-16">
            <ResumeProvider>
                <ResumeEditorLayout />
            </ResumeProvider>
        </main>
    );
}
