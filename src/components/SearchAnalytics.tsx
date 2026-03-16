"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from "recharts";
import {
    TrendingUp, Search, AlertCircle, Package,
    Clock, Users, Target, Activity
} from "lucide-react";

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

const SearchAnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState<SearchAnalytic[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading analytics...</p>
                </div>
            </div>
        );
    }

    // Calculate metrics
    const totalSearches = analytics.reduce((sum, item) => sum + item.count, 0);
    const uniqueTerms = analytics.length;
    const avgResults = analytics.length > 0
        ? Math.round(analytics.reduce((sum, item) => sum + item.totalResults, 0) / analytics.length)
        : 0;
    const zeroResultSearches = analytics.filter(item => item.totalResults === 0);
    const successRate = analytics.length > 0
        ? Math.round(((analytics.length - zeroResultSearches.length) / analytics.length) * 100)
        : 100;

    // Top 10 searches for bar chart
    const topSearches = analytics.slice(0, 10).map(item => ({
        term: item.term.length > 15 ? item.term.substring(0, 15) + '...' : item.term,
        searches: item.count,
        results: item.totalResults,
    }));

    // Search distribution by results count
    const resultDistribution = [
        { name: '0 Results', value: analytics.filter(a => a.totalResults === 0).length },
        { name: '1-5 Results', value: analytics.filter(a => a.totalResults > 0 && a.totalResults <= 5).length },
        { name: '6-20 Results', value: analytics.filter(a => a.totalResults > 5 && a.totalResults <= 20).length },
        { name: '20+ Results', value: analytics.filter(a => a.totalResults > 20).length },
    ];

    // Trend data (last 7 days mock - in production, track daily)
    const trendData = analytics.slice(0, 7).reverse().map((item, index) => ({
        date: new Date(item.lastSearched).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        searches: item.count,
    }));

    const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Search Analytics</h1>
                        <p className="text-sm text-gray-500 mt-1">Track and optimize your store's search performance</p>
                    </div>
                    <button
                        onClick={fetchAnalytics}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Activity className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Total Searches</span>
                                <span className="sm:hidden">Searches</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-3xl font-bold text-gray-900">{totalSearches.toLocaleString()}</div>
                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">All time searches</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Unique Terms</span>
                                <span className="sm:hidden">Terms</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-3xl font-bold text-gray-900">{uniqueTerms}</div>
                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">Different queries</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Avg Results</span>
                                <span className="sm:hidden">Results</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-3xl font-bold text-gray-900">{avgResults}</div>
                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">Per search</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Success Rate</span>
                                <span className="sm:hidden">Success</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-3xl font-bold text-gray-900">{successRate}%</div>
                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">With results</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
                    <TabsList className="grid w-full grid-cols-4 gap-1">
                        <TabsTrigger value="overview" className="text-xs sm:text-sm">
                            <span className="hidden sm:inline">Overview</span>
                            <span className="sm:hidden">📊</span>
                        </TabsTrigger>
                        <TabsTrigger value="trends" className="text-xs sm:text-sm">
                            <span className="hidden sm:inline">Trends</span>
                            <span className="sm:hidden">📈</span>
                        </TabsTrigger>
                        <TabsTrigger value="products" className="text-xs sm:text-sm">
                            <span className="hidden sm:inline">Products</span>
                            <span className="sm:hidden">📦</span>
                        </TabsTrigger>
                        <TabsTrigger value="issues" className="text-xs sm:text-sm">
                            <span className="hidden sm:inline">Issues</span>
                            <span className="sm:hidden">⚠️</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Top Searches Bar Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base sm:text-lg">Top Search Terms</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Most popular searches</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                                        <BarChart data={topSearches}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="term" fontSize={10} angle={-45} textAnchor="end" height={80} />
                                            <YAxis fontSize={10} />
                                            <Tooltip />
                                            <Bar dataKey="searches" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Result Distribution Pie Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base sm:text-lg">Results Distribution</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Search quality overview</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                                        <PieChart>
                                            <Pie
                                                data={resultDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => {
                                                    // Shorter labels on mobile
                                                    const isMobile = window.innerWidth < 640;
                                                    return isMobile ? `${entry.value}` : `${entry.name}: ${entry.value}`;
                                                }}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {resultDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Trends Tab */}
                    <TabsContent value="trends" className="space-y-4 sm:space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base sm:text-lg">Search Activity</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">Recent search trends</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" fontSize={10} />
                                        <YAxis fontSize={10} />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="searches"
                                            stroke="#3b82f6"
                                            fillOpacity={1}
                                            fill="url(#colorSearches)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Products Tab */}
                    <TabsContent value="products" className="space-y-4 sm:space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base sm:text-lg">Search Results Detail</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">Products appearing in searches</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 sm:space-y-4">
                                    {analytics.slice(0, 10).map((item, index) => (
                                        <div key={index} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Search className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item.term}</h3>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            {item.count} searches • {item.totalResults} results
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                    <span className="hidden sm:inline">{new Date(item.lastSearched).toLocaleDateString()}</span>
                                                    <span className="sm:hidden">{new Date(item.lastSearched).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                            {item.products && item.products.length > 0 && (
                                                <div className="mt-3 pl-0 sm:pl-11">
                                                    <p className="text-xs font-semibold text-gray-600 mb-2">
                                                        Top Products:
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {item.products.slice(0, 4).map((product, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="text-sm flex items-center gap-2 p-2 bg-white rounded border"
                                                            >
                                                                <Package className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="truncate font-medium text-gray-700 text-xs sm:text-sm">
                                                                        {product.name}
                                                                    </p>
                                                                    {product.brand && (
                                                                        <p className="text-xs text-gray-500">{product.brand}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Issues Tab */}
                    <TabsContent value="issues" className="space-y-4 sm:space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600 text-base sm:text-lg">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Zero Results
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Searches that need products or better descriptions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {zeroResultSearches.length > 0 ? (
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {zeroResultSearches.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item.term}</p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                {item.count} time{item.count > 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 pl-8 sm:pl-10">
                                                        <span className="text-gray-400">Last: </span>
                                                        {new Date(item.lastSearched).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">💡 Tips:</h4>
                                            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                                                <li>• Add products for popular searches</li>
                                                <li>• Update product descriptions with these terms</li>
                                                <li>• Check for similar existing products</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                            Perfect! 🎉
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            All searches return results
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
};

export default SearchAnalyticsDashboard;