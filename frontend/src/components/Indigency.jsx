import React from "react";
import CaloocanLogo from "../assets/CaloocanLogo.png";
import Logo145 from "../assets/Logo145.png";
import BagongPilipinas from "../assets/BagongPilipinas.png";

export default function BarangayClearance() {



    
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
          width: "8.5in", // Letter width
          height: "11in", // Letter height
          margin: "40px auto",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
          background: "#fff",
        }}
      >
        {/* Logos */}
        <img
          style={{ position: "absolute", width: "80px", height: "80px", top: "60px", left: "40px" }}
          src={CaloocanLogo}
          alt="Logo 1"
        />
        <img
          style={{ position: "absolute", width: "80px", height: "80px", top: "60px", left: "130px" }}
          src={BagongPilipinas}
          alt="Logo 2"
        />
        <img
          style={{ position: "absolute", width: "100px", height: "100px", top: "50px", right: "40px" }}
          src={Logo145}
          alt="Logo 3"
        />

        {/* Watermark */}
        <img
          style={{
            position: "absolute",
            opacity: 0.3,
            width: "500px",
            left: "50%",
            top: "250px",
            transform: "translateX(-50%)",
          }}
          src={Logo145}
          alt="Watermark"
        />

        {/* Header Text */}
        <div
          style={{
            position: "absolute",
            whiteSpace: "pre",
            textAlign: "center",
            width: "100%",
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: '"Lucida Calligraphy", cursive',
            top: "50px",
          }}
        >
          Republic of the Philippines
        </div>

        <div
          style={{
            position: "absolute",
            whiteSpace: "pre",
            textAlign: "center",
            width: "100%",
            fontSize: "13pt",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            top: "84px",
          }}
        >
          CITY OF CALOOCAN
        </div>

        <div
          style={{
            position: "absolute",
            whiteSpace: "pre",
            textAlign: "center",
            width: "100%",
            fontSize: "18px",
            fontWeight: "bold",
            fontFamily: '"Arial Black", sans-serif',
            top: "110px",
          }}
        >
          BARANGAY 145 ZONES 13 DIST. 1
        </div>

        <div
          style={{
            position: "absolute",
            whiteSpace: "pre",
            textAlign: "center",
            width: "100%",
            fontSize: "18px",
            fontWeight: "bold",
            fontFamily: '"Arial Black", sans-serif',
            top: "138px",
          }}
        >
          Tel. No. 8711 - 7134
        </div>

        <div
          style={{
            position: "absolute",
            whiteSpace: "pre",
            textAlign: "center",
            width: "100%",
            fontSize: "19px",
            fontWeight: "bold",
            fontFamily: '"Arial Black", sans-serif',
            top: "166px",
          }}
        >
          OFFICE OF THE BARANGAY CHAIRMAN
        </div>

        <div
          style={{
            position: "absolute",
            top: "220px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: '"Brush Script MT", cursive',
              fontSize: "30px",
              fontWeight: "normal",
              display: "inline-block",
              background: "#0b7030",
              color: "#fff",
              padding: "4px 70px",
              borderRadius: "8px",
            }}
          >
            Certificate of Indigency
          </span>
        </div>

        {/* Date */}
        <div
          style={{
            position: "absolute",
            whiteSpace: "pre",
            top: "320px",
            right: "250px",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            fontWeight: "bold",
            color: "red",
          }}
        >
          Date:
        </div>

        {/* Body */}
        <div
          style={{
            position: "absolute",
            whiteSpace: "pre",
            top: "370px",
            left: "80px",
            width: "640px",
            textAlign: "justify",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            fontWeight: "bold",
            color: "black",
          }}
        >
          To whom it may concern:<br />
          <span style={{ marginLeft: "50px" }}></span>This is to certify that the person whose name and thumb print
          appear<br /> here on has requested a Barangay Clearance from this office
          and the result/s<br />  is/arelisted below and valid for six (6) months only.
        </div>

        {/* Info */}
        <div
          style={{
            position: "absolute",
            whiteSpace: "pre",
            top: "470px",
            left: "80px",
            width: "640px",
            lineHeight: "1.6",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            fontWeight: "bold",
          }}
        >
          <div>
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Name:</span>{" "}<br />
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif' }}>Address:</span>{" "}<br />
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>Birthday:</span>{" "}
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif',  marginLeft: "320px" }}>Age:</span>{" "}<br />
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>Provincial Address:</span>{" "}
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif',  marginLeft: "200px" }}>Contact No.:</span>{" "}<br />
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>Civil Status:</span>{" "}<br />
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>Remarks:</span>{" "}<br />
            <span style={{ color: "black", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>
              Residence in this Barangay, no derogatory record
            </span>{" "}<br />
            <span style={{ color: "red", fontWeight: "bold", fontFamily: '"Times New Roman", serif'  }}>
              This certification is being issued upon request for
            </span>
          </div>
        </div>

        {/* Applicant Signature */}
        <div
          style={{
            position: "absolute",
            top: "750px",
            left: "50px",
            width: "250px",
            textAlign: "center",
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            fontWeight: "bold",
          }}
        >
          <div style={{ borderTop: "2px solid #000", width: "65%", margin: "auto"}}></div>
          <div style={{ color: "black", fontFamily: "inherit" }}>Applicant&apos;s Signature</div>
          <div
            style={{
              margin: "15px auto 0 auto",
              width: "150px",
              height: "75px",
              border: "1px solid #000",
            }}
          ></div>
        </div>

        {/* Punong Barangay */}
        <div
          style={{
            position: "absolute",
            top: "900px",
            right: "100px",
            width: "300px",
            textAlign: "center",
          }}
        >
          <div style={{ borderTop: "2.5px solid #000", width: "90%", margin: "auto" }}></div>
          <div
            style={{
              fontFamily: "Impact, sans-serif",
              fontSize: "25pt",
              fontWeight: "bold",
              backgroundImage: "linear-gradient(to bottom, orange 50%, yellow 20%, orange 70%)", 
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "1px black",
              display: "inline-block", // keeps gradient tight to text
            }}
          >
            Arnold Dondonayos
          </div>


          <div
            style={{
              fontFamily: '"Brush Script MT", cursive',
              fontSize: "20pt",
              color: "#000",
              marginTop: "-8px",
              fontWeight: "bold",
            }}
          >
            Punong Barangay
          </div>
        </div>
      </div>
    </div>
  );
}




