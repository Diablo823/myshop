"use client";

// src/app/search-stats/page.tsx
import { useState, useEffect } from "react";
import SearchAnalyticsDashboard from "@/components/SearchAnalytics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, LogOut } from "lucide-react";

export default function SearchStatsPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Change this password to whatever you want
    const ADMIN_PASSWORD = "Analytics@2003";

    useEffect(() => {
        const authToken = sessionStorage.getItem("analytics-auth");
        if (authToken === "authenticated") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem("analytics-auth", "authenticated");
        } else {
            alert("Wrong password!");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("analytics-auth");
        setPassword("");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">Search Analytics</h1>
                    <p className="text-sm text-gray-600 text-center mb-4 sm:mb-6">
                        Enter your admin password
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Password
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-sm sm:text-lg font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-xs text-gray-500 hidden sm:block">Search Analytics</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Logout</span>
                        <span className="sm:hidden">Out</span>
                    </Button>
                </div>
            </div>
            <SearchAnalyticsDashboard />
        </div>
    );
}