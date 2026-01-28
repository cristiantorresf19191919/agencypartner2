// ✅ The Good Way (Template Method Pattern)
// Define algorithm skeleton in base class, let subclasses override specific steps

// ✅ Abstract base class with template method
abstract class DataMiner {
    // ✅ Template method - defines the algorithm structure
    // This is the skeleton that cannot be overridden
    public final void mine(String path) {
        openFile(path);
        String rawData = extractData(path);
        String parsedData = parseData(rawData);
        analyzeData(parsedData);
        generateReport(parsedData);
        closeFile(path);
    }
    
    // ✅ Abstract steps - must be implemented by subclasses
    protected abstract String extractData(String path);
    
    // ✅ Optional steps with default implementation
    // Subclasses can override if needed
    protected String parseData(String rawData) {
        System.out.println("Parsing raw data...");
        return rawData.toUpperCase();
    }
    
    protected void analyzeData(String data) {
        System.out.println("Analyzing data...");
        System.out.println("Found " + data.length() + " characters");
    }
    
    protected void generateReport(String data) {
        System.out.println("Generating report...");
        System.out.println("Report: " + data);
    }
    
    // ✅ Hooks - optional steps with empty implementation
    // Subclasses can override to add behavior at specific points
    protected void openFile(String path) {
        System.out.println("Opening file: " + path);
    }
    
    protected void closeFile(String path) {
        System.out.println("Closing file");
    }
}

// ✅ Concrete implementation for DOC files
class DOCDataMiner extends DataMiner {
    @Override
    protected String extractData(String path) {
        System.out.println("Extracting data from DOC format...");
        return "DOC: Document content";
    }
    
    @Override
    protected void openFile(String path) {
        System.out.println("Opening DOC file: " + path);
    }
    
    @Override
    protected void closeFile(String path) {
        System.out.println("Closing DOC file");
    }
}

// ✅ Concrete implementation for CSV files
class CSVDataMiner extends DataMiner {
    @Override
    protected String extractData(String path) {
        System.out.println("Extracting data from CSV format...");
        return "CSV: name,age,city";
    }
    
    @Override
    protected void openFile(String path) {
        System.out.println("Opening CSV file: " + path);
    }
    
    @Override
    protected void closeFile(String path) {
        System.out.println("Closing CSV file");
    }
}

// ✅ Concrete implementation for PDF files
class PDFDataMiner extends DataMiner {
    @Override
    protected String extractData(String path) {
        System.out.println("Extracting data from PDF format...");
        return "PDF: Page 1 content";
    }
    
    @Override
    protected void openFile(String path) {
        System.out.println("Opening PDF file: " + path);
    }
    
    @Override
    protected void closeFile(String path) {
        System.out.println("Closing PDF file");
    }
    
    // ✅ Can also override optional steps if needed
    @Override
    protected String parseData(String rawData) {
        System.out.println("Parsing PDF data with special formatting...");
        return rawData.toUpperCase() + " [PDF]";
    }
}

// ✅ Client code using polymorphism
class DataMiningApp {
    public static void main(String[] args) {
        String filePath = "document.doc";
        DataMiner miner = createMiner(filePath);
        
        // ✅ No conditionals - uses polymorphism
        miner.mine(filePath);
        
        // ✅ Benefits:
        // 1. No duplicate code - algorithm structure is in base class
        // 2. Easy to extend - just create new subclass
        // 3. Easy to maintain - change algorithm in one place
        // 4. Polymorphism instead of conditionals
    }
    
    // ✅ Factory method to create appropriate miner
    private static DataMiner createMiner(String path) {
        String fileType = path.substring(path.lastIndexOf('.') + 1);
        switch (fileType) {
            case "doc": return new DOCDataMiner();
            case "csv": return new CSVDataMiner();
            case "pdf": return new PDFDataMiner();
            default: throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }
}
