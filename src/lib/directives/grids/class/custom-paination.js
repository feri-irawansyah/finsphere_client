class CustomPaginationButtonsComponent {
    init(params) {
        this.params = params;
        this.eGui = document.createElement('div');
        this.eGui.className = 'custom-pagination-buttons';
        this.render = this.render.bind(this);

        this.render();
        params.api.addEventListener('paginationChanged', this.render);
    }

    render() {
        const api = this.params.api;
        const currentPage = api.paginationGetCurrentPage() + 1;
        const totalPages = api.paginationGetTotalPages();
        this.eGui.innerHTML = '';

        const makeBtn = (label, onClick, disabled = false, active = false, innerHTML = false) => {
            const b = document.createElement('button');
            b.className = 'page-btn btn btn-sm mx-1';
            if (active) b.classList.add('active');
            if (disabled) b.classList.add('disabled');

            if (innerHTML)
            b.innerHTML = label;
            else
            b.textContent = label;

            if (!disabled) b.addEventListener('click', onClick);
            return b;
        };

        // prev
        this.eGui.appendChild(
            makeBtn(`First`, () => api.paginationGoToFirstPage(), currentPage === 1, false, true)
        );

        this.eGui.appendChild(
            makeBtn(`<i class="bi bi-chevron-prev"></i>`, () => api.paginationGoToPage(currentPage - 2), currentPage === 1, false, true)
        );

        // Tampilkan maksimal 4 page number
        let maxVisible = 3;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = start + maxVisible - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            this.eGui.appendChild(
            makeBtn(String(i), () => api.paginationGoToPage(i - 1), false, i === currentPage)
            );
        }

        if (end < totalPages) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'ellipsis';
            ellipsis.style.marginTop = "3px";
            this.eGui.appendChild(ellipsis);

            this.eGui.appendChild(
            makeBtn(String(totalPages), () => api.paginationGoToPage(totalPages - 1), false, totalPages === currentPage)
            );
        }

        // next
        this.eGui.appendChild(
            makeBtn(`<i class="bi bi-chevron-next"></i>`, () => api.paginationGoToPage(currentPage), currentPage === totalPages, false, true)
        );

        this.eGui.appendChild(
            makeBtn('Last', () => api.paginationGoToLastPage(), currentPage === totalPages)
        );
    }

    getGui() { return this.eGui; }

    destroy() {
        this.params.api.removeEventListener('paginationChanged', this.render);
    }
}

export default CustomPaginationButtonsComponent