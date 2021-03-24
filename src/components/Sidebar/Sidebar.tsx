import { observer } from "mobx-react";
import React from "react";
import { Footer } from "../Footer";
import { ParcelDataList } from "../ParcelData/ParcelDataList";
import "./Sidebar.scss";

export const Sidebar = observer(function Sidebar() {
  return (
    <aside className="sm:hidden md:flex flex-col overflow-hidden w-1/3 h-screen shadow-md">
      <header className="w-full p-4 flex shadow-md">
        <h2 className="text-2xl font-bold"><a href="/" title="home"><span className="mr-2">📦</span>Parcel Tracker</a></h2>
      </header>
      <section className="flex flex-1 overflow-y-auto overflow-x-hidden py-4 mb-0">
        <ParcelDataList />
      </section>
      <Footer />
    </aside>
  );
});
