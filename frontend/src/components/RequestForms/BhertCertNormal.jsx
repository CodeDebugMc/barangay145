import React from "react";

import CaloocanLogo from '../../assets/CaloocanLogo.png';
import Logo145 from '../../assets/Logo145.png';
import BagongPilipinas from '../../assets/BagongPilipinas.png';


export default function BhertCertJSX() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        background: "#fff",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        className="paper"
        style={{
          position: "relative",
          width: "794px",
          height: "1123px",
          margin: "auto",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          background: "#fff",
        }}
      >
        {/* Logos */}
        <img
          src={CaloocanLogo}
          alt="Logo 1"
          style={{ position: "absolute", width: "80px", height: "80px", top: "60px", left: "40px" }}
        />
        <img
          src={BagongPilipinas}
          alt="Logo 2"
          style={{ position: "absolute", width: "80px", height: "80px", top: "60px", left: "130px" }}
        />
        <img
          src={Logo145}
          alt="Logo 3"
          style={{ position: "absolute", width: "80px", height: "80px", top: "60px", right: "40px" }}
        />

        {/* Watermark */}
        <img
          src={Logo145}
          alt="Watermark"
          style={{
            position: "absolute",
            opacity: 0.12,
            width: "650px",
            left: "50%",
            top: "400px",
            transform: "translateX(-50%)",
          }}
        />

        {/* Header */}
        <div
          className="header-text"
          style={{ position: "absolute", top: "60px", width: "100%", textAlign: "center", fontFamily: "'Lucida Calligraphy', cursive", fontSize: "12pt", fontWeight: "bold" }}
        >
          Republic of the Philippines
        </div>
        <div
          className="header-text"
          style={{ position: "absolute", top: "85px", width: "100%", textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: "12pt", fontWeight: "bold" }}
        >
          CITY OF CALOOCAN
        </div>
        <div
          className="header-text"
          style={{ position: "absolute", top: "110px", width: "100%", textAlign: "center", fontFamily: "'Arial Black', sans-serif", fontSize: "12pt", fontWeight: "bold" }}
        >
          BARANGAY 145, ZONE 13, DIST. 1
        </div>
        <div
          className="header-text"
          style={{ position: "absolute", top: "135px", width: "100%", textAlign: "center", fontFamily: "'Arial Black', sans-serif", fontSize: "12pt", fontWeight: "bold" }}
        >
          Tel. No. 8711 - 7134
        </div>
        <div
          className="header-text"
          style={{ position: "absolute", top: "160px", width: "100%", textAlign: "center", fontFamily: "'Arial Black', sans-serif", fontSize: "12pt", fontWeight: "bold" }}
        >
          OFFICE OF THE BARANGAY CHAIRMAN
        </div>

        {/* Title */}
        <div style={{ position: "absolute", top: "220px", width: "100%", textAlign: "center" }}>
          <span
            className="barangay-title"
            style={{
              fontFamily: "'Times New Roman', Georgia, serif",
              fontSize: "24pt",
              display: "inline-block",
              color: "#0b7030",
              padding: "4px 70px",
              borderRadius: "8px",
              textDecoration: "underline",
            }}
          >
            B I R T H C E R T I F I C A T I O N
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            position: "absolute",
            top: "320px",
            left: "80px",
            width: "640px",
            textAlign: "justify",
            fontSize: "11pt",
            fontFamily: "Arial, sans-serif",
            color: "black",
            fontStyle: "italic",
          }}
        >
          TO WHOM IT MAY CONCERN:
          <p style={{ textIndent: "50px" }}>
            This is to certify that <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>Full Name</span>, is a Filipino citizen and resident of <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>Address</span> Bagong Barrio Caloocan City.
          </p>
          <p style={{ textIndent: "50px" }}>
            <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>He/She</span> is NOT INCLUDED in the list of household in this barangay who is being monitored with <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>COVID-19</span> and <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>he/she</span> is NOT INCLUDED in the list of persons who is being monitored in this barangay to the PUI or CONFIRMED with COVID-19. No symptoms of Covid-19 virus.
          </p>
          <p style={{ textIndent: "50px" }}>
            This certification is issued upon the request of <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>ST.PETER CHAPEL</span>, and for <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>HOSPITAL</span>, for whatever legal purposes it may serve. Done in the office of the Punong Barangay 145, Zone 13, District 1, City of Caloocan this <span style={{ color: "red", fontWeight: "bold", textDecoration: "underline" }}>Day/Month/Year</span>.
          </p>
        </div>

        {/* Applicant Signature */}
        <div
          style={{
            position: "absolute",
            top: "580px",
            left: "10px",
            width: "250px",
            textAlign: "center",
            fontFamily: "'Times New Roman', serif",
            fontSize: "11pt",
            fontWeight: "bold",
            fontStyle: "italic",
          }}
        >
          <div>Certified Correct:</div>
          <p style={{ color: "rgb(193,193,193)", textDecoration: "underline" }}>Signature</p>
          <div>Rosalina P. Anore</div>
          <div style={{ marginTop: "5px" }}>Secretary</div>
        </div>

        {/* Punong Barangay */}
        <div
          style={{
            position: "absolute",
            top: "680px",
            right: "-90px",
            width: "300px",
            textAlign: "left",
            fontWeight: "bold",
            fontStyle: "italic",
            fontSize: "11pt",
          }}
        >
          <div>Attested By:</div>
          <p style={{ color: "rgb(193,193,193)", textDecoration: "underline" }}>Signature</p>
          <div>Arnold Dondonayos</div>
          <div style={{ marginLeft: "5px" }}>Punong Barangay</div>
        </div>
      </div>
    </div>
  );
}
