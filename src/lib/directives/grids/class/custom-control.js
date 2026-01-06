class CustomControlsComponent {
    init(params) {
        this.params = params;

        this.eGui = document.createElement('div');
        this.eGui.className = 'custom-button-info';

        // === Button Setting ===
        this.button = document.createElement('button');
        this.button.className = 'page-btn';
        this.button.innerHTML = `<i class="bi bi-settings"></i>`;

        this.menu = document.createElement('div');
        this.eGui.appendChild(this.button);
        this.eGui.appendChild(this.menu);

        // #region === Page Size Selector ===
        this.pageSizeSelect = document.createElement('select');
        this.pageSizeSelect.className = 'page-size-select p-1';
        this.pageSizeSelect.style.borderRadius = "12px";
        // this.pageSizeSelect.style.border = "1px solid #E0E2E6";
        // this.pageSizeSelect.style.backgroundColor = "#FFF";

        const sizes = [10, 50, 100, 500, 1000];
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            if (params.api.getGridOption('paginationPageSize') === size) {
            option.selected = true;
            }
            this.pageSizeSelect.appendChild(option);
        });

        // Update page size dynamically
        this.pageSizeSelect.addEventListener('change', (e) => {
            const newSize = Number(e.target.value);
            params.api.setGridOption('paginationPageSize', newSize);
        });

        this.eGui.appendChild(this.pageSizeSelect);
        // #endregion === Page Size Selector ===

        this.button.addEventListener('click', () => {
            params.api.showColumnChooser();
        });
    }

    getGui() {
        return this.eGui;
    }
}

export default CustomControlsComponent