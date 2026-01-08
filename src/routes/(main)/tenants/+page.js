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
                headerName: 'Role UID',
                field: 'roleUid',
                hide: true
            },
            {
                headerName: 'Role ID',
                field: 'roleId',
                pinned: 'left',
            },
            {
                headerName: 'Name',
                field: 'name',
            },
            {
                headerName: 'Description',
                field: 'description',
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
            { tabId: 1, title: 'Tenant Information', icon: 'bi bi-person-vcard' },
            { tabId: 2, title: 'User Information', icon: 'bi bi-person-fill' },
            { tabId: 3, title: 'User Information', icon: 'bi bi-box-fill' },
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