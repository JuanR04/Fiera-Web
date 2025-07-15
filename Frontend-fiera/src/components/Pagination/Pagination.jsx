import React from 'react';
import './Pagination.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onPrevPage,
    onNextPage,
    className = '',
}) => {
    // No mostrar paginación si solo hay una página
    if (totalPages <= 1) return null;

    // Función para generar array de páginas a mostrar
    const getPageNumbers = () => {
        const pageNumbers = [];

        // Mostrar máximo 5 páginas
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // Ajustar startPage si estamos cerca del final
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // Primera página siempre visible
        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) pageNumbers.push('...');
        }

        // Páginas intermedias
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Última página siempre visible
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className={`pagination ${className}`}>
            <button
                className="pagination-button prev"
                onClick={onPrevPage}
                disabled={currentPage === 1}
                aria-label="Página anterior"
            >
                <FaChevronLeft />
            </button>

            <div className="pagination-numbers">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                            aria-label={`Página ${page}`}
                            aria-current={currentPage === page ? 'page' : null}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                className="pagination-button next"
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

export default Pagination;