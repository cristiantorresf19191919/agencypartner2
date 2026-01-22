// ❌ The Bad Way (Template Method Anti-Pattern in React/TypeScript)
// Duplicate code across components - no shared algorithm structure

import React from "react";

// ❌ DOC file processor component - contains duplicate logic
const DOCDataMiner: React.FC<{ path: string }> = ({ path }) => {
  const mine = () => {
    // ❌ Duplicate: opening file
    console.log("Opening DOC file: " + path);
    
    // ❌ Unique: extracting data
    console.log("Extracting data from DOC format...");
    const rawData = "DOC: Document content";
    
    // ❌ Duplicate: parsing data
    console.log("Parsing raw data...");
    const parsedData = rawData.toUpperCase();
    
    // ❌ Duplicate: analyzing data
    console.log("Analyzing data...");
    console.log("Found " + parsedData.length + " characters");
    
    // ❌ Duplicate: generating report
    console.log("Generating report...");
    console.log("Report: " + parsedData);
    
    // ❌ Duplicate: closing file
    console.log("Closing DOC file");
  };

  return <button onClick={mine}>Mine DOC File</button>;
};

// ❌ CSV file processor component - contains duplicate logic
const CSVDataMiner: React.FC<{ path: string }> = ({ path }) => {
  const mine = () => {
    // ❌ Duplicate: opening file
    console.log("Opening CSV file: " + path);
    
    // ❌ Unique: extracting data
    console.log("Extracting data from CSV format...");
    const rawData = "CSV: name,age,city";
    
    // ❌ Duplicate: parsing data
    console.log("Parsing raw data...");
    const parsedData = rawData.toUpperCase();
    
    // ❌ Duplicate: analyzing data
    console.log("Analyzing data...");
    console.log("Found " + parsedData.length + " characters");
    
    // ❌ Duplicate: generating report
    console.log("Generating report...");
    console.log("Report: " + parsedData);
    
    // ❌ Duplicate: closing file
    console.log("Closing CSV file");
  };

  return <button onClick={mine}>Mine CSV File</button>;
};

// ❌ PDF file processor component - contains duplicate logic
const PDFDataMiner: React.FC<{ path: string }> = ({ path }) => {
  const mine = () => {
    // ❌ Duplicate: opening file
    console.log("Opening PDF file: " + path);
    
    // ❌ Unique: extracting data
    console.log("Extracting data from PDF format...");
    const rawData = "PDF: Page 1 content";
    
    // ❌ Duplicate: parsing data
    console.log("Parsing raw data...");
    const parsedData = rawData.toUpperCase();
    
    // ❌ Duplicate: analyzing data
    console.log("Analyzing data...");
    console.log("Found " + parsedData.length + " characters");
    
    // ❌ Duplicate: generating report
    console.log("Generating report...");
    console.log("Report: " + parsedData);
    
    // ❌ Duplicate: closing file
    console.log("Closing PDF file");
  };

  return <button onClick={mine}>Mine PDF File</button>;
};

// ❌ Client component with conditionals
const DataMiningApp: React.FC = () => {
  const [filePath, setFilePath] = React.useState("document.doc");
  const fileType = filePath.substring(filePath.lastIndexOf('.') + 1);

  // ❌ Using conditionals to render the right component
  const renderMiner = () => {
    if (fileType === "doc") {
      return <DOCDataMiner path={filePath} />;
    } else if (fileType === "csv") {
      return <CSVDataMiner path={filePath} />;
    } else if (fileType === "pdf") {
      return <PDFDataMiner path={filePath} />;
    }
    return null;
  };

  return (
    <div>
      <input
        type="text"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
        placeholder="Enter file path"
      />
      {renderMiner()}
      {/* ❌ Problems:
          1. Lots of duplicate code (parsing, analyzing, reporting)
          2. If we need to change the algorithm, we must change it in all components
          3. Client code uses conditionals instead of polymorphism
          4. Hard to maintain and extend
      */}
    </div>
  );
};

export { DataMiningApp };
