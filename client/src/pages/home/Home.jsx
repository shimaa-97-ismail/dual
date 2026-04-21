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
      {/* Responsive header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 p-3 md:p-4">
          
          {/* Left section: SidebarTrigger + Title */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <SidebarTrigger
              variant="ghost"
              className="bg-transparent border-none shadow-none hover:bg-transparent text-black! mb-3 shrink-0"
            />
            <h1 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-primary truncate">
              الوحدة الاقليمية للتعليم والتدريب الفنى المزدوج
            </h1>
          </div>

          {/* Right section: Search + User info + Logout */}
          <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
            {/* Search input - full width on mobile, fixed width on larger screens */}
            <div className="flex-1 lg:flex-initial w-full lg:w-64 mt-3">
              <input
                type="text"
                placeholder="ابحث عن طالب.."
                className="w-full px-3 py-2 h-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            
            {/* User badge and logout button group */}
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                className="text-primary border-primary text-sm sm:text-base px-3 py-1 whitespace-nowrap mt-3"
                variant="outline"
              >
                {user?.username?.split(" ")[0]?.charAt(0)?.toUpperCase() || "U"}
              </Badge>
              <Button
                variant="outline"
                className="text-primary! border-primary hover:bg-primary hover:text-white! px-2 sm:px-3"
                onClick={handlLogout}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline ms-1">تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </main>
  </div>
</SidebarProvider>
  );
}
