import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import ReceiptIcon from "@material-ui/icons/Receipt";

export default function EnclosureTable() {
  const baseUrl = "http://localhost:8080/enclosures";

  const columns = [
    { title: "#", field: "id", sorting: false, align: "right" },
    {
      title: "Назва",
      field: "name",
      cellStyle: { fontWeight: "bold", fontStyle: "italic" },
    },
    {
      title: "К-ть",
      field: "qty",
      align: "right",
      sorting: false,
      grouping: false,
    },
    {
      title: "Од.вим.",
      field: "id",
      align: "center",
      render: () => "шт.",
      searchable: false,
      export: false,
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
  const [enclosures, setEnclosures] = useState([]);
  useEffect(() => {
    axios.get(baseUrl).then(function (response) {
      setEnclosures(response.data);
    });
  }, []);

  return (
    <MaterialTable
      columns={columns}
      data={enclosures}
      editable={{
        onRowAdd: (newEnclosure) =>
          new Promise((resolve, reject) => {
            axios.post(baseUrl, newEnclosure).then(function (response) {
              setEnclosures([...enclosures, response.data]);
              resolve();
            });
          }),
        onRowUpdate: (newEnclosure, oldEnclosure) =>
          new Promise((resolve, reject) => {
            axios.put(baseUrl, newEnclosure).then(function (response) {
              const updatedEnclosures = [...enclosures];
              updatedEnclosures[oldEnclosure.tableData.id] = response.data;
              setEnclosures(updatedEnclosures);
              resolve();
            });
          }),
        onRowDelete: (selectedRow) =>
          new Promise((resolve, rejejct) => {
            const url = baseUrl.concat("/", selectedRow.id);
            axios.delete(url).then(function (response) {
              const updatedEnclosures = [...enclosures];
              updatedEnclosures.splice(selectedRow.tableData.id, 1);
              setEnclosures(updatedEnclosures);
              resolve();
            });
          }),
      }}
      actions={[
        {
          icon: () => <ReceiptIcon />,
          tooltip: "View parts",
          onClick: (event, enclosure) => console.log(enclosure),
          position: "row",
        },
      ]}
      onSelectionChange={(selectedRows) => console.log(selectedRows)}
      options={{
        searchFieldVariant: "filled",
        filtering: true,
        pageSizeOptions: [10, 20, 50, 100],
        pageSize: 10,
        exportButton: false,
        addRowPosition: "first",
        actionsColumnIndex: -1,
        selection: true,
        showSelectAllCheckbox: false,
        showTextRowsSelected: false,
        grouping: true,
        columnsButton: true,
        rowStyle: (data, index) =>
          index % 2 === 0 ? { background: "#f5f5f5" } : null,
        headerStyle: { fontWeight: "bold" },
      }}
      title="Щити"
    />
  );
}
