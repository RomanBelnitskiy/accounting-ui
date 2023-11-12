import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import GetAppIcon from "@material-ui/icons/GetApp";

export default function BillTable() {
  const baseUrl = "http://localhost:8080/bills";

  const columns = [
    {
      title: "Постачальник",
      field: "supplier",
      cellStyle: { fontWeight: "bold", fontStyle: "italic" },
    },
    { title: "Номер", field: "number", sorting: false, align: "right" },
    {
      title: "Дата",
      field: "date",
      align: "right",
      type: "date",
      defaultSort: "asc",
    },
    {
      title: "Сума",
      field: "total",
      align: "right",
      type: "currency",
      currencySetting: { locale: "ua", currencyCode: "UAH" },
      sorting: false,
      grouping: false,
      render: (rowData) => (
        <div style={{ color: !rowData.paymentStatus ? "red" : "" }}>
          {rowData.total.toFixed(2)}&nbsp;грн.
        </div>
      ),
    },
    {
      title: "Оплата",
      field: "paymentStatus",
      lookup: {
        NONE: "Не оплачений",
        WILL_BE_PAID: "На оплаті",
        PARTIALLY_PAID: "Часткова оплата",
        PAID: "Оплатили",
      },
    },
    {
      title: "",
      field: "noticed",
      align: "center",
      lookup: { true: "Так", false: "Ні" },
      searchable: false,
      export: false,
      render: (rowData) => (
        <div style={{ backgroundColor: rowData.noticed ? "" : "red" }}>
          {rowData.noticed ? "Так" : "Ні"}
        </div>
      ),
    },
    {
      title: "Статус",
      field: "shipmentStatus",
      searchable: false,
      export: false,
      lookup: {
        DO_NOT_SHIPPED: "Не відвантажено",
        SHIPPED: "В дорозі",
        AT_SQUAD: "У відділенні",
        RECEIVED: "Одержано",
      },
    },
    {
      title: "ТТН",
      field: "waybill",
      align: "right",
      sorting: false,
      searchable: false,
      render: (rowData) => (
        <div
          style={{
            backgroundColor:
              rowData.shipmentStatus === "RECEIVED" ? "green" : "orange",
          }}
        >
          {rowData.waybill}
        </div>
      ),
    },
    {
      title: "Об'єкт",
      field: "target",
      export: false,
    },
    {
      title: "Обладнання",
      field: "equipment",
      sorting: false,
      filtering: false,
      export: false,
    },
  ];
  const [bills, setBills] = useState([]);
  useEffect(() => {
    axios.get(baseUrl).then(function (response) {
      setBills(response.data);
    });
  }, []);

  return (
    <MaterialTable
      columns={columns}
      data={bills}
      editable={{
        onRowAdd: (newBill) =>
          new Promise((resolve, reject) => {
            axios.post(baseUrl, newBill).then(function (response) {
              setBills([...bills, response.data]);
              resolve();
            });
          }),
        onRowUpdate: (newBill, oldBill) =>
          new Promise((resolve, reject) => {
            axios.put(baseUrl, newBill).then(function (response) {
              const updatedBills = [...bills];
              updatedBills[oldBill.tableData.id] = response.data;
              setBills(updatedBills);
              resolve();
            });
          }),
        onRowDelete: (selectedRow) =>
          new Promise((resolve, rejejct) => {
            const url = baseUrl.concat("/", selectedRow.id);
            axios.delete(url).then(function (response) {
              const updatedBills = [...bills];
              updatedBills.splice(selectedRow.tableData.id, 1);
              setBills(updatedBills);
              resolve();
            });
          }),
      }}
      actions={[
        {
          icon: () => <GetAppIcon />,
          tooltip: "Click me",
          onClick: (event, bill) => console.log(bill),
          // isFreeAction: true,
        },
      ]}
      onSelectionChange={(selectedRows) => console.log(selectedRows)}
      options={{
        searchFieldVariant: "filled",
        filtering: true,
        pageSizeOptions: [10, 20, 50, 100],
        pageSize: 10,
        exportButton: true,
        addRowPosition: "first",
        actionsColumnIndex: -1,
        selection: true,
        showSelectAllCheckbox: false,
        showTextRowsSelected: false,
        selectionProps: (rowData) => ({
          disabled: !rowData.supplier,
          color: "primary",
        }),
        grouping: true,
        columnsButton: true,
        rowStyle: (data, index) =>
          index % 2 === 0 ? { background: "#f5f5f5" } : null,
        headerStyle: { fontWeight: "bold" },
      }}
      title="Список рахунків"
    />
  );
}
