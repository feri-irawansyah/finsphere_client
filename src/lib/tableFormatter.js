const createTableFormatter = (columns) => {
    return columns.map(col => {
        // clone kolom biar immutable
        const c = { ...col };
        const hasSelectedColumn = columns.some(col => col.field === "selected");

        // Inject formatter otomatis berdasarkan nama field
        switch(c.field) {
            case "entryTime":
            case "updateTime":
                const columnName = c.field;
                c.filter = "agDateColumnFilter";
                c.valueGetter = (params) => {
                    const v = params.data[columnName];
                    return v ? new Date(v) : null;
                };
                c.valueFormatter = dateTimeFormatter;
                break;
            case "selected":
                c.headerName = "";
                c.hide = true,
                c.headerCheckboxSelection = true;
                c.suppressHeaderMenuButton = false,
                c.filter = false;
                c.sortable = false;
                c.width = 0;
                c.resizable = false;
                c.suppressMenu = true;
                c.suppressMovable = true;
                c.lockVisible = true;
                c.suppressKeyboardEvent = () => true;
                c.checkboxSelection = params => {
                    return hasSelectedColumn; // cuma muncul kalau kolom exist
                };
                break;
            case "orderVolume":
                c.valueFormatter = IDRFormatter;
                c.filter = "agNumberColumnFilter";
                c.aggFunc = "sum";
                break;
            case "type":
                c.filter = "agSetColumnFilter";
                break;
            case "state":
                c.filter = "agSetColumnFilter";
                c.filterParams = {
                    values: async (params) => {
                        params.success(["YES", "NO"]);
                    }
                };
                c.cellRenderer = YesNoFormatter;
                break;
            default:
                if(c.filter === false) c.filter = false;
                else {
                    c.filter = "agTextColumnFilter";
                    // c.getQuickFilterText = (params) => {
                    //     return params.value;
                    // }
                };
                break;
        }
        c.headerName = c.headerName.toUpperCase();
        return c;
    })
};

const IDRFormatter = (params) => {
    if (params.value == null) return "";
        return new Intl.NumberFormat("id-ID", { 
        style: "currency", 
        currency: "IDR", 
        minimumFractionDigits: 0 
    }).format(params.value);
}

const YesNoFormatter = (params) => {
    if (params.value == null) return "";
        return params.value
        ? '<span class="badge bg-success">Yes</span>'
        : '<span class="badge bg-danger">No</span>';
}

const dateFormatter = (params) => {
    if (!params.value) return "";
    const date = new Date(params.value);

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

const dateTimeFormatter = (params) => {
    if (!params?.value) return "";

    const date = new Date(params.value);

    const pad = (n) => String(n).padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = String(date.getFullYear()).slice(-2);

    const hours24 = date.getHours();
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const ampm = hours24 >= 12 ? 'PM' : 'AM';

    return `${day}/${month}/${year} - ${pad(hours24)}:${minutes}:${seconds} ${ampm}`;
};

export default createTableFormatter;