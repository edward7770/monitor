import React, { useState, useEffect } from "react";
import ClientsListTable from "../Components/ClientsListTable";
import { getClientsAPI } from "../Services/ClientService";

const TransactionHistory = () => {
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      var clients = await getClientsAPI();
      if (clients) {
        console.log(clients);
        setRowData(clients);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.title = "Monitor | Transaction History";
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Transaction History</div>
            </div>
            <div className="card-body">
              <ClientsListTable rowData={rowData && rowData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
