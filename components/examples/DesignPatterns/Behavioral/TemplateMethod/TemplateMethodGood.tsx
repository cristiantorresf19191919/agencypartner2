// ✅ The Good Way (Template Method Pattern in React/TypeScript)
// Define algorithm skeleton in base hook/function, let implementations override specific steps

import React, { useCallback } from "react";

// ✅ Abstract base class (using TypeScript abstract class)
abstract class DataMiner {
  // ✅ Template method - defines the algorithm structure
  // This is the skeleton that cannot be overridden
  public mine(path: string): void {
    this.openFile(path);
    const rawData = this.extractData(path);
    const parsedData = this.parseData(rawData);
    this.analyzeData(parsedData);
    this.generateReport(parsedData);
    this.closeFile(path);
  }

  // ✅ Abstract steps - must be implemented by subclasses
  protected abstract extractData(path: string): string;

  // ✅ Optional steps with default implementation
  // Subclasses can override if needed
  protected parseData(rawData: string): string {
    console.log("Parsing raw data...");
    return rawData.toUpperCase();
  }

  protected analyzeData(data: string): void {
    console.log("Analyzing data...");
    console.log("Found " + data.length + " characters");
  }

  protected generateReport(data: string): void {
    console.log("Generating report...");
    console.log("Report: " + data);
  }

  // ✅ Hooks - optional steps with default implementation
  // Subclasses can override to add behavior at specific points
  protected openFile(path: string): void {
    console.log("Opening file: " + path);
  }

  protected closeFile(path: string): void {
    console.log("Closing file");
  }
}

// ✅ Concrete implementation for DOC files
class DOCDataMiner extends DataMiner {
  protected extractData(path: string): string {
    console.log("Extracting data from DOC format...");
    return "DOC: Document content";
  }

  protected openFile(path: string): void {
    console.log("Opening DOC file: " + path);
  }

  protected closeFile(path: string): void {
    console.log("Closing DOC file");
  }
}

// ✅ Concrete implementation for CSV files
class CSVDataMiner extends DataMiner {
  protected extractData(path: string): string {
    console.log("Extracting data from CSV format...");
    return "CSV: name,age,city";
  }

  protected openFile(path: string): void {
    console.log("Opening CSV file: " + path);
  }

  protected closeFile(path: string): void {
    console.log("Closing CSV file");
  }
}

// ✅ Concrete implementation for PDF files
class PDFDataMiner extends DataMiner {
  protected extractData(path: string): string {
    console.log("Extracting data from PDF format...");
    return "PDF: Page 1 content";
  }

  protected openFile(path: string): void {
    console.log("Opening PDF file: " + path);
  }

  protected closeFile(path: string): void {
    console.log("Closing PDF file");
  }

  // ✅ Can also override optional steps if needed
  protected parseData(rawData: string): string {
    console.log("Parsing PDF data with special formatting...");
    return rawData.toUpperCase() + " [PDF]";
  }
}

// ✅ Alternative: Using React hooks for Template Method pattern
interface DataMinerConfig {
  extractData: (path: string) => string;
  openFile?: (path: string) => void;
  closeFile?: (path: string) => void;
  parseData?: (rawData: string) => string;
}

const useDataMiner = (config: DataMinerConfig) => {
  const mine = useCallback(
    (path: string) => {
      // ✅ Template method structure
      const openFile = config.openFile || ((p: string) => console.log("Opening file: " + p));
      const closeFile = config.closeFile || ((p: string) => console.log("Closing file"));
      const parseData = config.parseData || ((raw: string) => {
        console.log("Parsing raw data...");
        return raw.toUpperCase();
      });

      openFile(path);
      const rawData = config.extractData(path);
      const parsedData = parseData(rawData);
      console.log("Analyzing data...");
      console.log("Found " + parsedData.length + " characters");
      console.log("Generating report...");
      console.log("Report: " + parsedData);
      closeFile(path);
    },
    [config]
  );

  return { mine };
};

// ✅ React component using the pattern
const DataMiningApp: React.FC = () => {
  const [filePath, setFilePath] = React.useState("document.doc");
  const fileType = filePath.substring(filePath.lastIndexOf('.') + 1);

  // ✅ Factory function to create appropriate miner
  const createMiner = (path: string): DataMiner => {
    const type = path.substring(path.lastIndexOf('.') + 1);
    switch (type) {
      case "doc":
        return new DOCDataMiner();
      case "csv":
        return new CSVDataMiner();
      case "pdf":
        return new PDFDataMiner();
      default:
        throw new Error("Unsupported file type: " + type);
    }
  };

  const handleMine = () => {
    const miner = createMiner(filePath);
    // ✅ No conditionals - uses polymorphism
    miner.mine(filePath);
  };

  // ✅ Alternative using hooks
  const docMiner = useDataMiner({
    extractData: (path) => {
      console.log("Extracting data from DOC format...");
      return "DOC: Document content";
    },
    openFile: (path) => console.log("Opening DOC file: " + path),
    closeFile: () => console.log("Closing DOC file"),
  });

  return (
    <div>
      <input
        type="text"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
        placeholder="Enter file path"
      />
      <button onClick={handleMine}>Mine File (Class-based)</button>
      <button onClick={() => docMiner.mine(filePath)}>Mine DOC (Hook-based)</button>
      {/* ✅ Benefits:
          1. No duplicate code - algorithm structure is in base class/hook
          2. Easy to extend - just create new subclass or config
          3. Easy to maintain - change algorithm in one place
          4. Polymorphism instead of conditionals
      */}
    </div>
  );
};

export { DataMiningApp };
