// ✅ Khusus module Ag-Grid Community gratisan
import {
    DateFilterModule,
    ModuleRegistry,
    NumberFilterModule,
    TextFilterModule,
    ValidationModule,
    PaginationModule,
    RowSelectionModule,
    PinnedRowModule,
    RowApiModule,
    createGrid,
    themeQuartz,
    QuickFilterModule,
    CellStyleModule,
    EventApiModule,
    RenderApiModule,
    colorSchemeDarkBlue
} from "ag-grid-community";

// ⚠️ Khsus module Ag-Grid Enterprise
import {
    SetFilterModule,
    RowGroupingModule,
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    TreeDataModule,
    CellSelectionModule,
    ClipboardModule,
    ContextMenuModule,
    PivotModule,
    ExcelExportModule,
    SideBarModule,
    ColumnsToolPanelModule,
    StatusBarModule,
    ColumnMenuModule
} from "ag-grid-enterprise";

// ✅ Untuk daftarin module
const modules = [
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    RowSelectionModule,
    TextFilterModule,
    NumberFilterModule,
    SetFilterModule,
    DateFilterModule,
    PaginationModule,
    PinnedRowModule,
    RowGroupingModule,
    PivotModule,
    TreeDataModule,
    RowApiModule,
    QuickFilterModule,
    CellSelectionModule,
    ClipboardModule,
    // ContextMenuModule,
    ExcelExportModule,
    CellStyleModule,
    SideBarModule,
    ColumnsToolPanelModule,
    StatusBarModule,
    EventApiModule,
    // ColumnMenuModule,
    RenderApiModule,
];

// Tambahkan ValidationModule hanya saat development
if (process.env.NODE_ENV !== "production") {
    modules.push(ValidationModule);
}

// Register sekali
ModuleRegistry.registerModules(modules);

// ✅ Konfigurasi style ag grid
const myTheme = themeQuartz.withParams({
    spacing: 10,
    fontFamily: 'Geist',
    headerFontFamily: 'Geist',
    cellFontFamily: 'Geist',
    fontSize: 14,
    headerFontSize: 14,
    cellFontSize: 14,
    headerHeight: '40px',
    headerTextColor: '#0B032D',
    headerBackgroundColor: '#F4F5F6',
    headerColumnBorder: { style: 'solid', width: 1, color: '#cfd1d4ff' },
    headerColumnResizeHandleWidth: 0,
    headerColumnBorderHeight: 20,
    headerFontWeight: 600,
    oddRowBackgroundColor: '#F4F5F6',
    columnBorder: { style: 'solid', width: 1, color: 'transparent' },
    rowBorder: { style: 'solid', width: 1, color: 'transparent' },
    wrapperBorderRadius: 6,
    wrapperBorder: { style: 'solid', width: 1, color: '#E7E5E5' },
    selectedRowBackgroundColor: 'rgba(4, 128, 236, 0.1)',
    checkboxBorderWidth: 2,
    checkboxCheckedBackgroundColor: '#00A7CD',
});

export { createGrid, myTheme };