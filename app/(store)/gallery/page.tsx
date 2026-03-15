import { verses } from "@/data/verses";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";

export default function GalleryPage() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="min-h-screen bg-bg-primary">
        <section className="max-w-7xl mx-auto px-4 pt-28 pb-12">
          <ArtworkGrid verses={verses} />
        </section>
      </main>

      <Footer />
    </>
  );
}
