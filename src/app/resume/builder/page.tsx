import { ResumeProvider } from "@/components/resume/ResumeContext";
import ResumeEditorLayout from "@/components/resume/ResumeEditorLayout";
import Header from "@/components/Header";

export default function ResumeBuilderPage() {
    return (
        <>
            <Header />
            <main className="pt-16">
                <ResumeProvider>
                    <ResumeEditorLayout />
                </ResumeProvider>
            </main>
        </>
    );
}
