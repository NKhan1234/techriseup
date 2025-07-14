"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Tag,
  Calendar,
  ExternalLink,
  Globe,
} from "lucide-react";
import Link from "next/link";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarks") || "[]"
    );
    setBookmarks(savedBookmarks);
  };

  const saveBookmarks = (updatedBookmarks: Bookmark[]) => {
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchPageTitle = async (url: string) => {
    if (!isValidUrl(url)) return "";

    setIsLoadingTitle(true);
    try {
      const domain = new URL(url).hostname;
      return domain.replace("www.", "").split(".")[0];
    } catch {
      return "";
    } finally {
      setIsLoadingTitle(false);
    }
  };

  const handleUrlChange = async (url: string) => {
    setFormData({ ...formData, url });

    if (isValidUrl(url) && !formData.title) {
      const title = await fetchPageTitle(url);
      if (title) {
        setFormData((prev) => ({
          ...prev,
          title: title.charAt(0).toUpperCase() + title.slice(1),
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!isValidUrl(formData.url)) {
      alert("Please enter a valid URL");
      return;
    }

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const now = new Date().toISOString();

    if (editingBookmark) {
      const updatedBookmarks = bookmarks.map((bookmark) =>
        bookmark.id === editingBookmark.id
          ? { ...bookmark, ...formData, tags, updatedAt: now }
          : bookmark
      );
      saveBookmarks(updatedBookmarks);
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        title: formData.title,
        url: formData.url,
        description: formData.description,
        tags,
        createdAt: now,
        updatedAt: now,
      };
      saveBookmarks([...bookmarks, newBookmark]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: "", url: "", description: "", tags: "" });
    setShowForm(false);
    setEditingBookmark(null);
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      tags: bookmark.tags.join(", "),
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bookmark?")) {
      const updatedBookmarks = bookmarks.filter(
        (bookmark) => bookmark.id !== id
      );
      saveBookmarks(updatedBookmarks);
    }
  };

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => bookmark.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = [...new Set(bookmarks.flatMap((bookmark) => bookmark.tags))];

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">My Bookmarks</h1>
            <p className="text-text">Save and organize your favorite links</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Link
              href="/"
              className="px-4 py-2 text-accent hover:text-accent/90 transition-colors"
            >
              ← Back to Home
            </Link>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-accent text-secondary rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Bookmark
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-accent text-secondary"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {editingBookmark ? "Edit Bookmark" : "Add New Bookmark"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    {isLoadingTitle && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Brief description of this bookmark..."
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="work, tools, reference"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent text-secondary rounded-md hover:bg-accent/90 transition-colors"
                  >
                    {editingBookmark ? "Update" : "Add"} Bookmark
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 flex-1">
                    {bookmark.title}
                  </h3>
                  <div className="flex gap-1 ml-2">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleEdit(bookmark)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="truncate">
                    {new URL(bookmark.url).hostname}
                  </span>
                </div>

                {bookmark.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {bookmark.description}
                  </p>
                )}

                {bookmark.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bookmark.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(bookmark.updatedAt).toLocaleDateString()}
                  </div>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    Visit
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookmarks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Globe className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {bookmarks.length === 0
                ? "No bookmarks yet"
                : "No bookmarks found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {bookmarks.length === 0
                ? "Add your first bookmark to get started"
                : "Try adjusting your search or filter criteria"}
            </p>
            {bookmarks.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-accent text-secondary rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bookmark
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
