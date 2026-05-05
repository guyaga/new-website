import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { getSeedancePrompts } from '../utils/seedance';
import SearchBar from '../components/seedance/SearchBar';
import PromptGrid from '../components/seedance/PromptGrid';
import PromptModal from '../components/seedance/PromptModal';

const PAGE_SIZE = 24;

export default function SeedancePage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const fetchPrompts = useCallback(async (pageNum, searchTerm, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    const { prompts: data, total: count } = await getSeedancePrompts({
      page: pageNum,
      pageSize: PAGE_SIZE,
      search: searchTerm,
    });

    if (append) {
      setPrompts((prev) => [...prev, ...data]);
    } else {
      setPrompts(data);
    }
    setTotal(count);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  // Initial load + search changes
  useEffect(() => {
    setPage(1);
    fetchPrompts(1, search);
  }, [search, fetchPrompts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPrompts(nextPage, search, true);
  };

  const hasMore = prompts.length < total;

  return (
    <>
      <Helmet>
        <title>Seedance 2.0 Prompt Hub — Guy Aga</title>
        <meta name="description" content="Browse 972 curated Seedance 2.0 video generation prompts with video previews. Search, explore, and copy prompts." />
      </Helmet>

      <div className="bg-black min-h-screen text-white">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 md:pt-40 md:pb-16">
          <p className="font-mono text-xs text-signal-red uppercase tracking-widest mb-4">
            Prompt Library
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-none mb-4">
            Seedance 2.0
            <br />
            <span className="text-white/40">Prompt Hub</span>
          </h1>
          <p className="font-sans text-base md:text-lg text-white/50 max-w-xl mb-10">
            {total > 0 ? total.toLocaleString() : '970+'} curated prompts with video previews.
            Search, explore, and copy.
          </p>

          <SearchBar onSearch={setSearch} />
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <PromptGrid
            prompts={prompts}
            loading={loading}
            onCardClick={setSelectedPrompt}
          />

          {/* Load More */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="font-mono text-sm bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 px-8 py-3 rounded-full transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : `Load More (${prompts.length} / ${total})`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </>
  );
}
