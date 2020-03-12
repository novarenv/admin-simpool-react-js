import React, { useState } from 'react'
import Modal from 'react-modal'
import {
  Button
} from 'reactstrap'

import Swal from '../Common/Swal'

const Documents = props => {
  const [modalPreview, setModalPreview] = useState(false)
  const [docImage, setDocImage] = useState(null)
  const [isImage, setIsImage] = useState(null)

  const setClientDocDlRes = (res, fileName) => {
    const link = document.createElement('a');
    link.href = res;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  }

  const handleModalPreview = doc => {
    setModalPreview(true)

    if (doc.type === "image/jpeg" || doc.type === "image/png") {
      setIsImage(true)

      if (props.docType === "loan") {
        props.actions.loansDocAttachment(
          {
            loanId: doc.parentEntityId,
            docId: doc.id
          },
          setDocImage
        )
      } else {
        props.actions.getDocAttach(
          {
            clientId: doc.parentEntityId,
            documentId: doc.id
          },
          setDocImage
        )
      }
    } else {
      setIsImage(false)
    }
  }

  const handleDownload = doc => {
    console.log(doc)
    if (props.docType === "loan") {
      props.actions.loansDocAttachment(
        {
          loanId: doc.parentEntityId,
          docId: doc.id,
          fileName: doc.fileName
        },
        setClientDocDlRes
      )
    } else {
      props.actions.getDocAttach(
        {
          clientId: doc.parentEntityId,
          documentId: doc.id,
          fileName: doc.fileName
        },
        setClientDocDlRes
      )
    }
  }

  const swalOption = {
    title: 'Are you sure?',
    text: 'Do you want to delete this document?',
    icon: 'warning',
    buttons: {
      cancel: {
        text: 'No, I\'d like to save it!',
        value: null,
        visible: true,
        className: "",
        closeModal: false
      },
      confirm: {
        text: 'Yes, delete it!',
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: false
      }
    }
  }

  const swalCallback = (isConfirm, swal, deleteDocument, id) => {
    if (isConfirm) {
      swal("Deleted!", "Your document has been deleted.", "success")
      deleteDocument(id)
    } else {
      swal("Cancelled", "Your document is safe :)", "error");
    }
  }

  return (
    <div>
      <Modal
        isOpen={modalPreview}
        onRequestClose={() => setModalPreview(false)}
        ariaHideApp={false}
      >
        <div className="container-fluid">
          <div className="row">
            <Button outline className="col-4 col-lg-2" color="primary"
              onClick={() => setModalPreview(false)}
            >
              Kembali
            </Button>
          </div>

          <div className="mb-3 center-parent">
            <h1>Preview Image</h1>
          </div>

          <div className="center-parent mt-3">
            {
              isImage != null
                ? isImage
                  ? docImage != null
                    ? (
                      <div>
                        <div className="row justify-content-center">
                          <img className="col-md-6" src={docImage} alt="Doc" />
                        </div>
                      </div>
                    )
                    : null
                  : (<div>Dokumen bukanlah gambar PNG atau JPEG</div>)
                : null
            }
          </div>
        </div>
      </Modal>

      <div className="row ft-detail list-header d-flex justify-content-center center-parent">
        <div className="col-3">
          <span>Name</span>
        </div>
        <div className="col-3">
          <span>Description</span>
        </div>
        <div className="col-3">
          <span>File Name</span>
        </div>
        <div className="col-3">
          <span>Actions</span>
        </div>
      </div>
      {
        Array.isArray(props.documents) && props.documents.length > 0
          ? props.documents.map((doc, key) => {
            return (
              <div key={"Documents " + key}>
                <div className="row ft-detail list-docs d-flex justify-content-center">
                  <div className="col-3">
                    <span>{doc.name}</span>
                  </div>
                  <div className="col-3">
                    <span>{doc.description}</span>
                  </div>
                  <div className="col-3">
                    <span>{doc.fileName}</span>
                  </div>
                  <div className="col-3 row d-flex justify-content-center center-parent">
                    <div>
                      <button className="btn btn-sm btn-secondary mr-1" type="button" onClick={() => handleModalPreview(doc)}>
                        <em className="fa fa-eye" />
                      </button>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-secondary mr-1" type="button" onClick={() => handleDownload(doc)}
                        download={
                          docImage != null
                            ? docImage
                            : null
                        }
                      >
                        <em className="fa fa-download" />
                      </button>
                    </div>
                    <Swal
                      options={swalOption}
                      callback={swalCallback}
                      deleterow={props.deleteDoc}
                      id={doc.id}
                    >
                      <button className="btn btn-sm btn-secondary" type="button">
                        <em className="fa fa-times" />
                      </button>
                    </Swal>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <hr className="col-11 hr-margin-0" />
                </div>
              </div>
            )
          })
          : null
      }
    </div>
  )
}

export default Documents