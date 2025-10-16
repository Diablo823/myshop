import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "./ui/input";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useWixClient } from "@/hooks/useWixClient";
import { products } from "@wix/stores";
import { ScrollArea } from "./ui/scroll-area";

interface Product extends products.Product {}

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchBar = () => {
  const router = useRouter();
  const wixClient = useWixClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const suggestionClickedRef = useRef(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchSuggestions = useCallback(
    async (term: string) => {
      if (term.length < 1) {
        setSuggestions([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(false);

      try {
        const response = await wixClient.products
          .queryProducts()
          //@ts-ignore
          .contains("name", term)
          //.limit(5)
          .find();

        setSuggestions(response.items);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    },
    [wixClient]
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSuggestions(debouncedSearchTerm);
    } else {
      setSuggestions([]);
      setHasSearched(false);
    }
  }, [debouncedSearchTerm, fetchSuggestions]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/list?name=${searchTerm}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    suggestionClickedRef.current = true;
    router.push(`/products/${slug}`);
    setShowSuggestions(false);
    setSearchTerm("");
    
    // Reset the ref after navigation
    setTimeout(() => {
      suggestionClickedRef.current = false;
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSuggestions(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when suggestions are open
  useEffect(() => {
    if (showSuggestions && searchTerm.length >= 1) {
      // Save current scroll position
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showSuggestions, searchTerm]);

  const handleBlur = () => {
    // Only hide suggestions if no suggestion was clicked
    setTimeout(() => {
      if (!suggestionClickedRef.current) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  return (
    <div className="relative w-full search-container">
      <form
        className="flex items-center justify-between gap-3 rounded-full flex-1 px-3 py-2"
        onSubmit={handleSearch}
      >
        <Input
          type="text"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
            setHasSearched(false);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search Products"
          className="search-input flex-1 bg-white ring-1 ring-slate-300 focus:ring-slate-400 rounded-full placeholder:text-xs text-xs"
          suppressHydrationWarning
          onBlur={handleBlur}
        />
        <button
          className="absolute cursor-pointer right-8"
          type="submit"
          suppressHydrationWarning
        >
          <IoSearch size={20} />
        </button>
      </form>

      {showSuggestions && searchTerm.length >= 1 && (
        <div className="fixed md:absolute z-20 left-0 right-0 top-16 md:top-auto md:w-full md:mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="relative flex flex-col items-center gap-2">
              
              <div className="w-6 h-6 mt-2 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              <div className="text-black font-semibold text-xs">Searching</div>

              {/* <div className="animate-pulse relative w-10 h-10">
                <Image
                  src="https://ik.imagekit.io/5ok2lashts/loadlogo.png?updatedAt=1736980178600"
                  alt="Loading animation"
                  fill
                  sizes="(max-width: 768px) 96px, 96px"
                  priority
                  className="object-contain"
                />
              </div> */}
            </div>
          ) : hasSearched ? (
            suggestions.length > 0 ? (
              <ScrollArea className="h-full">
                <div className="py-2">
                  {suggestions.map((product) => (
                    <div
                      key={product._id}
                      onMouseDown={() => {
                        // Using onMouseDown instead of onClick to ensure it fires before onBlur
                        handleSuggestionClick(product.slug || product._id!);
                      }}
                      className="flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="relative w-12 h-12">
                        <Image
                          src={
                            product.media?.mainMedia?.image?.url ||
                            "/product.png"
                          }
                          alt={product.name || "Product"}
                          fill
                          sizes="48px"
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {product.name?.slice(0, 20)}...
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹
                          {product.priceData?.discountedPrice ||
                            product.priceData?.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No products found
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;