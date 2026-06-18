
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

// Pre-seeded sample data formatted as an array to prevent backtick copy-paste corruption on mobile
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
    if (!activeList) return [];
    const cats = new Set(activeList.items.map(i => i.category));
    return ['All', ...Array.from(cats)];
  }, [activeList]);
