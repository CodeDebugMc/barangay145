import React from "react";

const Indigency = () => {
 return (
    <div style={styles.wrapper}>
      <div style={styles.page}>
        <div style={styles.headerBlock}>
          Republic of the Philippines <br />
          CITY OF CALOOCAN <br />
          BARANGAY 145 ZONES 13 DIST. 1 <br />
          Tel. No. 8711 - 7134
        </div>

        <div style={styles.headerCenter}>
          <div style={styles.office}>OFFICE OF THE BARANGAY CHAIRMAN</div>
        </div>

        <div style={styles.title}>Certificate of Indigency</div>

        <div style={styles.date}>Date: Nov. 12, 2024</div>

        <div style={styles.content}>
          This is to certify that the person whose name and thumb print appear
          hereon has requested a Certificate of Indigency from this office and
          the result/s is/are listed below and valid for six (6) months only.
        </div>

        <div style={styles.field}>
          <span style={styles.label}>NAME:</span> DANILO LISING MIRANDA JR.
          &nbsp; VELASQUEZ Matimyas
        </div>

        <div style={styles.field}>
          <span style={styles.label}>Address:</span> # 207 Gen. Tirona St.,
          Brgy. 145, Bag. Bo., Caloocan City
        </div>

        <div style={styles.field}>
          <span style={styles.label}>Provincial Address:</span> NCR
        </div>

        <div style={styles.field}>
          <span style={styles.label}>Date of Birth:</span> Dec. 26, 1966 &nbsp;
          <span style={styles.label}>Age:</span> 57 yrs. old
        </div>

        <div style={styles.field}>
          <span style={styles.label}>Civil Status:</span> Married &nbsp;
          <span style={styles.label}>Contact No.:</span> 09568719212
        </div>

        <div style={styles.field}>
          <span style={styles.label}>Residence:</span> Residence in this
          Barangay and certifies that he/she belongs to indigent families.
        </div>

        <div style={styles.content}>
          This certification is being issued upon request for DSWD requirement.
        </div>

        <div style={styles.signature}>
          Applicant Signature ___________________________
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // full page center
    backgroundColor: "#fff", // white background
  },
  page: {
    fontFamily: "'Times New Roman', Times, serif",
    width: "70%", // certificate width
    padding: "40px",
    color: "#000",
    lineHeight: 1.4,
    border: "1px solid #000", // optional border like a document
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  headerBlock: {
    textAlign: "center", // 👈 now centered
    fontSize: "0.95rem",
    marginBottom: "10px",
  },
  headerCenter: {
    textAlign: "center",
    marginBottom: "8px",
  },
  office: {
    marginTop: "6px",
    fontWeight: "bold",
    letterSpacing: "0.04em",
  },
  title: {
    textAlign: "center",
    margin: "36px 0 12px",
    fontSize: "1.4rem",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  date: {
    textAlign: "right",
    marginBottom: "20px",
    fontSize: "0.95rem",
  },
  content: {
    marginTop: "6px",
    fontSize: "1rem",
  },
  field: {
    margin: "10px 0",
    fontSize: "1rem",
  },
  label: {
    fontWeight: "700",
  },
  signature: {
    marginTop: "48px",
  },
};

export default Indigency;
