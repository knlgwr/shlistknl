import React, { useState, useEffect, useMemo } from 'react';
import { 
  UploadCloud, 
  Search, 
  Trash2, 
  Plus, 
  Check, 
  ExternalLink, 
  Edit3, 
  Download, 
  Grid, 
  List, 
  X,
  ArrowLeft,
  CheckSquare,
  Square,
  Home,
  Layers
} from 'lucide-react';

// Pre-seeded sample data formatted strictly as array strings to avoid backtick issues on mobile clipboard engines
const SAMPLE_CSV_TRANSFORMATION = [
  "Category,Item Description,Brand / Platform,Specific Size / Spec,Price (INR),Direct Purchase or Search Link",
  "Prep,Salicylic Acid 2% Cleanser,Minimalist,100ml,300,https://www.amazon.in/s?k=Minimalist+Salicylic+Acid+2%25+Cleanser",
  "Prep,Pure Coconut Oil / Baby Oil,Parachute / Johnson's,Shave Base,100,https://www.amazon.in/s?k=Parachute+Coconut+Oil",
  "Prep,Body Milk (Deep Moisture Glaze),Nivea,Very Dry Skin,250,https://www.amazon.in/s?k=Nivea+Body+Milk+Very+Dry+Skin",
  "Makeup,Pro Concealer Palette (6-Color Wheel),Insight Cosmetics,Corrector / Contour,240,https://www.amazon.in/s?k=Insight+Cosmetics+Pro+Concealer+Palette",
  "Makeup,Fit Me Matte + Poreless Foundation,Maybelline New York,Liquid Base,550,https://www.amazon.in/s?k=Maybelline+Fit+Me+Matte+Poreless+Foundation",
  "Makeup,Blend Master Sponge,Insight Cosmetics,High-Density,150,https://www.amazon.in/s?k=Insight+Cosmetics+Blend+Master+Sponge",
  "Makeup,Liquid Eyeliner + Mascara Pack,Swiss Beauty,Jet Black / Waterproof,350,https://www.amazon.in/s?k=Swiss+Beauty+Liquid+Eyeliner+Mascara",
  "Makeup,Bold Matte Lip Liner,Swiss Beauty,Center Overlining,70,https://www.amazon.in/s?k=Swiss+Beauty+Bold+Matte+Lip+Liner",
  "Makeup,SuperStay Matte Ink Liquid Lipstick,Maybelline New York,Locked / Transfer-proof,650,https://www.amazon.in/s?k=Maybelline+SuperStay+Matte+Ink",
  "Makeup,Flawless Finishing Loose Powder,Blue Heaven,Translucent Baking,180,https://www.amazon.in/s?k=Blue+Heaven+Flawless+Finishing+Loose+Powder",
  "Wardrobe,Seamless Microfiber Bikini Panty,Clovia / Zivame,Size Medium (M),250,https://www.clovia.com/search/?q=seamless+microfiber+bikini+panty",
  "Wardrobe,Seamless Padded Bralette,Clovia / Zivame,Size 34B (Sister Size),600,https://www.clovia.com/search/?q=seamless+padded+bralette",
  "Hardware,Silicone Teardrop Breast Forms,Generic (Amazon India),400g / pair (200g each),1200,https://www.amazon.in/s?k=Silicone+Teardrop+Breast+Forms+400g",
  "Hardware,Foam Padded Hip & Butt Briefs,Generic (Amazon India),Base Curve Builder,900,https://www.amazon.in/s?k=Foam+Padded+Hip+Butt+Briefs",
  "Wardrobe,Satin Shirt Dress with Front Drape,MABISH by Sonal Jain,\"Size Large (L), Black\",1200,https://www.myntra.com/mabish-by-sonal-jain-black-solid-dress",
  "Hardware,Pointed-Toe Block Heels / Pumps,Generic (Amazon India),Size UK 10 / UK 11,3100,https://www.amazon.in/s?k=Womens+Pointed+Toe+Block+Heels+UK+10+UK+11",
  "Jewelry,Anti-Tarnish Stainless Steel Anklet,Yellow Chimes,Right Leg Anchor,350,https://www.amazon.in/s?k=Yellow+Chimes+Anti+Tarnish+Stainless+Steel+Anklet",
  "Jewelry,Minimalist Single-Pendant Chain,Yellow Chimes / Salty,V-Neck Framing,350,https://www.amazon.in/s?k=Yellow+Chimes+Minimalist+Single+Pendant+Chain",
  "Jewelry,Non-Pierced Clip-On Earring Pack,Indicare / Generic,Huggie Hoop / Drop,200,https://www.amazon.in/s?k=Anti+Tarnish+Stainless+Steel+Clip+On+Earrings",
  "Jewelry,Slender Chain Bracelet,Yellow Chimes,Left Wrist Anchor,250,https://www.amazon.in/s?k=Yellow+Chimes+Stainless+Steel+Chain+Bracelet"
].join("\n");

const SAMPLE_CSV_AMENITIES = [
  "Category,Item Description,Brand / Platform,Specific Size / Spec,Price (INR),Direct Purchase or Search Link",
  "Kitchen,Ceramic Pastel Coffee Mug,Doodle Home,Set of 2,600,https://www.amazon.in/s?k=Ceramic+Pastel+Coffee+Mug",
  "Kitchen,Non-Stick Pastel Cookware Set,Wonderchef,3-Piece Pink,2400,https://www.amazon.in/s?k=Wonderchef+Pink+Cookware+Set",
  "Living Room,Tufted Pastel Throw Pillow,Swayam,45x45cm Lavender,800,https://www.amazon.in/s?k=Tufted+Pastel+Throw+Pillow",
  "Living Room,Abstract Pastel Wall Art,Art Street,Set of 3 Minimalist,1200,https://www.amazon.in/s?k=Abstract+Pastel+Wall+Art+Set+3",
  "Bedroom,100% Cotton Pastel Bedding Set,Portico New York,Double Bed Mint,1800,https://www.amazon.in/s?k=Mint+Pastel+Cotton+Bedding+Set",
  "Bathroom,Plush Pastel Cotton Towels,Solimo,Pack of 4 Peach,950,https://www.amazon.in/s?k=Plush+Pastel+Cotton+Towels+Peach"
].join("\n");

