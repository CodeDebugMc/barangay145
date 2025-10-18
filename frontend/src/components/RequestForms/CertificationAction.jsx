import React from 'react';
import CaloocanLogo from '../../assets/CaloocanLogo.png';
import Logo145 from '../../assets/Logo145.png';

const CertificationAction = () => {
  return (
    <div style={styles.page}>
      {/* Logos */}
      <img
        src={CaloocanLogo}
        alt="City Logo"
        style={{
          width: '100px',
          position: 'absolute',
          top: '20px',
          left: '20px',
        }}
      />
      <img
        src={Logo145}
        alt="Barangay Logo"
        style={{
          width: '120px',
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}
      />

      {/* Watermark */}
      <img src={Logo145} alt="Watermark" style={styles.watermarkImg} />

      {/* Header */}
      <div
        style={{
          fontFamily: '"Lucida Calligraphy", cursive',
          fontSize: '20px',
          textAlign: 'center',
        }}
      >
        Republic of the Philippines
      </div>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '20px',
          textAlign: 'center',
        }}
      >
        CITY OF CALOOCAN
      </div>
      <div
        style={{
          fontFamily: 'Arial Black, Gadget, sans-serif',
          fontSize: '15px',
          textAlign: 'center',
        }}
      >
        BARANGAY 145 ZONES 13 DIST. 1 <br />
        Tel. No. 8711-7134
      </div>
      <div
        style={{
          fontFamily: 'Arial Black, Gadget, sans-serif',
          fontSize: '20px',
          textAlign: 'center',
          marginBottom: '20px', // space below
        }}
      >
        OFFICE OF THE BARANGAY CHAIRMAN
      </div>
      <div style={styles.lupon}>OFFICE OF THE LUPONG TAGAPAMAYAPA</div>

      <div style={styles.date}>January 06, 2025</div>

      <div style={styles.caseInfo}>
        BARANGAY CASE NO. 2024-1115 <br />
        FOR: Unsettled Money Matter
      </div>

      {/* Parties */}
      <div style={styles.content}>
        <p>
          <b>MARILYN SESE</b>
          <br />
          <b>COMPLAINANT</b>
        </p>
        <p style={{ textAlign: 'left' }}>-against-</p>
        <p>
          <b>ANGELO AREVALO</b>
          <br />
          <b>RESPONDENT</b>
        </p>
      </div>

      <div
        style={{
          fontFamily: 'Calibri',
          fontSize: '20px',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        CERTIFICATION TO FILE ACTION
      </div>
      <div style={styles.content}>
        <b style={{ paddingBottom: '150px' }}>This is to certify that:</b>
        <ol style={{ paddingLeft: '7.5em', paddingBottom: '30px' }}>
          {' '}
          {/* 2 tabs ≈ 4em */}
          <li style={{ marginBottom: '15px' }}>
            <b>This complaint was filed on 15TH day of November, 2024.</b>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <b>
              There has no personal confrontation between the parties before the
              Punong Barangay because the respondent was absent and that
              mediation failed.
            </b>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <b>
              The Pangkat Tagapagkasundo was constituted but there has been no
              personal confrontation before the Pangkat likewise did not result
              into a settlement because the respondent was absent.
            </b>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <b>
              Therefore, the corresponding complaint for the dispute may now be
              filed in the court/government office.
            </b>
          </li>
        </ol>
      </div>

      <div style={styles.content}>
        <b>Issued this 6th day of January, 2025, at Barangay 145 office.</b>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '60px',
          width: '100%',
          fontStyle: 'italic',
        }}
      >
        {/* Prepared By */}
        <div>
          <div
            style={{
              fontFamily: 'Calibri, sans-serif',
              fontSize: '15px',
              textAlign: 'center',
            }}
          >
            <b>Prepared by:</b> <br />
            <br />
            <br />
            <b style={{ fontSize: '20px' }}>Rosalina P. Anore</b>
            <br />
            <b
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: '15px',
              }}
            >
              Secretary
            </b>
          </div>
        </div>

        {/* Signature */}
        <div
          style={{
            textAlign: 'right',
            fontFamily: 'Calibri, sans-serif',
            fontSize: '22px',
          }}
        >
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <b>ARNOLD L. DONDONAYOS</b>
          <br />
          <b>Barangay 145 Chairperson</b>
        </div>
      </div>
    </div> // closes the main page div
  );
};

const styles = {
  page: {
    width: '210mm', // A4 width
    minHeight: '297mm', // A4 height
    margin: '20px auto',
    padding: '40px',
    border: '1px solid #000',
    position: 'relative',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    fontWeight: 'bold', // all text bold by default
    maxWidth: '100%',
    overflow: 'auto',
  },
  watermarkImg: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.2,
    width: '60%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  republic: {
    textAlign: 'center',
    fontFamily: "'Quintessential', cursive",
    fontSize: '18px',
  },
  city: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
  },
  barangay: {
    textAlign: 'center',
    fontFamily: "'Arial Black', Gadget, sans-serif",
    fontSize: '12px',

    fontWeight: 'normal', // not bold
  },
  office: {
    textAlign: 'center',
    fontFamily: 'Arial black, ',
    fontSize: '20px',
    marginBottom: '30px',
    fontWeight: 'bold',
  },
  lupon: {
    textAlign: 'center',
    fontFamily: 'Calibri, sans-serif',
    fontStyle: 'italic',
    fontSize: '16px',
    marginBottom: '2px',
    fontWeight: 'bold',
  },
  date: {
    textAlign: 'right',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '14px',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  caseInfo: {
    textAlign: 'right',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '14px',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '17px',

    margin: '30px 0',
    fontStyle: 'italic',
  },
  content: {
    margin: '20px 0',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '14px',
    position: 'relative',
    zIndex: 1,
    fontStyle: 'italic',
  },
  preparedBy: {
    marginTop: '60px',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '14px',
    width: '15%', // Optional: restrict width for proper alignment
    display: 'inline-block',
    fontStyle: 'italic',
  },

  signature: {
    marginTop: '40px',
    fontFamily: 'Calibri, sans-serif',
    fontSize: '14px',
    fontStyle: 'italic',
  },
};

export default CertificationAction;
