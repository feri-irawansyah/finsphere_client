import modalStore from '$lib/directives/modal/functions/modal-store.js';
import ModalUsers from "$lib/components/molecules/modals/ModalUsers.svelte";

export const load = ({ parent }) => {

    const metaPage = {
        title: 'Users Roles List',
        tableName: 'usersroles',
        columns: [
            {
                headerName: "No.",
                valueGetter: "node.rowIndex + 1",
                width: 10,
                pinned: 'left',
                filter: false,
                menuTabs: [],
                cellClass: 'text-center',
                headerClass: 'text-center',
            },
            {
                headerName: 'User Roles Uid',
                field: 'userRolesUid',
                hide: true,
            },
            {
                headerName: 'Email',
                field: 'email',
                pinned: 'left',
                cellRenderer: (params) => {
                    const a = document.createElement("a");
                    a.innerText = params.value;
                    a.href = "#";
                    a.onclick = (e) => {
                        e.preventDefault();

                        modalStore.open("modal-users", "View user", "",
                            {
                                actions: "update",
                                uid: e.detail.userUid,
                                isFormViewOnly: true
                            }, "modal-users")
                    }
                    return a;
                }
            },
            {
                headerName: 'Role Id',
                field: 'roleId',
                cellRenderer: (params) => {
                    const a = document.createElement("a");
                    a.innerText = params.value;
                    a.href = "#";
                    a.onclick = (e) => {
                        e.preventDefault();

                        modalStore.open("modal-roles", "View role", "",
                            {
                                actions: "update",
                                uid: e.detail.roleUid,
                                isFormViewOnly: true
                            })
                    }
                    return a;
                }
            },
            {
                headerName: 'Entry Time',
                field: 'entryTime',
                minWidth: 195,
            },
            {
                headerName: 'Update Time',
                field: 'updateTime',
                minWidth: 195,
            },
            {
                headerName: 'Version',
                field: 'version',
                minWidth: 150,
            },
            {
                headerName: 'Status',
                field: 'status',
                minWidth: 150,
            },
        ],
    }

    return metaPage;
}