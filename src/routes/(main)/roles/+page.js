export const load = () => {
    
    const metaPage = {
        title: 'Role List',
        tableName: 'roles',
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
    } 

    return metaPage;
}