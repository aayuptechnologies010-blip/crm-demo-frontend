import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from './Skeleton';

export default function DataTable({ 
  columns, 
  data, 
  selectable = false, 
  onSelectionChange, 
  disabledRows = [],
  loading = false,
  emptyMessage = "No records found"
}) {
  const [selected, setSelected] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const v = String(a[sortKey]).localeCompare(String(b[sortKey]));
        return sortDir === 'asc' ? v : -v;
      })
    : data;

  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const maxPage = Math.max(1, totalPages);
  const activePage = currentPage > maxPage ? maxPage : currentPage;

  const paginatedData = sorted.slice((activePage - 1) * pageSize, activePage * pageSize);
  const selectableData = paginatedData.filter(r => !disabledRows.includes(r.id));

  const toggleRow = (id) => {
    if (disabledRows.includes(id)) return;
    const next = selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id];
    setSelected(next);
    onSelectionChange?.(next);
  };

  const toggleAll = () => {
    const next = selected.length === selectableData.length ? [] : selectableData.map(r => r.id);
    setSelected(next);
    onSelectionChange?.(next);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/90 text-slate-600">
              {selectable && (
                <th className="sm:sticky sm:left-0 bg-slate-50/90 sm:z-20 px-4 py-3.5 text-left w-12">
                  <input 
                    type="checkbox" 
                    checked={selectableData.length > 0 && selected.length === selectableData.length}
                    onChange={toggleAll} 
                    className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-300 w-4 h-4 cursor-pointer" 
                  />
                </th>
              )}
              {columns.map((col, idx) => {
                const colKey = col.key || col.accessor || `th-${idx}`;
                const colLabel = col.label || col.header || colKey;
                return (
                  <th 
                    key={colKey} 
                    className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap bg-slate-50/90">
                    {col.sortable ? (
                      <button 
                        onClick={() => toggleSort(colKey)} 
                        className="flex items-center gap-1.5 hover:text-slate-900 font-black transition-colors group">
                        <span>{colLabel}</span>
                        <span className="flex flex-col -space-y-1">
                          <ChevronUp size={11} className={sortKey === colKey && sortDir === 'asc' ? 'text-blue-600 font-black' : 'text-slate-300 group-hover:text-slate-400'} />
                          <ChevronDown size={11} className={sortKey === colKey && sortDir === 'desc' ? 'text-blue-600 font-black' : 'text-slate-300 group-hover:text-slate-400'} />
                        </span>
                      </button>
                    ) : colLabel}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              // Skeleton Loader Rows
              Array.from({ length: 6 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {selectable && (
                    <td className="px-4 py-3.5"><div className="w-4 h-4 bg-slate-200 rounded" /></td>
                  )}
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-4 py-3.5">
                      <div className={`h-4 bg-slate-200/80 rounded-md ${cIdx === 0 ? 'w-28' : cIdx === 1 ? 'w-36' : 'w-20'}`} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => {
                const rowKey = row.id || row.projectId || row.orderId || row.applicationNo || `row-${rIdx}`;
                return (
                  <tr key={rowKey} className="hover:bg-slate-50/80 transition-colors">
                    {selectable && (
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selected.includes(rowKey)} 
                          onChange={() => toggleRow(rowKey)}
                          disabled={disabledRows.includes(rowKey)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-300 w-4 h-4 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                        />
                      </td>
                    )}
                    {columns.map((col, idx) => {
                      const colKey = col.key || col.accessor || `col-${idx}`;
                      const cellValue = colKey && row[colKey] !== undefined ? row[colKey] : null;
                      return (
                        <td key={colKey} className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                          {col.render ? col.render(cellValue, row) : cellValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-12 text-slate-400 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modern High-End Pagination Bar */}
      {!loading && data.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-600 bg-slate-50/60">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Rows per page:</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all cursor-pointer">
              {[5, 10, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>

          {/* Range count */}
          <div className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{Math.min((activePage - 1) * pageSize + 1, data.length)}</span> to{' '}
            <span className="font-bold text-slate-800">{Math.min(activePage * pageSize, data.length)}</span> of{' '}
            <span className="font-bold text-slate-800">{data.length}</span> entries
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={activePage === 1}
              title="First Page"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-600">
              <ChevronsLeft size={15} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={activePage === 1}
              title="Previous Page"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-600">
              <ChevronLeft size={15} />
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1 px-1">
              {(() => {
                const pages = [];
                if (totalPages <= 5) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  const start = Math.max(2, activePage - 1);
                  const end = Math.min(totalPages - 1, activePage + 1);
                  if (start > 2) pages.push('...');
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (end < totalPages - 1) pages.push('...');
                  pages.push(totalPages);
                }
                return pages.map((p, idx) =>
                  typeof p === 'string'
                    ? <span key={idx} className="px-1 text-slate-400 font-bold">{p}</span>
                    : <button 
                        key={p} 
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                          activePage === p 
                            ? 'bg-blue-600 text-white shadow-xs font-extrabold ring-2 ring-blue-300/50' 
                            : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}>{p}</button>
                );
              })()}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={activePage === totalPages}
              title="Next Page"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-600">
              <ChevronRight size={15} />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={activePage === totalPages}
              title="Last Page"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-600">
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
