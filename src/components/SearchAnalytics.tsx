"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductInfo {
    name: string;
    brand?: string;
    slug: string;
}

interface SearchAnalytic {
    term: string;
    count: number;
    lastSearched: string;
    totalResults: number;
    products?: ProductInfo[];
}

/**
 * Admin dashboard to view search analytics
 */
const SearchAnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState<SearchAnalytic[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics/search');
            const data = await response.json();
            setAnalytics(data.analytics || []);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (term: string) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(term)) {
                next.delete(term);
            } else {
                next.add(term);
            }
            return next;
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    const totalSearches = analytics.reduce((sum, item) => sum + item.count, 0);
    const avgResults = analytics.length > 0
        ? Math.round(analytics.reduce((sum, item) => sum + item.totalResults, 0) / analytics.length)
        : 0;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Search Analytics</h2>
                <button
                    onClick={fetchAnalytics}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalSearches}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Unique Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{analytics.length}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{avgResults}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search Terms Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Search Terms</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 w-8"></th>
                                        <th className="text-left py-3 px-4">Search Term</th>
                                        <th className="text-left py-3 px-4">Times Searched</th>
                                        <th className="text-left py-3 px-4">Results</th>
                                        <th className="text-left py-3 px-4">Last Searched</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <tr className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    {item.products && item.products.length > 0 && (
                                                        <button
                                                            onClick={() => toggleRow(item.term)}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            {expandedRows.has(item.term) ? (
                                                                <ChevronUp size={16} />
                                                            ) : (
                                                                <ChevronDown size={16} />
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-medium">{item.term}</td>
                                                <td className="py-3 px-4">{item.count}</td>
                                                <td className="py-3 px-4">
                                                    {Math.round(item.totalResults)}
                                                    {item.totalResults === 0 && (
                                                        <span className="ml-2 text-xs text-red-500">
                                                            (No results)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-500">
                                                    {new Date(item.lastSearched).toLocaleDateString()}
                                                </td>
                                            </tr>
                                            {expandedRows.has(item.term) && item.products && item.products.length > 0 && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={5} className="py-3 px-4">
                                                        <div className="ml-8">
                                                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                                                Products Found ({item.products.length}):
                                                            </p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {item.products.map((product, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-start gap-2 p-2 bg-white rounded border"
                                                                    >
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-medium truncate">
                                                                                {product.name}
                                                                            </p>
                                                                            {product.brand && (
                                                                                <p className="text-xs text-gray-500">
                                                                                    {product.brand}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        <a
                                                                            href={`/products/${product.slug}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-xs text-blue-500 hover:text-blue-700 whitespace-nowrap"
                                                                        >
                                                                            View →
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center py-8 text-gray-500">
                            No search data yet. Searches will appear here as users search your site.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Zero-Result Searches */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-red-600">
                        Searches with No Results
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics.filter(item => item.totalResults === 0).length > 0 ? (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 mb-4">
                                These searches returned no results. Consider adding products for these terms:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {analytics
                                    .filter(item => item.totalResults === 0)
                                    .map((item, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                                        >
                                            {item.term} ({item.count}x)
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center py-8 text-gray-500">
                            Great! All searches are returning results.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SearchAnalyticsDashboard;