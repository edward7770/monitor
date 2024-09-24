import React, { useState, useEffect } from "react";
import ClientsListTable from "../Components/ClientsListTable";
import ClientsTransactionHistoryTable from "../Components/ClientTransactionHistoryTable";
import { getClientsAPI } from "../Services/ClientService";
import { getUserAPI } from "../Services/AuthService";

const TransactionHistory = () => {
  const [rowData, setRowData] = useState(null);
  const [currentClientData, setCurrentClientData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);

  const onChangeSearchText = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      var clients = await getClientsAPI();
      if (clients) {
        if (searchText !== "") {
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

        if(user && user.role === "Client") {
          var tempClientDataIndex = clients.map(client => client.userId).indexOf(user.userId);
          if(tempClientDataIndex > -1) {
            setCurrentClientData(clients[tempClientDataIndex]);
          }
        }

        setRowData(clients);
      }
    };

    fetchData();
  }, [searchText, user]);

  useEffect(() => {
    document.title = "Monitor | Transaction History";

    const fetchUserData = async () => {
      const defaultUser = JSON.parse(window.localStorage.getItem("user"));
      if (defaultUser) {
        var tempUser = await getUserAPI(defaultUser.userId);
        if (tempUser) {
          setUser(tempUser);
        }
      }
    };

    fetchUserData();
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
              {/* {!user && <div>Loading...</div>} */}
              {user && user.role === "Superadmin" && (
                <ClientsListTable
                  rowData={rowData && rowData}
                  onChangeSearchText={onChangeSearchText}
                  searchText={searchText}
                />
              )}
              {user && user.role === "Client" && (
                <ClientsTransactionHistoryTable currentClientData={currentClientData && currentClientData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
