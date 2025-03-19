// src/components/appointment/AppointmentPrintService.js
import React, { useRef } from 'react';

/**
 * Function to handle appointment printing
 * @param {Object} appointment - The appointment to print
 * @returns {Object} - The print functions and ref
 */
export const usePrintAppointment = () => {
  const printFrameRef = useRef(null);
  
  // Function to generate print iframe HTML
  const generatePrintContent = (appointment) => {
    return `
      <html>
        <head>
          <title>Appointment Slip - ${appointment.patientName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px solid #ccc;
            }
            .section {
              margin-bottom: 20px;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .label {
              font-weight: bold;
              margin-right: 5px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #777;
            }
            .note {
              border-top: 1px solid #ccc;
              padding-top: 20px;
              font-size: 14px;
              color: #666;
            }
            .reason {
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Mukti Hospital</h1>
            <p>123 Medical Center Road, Dhaka, Bangladesh</p>
            <p>Phone: 01XXXXXXXXX | Email: info@muktihospital.com</p>
            <h2>Appointment Confirmation</h2>
            <p>Date: ${appointment.createdAt ? new Date(appointment.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          
          <div class="grid">
            <div class="section">
              <h3>Patient Information</h3>
              <p><span class="label">Name:</span> ${appointment.patientName}</p>
              <p><span class="label">Phone:</span> ${appointment.mobileNumber}</p>
              ${appointment.age ? `<p><span class="label">Age:</span> ${appointment.age} years</p>` : ''}
              ${appointment.weight ? `<p><span class="label">Weight:</span> ${appointment.weight} kg</p>` : ''}
              ${appointment.bloodGroup ? `<p><span class="label">Blood Group:</span> ${appointment.bloodGroup.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}</p>` : ''}
            </div>
            
            <div class="section">
              <h3>Appointment Details</h3>
              <p><span class="label">Doctor:</span> ${appointment.doctorName}</p>
              <p><span class="label">Serial Number:</span> ${appointment.serialNumber || 'Pending'}</p>
              ${appointment.consultationFee ? `<p><span class="label">Fee:</span> ${appointment.consultationFee} Tk</p>` : ''}
              ${appointment.paymentMethod ? `<p><span class="label">Paid via:</span> ${appointment.paymentMethod}</p>` : ''}
            </div>
          </div>
          
          ${appointment.reason ? `
          <div class="section">
            <h3>Appointment Reason</h3>
            <p class="reason">${appointment.reason}</p>
          </div>
          ` : ''}
          
          <div class="note">
            <p>Please arrive 15 minutes before your appointment time with this slip.</p>
            <p>For any changes or cancellations, please contact us 24 hours in advance.</p>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>Appointment ID: ${appointment.id}</p>
          </div>
        </body>
      </html>
    `;
  };
  
  // Function to handle print process
  const handlePrint = (appointment) => {
    if (!appointment) return;
    
    setTimeout(() => {
      if (printFrameRef.current) {
        const iframe = printFrameRef.current;
        const iframeWindow = iframe.contentWindow || iframe;
        
        try {
          iframeWindow.focus();
          iframeWindow.print();
        } catch (error) {
          console.error("Printing failed:", error);
          alert("Printing failed. Please try again.");
        }
      }
    }, 500);
  };
  
  // Render hidden iframe component
  const PrintFrame = ({ appointment }) => {
    if (!appointment) return null;
    
    return (
      <iframe
        ref={printFrameRef}
        style={{
          height: '0',
          width: '0',
          position: 'absolute',
          display: 'none',
        }}
        title="Print Frame"
        srcDoc={generatePrintContent(appointment)}
      />
    );
  };
  
  return {
    handlePrint,
    PrintFrame
  };
};

export default usePrintAppointment;