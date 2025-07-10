import { useState, useRef, useEffect } from "react";

export default function Carousel({
  children,
  direction = "horizontal",
  showPaging = true,
}) {
  const trackRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isVertical = direction === "vertical";

  const updateCarouselState = () => {
    const track = trackRef.current;
    if (!track) return;

    const prevButton = track.parentElement.querySelector(".carousel-prev");
    const nextButton = track.parentElement.querySelector(".carousel-next");
    if (!prevButton || !nextButton) return;

    const scrollPos = isVertical ? track.scrollTop : track.scrollLeft;
    const scrollDim = isVertical ? track.scrollHeight : track.scrollWidth;
    const clientDim = isVertical ? track.clientHeight : track.clientWidth;

    prevButton.disabled = scrollPos <= 0;
    nextButton.disabled = scrollPos + clientDim >= scrollDim - 1;

    if (clientDim > 0) {
      const newTotalPages = Math.max(1, Math.ceil(scrollDim / clientDim));
      const newCurrentPage = Math.min(
        newTotalPages,
        Math.round(scrollPos / clientDim) + 1
      );

      setTotalPages(newTotalPages);
      setCurrentPage(newCurrentPage);
    }
  };

  const scrollTo = (scrollDirection) => {
    const track = trackRef.current;
    if (!track) return;

    const clientDim = isVertical ? track.clientHeight : track.clientWidth;
    const scrollAmount = scrollDirection === "next" ? clientDim : -clientDim;

    const scrollOptions = {
      behavior: "smooth",
      [isVertical ? "top" : "left"]: scrollAmount,
    };

    track.scrollBy(scrollOptions);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const initialUpdate = setTimeout(() => updateCarouselState(), 100);

    track.addEventListener("scroll", updateCarouselState, { passive: true });

    const resizeObserver = new ResizeObserver(updateCarouselState);
    resizeObserver.observe(track);

    const mutationObserver = new MutationObserver(updateCarouselState);
    mutationObserver.observe(track, { childList: true });

    return () => {
      clearTimeout(initialUpdate);
      track.removeEventListener("scroll", updateCarouselState);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isVertical]);

  const trackClasses = [
    "carousel-track",
    "scroll-smooth",
    "scrollbar-hide",
    isVertical
      ? "flex flex-col overflow-y-auto snap-y h-full"
      : "flex overflow-x-auto snap-x",
  ].join(" ");

  const buttonBaseClasses =
    "absolute z-10 transform cursor-pointer rounded-full bg-white/60 p-2 text-neutral-800 shadow-md opacity-0 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 dark:bg-neutral-800/60 dark:text-white dark:hover:bg-neutral-800";

  const prevButtonClasses = `${buttonBaseClasses} carousel-prev ${
    isVertical
      ? "top-2 left-1/2 -translate-x-1/2"
      : "left-2 top-1/2 -translate-y-1/2"
  }`;
  const nextButtonClasses = `${buttonBaseClasses} carousel-next ${
    isVertical
      ? "bottom-2 left-1/2 -translate-x-1/2"
      : "right-2 top-1/2 -translate-y-1/2"
  }`;

  return (
    <div className="carousel-container group relative w-full h-full overflow-hidden">
      <div
        ref={trackRef}
        className={trackClasses}
        style={{
          scrollSnapType: isVertical ? "y mandatory" : "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>

      <button
        className={prevButtonClasses}
        aria-label={
          isVertical ? "Desplazar hacia arriba" : "Diapositiva anterior"
        }
        onClick={() => scrollTo("prev")}
      >
        {isVertical ? "▲" : "‹"}
      </button>

      <button
        className={nextButtonClasses}
        aria-label={
          isVertical ? "Desplazar hacia abajo" : "Siguiente diapositiva"
        }
        onClick={() => scrollTo("next")}
      >
        {isVertical ? "▼" : "›"}
      </button>

      {showPaging && totalPages > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
          {currentPage} / {totalPages}
        </div>
      )}
    </div>
  );
}
