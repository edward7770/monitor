import React, { useState, useEffect } from "react";
import ClientsListTable from "../Components/ClientsListTable";
import { getClientsAPI } from "../Services/ClientService";

const TransactionHistory = () => {
  const [rowData, setRowData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const onChangeSearchText = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      var clients = await getClientsAPI();
      if (clients) {
        if(searchText !== "" ) {
          for (let i = clients.length - 1; i >= 0; i--) {
            if (
              !clients[i].name
                .toLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ) {
              clients.splice(i, 1);
            }
          }
        } 

        setRowData(clients);
      }
    };

    fetchData();
  }, [searchText]);

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
              <ClientsListTable rowData={rowData && rowData} onChangeSearchText={onChangeSearchText} searchText={searchText} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
