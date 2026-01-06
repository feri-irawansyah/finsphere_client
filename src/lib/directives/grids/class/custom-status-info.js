class CustomStatusInfoComponent {
    init(params) {
        this.params = params;
        this.eGui = document.createElement('div');
        this.eGui.className = 'custom-pagination-info';
        this.refreshText = this.refreshText.bind(this);

        this.refreshText();
        params.api.addEventListener('paginationChanged', this.refreshText);
        params.api.addEventListener('modelUpdated', this.refreshText);
    }

    refreshText() {
        const api = this.params.api;
        const rowCount = api.paginationGetRowCount ? api.paginationGetRowCount() : api.getDisplayedRowCount();
        const pageSize = api.paginationGetPageSize ? api.paginationGetPageSize() : rowCount || 0;
        const currentPage = api.paginationGetCurrentPage ? api.paginationGetCurrentPage() + 1 : 1;

        const start = rowCount ? (pageSize * (currentPage - 1)) + 1 : 0;
        const end = rowCount ? Math.min(rowCount, currentPage * pageSize) : 0;

        this.eGui.textContent = `Showing ${start}-${end} of ${rowCount} Items`;
    }

    getGui() { return this.eGui; }

    destroy() {
        this.params.api.removeEventListener('paginationChanged', this.refreshText);
        this.params.api.removeEventListener('modelUpdated', this.refreshText);
    }
}

export default CustomStatusInfoComponent