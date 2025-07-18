"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import ApiKit from "@/common/ApiKit";

export default function InventoryListPage() {
  const router = useRouter();
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch inventories from real API
  const fetchInventories = async () => {
    try {
      const response = await ApiKit.me.inventory.getLists();
      
      if (response.data && response.data.results) {
        setInventories(response.data.results);
      } else if (response.data && Array.isArray(response.data)) {
        setInventories(response.data);
      } else {
        console.log("Unexpected API response structure:", response);
        setInventories([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      // Fallback to empty array on error
      setInventories([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const filteredInventories = inventories.filter(inventory =>
    inventory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inventory.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = async () => {
    try {
      // Show loading state
      setLoading(true);
      
      const timestamp = new Date();
      const uniqueId = Date.now(); // Add a unique timestamp to make it easier to find
      const payload = {
        name: `Inventory ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()} (${uniqueId})`,
        description: "New inventory list"
      };
      
      const response = await ApiKit.me.inventory.createList(payload);
      
      // Check if we got a UID in the response
      let inventoryUid = null;
      if (response && response.data) {
        inventoryUid = response.data.uid || response.data.id;
      }
      
      if (inventoryUid) {
        // Navigate to the new inventory detail page
        router.push(`/inventory/${inventoryUid}`);
      } else {
        // Backend didn't return UID, so fetch all lists to find the new one
        try {
          // Wait a moment for the backend to process
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const listsResponse = await ApiKit.me.inventory.getLists();
          
          if (listsResponse && listsResponse.data) {
            let inventoryList = [];
            if (listsResponse.data.results) {
              inventoryList = listsResponse.data.results;
            } else if (Array.isArray(listsResponse.data)) {
              inventoryList = listsResponse.data;
            }
            
            // Find the newly created list by the unique name
            const newList = inventoryList.find(list => 
              list.name === payload.name || 
              list.name.includes(uniqueId.toString())
            );
            
            if (newList && (newList.uid || newList.id)) {
              const foundUid = newList.uid || newList.id;
              router.push(`/inventory/${foundUid}`);
              return;
            }
          }
          
          // If we couldn't find the new list, just refresh the current page
          fetchInventories();
          alert("Inventory created successfully! The page will refresh to show the new list.");
          
        } catch (fetchError) {
          console.error("Error fetching updated lists:", fetchError);
          alert("Inventory may have been created, but there was an error loading the updated list. Please refresh the page.");
        }
      }
    } catch (error) {
      console.error("Error creating inventory:", error);
      
      // Show more detailed error information
      let errorMessage = "Unknown error occurred";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message || "Unknown error";
      }
      
      alert(`Error creating inventory: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uid) => {
    if (confirm("Are you sure you want to delete this inventory?")) {
      try {
        await ApiKit.me.inventory.deleteList(uid);
        setInventories(inventories.filter(inv => inv.uid !== uid));
      } catch (error) {
        console.error("Error deleting inventory:", error);
        // Still remove from UI even if API call fails
        setInventories(inventories.filter(inv => inv.uid !== uid));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage your moving inventories and track your items</p>
        </div>

        {/* Search and Create Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search inventories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Inventory
            </Button>
          </div>
        </div>

        {/* Inventories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventories.map((inventory) => (
            <div key={inventory.uid} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{inventory.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      inventory.is_completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inventory.is_completed ? 'Completed' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{inventory.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items:</span>
                  <span className="font-medium">{inventory.total_items || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Value:</span>
                  <span className="font-medium">${(inventory.total_value || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">{new Date(inventory.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link href={`/inventory/${inventory.uid}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Link href={`/inventory/${inventory.uid}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(inventory.uid)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInventories.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No inventories found" : "No inventories yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Get started by creating your first inventory"
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create New Inventory
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
