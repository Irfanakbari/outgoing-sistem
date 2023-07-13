import { useState } from 'react';

const PaginationSelect = ({ totalPages, currentPage, onPageChange }) => {
    const [selectedPage, setSelectedPage] = useState(currentPage || 1);

    const handlePageChange = (e) => {
        const selected = parseInt(e.target.value);
        setSelectedPage(selected);
        onPageChange(selected);
    };

    return (
        <div className="flex items-center">
            <label htmlFor="pagination-select" className="mr-2">
                Halaman:
            </label>
            <select
                id="pagination-select"
                className="border border-gray-300 rounded p-1"
                value={selectedPage}
                onChange={handlePageChange}
            >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <option key={page} value={page}>
                        {page}
                    </option>
                ))}
            </select>
            <span className="ml-2">of {totalPages}</span>
        </div>
    );
};

export default PaginationSelect;
