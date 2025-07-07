import { useState } from "react";
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import FighterGrid from "../components/fighters/fighter-grid";
import useFighters from "../hooks/fighters/useFighters";
import usePagination from "../hooks/usePagination";
import Sidebar from "../components/fighters/sidebar";

export default function Home({ initialFighters, initialTotalPages }) {
  const { page, setPage, handleNextPage, handlePrevPage } = usePagination();
  const { fighters, loading, error, totalPages } = useFighters('', page, 30);

  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <meta
          name="description"
          content="Support bold and populist purveyors of freedom who unapologetically oppose fascism, defend our democracy, and champion the rights of all people."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 max-w-6xl mx-auto">
        <section className="flex-1 text-center my-auto">
          <h1 className="text-4xl sm:text-5xl mb-8 font-bebas text-primaryText">
            Meet the Fighters for Justice
          </h1>
          <p className="text-lg text-primaryText mb-3">
            These bold, unapologetic leaders are standing up to fascism and corporate power — 
            fighting for climate justice, workers' rights, and a real democracy.
          </p>
          <p className="text-lg text-secondaryText">
            Explore and support the next generation of populist champions.
          </p>

          {/* Toggle Button on Mobile/Tablet */}
          <div className="lg:hidden mt-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-2 py-2 bg-secondary text-sm text-white rounded"
            >
              {sidebarOpen ? "Hide Criteria" : "What Makes a Fighter?"}
            </button>
          </div>
        </section>

        {/* Sidebar visible on desktop */}
        <div className="hidden lg:block lg:w-1/4 w-full max-w-sm">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar conditionally visible on mobile and tablet */}
      {sidebarOpen && (
        <div className="lg:hidden mt-4 px-4 flex justify-center">
          <div className="w-full max-w-sm">
            <Sidebar />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center mt-6">Loading fighters...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-6">Error: {error}</p>
      ) : (
        <>
          <div className="mt-6">
            <FighterGrid fighters={fighters} />
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 px-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              onClick={() => handleNextPage(totalPages)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}
