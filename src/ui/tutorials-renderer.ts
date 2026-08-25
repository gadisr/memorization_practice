/**
 * Tutorials screen: guide cards, search, and category filters.
 */

type TutorialCategory = 'beginner' | 'memorization' | 'execution' | 'advanced';

type TutorialFilter = 'all' | TutorialCategory;

interface TutorialGuide {
  title: string;
  description: string;
  href: string;
  categories: TutorialCategory[];
  icon: string;
}

const TUTORIAL_GUIDES: TutorialGuide[] = [
  {
    title: "Beginner's Guide to Blindfold Cubing",
    description:
      'A comprehensive introduction to blindfold cubing. Learn the basics of BLD solving, memory techniques, and get started with your first blindfold solve.',
    href: 'intro.html',
    categories: ['beginner'],
    icon: 'school',
  },
  {
    title: 'Lettering System',
    description:
      "Understand how the Rubik's cube is mapped to letters for memorization. Learn the standard lettering system used in blindfold cubing.",
    href: 'lettering-system.html',
    categories: ['beginner'],
    icon: 'abc',
  },
  {
    title: 'Features & How It Works',
    description:
      'Learn about the features of this training tool and how to use it effectively for improving your blindfold cubing skills.',
    href: 'features.html',
    categories: ['beginner'],
    icon: 'info',
  },
  {
    title: 'Visualization & Memory Guide',
    description:
      'Master visualization techniques and memory methods for blindfold cubing. Learn how to create vivid mental images and improve your recall accuracy.',
    href: 'guides/improve-visualization-memory.html',
    categories: ['memorization', 'advanced'],
    icon: 'psychology',
  },
  {
    title: 'Speffz Notation Guide',
    description:
      'Learn Speffz notation, the standard lettering system for blindfold cubing. Understand how to identify and memorize piece positions.',
    href: 'guides/speffz-notation.html',
    categories: ['memorization', 'beginner'],
    icon: 'grid_on',
  },
  {
    title: 'Progress Tracking Guide',
    description:
      'Learn how to track your progress, analyze your performance, and identify areas for improvement in your blindfold cubing journey.',
    href: 'guides/progress-tracking.html',
    categories: ['advanced'],
    icon: 'trending_up',
  },
];

const FILTER_BUTTON_IDS: Record<TutorialFilter, string> = {
  all: 'tutorials-filter-all',
  beginner: 'tutorials-filter-beginner',
  memorization: 'tutorials-filter-memorization',
  execution: 'tutorials-filter-execution',
  advanced: 'tutorials-filter-advanced',
};

const ACTIVE_FILTER_CLASSES = ['bg-primary/20', 'text-primary'];
const INACTIVE_FILTER_CLASSES = [
  'bg-[#161d2b]',
  'text-slate-300',
  'hover:bg-slate-700',
  'border',
  'border-white/10',
];

let currentFilter: TutorialFilter = 'all';
let currentSearch = '';
let listenersAttached = false;

function getCategoryLabel(category: TutorialCategory): string {
  switch (category) {
    case 'beginner':
      return 'Beginner';
    case 'memorization':
      return 'Memorization';
    case 'execution':
      return 'Execution';
    case 'advanced':
      return 'Advanced';
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

function filterGuides(guides: TutorialGuide[]): TutorialGuide[] {
  const searchTerm = currentSearch.trim().toLowerCase();

  return guides.filter((guide) => {
    const matchesFilter =
      currentFilter === 'all' || guide.categories.includes(currentFilter);

    const matchesSearch =
      searchTerm.length === 0 ||
      guide.title.toLowerCase().includes(searchTerm) ||
      guide.description.toLowerCase().includes(searchTerm) ||
      guide.categories.some((category) =>
        getCategoryLabel(category).toLowerCase().includes(searchTerm)
      );

    return matchesFilter && matchesSearch;
  });
}

function renderCategoryBadges(categories: TutorialCategory[]): string {
  return categories
    .map(
      (category) =>
        `<span class="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/20 px-2 py-1 rounded-full">${getCategoryLabel(category)}</span>`
    )
    .join('');
}

function renderGuideCard(guide: TutorialGuide): string {
  return `
    <a href="${guide.href}" class="bg-[#161d2b] rounded-lg p-6 flex flex-col gap-4 border border-white/10 hover:border-primary/50 transition-all duration-300">
      <div class="flex items-center justify-center h-32 bg-slate-700 rounded-lg">
        <span class="material-symbols-outlined text-4xl text-slate-500">${guide.icon}</span>
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <div class="flex flex-wrap gap-2">${renderCategoryBadges(guide.categories)}</div>
        <h3 class="text-lg font-bold text-white">${guide.title}</h3>
        <p class="text-sm text-white/60">${guide.description}</p>
      </div>
    </a>
  `;
}

function renderGuidesGrid(): void {
  const grid = document.getElementById('tutorials-guides-grid');
  if (!grid) return;

  const filteredGuides = filterGuides(TUTORIAL_GUIDES);

  if (filteredGuides.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full rounded-lg bg-[#161d2b] p-8 text-center border border-white/10">
        <span class="material-symbols-outlined text-4xl text-slate-500 mb-3">search_off</span>
        <p class="text-white font-medium">No guides match your search</p>
        <p class="text-white/60 text-sm mt-1">Try a different keyword or category filter.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredGuides.map(renderGuideCard).join('');
}

function setActiveFilterButton(filter: TutorialFilter): void {
  (Object.entries(FILTER_BUTTON_IDS) as [TutorialFilter, string][]).forEach(
    ([filterKey, buttonId]) => {
      const button = document.getElementById(buttonId);
      if (!button) return;

      button.classList.remove(...ACTIVE_FILTER_CLASSES, ...INACTIVE_FILTER_CLASSES);

      if (filterKey === filter) {
        button.classList.add(...ACTIVE_FILTER_CLASSES);
      } else {
        button.classList.add(...INACTIVE_FILTER_CLASSES);
      }
    }
  );
}

function attachTutorialListeners(): void {
  if (listenersAttached) return;

  const searchInput = document.getElementById('tutorials-search') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value;
      renderGuidesGrid();
    });
  }

  (Object.entries(FILTER_BUTTON_IDS) as [TutorialFilter, string][]).forEach(
    ([filter, buttonId]) => {
      const button = document.getElementById(buttonId);
      if (!button) return;

      button.addEventListener('click', () => {
        currentFilter = filter;
        setActiveFilterButton(filter);
        renderGuidesGrid();
      });
    }
  );

  listenersAttached = true;
}

export function renderTutorialsGrid(): void {
  attachTutorialListeners();
  setActiveFilterButton(currentFilter);
  renderGuidesGrid();
}
