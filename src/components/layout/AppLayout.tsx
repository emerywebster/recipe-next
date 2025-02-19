import React from "react";
import RecipeHeader from "../RecipeHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <RecipeHeader />
      <main>{children}</main>
    </div>
  );
}
