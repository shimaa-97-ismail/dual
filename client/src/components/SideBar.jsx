import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
const IsActive = (path) => {
  const resolved = useResolvedPath(path);
  const match = useMatch({ path: resolved.pathname, end: true });
  return !!match;
};
export function AppSidebar() {
  const menuItems = [
    { label: " الصفحه الرئسية", path: "/dashboard" },
    { label: "الإدارات", path: "/department" },
    { label: "المدارس", path: "/schools" },
    { label: "أنواع المدارس", path: "/type-of-school" },
    { label: " التخصصات المتاحة", path: "/special" },
    { label: "المنشأت التدربيه", path: "/trainning-place" },
    // { label: " الطلاب", path: "/student" },
     { label: " التقارير", path: "/reports" },
  ];

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <div className="flex ">
          <SidebarTrigger className="" />

          <div className="flex flex-col items-center justify-center ">
            {/* <h2 className="font-bold text-base text-start mb-1 mt-2">مديريه التضامن الاجتماعى بقنا</h2> */}
            <h2 className="font-bold text-base text-start mt-2">جمعية رؤى للتنمية بالمشاركة</h2>
            {/* <h2 className="font-bold text-sm text-start mb-2 ">المشهورة برقم 949 لسنة2005</h2> */}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild isActive={IsActive(item.path)}>
                  <Link to={item.path}>
                    {/* <item.icon className="h-4 w-4" /> */}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
