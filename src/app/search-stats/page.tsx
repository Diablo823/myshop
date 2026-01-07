"use client";

import { useEffect, useState } from "react";
import SearchAnalyticsDashboard from "@/components/SearchAnalytics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchStatsPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const ADMIN_PASSWORD = "Analytics@2003";

    // ✅ Check auth status on page load
    useEffect(() => {
        const auth = localStorage.getItem("search_analytics_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem("search_analytics_auth", "true"); // ✅ persist login
        } else {
            alert("Wrong password!");
        }
    };

    // Optional logout function
    const handleLogout = () => {
        localStorage.removeItem("search_analytics_auth");
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-6">Search Analytics</h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Admin Password
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Optional logout button */}
            <div className="p-4 flex justify-end">
                <Button variant="outline" onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            <SearchAnalyticsDashboard />
        </div>
    );
}
