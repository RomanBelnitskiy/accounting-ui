import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialTable from "material-table";

export default function PartTable() {
  const baseUrl = "http://localhost:8080/parts";

  const columns = [
    { title: "Артикул", field: "reference", sorting: false, align: "right" },
    {
      title: "Назва",
      field: "name",
      cellStyle: { fontWeight: "bold", fontStyle: "italic" },
    },
    {
      title: "Ціна",
      field: "price",
      align: "right",
      type: "currency",
      currencySetting: { locale: "ua", currencyCode: "UAH" },
      sorting: false,
      grouping: false,
    },
    {
      title: "Од.вим.",
      field: "unit",
      align: "center",
      lookup: { SHT: "шт.", M: "м", M_KV: "м.кв." },
      searchable: false,
      export: false,
    },
    {
      title: "Тип",
      field: "partType",
      searchable: false,
      export: false,
      lookup: {
        CIRCUIT_BREAKER: "Автоматичний вимикач",
        CAPACITOR: "Контактор",
        RELAY: "Реле",
        FUSE: "Запобіжник",
        SWITCH: "Вимикач навантаження",
        ENCLOSURE: "Корпус",
        WIRE: "Провід",
        ADAPTER: "Наконечник",
        BUS: "Шина",
        CURRENT_TRANSFORMER: "Трансформатор струму",
      },
    },
    {
      title: "Виробник",
      field: "manufacturer",
    },
  ];
  const [parts, setParts] = useState([]);
  useEffect(() => {
    axios.get(baseUrl).then(function (response) {
      setParts(response.data);
    });
  }, []);

  return (
    <MaterialTable
      columns={columns}
      data={parts}
      editable={{
        onRowAdd: (newPart) =>
          new Promise((resolve, reject) => {
            axios.post(baseUrl, newPart).then(function (response) {
              setParts([...parts, response.data]);
              resolve();
            });
          }),
        onRowUpdate: (newPart, oldPart) =>
          new Promise((resolve, reject) => {
            axios.put(baseUrl, newPart).then(function (response) {
              const updatedParts = [...parts];
              updatedParts[oldPart.tableData.id] = response.data;
              setParts(updatedParts);
              resolve();
            });
          }),
        onRowDelete: (selectedRow) =>
          new Promise((resolve, rejejct) => {
            const url = baseUrl.concat("/", selectedRow.id);
            axios.delete(url).then(function (response) {
              const updatedParts = [...parts];
              updatedParts.splice(selectedRow.tableData.id, 1);
              setParts(updatedParts);
              resolve();
            });
          }),
      }}
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
          index % 2 == 0 ? { background: "#f5f5f5" } : null,
        headerStyle: { fontWeight: "bold" },
      }}
      title="Деталі"
    />
  );
}
