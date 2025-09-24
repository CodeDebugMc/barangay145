import React from "react";
import CaloocanLogo from "../assets/CaloocanLogo.png";
import Logo145 from "../assets/Logo145.png";

const SoloParentForm = () => {
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
          height: "11in",
          margin: "40px auto",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          background: "#fff",
        }}
      >
        {/* Placeholder for Logos */}
        <div
          style={{ 
            position: "absolute", 
            width: "90px", 
            height: "100px",
            top: "28px", 
            left: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
          }}
        >
         <img
            src={CaloocanLogo}
            alt="City Logo"
            style={{ position: "absolute", width: "90px", top: "20px", left: "32px" }}
        />
        </div>
        <div
          style={{ 
            position: "absolute", 
            width: "92px", 
            height: "107px",
            top: "26px", 
            right: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: "#999"
          }}
        >
          <img
            src={Logo145}
            alt="Logo 145"
            style={{ position: "absolute", width: "110px", top: "5px", right: '5px' }}
        />
        </div>

        {/* Watermark placeholder */}
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.2,
            width: "500px",
            height: "500px",
            border: "2px dashed #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <img
            src={Logo145}
            alt="Logo 145"
            
        />
        </div>

        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: "70px",
            width: "100%",
            textAlign: "center",
            fontSize: "14pt",
            fontWeight: "bold",
            lineHeight: 1.5,
          }}
        >
          <div style={{fontFamily: 'Lucida Calligraphy, "Times New Roman", serif',}}>Republic Of the Philippines</div>
          <div style={{ fontSize: "13pt" }}>City of Caloocan</div>
          <div style={{ fontSize: "12pt", marginTop: "4px", fontFamily: 'Bodoni MT Black' }}>BARANGAY 145 ZONE 13 DISTRICT 1</div>
          <div style={{ fontSize: "11pt", marginTop: "8px", fontFamily: 'Bodoni MT Black'  }}>OFFICE OF THE BARANGAY CAPTAIN</div>
        </div>

        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: "190px",
            width: "100%",
            textAlign: "center",
            fontFamily: 'Bodoni MT Black, "Times New Roman", serif',
            fontSize: "18pt",
            fontWeight: "bold",
            textDecoration: "underline",
            letterSpacing: "1px",
          }}
        >
          BARANGAY CERTIFICATION
        </div>

        {/* Main Content */}
        <div
          style={{
            position: "absolute",
            top: "270px",
            left: "60px",
            width: "680px",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            lineHeight: 1.8,
            textAlign: "justify",
            zIndex: 1,
          }}
        >
          <p style={{ marginBottom: "20px" }}>
            <strong>This is to certify that, ANGELIE L. LOTERTE, 31 y/o is a Bonafide 
            resident of #141 Gen. Tirona St. Barangay 145 of this city, since 2021.</strong>
          </p>

          <p style={{ marginBottom: "20px" }}>
            <strong>Upon verification, she is currently not in any form of relationship 
            and is qualified to apply for a Solo Parent ID based on the classification 
            set forth by RA 8972, otherwise known as the Solo Parents Welfare Act 2000.</strong>
          </p>

          <p style={{ marginBottom: "20px" }}>
            <strong>Ms. ANGELIE L. LOTERTE, is UNWED, since, 2021.</strong>
          </p>

          <p style={{ marginBottom: "20px" }}>
            <strong>Moreover ANGELIE L. LOTERTE has two qualified dependent living with 
            her, her daughter NIGELLA NICOLE LOTERTE, 2y/o, birthday-August 01, 2021; 
            her son NIGEL ANGELO LOTERTE 06y/o, birthday- Sept. 09, 2017, Kinder student.</strong>
          </p>

          <p style={{ marginBottom: "20px" }}>
            <strong>ANGELIE L. LOTERTE is unemployed.</strong>
          </p>

          <p style={{ marginBottom: "30px" }}>
            <strong>This certification is issued solely for the purpose of authentication 
            of Ms. ANGELIE L. LOTERTE, qualification to apply for a Solo Parent ID 
            and receive all benefits that go with it.</strong>
          </p>

          <p style={{ marginBottom: "40px" }}>
            <strong>Issued this 24TH day of NOVEMBER, 2023.</strong>
          </p>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "60px",
            width: "680px",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            fontWeight: "bold",
          }}
        >
          <div style={{ marginBottom: "50px" }}>
            Brgy. SOLO PARENT Focal Person/Barangay Officials
          </div>
          
          {/* Signatures */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "50px"}}>
            <div style={{ textAlign: "center", width: "300px" }}>
              <div style={{ borderTop: "1px solid #000", width: "80%", margin: "0 auto 8px auto" }}></div>
              <div style={{ fontWeight: "bold" }}>ROSALINA P. ANORE</div>
              <div style={{ fontWeight: "bold" }}>Brgy. Secretary</div>
            </div>
            
            <div style={{ textAlign: "center", width: "300px" }}>
              <div style={{ borderTop: "1px solid #000", width: "80%", margin: "0 auto 8px auto" }}></div>
              <div style={{ fontWeight: "bold" }}>ARNOLD DONDONAYOS</div>
              <div style={{ fontWeight: "bold" }}>Barangay Captain</div>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        
      </div>
    </div>
  );
};

export default SoloParentForm;