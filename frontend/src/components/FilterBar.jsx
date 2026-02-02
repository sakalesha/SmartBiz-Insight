import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const FilterBar = ({ config, onFilter, placeholder = 'Search...' }) => {
    // Initialize state from config
    const [filters, setFilters] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);

    // Update filters and notify parent
    const updateFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({});
        onFilter({});
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar - Always Visible */}
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={filters.search || ''}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                {/* Toggle Advanced Filters */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${isExpanded
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <FiFilter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                </button>

                {/* Clear Filters */}
                {Object.keys(filters).length > 0 && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <FiX className="w-4 h-4" />
                        <span className="text-sm font-medium">Clear</span>
                    </button>
                )}
            </div>

            {/* Advanced Filters Area */}
            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                    {config.map((field) => (
                        <div key={field.key} className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {field.label}
                            </label>

                            {/* Select Input */}
                            {field.type === 'select' && (
                                <select
                                    value={filters[field.key] || ''}
                                    onChange={(e) => updateFilter(field.key, e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">All</option>
                                    {field.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Date Input */}
                            {field.type === 'date' && (
                                <input
                                    type="date"
                                    value={filters[field.key] || ''}
                                    onChange={(e) => updateFilter(field.key, e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            )}

                            {/* Number Input */}
                            {field.type === 'number' && (
                                <input
                                    type="number"
                                    placeholder={field.placeholder}
                                    value={filters[field.key] || ''}
                                    onChange={(e) => updateFilter(field.key, e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterBar;
