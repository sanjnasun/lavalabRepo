import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { Search } from 'lucide-react';
import redImg from '../images/red.png';
import blackImg from '../images/black.png';
import whiteImg from '../images/white.png';


const inventory = [
  { id: 1, name: "Gildan T-Shirt - Red / M", quantity: 13, color: "red", size: "M", type: "T-Shirt" },
  { id: 2, name: "Gildan T-Shirt - Red / L", quantity: 46, color: "red", size: "L", type: "T-Shirt" },
  { id: 3, name: "Gildan T-Shirt - Black / S", quantity: 21, color: "black", size: "S", type: "T-Shirt" },
  { id: 4, name: "Gildan T-Shirt - Black / M", quantity: 34, color: "black", size: "M", type: "T-Shirt" },
  { id: 5, name: "Gildan T-Shirt - Black / L", quantity: 27, color: "black", size: "L", type: "T-Shirt" },
  { id: 6, name: "Gildan T-Shirt - White / S", quantity: 34, color: "white", size: "S", type: "T-Shirt" },
  { id: 7, name: "Gildan T-Shirt - White / M", quantity: 51, color: "white", size: "M", type: "T-Shirt" },
  { id: 8, name: "Gildan T-Shirt - White / L", quantity: 29, color: "white", size: "L", type: "T-Shirt" },
];