const PASTEL_PALETTES = [
  { bg: 'bg-[#FFE5EC]', border: 'border-[#FFA6C9]', text: 'text-[#8A2544]', bgHover: 'hover:bg-[#FFD1DC]' }, 
  { bg: 'bg-[#E8F0FE]', border: 'border-[#B4CDFD]', text: 'text-[#1E429F]', bgHover: 'hover:bg-[#D4E4FC]' }, 
  { bg: 'bg-[#EAFDF8]', border: 'border-[#A3F1DC]', text: 'text-[#0B5A45]', bgHover: 'hover:bg-[#D5FCF1]' }, 
  { bg: 'bg-[#FEF9E6]', border: 'border-[#FCE4A6]', text: 'text-[#7A4B00]', bgHover: 'hover:bg-[#FDF1CC]' }, 
  { bg: 'bg-[#F3E8FF]', border: 'border-[#D8B4FE]', text: 'text-[#5B21B6]', bgHover: 'hover:bg-[#E9D5FF]' }, 
  { bg: 'bg-[#FFF0E6]', border: 'border-[#FFD0B3]', text: 'text-[#9A3412]', bgHover: 'hover:bg-[#FFE0CC]' }  
];

const EMOJIS = ['✨', '💄', '👗', '🏠', '🛋️', '🎒', '🛍️', '🎁', '🥑', '🧸', '🛁', '🌱'];

function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') { i++; }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  return lines.filter(r => r.some(cell => cell.trim() !== ""));
}

