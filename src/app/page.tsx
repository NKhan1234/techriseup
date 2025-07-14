"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BookOpen, Bookmark, Plus } from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({ notes: 0, bookmarks: 0 });

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setStats({ notes: notes.length, bookmarks: bookmarks.length });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">
            Personal Notes & Bookmark Manager
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-semibold text-background">Notes</h2>
            </div>
            <p className="text-background mb-6">
              Create and organize your personal notes with tags for easy
              searching and filtering.
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-background">
                {stats.notes} notes saved
              </span>
            </div>
            <Link
              href="/notes"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Manage Notes
            </Link>
          </div>

          {/* Bookmarks Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Bookmark className="h-8 w-8 text-secondary mr-3" />
              <h2 className="text-2xl font-semibold text-accent">Bookmarks</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Save your favorite websites and resources with descriptions and
              tags for quick access.
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                {stats.bookmarks} bookmarks saved
              </span>
            </div>
            <Link
              href="/bookmarks"
              className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Manage Bookmarks
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-text mb-6">
            Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/notes?action=create"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Link>
            <Link
              href="/bookmarks?action=create"
              className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bookmark
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
