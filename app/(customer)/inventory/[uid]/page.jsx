"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Package2,
  Box,
  Briefcase,
  Save,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  MapPin,
  Calendar,
  Hash,
  PoundSterling,
} from "lucide-react";
import Link from "next/link";
import ApiKit from "@/common/ApiKit";
import toast from "react-hot-toast";

export default function InventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Boxes");
  const [inventory, setInventory] = useState(null);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [presetItems, setPresetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", value: "", comment: "" });
  const [showPreview, setShowPreview] = useState(false);

  // Fetch data from real APIs
  useEffect(() => {
    const fetchData = async () => {
      // Check if we have a valid UID
      if (!params.uid || params.uid === 'undefined') {
        console.error("Invalid inventory UID:", params.uid);
        router.push('/inventory');
        return;
      }

      try {
        // Fetch categories first (these should always work)
        const categoriesResponse = await ApiKit.me.inventory.getCategories();
        if (categoriesResponse.data) {
          const categoryList = Array.isArray(categoriesResponse.data) 
            ? categoriesResponse.data 
            : categoriesResponse.data.results || [];
          
          console.log("Categories received:", categoryList);
          console.log("Sample category structure:", categoryList[0]);
          setCategories(categoryList);
          
          // Set default category to first available or fallback
          if (categoryList.length > 0) {
            setSelectedCategory(categoryList[0].name);
          }
        }

        // Fetch preset items
        try {
          const presetResponse = await ApiKit.me.inventory.getPresetItems();
          if (presetResponse.data) {
            const presetList = Array.isArray(presetResponse.data) 
              ? presetResponse.data 
              : presetResponse.data.results || [];
            console.log("Preset items loaded:", presetList.length, "items");
            console.log("Sample preset item structure:", presetList[0]);
            setPresetItems(presetList);
          }
        } catch (presetError) {
          console.warn("Could not fetch preset items:", presetError);
          // Continue without preset items
        }

        // Fetch inventory details - this is critical
        try {
          console.log("Fetching inventory with UID:", params.uid);
          const inventoryResponse = await ApiKit.me.inventory.getList(params.uid);
          if (inventoryResponse.data) {
            console.log("Inventory details received:", inventoryResponse.data);
            console.log("Inventory structure:", Object.keys(inventoryResponse.data));
            console.log("Inventory ID/PK:", inventoryResponse.data.id || inventoryResponse.data.pk);
            setInventory(inventoryResponse.data);
          } else {
            throw new Error("Inventory not found - no data in response");
          }
        } catch (inventoryError) {
          console.error("Error fetching inventory:", inventoryError);
          console.error("Inventory error response:", inventoryError.response?.data);
          console.error("Inventory error status:", inventoryError.response?.status);
          
          // If inventory not found, redirect to inventory list
          if (inventoryError.response?.status === 404) {
            alert("Inventory not found. Redirecting to inventory list.");
            router.push('/inventory');
            return;
          }
          
          // Create a new inventory if it doesn't exist
          console.error("Error fetching inventory:", inventoryError);
          // Create a new inventory if it doesn't exist
          try {
            const newInventoryResponse = await ApiKit.me.inventory.createList({
              name: "New Inventory",
              description: "Add your items here"
            });
            if (newInventoryResponse.data && newInventoryResponse.data.uid) {
              // Redirect to the new inventory
              router.replace(`/inventory/${newInventoryResponse.data.uid}`);
              return;
            }
          } catch (createError) {
            console.error("Error creating new inventory:", createError);
            // Fallback: go back to inventory list
            router.push('/inventory');
            return;
          }
        }

        // Fetch items for this inventory
        try {
          const itemsResponse = await ApiKit.me.inventory.getItems(params.uid);
          if (itemsResponse.data) {
            const itemsList = Array.isArray(itemsResponse.data) 
              ? itemsResponse.data 
              : itemsResponse.data.results || [];
            
            // Add icons to items based on category
            const itemsWithIcons = itemsList.map(item => ({
              ...item,
              icon: getIconForCategory(item.category_name || item.category?.name)
            }));
            setItems(itemsWithIcons);
          }
        } catch (itemsError) {
          console.warn("Could not fetch items:", itemsError);
          // Continue with empty items list
          setItems([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        
        // Show all preset items if categories fail to load
        console.log("Using fallback - showing all preset items");
        
        // Fallback to default categories if API fails
      
        
        console.log("Using fallback categories:", fallbackCategories);
        setCategories(fallbackCategories);
        
        // Fallback inventory
        setInventory({
          uid: params.uid,
          name: "New Inventory",
          description: "Add your items here",
          is_completed: false
        });
        
        setItems([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.uid, router]);

  // Helper function to get appropriate icon for category
  const getIconForCategory = (categoryName) => {
    if (!categoryName) return Package2;
    const name = categoryName.toLowerCase();
    if (name.includes('box')) return Box;
    if (name.includes('suitcase') || name.includes('travel')) return Briefcase;
    if (name.includes('wardrobe')) return Package2;
    return Package2; // Default icon
  };

  // Get current category items
  const getCurrentCategoryItems = () => {
    const currentCategory = categories.find(cat => cat.name === selectedCategory);
    if (!currentCategory) return [];
    
    return items.filter(item => 
      item.category_name === selectedCategory || 
      item.category?.name === selectedCategory ||
      item.category === currentCategory.uid
    );
  };

  // Get preset items for current category (excluding those already added)
  const getPresetItemsForCategory = () => {
    const currentCategory = categories.find(cat => cat.name === selectedCategory);
    if (!currentCategory) {
      // Return empty if no category is selected
      return [];
    }
    
    // Filter preset items that belong to the currently selected category
    const filteredPresets = presetItems.filter(item => {
      // Match by category name (exact match)
      if (item.category_name === selectedCategory) {
        return true;
      }
      
      // Match by category ID (if available)
      if (item.category === currentCategory.id || item.category === currentCategory.pk) {
        return true;
      }
      
      // Match by category UID (if needed)
      if (item.category === currentCategory.uid) {
        return true;
      }
      
      // Case insensitive category name matching
      const itemCategoryLower = item.category_name?.toLowerCase() || '';
      const selectedCategoryLower = selectedCategory.toLowerCase();
      
      if (itemCategoryLower === selectedCategoryLower) {
        return true;
      }
      
      // Handle common typos in category names
      const normalizeCategory = (name) => {
        return name.toLowerCase()
          .replace(/boxs$/, 'boxes') // Handle "Boxs" -> "Boxes"
          .replace(/s$/, '') // Remove trailing 's' for matching
          .trim();
      };
      
      if (normalizeCategory(itemCategoryLower) === normalizeCategory(selectedCategoryLower)) {
        return true;
      }
      
      return false;
    });
    
    // Exclude preset items that are already added to inventory
    return filteredPresets.filter(presetItem => {
      const isAlreadyAdded = items.some(item => 
        item.preset_item === presetItem.id || 
        item.preset_item === presetItem.pk ||
        item.preset_item === presetItem.uid ||
        (item.name === presetItem.name && item.category_name === selectedCategory)
      );
      return !isAlreadyAdded;
    });
  };

  // Add new item with real API call
  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
    
    // Check if we have a valid inventory
    if (!params.uid || params.uid === 'undefined') {
      toast.error("Invalid inventory. Please go back and select a valid inventory.");
      return;
    }

    try {
      const currentCategory = categories.find(cat => cat.name === selectedCategory);
      if (!currentCategory) {
        console.error("No category found for:", selectedCategory);
        return;
      }

      console.log("Current category object:", currentCategory);
      console.log("Inventory object:", inventory);
      console.log("Inventory UID:", params.uid);
      
      // The backend expects primary key values (integers), not UUIDs
      // Let's check what fields are available and try different approaches
      const categoryId = currentCategory.id || currentCategory.pk || currentCategory.uid;
      const inventoryListPk = inventory?.id || inventory?.pk;

      const payload = {
        inventory_list: inventoryListPk,
        name: newItem.name,
        quantity: parseInt(newItem.quantity) || 1,
        value: parseFloat(newItem.value) || 0,
        comments: newItem.comment,
        category: categoryId
      };

      console.log("Adding item with payload:", payload);
      
      // Check if we have required fields
      if (!inventoryListPk) {
        throw new Error(`Could not determine inventory_list PK. Inventory data: ${JSON.stringify(inventory)}`);
      }
      if (!categoryId) {
        throw new Error(`Could not determine category PK. Category data: ${JSON.stringify(currentCategory)}`);
      }
      
      const response = await ApiKit.me.inventory.addItem(params.uid, payload);
      
      if (response.data) {
        const newItemWithIcon = {
          ...response.data,
          icon: getIconForCategory(response.data.category_name)
        };
        setItems([...items, newItemWithIcon]);
        setNewItem({ name: "", quantity: "", value: "", comment: "" });
      } else {
        console.error("No data in add item response:", response);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      
      // Show more detailed error message
      let errorMessage = "Error adding item. Please try again.";
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        console.log("Error response data:", errorData);
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData).map(([field, messages]) => {
            const messageArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${messageArray.join(', ')}`;
          });
          errorMessage = errorMessages.join('\n');
        } else {
          errorMessage = errorData.toString();
        }
      }
      toast.error(errorMessage);
    }
  };

  // Update item with real API call
  const handleUpdateItem = async (itemUid, updatedData) => {
    try {
      const payload = {
        ...updatedData,
        quantity: parseInt(updatedData.quantity) || 1,
        value: parseFloat(updatedData.value) || 0
      };

      await ApiKit.me.inventory.updateItem(params.uid, itemUid, payload);
      
      setItems(items.map(item => 
        item.uid === itemUid ? { ...item, ...updatedData } : item
      ));
    } catch (error) {
      console.error("Error updating item:", error);
      // Fallback to local state update
      setItems(items.map(item => 
        item.uid === itemUid ? { ...item, ...updatedData } : item
      ));
    }
  };

  // Delete item with real API call
  const handleDeleteItem = async (itemUid) => {
    // Find the item to determine the confirmation message
    const itemToDelete = items.find(item => item.uid === itemUid);
    const isPresetItem = itemToDelete && (itemToDelete.preset_item || itemToDelete.isPresetItem);
    
    const confirmMessage = isPresetItem 
      ? `Remove "${itemToDelete.name}" from your inventory? It will be available to add again from the preset items.`
      : `Are you sure you want to permanently delete "${itemToDelete?.name || 'this item'}"?`;
    
    if (confirm(confirmMessage)) {
      try {
        await ApiKit.me.inventory.deleteItem(params.uid, itemUid);
        setItems(items.filter(item => item.uid !== itemUid));
        
        // Show success message
        if (isPresetItem) {
          console.log(`Removed preset item "${itemToDelete.name}" from inventory. It's now available to add again.`);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error(`Error removing ${itemToDelete?.name || 'item'}. Please try again.`);
        // Don't do fallback update for failed deletions to maintain data integrity
      }
    }
  };

  // Handle preview - show modal with inventory summary
  const handlePreview = () => {
    const itemsWithQty = getItemsWithQuantities();
    if (itemsWithQty.length === 0) {
      toast.error("No items with quantities to preview. Please add quantities to items first.");
      return;
    }
    
    setShowPreview(true);
  };

  // Get items with quantities (for preview)
  const getItemsWithQuantities = () => {
    return items.filter(item => item.quantity && item.quantity > 0);
  };

  // Get items grouped by category for preview
  const getItemsByCategory = () => {
    const itemsWithQty = getItemsWithQuantities();
    const grouped = {};
    
    itemsWithQty.forEach(item => {
      const categoryName = item.category_name || item.category?.name || 'Other';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(item);
    });
    
    return grouped;
  };

  // Calculate total inventory value
  const getTotalInventoryValue = () => {
    return getItemsWithQuantities().reduce((total, item) => {
      return total + (parseFloat(item.value || 0) * parseInt(item.quantity || 0));
    }, 0);
  };

  // Handle save - mark inventory as completed
  const handleSave = async () => {
    try {
      // Update inventory to mark as completed
      const response = await ApiKit.me.inventory.updateList(params.uid, {
        is_completed: true,
        completed_at: new Date().toISOString()
      });
      
      if (response.data) {
        setInventory({
          ...inventory,
          is_completed: true,
          completed_at: new Date().toISOString()
        });
        toast.success("Inventory saved and marked as completed!");
      }
    } catch (error) {
      console.error("Error saving inventory:", error);
      toast.error("Error saving inventory. Please try again.");
    }
  };

  // Auto-save preset item when quantity is entered
  const handlePresetItemChange = async (presetItem, field, value) => {
    if (field === 'quantity' && value && value.trim() !== '' && parseInt(value) > 0) {
      // Check if this preset item is already added to avoid duplicates
      const existingItem = items.find(item => 
        item.preset_item === presetItem.id || 
        item.preset_item === presetItem.uid ||
        (item.name === presetItem.name && item.category_name === selectedCategory)
      );

      if (existingItem) {
        // Update existing item instead of creating new one
        try {
          const updatedData = {
            quantity: parseInt(value),
            value: parseFloat(presetItem.default_value) || existingItem.value || 0
          };
          
          await ApiKit.me.inventory.updateItem(params.uid, existingItem.uid, updatedData);
          
          setItems(items.map(item => 
            item.uid === existingItem.uid 
              ? { ...item, ...updatedData } 
              : item
          ));
          
          console.log(`Updated "${presetItem.name}" quantity to ${value}`);
        } catch (error) {
          console.error("Error updating existing preset item:", error);
          toast.error(`Error updating ${presetItem.name}. Please try again.`);
        }
        return;
      }        // Auto-save the preset item when quantity is filled (only if not already exists)
        try {
          const currentCategory = categories.find(cat => cat.name === selectedCategory);
          
          // Use integer PKs from the updated serializers
          const presetItemPk = presetItem?.id || presetItem?.pk;
          const categoryPk = currentCategory?.id || currentCategory?.pk || presetItem?.category;
          const inventoryListPk = inventory?.id || inventory?.pk;
        
        // Build payload with inventory_list field
        const payload = {
          inventory_list: inventoryListPk,
          name: presetItem.name,
          quantity: parseInt(value) || 1,
          value: parseFloat(presetItem.default_value) || 0,
          comments: "",
          category: categoryPk || presetItem.category
        };

        // Only add preset_item if we have its PK
        if (presetItemPk) {
          payload.preset_item = presetItemPk;
        }

        // Check if we have required fields
        if (!inventoryListPk) {
          throw new Error(`Could not determine inventory_list PK. Inventory data: ${JSON.stringify(inventory)}`);
        }
        if (!categoryPk && !presetItem.category) {
          throw new Error(`Could not determine category PK. Category data: ${JSON.stringify(currentCategory)}`);
        }
        
        const response = await ApiKit.me.inventory.addItem(params.uid, payload);
        
        if (response.data) {
          const newItemWithIcon = {
            ...response.data,
            icon: getIconForCategory(response.data.category_name),
            isPresetItem: true // Mark as preset item for UI purposes
          };
          setItems([...items, newItemWithIcon]);
          
          console.log(`Added "${presetItem.name}" to inventory with quantity ${value}`);
        }
      } catch (error) {
        console.error("Error auto-saving preset item:", error);
        console.error("Error response:", error.response?.data);
        
        // Show detailed error message
        let errorMessage = `Error saving ${presetItem.name}`;
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (typeof errorData === 'object') {
            const errorMessages = Object.entries(errorData).map(([field, messages]) => {
              const messageArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${messageArray.join(', ')}`;
            });
            errorMessage += `\n${errorMessages.join('\n')}`;
          } else {
            errorMessage += `\n${errorData}`;
          }
        } else if (error.message) {
          errorMessage += `\n${error.message}`;
        }
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
          <p className="text-xs text-gray-400 mt-2">UID: {params.uid}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex max-w-7xl mx-auto min-h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 p-6 flex-shrink-0 shadow-xl">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/inventory">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 rounded-lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lists
              </Button>
            </Link>
          </div>

          {/* Inventory Info */}
          {inventory && (
            <div className="mb-8 p-5 bg-gradient-to-br from-white/90 to-blue-50/90 rounded-xl border border-blue-200/50 shadow-lg backdrop-blur-sm">
              <h2 className="font-bold text-gray-900 text-lg mb-2">{inventory.name}</h2>
              <p className="text-sm text-gray-600 mb-3">{inventory.description}</p>
              <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold shadow-sm ${
                inventory.is_completed 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  inventory.is_completed ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></div>
                {inventory.is_completed ? 'Completed' : 'Draft'}
              </span>
            </div>
          )}

          {/* Category Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 px-2">Categories</h3>
            {categories.map((category) => (
              <Button
                key={category.uid}
                variant={selectedCategory === category.name ? "default" : "ghost"}
                className={`w-full justify-start text-left h-12 transition-all duration-300 ${
                  selectedCategory === category.name 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg transform scale-[1.02] border-0" 
                    : "text-gray-700 hover:bg-white/70 hover:text-gray-900 hover:shadow-md border border-transparent hover:border-gray-200"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="font-medium">{category.name}</span>
                <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold ${
                  selectedCategory === category.name 
                    ? "bg-white/20 text-blue-100" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {items.filter(item => 
                    item.category_name === category.name || 
                    item.category?.name === category.name ||
                    item.category === category.uid
                  ).length}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden h-full">
            {/* Category Header */}
            <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCategory}</h1>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">{getCurrentCategoryItems().length}</span> saved items • 
                <span className="font-semibold ml-1">{getPresetItemsForCategory().length}</span> preset items available
              </p>
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center text-sm text-blue-700">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs font-bold">💡</span>
                  </div>
                  <span className="font-medium">Enter quantity for any item to automatically save it to your inventory.</span>
                </div>
              </div>
            </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b bg-gradient-to-r from-gray-50/90 to-gray-100/90 text-sm font-bold text-gray-800 backdrop-blur-sm">
            <div className="col-span-4">Item Name</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Value (£)</div>
            <div className="col-span-3">Comments</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Items List */}
          <div className="divide-y">
            {/* Existing items for this category */}
            {getCurrentCategoryItems().map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.uid} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="col-span-4 flex items-center">
                    {/* Show image if it's a preset item with image, otherwise show icon */}
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="h-8 w-8 object-cover rounded mr-3"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'inline';
                        }}
                      />
                    ) : null}
                    <IconComponent className={`h-5 w-5 text-gray-400 mr-3 ${item.image_url ? 'hidden' : ''}`} />
                    <span className="text-gray-900">{item.name}</span>
                  </div>
                  <div className="col-span-2">
                    <Input 
                      placeholder="Qty"
                      value={item.quantity || ""}
                      onChange={(e) => handleUpdateItem(item.uid, { quantity: e.target.value })}
                      className="border-0 bg-transparent shadow-none p-0 h-8 focus-visible:ring-0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      placeholder="Value"
                      value={item.value || ""}
                      onChange={(e) => handleUpdateItem(item.uid, { value: e.target.value })}
                      className="border-0 bg-transparent shadow-none p-0 h-8 focus-visible:ring-0"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input 
                      placeholder="Comment"
                      value={item.comments || ""}
                      onChange={(e) => handleUpdateItem(item.uid, { comments: e.target.value })}
                      className="border-0 bg-transparent shadow-none p-0 h-8 focus-visible:ring-0"
                    />
                  </div>
                  <div className="col-span-1">
                    {/* Show check/clear icon for preset items, delete icon for custom items */}
                    {item.preset_item || item.isPresetItem ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Actually delete the preset item from database and UI
                          handleDeleteItem(item.uid);
                        }}
                        className={`p-1 ${
                          (item.quantity && item.quantity > 0) 
                            ? "text-green-500 hover:text-green-700" 
                            : "text-red-500 hover:text-red-700"
                        }`}
                        title={
                          (item.quantity && item.quantity > 0) 
                            ? "Remove preset item from inventory" 
                            : "Remove preset item from inventory"
                        }
                      >
                        {(item.quantity && item.quantity > 0) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.uid)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete custom item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Preset items as editable rows for the selected category */}
            {getPresetItemsForCategory().map((presetItem) => (
              <div key={`preset-${presetItem.uid}`} className="grid grid-cols-12 gap-4 px-6 py-4 bg-blue-50 hover:bg-blue-100">
                <div className="col-span-4 flex items-center">
                  {presetItem.image_url ? (
                    <img 
                      src={presetItem.image_url} 
                      alt={presetItem.name}
                      className="h-8 w-8 object-cover rounded mr-3"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline';
                      }}
                    />
                  ) : (
                    <Package2 className="h-5 w-5 text-blue-600 mr-3" />
                  )}
                  <span className="text-gray-900 font-medium">{presetItem.name}</span>
                </div>
                <div className="col-span-2">
                  <Input 
                    placeholder="Qty"
                    onChange={(e) => handlePresetItemChange(presetItem, 'quantity', e.target.value)}
                    className="border-0 bg-white shadow-none p-0 h-8 focus-visible:ring-0"
                  />
                </div>
                <div className="col-span-2">
                  <Input 
                    placeholder="Value"
                    defaultValue={presetItem.default_value || ""}
                    onChange={(e) => handlePresetItemChange(presetItem, 'value', e.target.value)}
                    className="border-0 bg-white shadow-none p-0 h-8 focus-visible:ring-0"
                  />
                </div>
                <div className="col-span-3">
                  <Input 
                    placeholder="Comment"
                    onChange={(e) => handlePresetItemChange(presetItem, 'comments', e.target.value)}
                    className="border-0 bg-white shadow-none p-0 h-8 focus-visible:ring-0"
                  />
                </div>
                <div className="col-span-1">
                  {/* No action button needed - auto-saves when quantity is entered */}
                </div>
              </div>
            ))}

            {/* Add New Custom Item Row */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50">
              <div className="col-span-4">
                <Input 
                  placeholder="Add custom item name..."
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="border-0 bg-transparent shadow-none p-0 h-8 focus-visible:ring-0"
                />
              </div>
              <div className="col-span-2">
                <Input 
                  placeholder="Qty"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="border-0 bg-transparent shadow-none p-0 h-8 focus-visible:ring-0"
                />
              </div>
              <div className="col-span-2">
                <Input 
                  placeholder="Value"
                  value={newItem.value}
                  onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                  className="border-0 bg-transparent shadow-none p-0 h-8 focus-visible:ring-0"
                />
              </div>
              <div className="col-span-3">
                <Input 
                  placeholder="Comment"
                  value={newItem.comment}
                  onChange={(e) => setNewItem({ ...newItem, comment: e.target.value })}
                  className="border-0 bg-transparent shadow-none p-0 h-8 focus-visible:ring-0"
                />
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddItem}
                  disabled={!newItem.name.trim()}
                  className="text-green-600 hover:text-green-700 p-1"
                  title="Add custom item"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Add Item Button */}
          <div className="px-6 py-4">
            <Button 
              onClick={handleAddItem}
              disabled={!newItem.name.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm space-y-4">
            <Button 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold h-14 text-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02]"
            >
              <Save className="h-5 w-5 mr-3" />
              Save & Complete Inventory
            </Button>
            <Button 
              onClick={handlePreview}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-16 text-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.02]"
            >
              <Eye className="h-6 w-6 mr-3" />
              VIEW INVENTORY LIST ({getItemsWithQuantities().length} items)
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        {/* Dark background overlay */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/80 z-40" />
        )}
        
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden z-50">
          <DialogHeader className="print:hidden">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* MovMonkey Logo - Full Size */}
                <img 
                  src="/_next/static/media/logo.d83fe626.svg" 
                  alt="MovMonkey Logo" 
                  className="max-h-16 w-auto object-contain"
                />
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-blue-600" />
                  <span>Inventory List</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2"
                >
                  Close
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
            {/* Print Header */}
            <div className="hidden print:block mb-8 text-center border-b-2 border-gray-800 pb-4">
              {/* MovMonkey Logo for Print - Full Size */}
              <div className="flex justify-center mb-6">
                <img 
                  src="/_next/static/media/logo.d83fe626.svg" 
                  alt="MovMonkey Logo" 
                  className="max-h-24 w-auto object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MovMonkey - INVENTORY LIST</h1>
              <div className="text-lg text-gray-700">
                <p><strong>{inventory?.name}</strong></p>
                <p>{inventory?.description}</p>
                <p className="text-sm mt-2">Generated on: {new Date().toLocaleDateString()} | Total Items: {getItemsWithQuantities().length} | Total Value: £{getTotalInventoryValue().toFixed(2)}</p>
              </div>
            </div>

            {/* Traditional Inventory Table */}
            <div className="bg-white">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">#</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Item Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Quantity</th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">Unit Value (£)</th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">Total Value (£)</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {getItemsWithQuantities().map((item, index) => (
                    <tr key={item.uid || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700 font-medium">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="h-10 w-10 object-cover rounded border border-gray-200 print:hidden"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center border border-gray-200 print:hidden">
                              <Package2 className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            {item.preset_item && (
                              <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium print:hidden">
                                Preset
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">
                        {item.category_name || item.category?.name || 'Other'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                        {parseFloat(item.value || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                        {(parseFloat(item.value || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700 text-sm">
                        {item.comments || '-'}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Total Row */}
                  <tr className="bg-gray-200 font-bold">
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3 font-bold text-gray-900">TOTAL</td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-900">
                      {getItemsWithQuantities().reduce((total, item) => total + parseInt(item.quantity || 0), 0)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900 text-lg">
                      £{getTotalInventoryValue().toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Info for Print */}
            <div className="hidden print:block mt-8 border-t-2 border-gray-800 pt-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-2">Inventory Summary</h3>
                  <p><strong>Total Items:</strong> {getItemsWithQuantities().length}</p>
                  <p><strong>Categories:</strong> {Object.keys(getItemsByCategory()).length}</p>
                  <p><strong>Total Value:</strong> £{getTotalInventoryValue().toFixed(2)}</p>
                  <p><strong>Status:</strong> {inventory?.is_completed ? 'Completed' : 'Draft'}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg mb-2">Signatures</h3>
                  <div className="border-b border-gray-400 mb-4 pb-1">Prepared by: ________________________</div>
                  <div className="border-b border-gray-400 mb-4 pb-1">Verified by: ________________________</div>
                  <div className="border-b border-gray-400 pb-1">Date: ________________________</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
