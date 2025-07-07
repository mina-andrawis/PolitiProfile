import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import FighterGrid from "../components/fighters/fighter-grid";
import useFighters from "../hooks/fighters/useFighters";
import usePagination from "../hooks/usePagination";

export default function Home({ initialFighters, initialTotalPages }) {
  const { page, setPage, handleNextPage, handlePrevPage } = usePagination();
  const { fighters, loading, error, totalPages } = useFighters('', page, 30, {
    fallbackData: initialFighters,
    fallbackPages: initialTotalPages,
  });

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

      <section className="text-center my-4 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primaryText">
          Meet the Fighters for Justice
        </h1>
        <p className="text-lg text-primaryText mb-3">
          These bold, unapologetic leaders are standing up to fascism and corporate power —
          fighting for climate justice, workers' rights, and a real democracy.
        </p>
        <p className="text-lg text-secondaryText">
          Explore and support the next generation of populist champions.
        </p>
      </section>


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
