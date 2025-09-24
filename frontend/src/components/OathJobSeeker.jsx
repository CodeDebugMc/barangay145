import React from "react";
import CaloocanLogo from "../assets/CaloocanLogo.png";
import Logo145 from "../assets/Logo145.png";

const OathJobSeeker = () => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: "#f2f2f2",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflow: "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "8.5in",
          height: "11.5in",
          margin: "40px auto",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          background: "#fff",
        }}
      >
        {/* Logos */}
        <img
          src={CaloocanLogo}
          alt="City Logo"
          style={{ position: "absolute", width: "90px", top: "28px", left: "32px" }}
        />
        <img
          src={Logo145}
          alt="Barangay Logo"
          style={{ position: "absolute", width: "110px", top: "26px", right: "32px" }}
        />

        {/* Watermark */}
        <img src={Logo145} alt="Watermark" style={styles.watermarkImg} />

        {/* Header */}


        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            width: "100%",
            textAlign: "center",
            fontFamily: '"Arial Black", sans-serif',
            fontSize: "14pt",
            letterSpacing: "2px",
          }}
        >
          OATH OF
        </div>
        <div
          style={{
            position: "absolute",
            top: "80px",
            width: "100%",
            textAlign: "center",
            fontFamily: '"Arial Black", sans-serif',
            fontSize: "18pt",
            letterSpacing: "2px",
          }}
        >
          UNDERTAKING
        </div>

        {/* Body Intro */}
        <div
          style={{
            position: "absolute",
            top: "140px",
            left: "80px",
            width: "640px",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            lineHeight: 1.6,
            textAlign: "justify",
          }}
        >
          I, <span style={{ textDecoration: 'underline', fontWeight: 'bold'}}> RODJEN  DE GUZMAN  ROXAS </span>  , 
          <b> twenty seven yrs. old of age </b>, is Bonafide resident of  <b> # 148  </b> Mabikas St., <b> Brgy. 145,  Zone 13, </b> 
          District 1, Bagong  Barrio  Caloocan  City for One year, availing the benefits of <b> <i> Republic Act 11261,</i></b>  
          otherwise known as the <b> <i>  First Time Jobseeker Act of 2019, </i> </b> do hereby declare, agree and undertake to abide and be bound by the following:
        </div>

        {/* List */}
        <div
        style={{
            position: "absolute",
            top: "250px",
            left: "100px",
            width: "610px",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            lineHeight: 1.6,
            textAlign: "justify",
        }}
        >
        <p>
            1. That this is the first time that I will actively look for a job, and
            therefore requesting that a Barangay Certification be issued in my favor
            to avail the benefits of the law;
        </p>
        <p>
            2. That I am aware that the benefit and privilege/s under the said law
            shall be valid only for one (1) year from the date that the Barangay
            Certificate is issued;
        </p>
        <p>3. That I can avail the benefits of the law only once;</p>
        <p>
            4. That I understand that my personal information shall be included in the
            Roster/List of First Time Jobseekers and will not be used for any unlawful
            purposes;
        </p>
        <p>
            5. That I will inform and/or report to the Barangay personally, through
            text or other means, or through my family/relatives once I get employed;
            and
        </p>
        <p>
            6. That I am not a beneficiary of the Job Start Program under R.A. No.
            10869 and other laws that give similar exemption for the documents of
            transaction exempted under R.A. No. 11261.
        </p>
        <p>
            7. That if issued the requested Certification, I will not use the same in
            any fraud, neither falsify nor help and/or assist in the fabrication of
            the said certification.
        </p>
        <p>
            8. That this undertaking is made solely for the purpose of obtaining a
            Barangay Certification consistent with the objective of R.A. No. 11261 and
            not for any other purpose.
        </p>
        <p>
            9. That I consent to the use of my personal information pursuant to the
            Data Privacy Act and other applicable laws, rules, and regulations.
        </p>
        </div>

        <div
            style={{
                position: "absolute",
                bottom: '230px', // adjust depending on where you want it
                left: "140px", // adjust left margin
                width: "610px",
                fontFamily: '"Times New Roman", serif',
                fontSize: "12pt",
                lineHeight: 1.6,
                textAlign: "justify",
            }}
            >
            Signed this 17th day Sept., 2025, in Barangay 145 Zone 13 District 1 at the
            City of Caloocan.
            </div>



        {/* Bottom Signatures */}
        <div
          style={{
            position: "absolute",
            bottom: "130px",
            right: "30px",
            width: "320px",
            textAlign: "center",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
          }}
        >
          <div style={{ borderTop: "1px solid #000", width: "80%", margin: "0 auto 6px auto" }}></div>
                    <div>RODNEY DE GUZMAN-ROXAS</div>
          <div> First Time Job Seeker</div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "28px",
            width: "320px",
            textAlign: "center",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            fontWeight: "bold",
          }}
        >
          <div style={{ borderTop: "1px solid #000", width: "80%", margin: "0 auto 6px auto" }}></div>

          <div style={{ marginTop: "-4px", textAlign: "center", fontFamily: '"Times New Roman", serif', fontSize: "12pt" }}>
            <div>Roselyn Pestilos Anore</div>
            <div>Barangay Secretary</div>
            <div>(Barangay Official/Designation/Position)</div>
            </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {},
  watermarkImg: {
    position: "absolute",
    top: "200px",
    left: "50%",
    transform: "translateX(-50%)",
    opacity: 0.2,
    width: "650px",
    pointerEvents: "none",
    zIndex: 0,
  },
  republic: {},
  city: {},
  barangay: {},
  office: {},
  lupon: {},
  date: {},
  caseInfo: {},
  title: {},
  content: {},
  preparedBy: {},
  signature: {},
};

export default OathJobSeeker;