export default function App() {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); 
  
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [newListEmoji, setNewListEmoji] = useState('✨');
  const [newListCsvText, setNewListCsvText] = useState('');

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  
  const [newItem, setNewItem] = useState({
    category: '',
    name: '',
    brand: '',
    spec: '',
    price: '',
    link: ''
  });
  
  const [editingItem, setEditingItem] = useState(null);
  const [uiNotification, setUiNotification] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital,wght@0,400;0,900;1,400;1,900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.innerHTML = ".font-doodle-serif { font-family: 'Instrument Serif', Georgia, serif; } .font-doodle-sans { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }";
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const savedLists = localStorage.getItem('pastel_doodle_shopping_hub');
    if (savedLists) {
      try {
        setLists(JSON.parse(savedLists));
      } catch (e) {
        console.error("Local storage sync error.", e);
      }
    } else {
      const transItems = parseCSVToItemsArray(SAMPLE_CSV_TRANSFORMATION);
      const amenItems = parseCSVToItemsArray(SAMPLE_CSV_AMENITIES);
      const defaultLists = [
        {
          id: 'list-transformation',
          title: 'Transformation',
          description: 'Personal self-care products, cosmetics, hardware forms, and custom accessories.',
          emoji: '💄',
          items: transItems
        },
        {
          id: 'list-amenities',
          title: 'Home Amenities',
          description: 'Beautiful ceramic pieces, pastel kitchenware, and custom bedroom options.',
          emoji: '🏠',
          items: amenItems
        }
      ];
      setLists(defaultLists);
      localStorage.setItem('pastel_doodle_shopping_hub', JSON.stringify(defaultLists));
    }

    const savedActiveId = localStorage.getItem('pastel_doodle_active_list_id');
    if (savedActiveId) setActiveListId(JSON.parse(savedActiveId));

    const savedCategory = localStorage.getItem('pastel_doodle_active_category');
    if (savedCategory) setActiveCategory(JSON.parse(savedCategory));

    const savedSortBy = localStorage.getItem('pastel_doodle_sort_by');
    if (savedSortBy) setSortBy(JSON.parse(savedSortBy));

    const savedViewMode = localStorage.getItem('pastel_doodle_view_mode');
    if (savedViewMode) setViewMode(JSON.parse(savedViewMode));

    const savedSearch = localStorage.getItem('pastel_doodle_search_query');
    if (savedSearch) setSearchQuery(JSON.parse(savedSearch));
  }, []);

  const saveLists = (updated) => {
    setLists(updated);
    localStorage.setItem('pastel_doodle_shopping_hub', JSON.stringify(updated));
  };

  const persistActiveListId = (id) => {
    setActiveListId(id);
    localStorage.setItem('pastel_doodle_active_list_id', JSON.stringify(id));
  };

  const persistActiveCategory = (category) => {
    setActiveCategory(category);
    localStorage.setItem('pastel_doodle_active_category', JSON.stringify(category));
  };

  const persistSortBy = (sortOption) => {
    setSortBy(sortOption);
    localStorage.setItem('pastel_doodle_sort_by', JSON.stringify(sortOption));
  };

  const persistViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('pastel_doodle_view_mode', JSON.stringify(mode));
  };

  const persistSearchQuery = (query) => {
    setSearchQuery(query);
    localStorage.setItem('pastel_doodle_search_query', JSON.stringify(query));
  };

  const triggerNotification = (message) => {
    setUiNotification(message);
    setTimeout(() => setUiNotification(null), 3000);
  };

  function parseCSVToItemsArray(rawText) {
    const rows = parseCSV(rawText);
    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const catIdx = headers.findIndex(h => h.includes('cat'));
    const itemIdx = headers.findIndex(h => h.includes('item') || h.includes('desc') || h.includes('name'));
    const brandIdx = headers.findIndex(h => h.includes('brand') || h.includes('plat') || h.includes('source'));
    const specIdx = headers.findIndex(h => h.includes('size') || h.includes('spec'));
    const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('cost') || h.includes('amt') || h.includes('inr'));
    const linkIdx = headers.findIndex(h => h.includes('link') || h.includes('url') || h.includes('purchase') || h.includes('search'));

    const itemsList = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length === 0 || !row[0]) continue;
      if (row[0].toLowerCase().includes('total') || row.some(cell => cell.toString().toLowerCase().includes('total'))) {
        continue; 
      }

      const category = catIdx !== -1 ? row[catIdx]?.trim() : 'General';
      const name = itemIdx !== -1 ? row[itemIdx]?.trim() : row[0]?.trim();
      const brand = brandIdx !== -1 ? row[brandIdx]?.trim() : '';
      const spec = specIdx !== -1 ? row[specIdx]?.trim() : '';
      
      let rawPrice = priceIdx !== -1 ? row[priceIdx] : '0';
      let parsedPrice = parseFloat(rawPrice?.replace(/[^0-9.]/g, '')) || 0;
      const link = linkIdx !== -1 ? row[linkIdx]?.trim() : '';

      if (name) {
        itemsList.push({
          id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          category: category || 'General',
          name,
          brand: brand || 'Generic',
          spec: spec || '-',
          price: parsedPrice,
          link: link || '',
          completed: false
        });
      }
    }
    return itemsList;
  }

  const handleCreateNewList = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) {
      triggerNotification("List title is required.");
      return;
    }

    let parsedItems = [];
    if (newListCsvText.trim()) {
      parsedItems = parseCSVToItemsArray(newListCsvText);
    }

    const created = {
      id: 'list-' + Date.now(),
      title: newListTitle.trim(),
      description: newListDesc.trim() || 'A custom list of curated elements.',
      emoji: newListEmoji,
      items: parsedItems
    };

    saveLists([created, ...lists]);
    setNewListTitle('');
    setNewListDesc('');
    setNewListEmoji('✨');
    setNewListCsvText('');
    setShowCreateModal(false);
    triggerNotification('Notebook "' + created.title + '" added!');
  };

  const handleDeleteListNotebookTrigger = (listId, listTitle, e) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteConfirmation({
      type: 'notebook',
      id: listId,
      title: listTitle
    });
  };

  const handleDeleteItemFromActiveWorkspaceTrigger = (itemId, itemName, e) => {
    if (e) e.stopPropagation();
    setDeleteConfirmation({
      type: 'item',
      id: itemId,
      title: itemName
    });
  };

  const handleDeleteCategoryTrigger = (categoryName, e) => {
    if (e) e.stopPropagation();
    setDeleteConfirmation({
      type: 'category',
      id: categoryName,
      title: categoryName
    });
  };

  const handleExecuteDeletion = () => {
    if (!deleteConfirmation) return;
    const { type, id, title } = deleteConfirmation;

    if (type === 'notebook') {
      const updated = lists.filter(l => l.id !== id);
      saveLists(updated);
      triggerNotification('Deleted "' + title + '"');
      if (activeListId === id) {
        persistActiveListId(null);
      }
    } else if (type === 'item') {
      if (!activeList) return;
      const updatedItems = activeList.items.filter(item => item.id !== id);
      const updatedLists = lists.map(l => {
        if (l.id === activeListId) return { ...l, items: updatedItems };
        return l;
      });
      saveLists(updatedLists);
      triggerNotification('Removed "' + title + '"');
    } else if (type === 'category') {
      if (!activeList) return;
      const updatedItems = activeList.items.filter(item => item.category !== id);
      const updatedLists = lists.map(l => {
        if (l.id === activeListId) return { ...l, items: updatedItems };
        return l;
      });
      saveLists(updatedLists);
      persistActiveCategory('All');
      triggerNotification('Deleted category "' + title + '" and all nested items.');
    }

    setDeleteConfirmation(null);
  };

  const handleCSVUploadFromFiles = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const fileTitle = file.name.replace(/\.[^/.]+$/, "");
      const items = parseCSVToItemsArray(text);
      
      const created = {
        id: 'list-' + Date.now(),
        title: fileTitle,
        description: 'Imported directly from file: ' + file.name,
        emoji: '📂',
        items: items
      };

      saveLists([created, ...lists]);
      triggerNotification('Imported "' + fileTitle + '"!');
    };
    reader.readAsText(file);
  };

  const activeList = useMemo(() => {
    return lists.find(l => l.id === activeListId) || null;
  }, [lists, activeListId]);

  useEffect(() => {
    if (activeList && activeCategory !== 'All') {
      const exists = activeList.items.some(item => item.category === activeCategory);
      if (!exists) {
        persistActiveCategory('All');
      }
    }
  }, [lists, activeList, activeCategory]);

  const handleItemCompletionToggle = (itemId, e) => {
    if (e) e.stopPropagation();
    if (!activeList) return;
    const updatedItems = activeList.items.map(item => {
      if (item.id === itemId) return { ...item, completed: !item.completed };
      return item;
    });

    const updatedLists = lists.map(l => {
      if (l.id === activeListId) return { ...l, items: updatedItems };
      return l;
    });

    saveLists(updatedLists);
  };

  const handleAddItemToActiveWorkspace = (e) => {
    e.preventDefault();
    if (!activeList) return;
    if (!newItem.name || !newItem.category) {
      triggerNotification("Fill in both Name and Category!");
      return;
    }

    const priceVal = parseFloat(newItem.price) || 0;
    const itemAdded = {
      id: 'item-' + Date.now(),
      category: newItem.category.trim(),
      name: newItem.name.trim(),
      brand: newItem.brand.trim() || 'Generic',
      spec: newItem.spec.trim() || '-',
      price: priceVal,
      link: newItem.link.trim(),
      completed: false
    };

    const updatedItems = [...activeList.items, itemAdded];
    const updatedLists = lists.map(l => {
      if (l.id === activeListId) return { ...l, items: updatedItems };
      return l;
    });

    saveLists(updatedLists);
    setNewItem({ category: '', name: '', brand: '', spec: '', price: '', link: '' });
    triggerNotification("Added item!");
  };

  const handleUpdateItemDetails = (e) => {
    e.preventDefault();
    if (!activeList || !editingItem) return;

    const updatedItems = activeList.items.map(item => {
      if (item.id === editingItem.id) {
        return { ...editingItem, price: parseFloat(editingItem.price) || 0 };
      }
      return item;
    });

    const updatedLists = lists.map(l => {
      if (l.id === activeListId) return { ...l, items: updatedItems };
      return l;
    });

    saveLists(updatedLists);
    setEditingItem(null);
    triggerNotification("Updated details!");
  };

  const exportActiveWorkspaceCSV = () => {
    if (!activeList || activeList.items.length === 0) return;

    const headers = ["Category", "Item Description", "Brand / Platform", "Specific Size / Spec", "Price (INR)", "Direct Purchase or Search Link"];
    const rows = activeList.items.map(item => [
      '"' + item.category.replace(/"/g, '""') + '"',
      '"' + item.name.replace(/"/g, '""') + '"',
      '"' + item.brand.replace(/"/g, '""') + '"',
      '"' + item.spec.replace(/"/g, '""') + '"',
      item.price,
      '"' + item.link.replace(/"/g, '""') + '"'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", encodedUri);
    downloadLink.setAttribute("download", activeList.title.toLowerCase().replace(/\s+/g, '_') + '_list.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const activeListCategories = useMemo(() => {
    if (!activeList) return [];
    const cats = new Set(activeList.items.map(i => i.category));
    return ['All', ...Array.from(cats)];
  }, [activeList]);

  const activeListStats = useMemo(() => {
    if (!activeList) return null;
    const totalCount = activeList.items.length;
    const completedCount = activeList.items.filter(i => i.completed).length;
    const totalBudget = activeList.items.reduce((sum, item) => sum + item.price, 0);
    const spentAmount = activeList.items.filter(i => i.completed).reduce((sum, item) => sum + item.price, 0);
    const remainingAmount = totalBudget - spentAmount;

    return {
      totalCount,
      completedCount,
      percentComplete: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      totalBudget,
      spentAmount,
      remainingAmount
    };
  }, [activeList]);

  const globalMetrics = useMemo(() => {
    let itemsCount = 0;
    let completedItemsCount = 0;
    let totalCost = 0;
    lists.forEach(l => {
      itemsCount += l.items.length;
      completedItemsCount += l.items.filter(i => i.completed).length;
      totalCost += l.items.reduce((sum, item) => sum + item.price, 0);
    });
    return {
      itemsCount,
      completedItemsCount,
      totalCost,
      completionRate: itemsCount > 0 ? Math.round((completedItemsCount / itemsCount) * 100) : 0
    };
  }, [lists]);

  const activeFilteredSortedItems = useMemo(() => {
    if (!activeList) return [];
    let items = [...activeList.items];

    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.brand.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) ||
        item.spec.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'alphabetical') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'completed') {
      items.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);
    }

    return items;
  }, [activeList, activeCategory, searchQuery, sortBy]);

  const handleUrlAccess = (url, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!url) return;
    try {
      const targetWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (targetWindow) {
        targetWindow.focus();
      } else {
        window.location.href = url;
      }
    } catch (err) {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#332C27] font-doodle-sans selection:bg-[#FFE3E8] pb-24">
      
      {uiNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border-4 border-[#FFA6C9] bg-[#FFE5EC] text-[#8A2544] shadow-md transform animate-bounce font-doodle-sans">
          <span className="text-xl">🌟</span>
          <span className="text-sm font-bold tracking-tight">{uiNotification}</span>
        </div>
      )}

      <nav className="border-b-4 border-[#B4CDFD] bg-[#E8F0FE] py-5 px-4 sm:px-6 sticky top-0 z-40 font-doodle-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => persistActiveListId(null)}>
            <div className="w-12 h-12 rounded-2xl bg-[#FFE5EC] border-4 border-[#FFA6C9] flex items-center justify-center text-2xl">
              🦄
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-1 text-[#1E429F] font-doodle-serif leading-none">
                Kunal's Shopping List
              </h1>
              <p className="text-[10px] font-bold text-[#4B69B1] tracking-wide uppercase mt-1">Your Aesthetic Shopping Catalog</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                persistActiveListId(null);
                persistActiveCategory('All');
              }}
              className={'px-4 py-2.5 rounded-2xl font-black text-xs border-3 transition-all flex items-center gap-1.5 ' + (activeListId === null ? 'bg-[#FEF9E6] border-[#FCE4A6] text-[#7A4B00]' : 'bg-white border-[#B4CDFD] text-[#1E429F] hover:bg-[#E8F0FE]')}
            >
              <Home size={14} strokeWidth={3} />
              Home Board
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#EAFDF8] border-3 border-[#A3F1DC] hover:bg-[#D5FCF1] text-[#0B5A45] rounded-2xl font-black text-xs transition-all flex items-center gap-1"
            >
              <Plus size={14} strokeWidth={3} />
              New Notebook
            </button>
          </div>

        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">

        {activeListId === null && (
          <div className="space-y-10 animate-fadeIn">
            
            <div className="bg-[#FFE5EC] border-4 border-[#FFA6C9] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="max-w-xl">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#8A2544] bg-white border-2 border-[#FFA6C9] px-3 py-1 rounded-full font-doodle-sans">
                  Dashboard Center
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-[#8A2544] tracking-tight mt-3 font-doodle-serif leading-none">
                  Aesthetic Shopping Lists, Generated from Raw Data
                </h2>
                <p className="text-xs font-bold text-[#8A2544]/80 mt-2 leading-relaxed font-doodle-sans">
                  Import CSV files directly, paste raw tabular values, or build your shopping categories manually. Everything gets organized into beautifully structured visual records.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 font-doodle-sans">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-3 bg-white hover:bg-[#FFE5EC] text-[#8A2544] font-black rounded-2xl border-3 border-[#FFA6C9] transition-all flex items-center gap-2 text-xs"
                  >
                    <Plus size={16} strokeWidth={3} className="text-[#8A2544]" />
                    Paste CSV or Create Notebook
                  </button>

                  <label className="px-5 py-3 bg-[#EAFDF8] hover:bg-[#D5FCF1] text-[#0B5A45] font-black rounded-2xl border-3 border-[#A3F1DC] transition-all flex items-center gap-2 text-xs cursor-pointer">
                    <UploadCloud size={16} strokeWidth={3} />
                    Upload File.csv
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUploadFromFiles}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-doodle-sans">
              <div className="bg-[#FEF9E6] border-4 border-[#FCE4A6] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white border-2 border-[#FCE4A6] rounded-xl flex items-center justify-center text-2xl">📚</div>
                <div>
                  <div className="text-[10px] font-black text-[#7A4B00] uppercase tracking-wider">Registered Notebooks</div>
                  <div className="text-2xl font-black text-[#7A4B00] font-doodle-serif leading-tight">{lists.length} active logs</div>
                </div>
              </div>

              <div className="bg-[#EAFDF8] border-4 border-[#A3F1DC] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white border-2 border-[#A3F1DC] rounded-xl flex items-center justify-center text-2xl">🍒</div>
                <div>
                  <div className="text-[10px] font-black text-[#0B5A45] uppercase tracking-wider">Aesthetic Completion</div>
                  <div className="text-2xl font-black text-[#0B5A45] font-doodle-serif leading-tight">{globalMetrics.completionRate}% of items</div>
                </div>
              </div>

              <div className="bg-[#F3E8FF] border-4 border-[#D8B4FE] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white border-2 border-[#D8B4FE] rounded-xl flex items-center justify-center text-2xl">🎀</div>
                <div>
                  <div className="text-[10px] font-black text-[#5B21B6] uppercase tracking-wider">Projected Portfolio</div>
                  <div className="text-2xl font-black text-[#5B21B6] font-doodle-serif leading-tight">₹{globalMetrics.totalCost.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-[#1E429F]" />
                  <h3 className="text-2xl font-black tracking-tight text-[#1E429F] font-doodle-serif">Curated Shopping Notebooks</h3>
                </div>
                <span className="text-xs font-bold text-zinc-500 font-doodle-sans">Select any list below</span>
              </div>

              {lists.length === 0 ? (
                <div className="bg-white border-4 border-dashed border-[#FCE4A6] rounded-3xl p-12 text-center font-doodle-sans">
                  <div className="text-4xl mb-2">🧁</div>
                  <h4 className="text-lg font-black text-zinc-800">Your Notebook Shelf is Empty</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                    Paste raw CSV format or upload files to map your lists.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 px-4 py-2 bg-[#FFE5EC] border-2 border-[#FFA6C9] text-[#8A2544] font-black rounded-xl text-xs"
                  >
                    Create Custom Notebook
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-doodle-sans">
                  {lists.map((list, index) => {
                    const palette = PASTEL_PALETTES[index % PASTEL_PALETTES.length];
                    const itemsCount = list.items.length;
                    const itemsCompleted = list.items.filter(i => i.completed).length;
                    const progressVal = itemsCount > 0 ? Math.round((itemsCompleted / itemsCount) * 100) : 0;
                    const totalCost = list.items.reduce((sum, item) => sum + item.price, 0);

                    return (
                      <div
                        key={list.id}
                        className={'rounded-2xl p-6 border-4 ' + palette.border + ' ' + palette.bg + ' flex flex-col justify-between h-64 relative transition-transform hover:-translate-y-1'}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-2xl bg-white border-2 border-zinc-200 w-10 h-10 flex items-center justify-center rounded-xl">
                              {list.emoji || '📋'}
                            </span>
                            
                            <button
                              onClick={(e) => handleDeleteListNotebookTrigger(list.id, list.title, e)}
                              className={'p-1.5 rounded-lg border-2 bg-white ' + palette.border + ' hover:bg-rose-500 hover:text-white transition-colors'}
                              title="Delete Notebook"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <h4 className="text-2xl font-black mt-3 text-zinc-900 tracking-tight leading-snug line-clamp-1 font-doodle-serif">
                            {list.title}
                          </h4>
                          <p className="text-xs text-zinc-600 font-bold mt-1 line-clamp-2 leading-relaxed">
                            {list.description || "No description loaded."}
                          </p>
                        </div>

                        <div className="pt-3 border-t-2 border-dashed border-[#332C27]/10">
                          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-800">
                            <span>{itemsCompleted} / {itemsCount} Bought</span>
                            <span>₹{totalCost.toLocaleString('en-IN')}</span>
                          </div>
                          
                          <div className="w-full bg-white h-2.5 rounded-full border-2 border-zinc-900/10 mt-1.5 overflow-hidden">
                            <div 
                              className="bg-zinc-800 h-full rounded-full" 
                              style={{ width: progressVal + '%' }}
                            ></div>
                          </div>

                          <button
                            onClick={() => {
                              persistActiveListId(list.id);
                              persistActiveCategory('All');
                            }}
                            className={'w-full mt-3 py-1.5 bg-white ' + palette.bgHover + ' border-2 ' + palette.border + ' rounded-xl text-xs font-black transition text-zinc-800 flex items-center justify-center gap-1'}
                          >
                            <span>Open Notebook</span>
                            <span>📖</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {activeListId !== null && activeList && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FEF9E6] p-5 rounded-2xl border-4 border-[#FCE4A6]">
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    persistActiveListId(null);
                    persistActiveCategory('All');
                  }}
                  className="p-3.5 bg-white hover:bg-[#FEF9E6] rounded-xl border-2 border-[#FCE4A6] font-black text-sm flex items-center justify-center transition"
                  title="Back to All Notebooks"
                >
                  <ArrowLeft size={14} strokeWidth={3} />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl">{activeList.emoji || '📋'}</span>
                    <h2 className="text-3xl font-black text-zinc-850 tracking-tight font-doodle-serif leading-none">{activeList.title}</h2>
                  </div>
                  <p className="text-xs font-bold text-[#7A4B00] mt-0.5 font-doodle-sans">{activeList.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto font-doodle-sans">
                <button
                  onClick={exportActiveWorkspaceCSV}
                  disabled={activeList.items.length === 0}
                  className="px-4 py-2 bg-white border-2 border-[#FCE4A6] hover:bg-[#FEF9E6] disabled:opacity-50 text-xs font-black rounded-xl transition flex items-center gap-1"
                >
                  <Download size={13} strokeWidth={3} />
                  <span>Download Backup CSV</span>
                </button>
                <span className="text-xs font-black text-[#7A4B00] bg-white border-2 border-[#FCE4A6] px-3 py-2 rounded-xl">
                  {activeListStats.completedCount}/{activeListStats.totalCount} Acquired
                </span>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#FFE5EC] border-4 border-[#FFA6C9] rounded-2xl p-4">
                <span className="text-[10px] font-black uppercase text-[#8A2544] font-doodle-sans">List Total</span>
                <div className="text-3xl font-black text-[#8A2544] mt-1 font-doodle-serif leading-tight">₹{activeListStats.totalBudget.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-[#EAFDF8] border-4 border-[#A3F1DC] rounded-2xl p-4">
                <span className="text-[10px] font-black uppercase text-[#0B5A45] font-doodle-sans">Acquired Sum</span>
                <div className="text-3xl font-black text-[#0B5A45] mt-1 font-doodle-serif leading-tight">₹{activeListStats.spentAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-[#FFF0E6] border-4 border-[#FFD0B3] rounded-2xl p-4">
                <span className="text-[10px] font-black uppercase text-[#9A3412] font-doodle-sans">Remaining Need</span>
                <div className="text-3xl font-black text-[#9A3412] mt-1 font-doodle-serif leading-tight">₹{activeListStats.remainingAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-[#E8F0FE] border-4 border-[#B4CDFD] rounded-2xl p-4">
                <span className="text-[10px] font-black uppercase text-[#1E429F] font-doodle-sans">Progress Rate</span>
                <div className="text-3xl font-black text-[#1E429F] mt-1 font-doodle-serif leading-tight">{activeListStats.percentComplete}% done</div>
              </div>
            </div>

            <div className="bg-white border-4 border-zinc-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 font-doodle-sans">
              
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type="text"
                  placeholder="Filter elements..."
                  value={searchQuery}
                  onChange={(e) => persistSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF9F5] border-2 border-zinc-200 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-zinc-800 focus:outline-none focus:border-zinc-350 transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <div className="flex items-center gap-1.5 bg-[#FAF9F5] border-2 border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-bold">
                  <span className="text-zinc-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => persistSortBy(e.target.value)}
                    className="bg-transparent outline-none cursor-pointer font-black text-xs"
                  >
                    <option value="default">Import Order</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="alphabetical">Alphabetical A-Z</option>
                    <option value="completed">Incomplete First</option>
                  </select>
                </div>

                <div className="flex border-2 border-zinc-200 rounded-xl p-1 bg-zinc-50">
                  <button
                    onClick={() => persistViewMode('grid')}
                    className={'p-1 rounded-lg ' + (viewMode === 'grid' ? 'bg-[#FFE5EC] text-[#8A2544] border-2 border-[#FFA6C9]' : 'text-zinc-400')}
                  >
                    <Grid size={14} />
                  </button>
                  <button
                    onClick={() => persistViewMode('list')}
                    className={'p-1 rounded-lg ' + (viewMode === 'list' ? 'bg-[#FFE5EC] text-[#8A2544] border-2 border-[#FFA6C9]' : 'text-zinc-400')}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>

            </div>

            {activeListCategories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar font-doodle-sans">
                {activeListCategories.map((cat) => {
                  const count = cat === 'All' ? activeList.items.length : activeList.items.filter(i => i.category === cat).length;
                  const isSelected = activeCategory === cat;
                  return (
                    <div
                      key={cat}
                      className={'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all ' + (isSelected ? 'bg-[#FFE5EC] border-[#FFA6C9] text-[#8A2544]' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-55')}
                    >
                      <button
                        onClick={() => persistActiveCategory(cat)}
                        className="outline-none text-left"
                      >
                        {cat} <span className="ml-0.5 text-[10px] opacity-70">({count})</span>
                      </button>
                      {cat !== 'All' && (
                        <button
                          onClick={(e) => handleDeleteCategoryTrigger(cat, e)}
                          className="p-0.5 hover:bg-[#FFD1DC] rounded text-[#8A2544] transition-colors ml-1"
                          title={'Delete category "' + cat + '" and all its items'}
                        >
                          <X size={11} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              <div className="lg:col-span-3 space-y-6">
                
                {activeFilteredSortedItems.length === 0 ? (
                  <div className="bg-white border-4 border-dashed border-zinc-200 rounded-3xl p-12 text-center">
                    <span className="text-3xl">☕</span>
                    <h4 className="text-sm font-black text-zinc-800 mt-2 font-doodle-sans">No Matching Elements</h4>
                    <p className="text-xs text-zinc-500 mt-1 font-doodle-sans">Refine your search parameters or select different filters.</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-doodle-sans">
                    {activeFilteredSortedItems.map((item) => (
                      <div
                        key={item.id}
                        className={'bg-white border-4 border-[#FFA6C9] rounded-2xl p-5 flex flex-col justify-between h-56 transition-all ' + (item.completed ? 'bg-zinc-50 border-zinc-200 opacity-60' : 'hover:-translate-y-0.5')}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black uppercase bg-[#F3E8FF] text-[#5B21B6] border-2 border-[#D8B4FE] px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1 text-zinc-400 hover:text-zinc-800 transition"
                                title="Edit specs"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteItemFromActiveWorkspaceTrigger(item.id, item.name, e)}
                                className="p-1 text-zinc-400 hover:text-rose-500 transition"
                                title="Delete item"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>

                          <h4 className={'font-black text-xl text-zinc-900 tracking-tight leading-none line-clamp-2 ' + (item.completed ? 'line-through text-zinc-400 font-normal text-sm' : 'font-doodle-serif')}>
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-bold mt-1">
                            Brand/Platform: <span className="text-zinc-800">{item.brand || 'Generic'}</span>
                          </p>

                          <div className="mt-2 text-[10px] bg-[#FAF9F5] border border-zinc-200 p-2 rounded-lg line-clamp-2 text-zinc-600 leading-normal">
                            <strong className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-widest block mb-0.5">Specifications:</strong>
                            {item.spec}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-dashed border-zinc-200 mt-2 flex items-center justify-between">
                          <div>
                            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block">INR Cost</span>
                            <span className="text-lg font-extrabold text-zinc-950 font-doodle-serif leading-none">₹{item.price.toLocaleString('en-IN')}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.link && (
                              <button
                                onClick={(e) => handleUrlAccess(item.link, e)}
                                className="px-3 h-7 rounded-lg border-2 border-[#FFA6C9] bg-[#FFE5EC] text-[#8A2544] flex items-center justify-center gap-1 hover:bg-[#FFD1DC] transition font-black text-[10px] cursor-pointer"
                                title="Direct Access / Search"
                              >
                                <span>Shop</span>
                                <ExternalLink size={10} strokeWidth={2.5} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleItemCompletionToggle(item.id, e)}
                              className={'h-7 px-2 rounded-lg border-2 font-black text-[10px] flex items-center gap-1 transition ' + (item.completed ? 'bg-[#EAFDF8] border-[#A3F1DC] text-[#0B5A45]' : 'bg-white border-[#FFA6C9] hover:bg-zinc-50 text-[#8A2544]')}
                            >
                              {item.completed ? <CheckSquare size={10} strokeWidth={3} /> : <Square size={10} strokeWidth={3} />}
                              <span>{item.completed ? 'Acquired' : 'Got it'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  
                  <div className="bg-white border-4 border-[#FFA6C9] rounded-2xl overflow-hidden text-xs font-doodle-sans">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                          <tr className="bg-[#FFE5EC] border-b-2 border-[#FFA6C9] font-black text-[#8A2544]">
                            <th className="py-3 px-4 w-12 text-center">Buy</th>
                            <th className="py-3 px-4 font-doodle-serif text-2xl leading-none">Item Description</th>
                            <th className="py-3 px-4">Brand</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Spec Setup</th>
                            <th className="py-3 px-4 text-right">Price</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 font-doodle-sans">
                          {activeFilteredSortedItems.map((item) => (
                            <tr key={item.id} className={'hover:bg-[#FAF9F5] ' + (item.completed ? 'bg-zinc-50/75 opacity-60' : '')}>
                              <td className="py-3 px-4 text-center">
                                <button onClick={(e) => handleItemCompletionToggle(item.id, e)} className="focus:outline-none">
                                  {item.completed ? (
                                    <CheckSquare size={16} className="text-[#0B5A45]" strokeWidth={2.5} />
                                  ) : (
                                    <Square size={16} className="text-zinc-400 hover:text-[#8A2544]" strokeWidth={2.5} />
                                  )}
                                </button>
                              </td>
                              <td className={'py-3 px-4 font-bold text-zinc-900 ' + (item.completed ? 'line-through text-zinc-400 font-normal text-xs' : 'font-doodle-serif text-xl leading-none')}>{item.name}</td>
                              <td className="py-3 px-4 text-zinc-500">{item.brand}</td>
                              <td className="py-3 px-4">
                                <span className="bg-[#F3E8FF] border border-[#D8B4FE] text-[#5B21B6] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-zinc-400 max-w-xs truncate" title={item.spec}>{item.spec}</td>
                              <td className="py-3 px-4 text-right font-black text-zinc-800">₹{item.price.toLocaleString('en-IN')}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  {item.link && (
                                    <button
                                      onClick={(e) => handleUrlAccess(item.link, e)}
                                      className="px-2 py-1 rounded bg-[#FFE5EC] border-2 border-[#FFA6C9] text-[#8A2544] font-black text-[10px] hover:bg-[#FFD1DC] transition flex items-center gap-1 inline-flex cursor-pointer"
                                    >
                                      <span>Shop</span>
                                      <ExternalLink size={9} strokeWidth={3} />
                                    </button>
                                  )}
                                  <button onClick={() => setEditingItem(item)} className="p-1 text-zinc-400 hover:text-zinc-800">
                                    <Edit3 size={11} />
                                  </button>
                                  <button onClick={(e) => handleDeleteItemFromActiveWorkspaceTrigger(item.id, item.name, e)} className="p-1 text-zinc-400 hover:text-rose-500">
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>

              <div className="lg:col-span-1">
                <div className="bg-[#FFFDF9] border-4 border-[#FFA6C9] rounded-2xl p-5 sticky top-28 space-y-4 font-doodle-sans">
                  <h3 className="text-2xl font-black text-[#8A2544] flex items-center gap-1 font-doodle-serif leading-none">
                    <Plus size={16} strokeWidth={3} />
                    Insert Manual Item
                  </h3>

                  <form onSubmit={handleAddItemToActiveWorkspace} className="space-y-3 text-xs font-bold">
                    <div>
                      <label className="block text-zinc-500 uppercase mb-0.5">Item Title / Desc *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suede Heels"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        className="w-full bg-white border-2 border-zinc-200 rounded-xl px-3 py-1.5 text-zinc-800 focus:outline-none focus:border-[#FFA6C9] transition font-normal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-zinc-500 uppercase mb-0.5">Category *</label>
                        <input
                          type="text"
                          required
                          placeholder="Wardrobe"
                          value={newItem.category}
                          onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                          className="w-full bg-white border-2 border-zinc-200 rounded-xl px-3 py-1.5 text-zinc-800 focus:outline-none focus:border-[#FFA6C9] transition font-normal"
                          list="categories-list"
                        />
                        <datalist id="categories-list">
                          {activeListCategories.filter(c => c !== 'All').map(c => <option key={c} value={c} />)}
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-zinc-500 uppercase mb-0.5">Price (INR)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1500"
                          value={newItem.price}
                          onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                          className="w-full bg-white border-2 border-zinc-200 rounded-xl px-3 py-1.5 text-zinc-800 focus:outline-none focus:border-[#FFA6C9] transition font-normal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-500 uppercase mb-0.5">Brand / Platform</label>
                      <input
                        type="text"
                        placeholder="e.g. Minimalist"
                        value={newItem.brand}
                        onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                        className="w-full bg-white border-2 border-zinc-200 rounded-xl px-3 py-1.5 focus:border-[#FFA6C9] focus:outline-none font-normal"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-500 uppercase mb-0.5">Spec / Size config</label>
                      <textarea
                        placeholder="e.g. 100ml / Size L"
                        rows={2}
                        value={newItem.spec}
                        onChange={(e) => setNewItem({...newItem, spec: e.target.value})}
                        className="w-full bg-white border-2 border-zinc-200 rounded-xl px-3 py-1.5 resize-none focus:border-[#FFA6C9] focus:outline-none font-normal"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-500 uppercase mb-0.5">Direct Purchase Link</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newItem.link}
                        onChange={(e) => setNewItem({...newItem, link: e.target.value})}
                        className="w-full bg-white border-2 border-zinc-200 rounded-xl px-3 py-1.5 focus:border-[#FFA6C9] focus:outline-none font-normal"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#FFE5EC] border-2 border-[#FFA6C9] text-[#8A2544] rounded-xl font-black transition flex items-center justify-center gap-1"
                    >
                      <Plus size={14} strokeWidth={3} />
                      Insert Item
                    </button>
                  </form>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#FFA6C9] w-full max-w-2xl rounded-3xl p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto font-doodle-sans">
            
            <div className="flex items-center justify-between border-b-2 border-[#FFA6C9] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">📝</span>
                <h3 className="text-xl font-black text-[#8A2544] font-doodle-serif leading-none text-2xl">Generate Shopping Notebook</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-zinc-950 p-1.5 border-2 border-zinc-200 rounded-xl transition"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleCreateNewList} className="space-y-4 text-xs font-bold text-zinc-800">
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-zinc-500 uppercase mb-1">Notebook Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home Amenities, Wardrobe, Grocery Log"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFA6C9] font-normal"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase mb-1">Representative Emoji</label>
                  <select
                    value={newListEmoji}
                    onChange={(e) => setNewListEmoji(e.target.value)}
                    className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2.5 text-base text-center"
                  >
                    {EMOJIS.map(emoji => <option key={emoji} value={emoji}>{emoji}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 uppercase mb-1">Notebook Description</label>
                <input
                  type="text"
                  placeholder="e.g. My curated minimalist vanity elements and self-care essentials."
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2.5 focus:border-[#FFA6C9] focus:outline-none font-normal"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-500 uppercase">Optional: Paste plain CSV text here</label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewListTitle('Transformation');
                      setNewListDesc('Personal vanity records, micro-fiber outfits, jewelry, and hardware setup.');
                      setNewListEmoji('💄');
                      setNewListCsvText(SAMPLE_CSV_TRANSFORMATION);
                    }}
                    className="text-[10px] bg-[#FFE5EC] text-[#8A2544] px-2.5 py-1 rounded border-2 border-[#FFA6C9]"
                  >
                    Load Sample "Transformation" Data
                  </button>
                </div>
                <textarea
                  rows={6}
                  placeholder="Category,Item Description,Brand / Platform,Specific Size / Spec,Price (INR),Direct Purchase or Search Link&#10;Prep,Salicylic Acid 2% Cleanser,Minimalist,100ml,300,https://..."
                  value={newListCsvText}
                  onChange={(e) => setNewListCsvText(e.target.value)}
                  className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl p-3 font-mono text-[10px] leading-relaxed resize-none focus:border-[#FFA6C9] focus:outline-none font-normal"
                />
              </div>

              <div className="bg-[#FEF9E6] p-3 rounded-2xl border-2 border-[#FCE4A6] text-[10px] text-[#7A4B00] leading-relaxed">
                ℹ️ <strong>Intelligent Parsing:</strong> Paste spreadsheet rows containing comma-separated formats. We'll automatically build clean individual records complete with item metadata, estimated pricing, and web links.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-white hover:bg-zinc-50 border-2 border-zinc-200 px-4 py-2 rounded-xl text-zinc-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-[#EAFDF8] border-2 border-[#A3F1DC] hover:bg-[#D5FCF1] text-[#0B5A45] px-5 py-2 rounded-xl font-black"
                >
                  Generate Notebook
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-doodle-sans">
          <div className="bg-white border-4 border-[#FFA6C9] w-full max-w-md rounded-3xl p-6 relative animate-fadeIn text-xs font-bold">
            <div className="flex items-center justify-between border-b-2 border-[#FFA6C9] pb-3 mb-4">
              <h3 className="text-xl font-black text-[#8A2544] flex items-center gap-1.5 font-doodle-serif leading-none">
                <Edit3 size={15} />
                Edit Item Config
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-zinc-500 hover:text-zinc-950 p-1.5 border-2 border-zinc-200 rounded-xl"
              >
                <X size={12} />
              </button>
            </div>

            <form onSubmit={handleUpdateItemDetails} className="space-y-4 text-zinc-850">
              <div>
                <label className="block text-zinc-500 uppercase mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FFA6C9] font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFA6C9] font-normal"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 uppercase mb-1">Price (INR)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                    className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFA6C9] font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 uppercase mb-1">Brand / Platform</label>
                <input
                  type="text"
                  value={editingItem.brand}
                  onChange={(e) => setEditingItem({...editingItem, brand: e.target.value})}
                  className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2 focus:border-[#FFA6C9] font-normal"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase mb-1">Spec / Size config</label>
                <textarea
                  rows={2}
                  value={editingItem.spec}
                  onChange={(e) => setEditingItem({...editingItem, spec: e.target.value})}
                  className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2 resize-none focus:border-[#FFA6C9] font-normal"
                />
              </div>

              <div>
                <label className="block text-zinc-500 uppercase mb-1">Direct Link</label>
                <input
                  type="url"
                  value={editingItem.link}
                  onChange={(e) => setEditingItem({...editingItem, link: e.target.value})}
                  className="w-full bg-[#FFFDF9] border-2 border-zinc-200 rounded-xl px-3 py-2 focus:border-[#FFA6C9] font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-zinc-200 font-doodle-sans">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="bg-white hover:bg-zinc-50 text-zinc-500 border-2 border-zinc-200 px-4 py-2 rounded-xl"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-[#FFE5EC] border-2 border-[#FFA6C9] text-[#8A2544] px-5 py-2 rounded-xl font-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-doodle-sans">
          <div className="bg-[#FAF9F5] border-4 border-[#FFA6C9] max-w-sm w-full rounded-3xl p-6 relative animate-fadeIn text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-xl font-black text-zinc-900 font-doodle-serif leading-none">Confirm Deletion</h3>
            
            <p className="text-xs text-zinc-600 font-bold leading-normal">
              Are you absolutely sure you want to remove{' '}
              <span className="text-[#8A2544] underline font-black">"{deleteConfirmation.title}"</span>? 
              {deleteConfirmation.type === 'category' && " This will permanently wipe all items currently assigned to this category."}
              {deleteConfirmation.type === 'notebook' && " This will clear the entire notebook configuration."}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="w-1/2 py-2.5 bg-white border-2 border-zinc-200 rounded-xl font-black text-xs text-zinc-600 transition hover:bg-zinc-50"
              >
                No, Keep it
              </button>
              <button
                onClick={handleExecuteDeletion}
                className="w-1/2 py-2.5 bg-[#FFE5EC] border-2 border-[#FFA6C9] text-[#8A2544] font-black text-xs rounded-xl transition hover:bg-[#FFD1DC]"
              >
                Yes, Delete!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
