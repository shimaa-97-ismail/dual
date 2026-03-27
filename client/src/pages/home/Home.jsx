import React, { useContext, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/SideBar";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

export function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  console.log(user);

  // const handleSearch = async (search) => {
  //   console.log(search);

  //   //  navigate(`/search?search=${search}`)
  // };
  const handleClick = () => {
    navigate(`/search?search=${searchTerm}`);
    setSearchTerm("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleClick(); // Trigger search on Enter
    }
  };

  const handlLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full" dir="rtl">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {/* Header with improved responsiveness */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-3 sm:p-4 border-b">
            {/* Left group: SidebarTrigger + Title */}
            <div className="flex items-center sm:justify-start w-full sm:w-auto">
              <SidebarTrigger
                variant="ghost"
                className="bg-transparent border-none shadow-none hover:bg-transparent text-black! mb-3"
              />
              <h1 className="font-bold text-base sm:text-xl text-primary truncate max-w-[70%] sm:max-w-full">
                الوحدة الاقليمية للتعليم والتدريب الفنى المزدوج 
              </h1>
            </div>

            {/* Right group: Search, Badge, Logout */}
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mt-2 sm:mt-0">
              <input
                type="text"
                placeholder="ابحث عن طالب.."
                className="px-3 py-2 mt-3 w-full sm:w-64 h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="flex items-center gap-2">
                <Badge
                  className="text-primary border-primary text-base sm:text-lg px-3 py-1 mt-3"
                  variant="outline"
                >
                  {user?.username?.split(" ")[0].split("")[0].toUpperCase() ||
                    "U"}
                </Badge>
                <Button
                  variant="outline"
                  className="text-primary! border-primary hover:bg-primary hover:text-white! px-3"
                  onClick={handlLogout}
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline ms-1">تسجيل الخروج</span>
                </Button>
              </div>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