export default function Inventory() {
  const LOW_STOCK_THRESHOLD = 24;
  const [inventoryState, setInventoryState] = useState(inventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    colors: [],
    sizes: [],
    stock: null,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    type: "T-Shirt",
    color: "white",
    size: "M",
    currentStock: 0,
    requiredStock: 24,
    image: null,
  });


  const filteredInventory = inventoryState.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesColor =
      activeFilters.colors.length === 0 ||
      activeFilters.colors.includes(item.color);
    const matchesSize =
      activeFilters.sizes.length === 0 ||
      activeFilters.sizes.includes(item.size);
    const matchesStock =
      !activeFilters.stock ||
      (activeFilters.stock === "low"
        ? item.quantity <= LOW_STOCK_THRESHOLD
        : item.quantity > LOW_STOCK_THRESHOLD);

    return matchesSearch && matchesColor && matchesSize && matchesStock;
  });

  const sortedInventory = sortOrder
    ? [...filteredInventory].sort((a, b) => {
        if (sortOrder === "name") return a.name.localeCompare(b.name);
        if (sortOrder === "quantity") return a.quantity - b.quantity;
        if (sortOrder === "color") return a.color.localeCompare(b.color);
        if (sortOrder === "size") return a.size.localeCompare(b.size);
        return 0;
      })
    : filteredInventory;

  const isLowStock = (quantity) => quantity <= LOW_STOCK_THRESHOLD;

  const updateQuantity = (id, increment) => {
    setInventoryState((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + increment) } : item
      )
    );
  };

  const handleAddItem = () => {
    const newId = Math.max(...inventoryState.map((item) => item.id)) + 1;

    let finalImage = newItem.image;

    if (!finalImage) {
      if (newItem.color === "red") finalImage = redImg;
      if (newItem.color === "black") finalImage = blackImg;
      if (newItem.color === "white") finalImage = whiteImg;
    }

    const formattedItem = {
      id: newId,
      type: newItem.type,
      color: newItem.color,
      size: newItem.size,
      name: `Gildan ${newItem.type} - ${
        newItem.color.charAt(0).toUpperCase() + newItem.color.slice(1)
      } / ${newItem.size}`,
      quantity: parseInt(newItem.currentStock) || 0,
      requiredStock: parseInt(newItem.requiredStock) || 24,
      image: finalImage, // ✅ keeps uploaded one if exists
    };

    setInventoryState((prev) => [...prev, formattedItem]);
    setShowAddModal(false);

    // Reset
    setNewItem({
      type: "T-Shirt",
      color: "white",
      size: "M",
      currentStock: 0,
      requiredStock: 24,
      image: null,
    });
  };



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setNewItem((prev) => ({ ...prev, image: file }));
  };

  const getColorIcon = (color) => {
    if (color === "red") return redImg;
    if (color === "black") return blackImg;
    if (color === "white") return whiteImg;
    return null; // fallback
  };


  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: 'Uncut Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">



           <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <button className="hover:underline">
              <h1 className="text-2xl font-semibold text-gray-900">Materials</h1>
            </button>
            <span className="text-gray-400 text-xl">/</span>
            <button className="hover:underline">
              <span className="text-2xl font-normal text-gray-400">Blanks</span>
            </button>
          </div>
          <div className="ml-50 rounded-xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200 p-1">
            <button className="px-6 py-2.5 bg-white text-gray-900 font-medium border-r border-gray-200 rounded-l-lg">
              Inventory
            </button>
            <button className="px-6 py-2.5 text-gray-500 font-medium hover:bg-white hover:text-gray-900 transition-all duration-200 rounded-r-lg">
              Order Queue
            </button>
          </div>
        </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 lg:w-100/95 bg-white rounded-1.75xl border border-gray-200 overflow-hidden shadow-md">
            {/* Controls */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-bg">
                      ⌕
                    </span>
                    <input
                      type="text"
                      placeholder="Search Materials"
                      className="w-80 pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>


                  <button
                    className="px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                    onClick={() => setSortOrder(sortOrder ? "" : "name")}
                  >
                    ≡
                  </button>

                  <div className="relative">
                    <button
                      className="px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      ⇅
                    </button>
                    {showFilters && (
                      <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px] z-10">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-sm">Filters</h3>
                          <button
                            onClick={() => setActiveFilters({ colors: [], sizes: [], stock: null })}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2 text-sm">Colors</h3>
                            {["red", "black", "white"].map((color) => (
                              <label key={color} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={activeFilters.colors.includes(color)}
                                  onChange={(e) => {
                                    setActiveFilters((prev) => ({
                                      ...prev,
                                      colors: e.target.checked
                                        ? [...prev.colors, color]
                                        : prev.colors.filter((c) => c !== color),
                                    }));
                                  }}
                                />
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                              </label>
                            ))}
                          </div>
                          <div>
                            <h3 className="font-medium mb-2 text-sm">Sizes</h3>
                            {["S", "M", "L"].map((size) => (
                              <label key={size} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={activeFilters.sizes.includes(size)}
                                  onChange={(e) => {
                                    setActiveFilters((prev) => ({
                                      ...prev,
                                      sizes: e.target.checked
                                        ? [...prev.sizes, size]
                                        : prev.sizes.filter((s) => s !== size),
                                    }));
                                  }}
                                />
                                {size}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="px-6 py-2.5 text-white text-sm font-medium transition-colors rounded-lg hover:opacity-90"
                  style={{ backgroundColor: '#444EAA' }}
                  onClick={() => setShowAddModal(true)}
                >
                  + Add New
                </button>
              </div>
            </div>

            <div >
              {sortedInventory.map((item) => (
                <div
                  key={item.id}
                  className="p-2 pl-5 flex items-center justify-between "
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-8 h-8">
                      {getColorIcon(item.color) ? (
                        <img
                          src={getColorIcon(item.color)}
                          alt={item.color}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex border border-gray-400 rounded-md overflow-hidden h-16">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-12 h-16 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-500 text-xl font-light"
                        disabled={item.quantity <= 0}
                        style={{ lineHeight: '1' }}
                      >
                        −
                      </button>

                      <div
                        className="flex flex-col"
                        style={{
                          borderLeft: `1px solid ${isLowStock(item.quantity) ? '#C19A4D' : '#D1D5DB'}`,
                          borderRight: `1px solid ${isLowStock(item.quantity) ? '#C19A4D' : '#D1D5DB'}`,
                        }}
                      >
                        <div
                          className="px-8 py-2 flex items-center justify-center min-w-[100px]"
                          style={{
                            backgroundColor: isLowStock(item.quantity) ? '#FAF2E3' : 'white',
                          }}
                        >
                          <span className="text-xl font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                        </div>
                        <div
                          className="px-8 py-0.5 flex items-center justify-center"
                          style={{
                            backgroundColor: isLowStock(item.quantity) ? '#C19A4D' : '#f3f4f6',
                          }}
                        >
                          <span
                            className={`text-xs font-medium ${
                              isLowStock(item.quantity) ? 'text-white' : 'text-gray-600'
                            }`}
                          >
                            {LOW_STOCK_THRESHOLD} PCS
                          </span>
                        </div>
                      </div>


                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-12 h-16 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-500 text-xl font-light"
                        style={{ lineHeight: '1' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-[480px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Item</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Type
                    </label>
                    <select
                      value={newItem.type}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, type: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="T-Shirt">T-Shirt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <select
                      value={newItem.color}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, color: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="white">White</option>
                      <option value="red">Red</option>
                      <option value="black">Black</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <select
                      value={newItem.size}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, size: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      value={newItem.currentStock}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, currentStock: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Stock
                    </label>
                    <input
                      type="number"
                      value={newItem.requiredStock}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, requiredStock: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setNewItem((prev) => ({
                            ...prev,
                            image: URL.createObjectURL(file), // store a temporary URL
                          }));
                        }
                      }}
                    />

                  </div>

                  <button
                    onClick={handleAddItem}
                    className="w-full text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#444EAA' }}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}