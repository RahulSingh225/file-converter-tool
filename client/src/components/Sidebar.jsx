import React from 'react';

const Sidebar = ({ groups, selectedGroup, onSelectGroup, selectedConverter, onSelectConverter }) => {
  return (
    <aside className="w-64 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Tools</h2>
      <div className="space-y-3">
        {Object.keys(groups).map(groupKey => (
          <div key={groupKey}>
            <button
              onClick={() => onSelectGroup(groupKey)}
              className={`w-full text-left py-2 px-3 rounded ${selectedGroup === groupKey ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
              {groups[groupKey].title}
            </button>
            {selectedGroup === groupKey && (
              <div className="mt-2 pl-3">
                {groups[groupKey].items.map(item => (
                  <div key={item.key}>
                    <button
                      onClick={() => onSelectConverter(item.key)}
                      className={`w-full text-left py-1 px-2 rounded text-sm ${selectedConverter === item.key ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'}`}>
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
