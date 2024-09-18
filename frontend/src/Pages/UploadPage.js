import React, { useEffect, useState } from "react";
import { FilePond } from "react-filepond";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { addMatchAPI, addMatchDataAPI } from "../Services/UploadService";

let isSetUploadFile = false;
const UploadPage = () => {
  const [userId, setUserId] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState([]);

  const handleUploadCSV = (fileItems) => {
    const file = fileItems[0]?.file;
    let tempData = [];
    let status = 1;

    if (file && !isSetUploadFile) {
      setCsvFile(file);
      isSetUploadFile = true;
      const reader = new FileReader();
      setFileName(file.name);

      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split("\n").map((row) => row.split(","));

        if (
          rows[0][0].trim() === "IdNo" ||
          rows[0][0].trim() === "ID Number" ||
          rows[0][0].trim() === "IDNUmber " ||
          rows[0][0].trim() === "ID"
        ) {
          const tempRows = rows.slice(1);
          if (tempRows.length > 0) {
            tempRows.forEach((row) => {
              let otherData = "";
              let idNumber = row[0];
              rows[0].slice(1).forEach((item, index) => {
                item = item.replace(/\r/g, "");
                otherData += item + ": " + row[index] + "; ";
              });

              if (row[0].includes("\r")) {
                idNumber = row[0].replace(/\r/g, "");
              }

              let rowObj = {
                idNumber: idNumber,
                otherData: otherData,
              };

              if (row[0] !== "" && row[0] !== undefined) {
                tempData.push(rowObj);
              }
            });

            if (tempData.length > 0) {
              setData(tempData);
            }
          } else {
            toast.warning("This file is empty!");
          }
        } else {
          toast.warning("Wrong file format! Please check sample file!");
          status = 0;
        }
      };

      if (status === 1) {
        // setFiles(fileItems);
      }

      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setData([]);
    setFileName("");
    setCsvFile(null);
    isSetUploadFile = false;
  };

  const handleStartProcess = async () => {
    let formDataObj = {
      clientId: userId,
      records: data.length,
      status: "Processing",
      fileName: fileName,
      uploadedBy: userId,
      uploadDate: new Date().toISOString(),
      uploadedFile: csvFile,
    };

    let formData = new FormData();
    Object.entries(formDataObj).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await addMatchAPI(formData)
      .then(async (res) => {
        data.forEach((matchItem) => {
          matchItem.matchId = res.data.id;
        });

        await addMatchDataAPI(data)
          .then((response) => {
            toast.success(
              "Started to process uploaded file. We will return back soon!"
            );
            setData([]);
            setFileName("");
            setCsvFile(null);
          })
          .catch((err) => {
            if (err.response) {
              toast.error(err.response.data);
            } else {
              toast.error("Failed to add match data!");
            }
          });
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data);
        } else {
          toast.error("Failed to add match record!");
        }
      });
  };

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  return (
    <>
      <Helmet>{/* <script src="/assets/js/fileupload.js"></script> */}</Helmet>
      <div className="card custom-card mt-4" id="upload_input">
        <div className="card-body">
          <FilePond
            type="file"
            onupdatefiles={(fileItems) => handleUploadCSV(fileItems)}
            onremovefile={handleRemoveFile}
            className="multiple-filepond"
            acceptedFileTypes={[".csv"]}
            name="filepond"
            allowReorder="true"
            maxFileSize="100MB"
            labelIdle='<i class="bi bi-cloud-arrow-up" style="font-size: 25px;"></i><br/> <span style="font-size: 16px;">Drag & Drop Your CSV File or <span class="filepond--label-action">Browse</span></span>'
          />
          <p className="mt-2 flex">
            See &nbsp;
            <a
              href={`${process.env.REACT_APP_BACKEND_API}/Uploads/sample1.csv`}
              className="underline text-[#266FFE]"
            >
              sample
            </a>
            &nbsp; file for example! File must be in .csv format.{" "}
          </p>
          <div className="w-[98%] mx-auto mt-4 block">
            <button
              type="button"
              onClick={() => handleStartProcess()}
              disabled={data.length > 0 ? false : true}
              className={`btn btn-wave w-full ${
                data.length > 0 ? "btn-primary" : "btn-primary-ghost"
              }`}
            >
              Start Process
            </button>
          </div>
        </div>
        <div className="card custom-card d-none">
          <div className="card-header">
            <div className="card-title">Dropzone</div>
          </div>
          <div className="card-body">
            <form
              data-single="true"
              method="post"
              action="https://httpbin.org/post"
              className="dropzone"
            ></form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
