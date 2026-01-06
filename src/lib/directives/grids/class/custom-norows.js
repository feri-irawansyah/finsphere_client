class CustomNoRowsOverlay {
      init(params) {
            this.params = params;
            const { tableName, refresh } = params;

            this.eGui = document.createElement("div");
            this.eGui.classList.add("my-overlay");

            this.eGui.innerHTML = `
                <div class="empty-wrapper">
                    <img src="/svg/empty.svg" class="empty-icon" />
                    <div class="empty-title mb-3">
                        <h4>No data available</h4>
                        <span>Add new data or adjust your filters to see result.</span>
                    </div>
                    <a class="btn btn-primary overlay-add-btn">
                        <span class="mx-1 text-white">Refresh Data</span>
                    </a>
                </div>
            `;

            // simpan handler
            this.onButtonClick = () => {
                if (typeof refresh === "function") refresh();
            };

            this.button = this.eGui.querySelector(".overlay-add-btn");
            this.button.addEventListener("click", this.onButtonClick);
    }

    getGui() {
        return this.eGui;
    }

    destroy() {
        if (this.button) {
            this.button.removeEventListener("click", this.onButtonClick);
        }
    }
}

export default CustomNoRowsOverlay;