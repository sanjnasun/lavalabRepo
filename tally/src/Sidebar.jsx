import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import vector from './images/Vector.png';
import tally from './images/tally.png';
import invent from './images/inventory.png';
import card from './images/card.png';
import book from './images/book.png';
import darkComp from './images/componentDark.png';
import inventDark from './images/InventDark.png';
import cardDark from './images/CardDark.png';
import bookDark from './images/BookDark.png';

const Sidebar = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('Materials');
  const [hoveredSection, setHoveredSection] = useState(null);

  const sidebarItems = [
    {
      name: 'Materials',
      icon: vector,
      darkIcon: darkComp
    },
    {
      name: 'Products',
      icon: card,
      darkIcon: cardDark
    },
    {
      name: 'Fulfillment',
      icon: book,
      darkIcon: bookDark
    },
    {
      name: 'Integrations',
      icon: invent,
      darkIcon: inventDark
    }
  ];

  const handleClick = (name) => {
    setActiveSection(name);
    setSidebarExpanded(false); // collapse after click
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full flex flex-col justify-between py-6 transition-all duration-200 bg-white border-r border-gray-200 ${
        sidebarExpanded ? 'w-56' : 'w-16'
      }`}
      onMouseEnter={() => setSidebarExpanded(true)}
      onMouseLeave={() => setSidebarExpanded(false)}
    >
      {/* Logo / Tally */}
      <div
        className={`flex items-center gap-3 px-4 cursor-pointer transition-all duration-200`}
        onClick={() => setSidebarExpanded((prev) => !prev)}
      >
        <img src={tally} alt="Tally Logo" className="w-8 h-8" />
        {sidebarExpanded && <span className="text-indigo-600 font-semibold text-lg">Tally</span>}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 mt-8 px-3">
        <div className="space-y-1">
          {sidebarItems.map((item, index) => {
            const isActive = activeSection === item.name;
            const isHovered = hoveredSection === item.name;
            const shouldUseDarkIcon = isActive || isHovered;

            return (
              <div key={item.name}>
                <button
                  onClick={() => handleClick(item.name)}
                  onMouseEnter={() => setHoveredSection(item.name)}
                  onMouseLeave={() => setHoveredSection(null)}
                  title={!sidebarExpanded ? item.name : ''}
                  className={`w-full flex items-center gap-3 px-3 py-3 transition-all duration-200 cursor-pointer rounded-lg border ${
                    isActive
                      ? 'text-indigo-700 border-indigo-300'
                      : isHovered
                      ? 'text-indigo-600 hover:bg-gray-50 border-indigo-200'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600 border-transparent hover:border-gray-300'
                  } ${sidebarExpanded ? 'justify-start' : 'justify-center'}`}
                  style={isActive ? { backgroundColor: '#DADCEE' } : {}}
                >
                  <img
                    src={shouldUseDarkIcon ? item.darkIcon : item.icon}
                    alt={item.name}
                    className="w-4 h-4 flex-shrink-0 transition-all duration-200"
                  />
                  {sidebarExpanded && <span className="font-medium">{item.name}</span>}
                </button>
                {/* Add border after Fulfillment (index 2) */}
                {index === 2 && (
                  <div className="border-t border-gray-200 my-3"></div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 space-y-1">
        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Logout */}
        <button
          className={`w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-lg ${
            sidebarExpanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {sidebarExpanded && <span className="font-medium">Logout</span>}
        </button>

        {/* Profile */}
        <div
          className={`flex items-center gap-3 px-3 py-3 transition-all duration-200 ${
            sidebarExpanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          {sidebarExpanded && (
            <div className="flex flex-col">
              <span className="font-medium text-sm text-gray-900">Don't Ruin It</span>
              <span className="text-gray-500 text-xs">Premium</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;