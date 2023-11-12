import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import ReceiptIcon from "@material-ui/icons/Receipt";

export default function ProjectTable() {
  const baseUrl = "http://localhost:8080/projects";

  const columns = [
    { title: "#", field: "id", sorting: false, align: "left" },
    {
      title: "Назва",
      field: "name",
      cellStyle: { fontWeight: "bold", fontStyle: "italic" },
    },
    {
      title: "Дата",
      field: "createdAt",
      align: "right",
      type: "date",
      defaultSort: "asc",
    },

    // {
    //   title: "Ціна",
    //   field: "price",
    //   align: "right",
    //   type: "currency",
    //   currencySetting: { locale: "ua", currencyCode: "UAH" },
    //   sorting: false,
    //   grouping: false,
    // },
  ];
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    axios.get(baseUrl).then(function (response) {
      setProjects(response.data);
    });
  }, []);

  return (
    <MaterialTable
      columns={columns}
      data={projects}
      editable={{
        onRowAdd: (newProject) =>
          new Promise((resolve, reject) => {
            axios.post(baseUrl, newProject).then(function (response) {
              setProjects([...projects, response.data]);
              resolve();
            });
          }),
        onRowUpdate: (newProject, oldProject) =>
          new Promise((resolve, reject) => {
            axios.put(baseUrl, newProject).then(function (response) {
              const updatedProjects = [...projects];
              updatedProjects[oldProject.tableData.id] = response.data;
              setProjects(updatedProjects);
              resolve();
            });
          }),
        onRowDelete: (selectedRow) =>
          new Promise((resolve, rejejct) => {
            const url = baseUrl.concat("/", selectedRow.id);
            axios.delete(url).then(function (response) {
              const updatedProjects = [...projects];
              updatedProjects.splice(selectedRow.tableData.id, 1);
              setProjects(updatedProjects);
              resolve();
            });
          }),
      }}
      actions={[
        {
          icon: () => <ReceiptIcon />,
          tooltip: "View parts",
          onClick: (event, project) => console.log(project),
          position: "row",
        },
      ]}
      onSelectionChange={(selectedRows) => console.log(selectedRows)}
      options={{
        searchFieldVariant: "filled",
        filtering: false,
        pageSizeOptions: [10, 20, 50, 100],
        pageSize: 10,
        exportButton: false,
        addRowPosition: "first",
        actionsColumnIndex: -1,
        selection: false,
        showSelectAllCheckbox: false,
        showTextRowsSelected: false,
        grouping: false,
        columnsButton: false,
        rowStyle: (data, index) =>
          index % 2 === 0 ? { background: "#f5f5f5" } : null,
        headerStyle: { fontWeight: "bold" },
      }}
      title="Проекти"
    />
  );
}
