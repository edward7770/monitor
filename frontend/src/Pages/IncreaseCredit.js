import React, { useState, useEffect } from "react";
import ClientsListTable from "../Components/ClientsListTable";
import { getClientsAPI } from "../Services/ClientService";

const IncreaseCredit = () => {
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      var clients = await getClientsAPI();
      if (clients) {
        setRowData(clients);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.title = "Monitor | Increase Credit";
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Increase Credit</div>
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

export default IncreaseCredit;
