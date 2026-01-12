import Swal from "sweetalert2";

export const load = () => {

    const metaPage = {
        title: 'Tenant List',
        tableName: 'tenants',
        columns: [
            {
                headerName: "No.",
                valueGetter: "node.rowIndex + 1",
                width: 50,
                pinned: 'left',
                filter: false,
                menuTabs: [],
                cellClass: 'text-center',
                headerClass: 'text-center',
            },
            {
                headerName: 'Tenant ID',
                field: 'tenantId',
                pinned: 'left',
            },
            {
                headerName: 'Name',
                field: 'name',
            },
            {
                headerName: 'MV Tenant Category',
                field: 'mvTenantCategory',
            },
            {
                headerName: 'Entry Time',
                field: 'entryTime',
            },
            {
                headerName: 'Update Time',
                field: 'updateTime',
            },
            {
                headerName: 'Version',
                field: 'version',
            },
            {
                headerName: 'Status',
                field: 'status',
            },
        ],
        wizardHeader: [
            { tabId: 0, title: 'Tenant Information', icon: 'bi bi-person-vcard' },
            { tabId: 1, title: 'User Information', icon: 'bi bi-person-fill' },
        ],
        nextStepWizard: (e, nextTab) => {
            e.preventDefault();

            const formEl = e.currentTarget;

            if (!formEl.checkValidity()) {
                formEl.reportValidity(); // 🔥 munculin error browser
                return;
            }

            return nextTab;
        },
        submitData: async (e, formModel) => {
            // misal nanti ada hit api

            Swal.fire({
                theme: 'auto',
                title: 'Data has been saved successfully.',
                text: JSON.stringify(formModel),
                icon: 'success',
            })
        }
    }

    return metaPage;
}