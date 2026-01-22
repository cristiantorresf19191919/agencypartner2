// ❌ The Bad Way (Template Method Anti-Pattern)
// Duplicate code across classes - no shared algorithm structure

// ❌ DOC file processor - contains duplicate code
class DOCDataMiner {
    public void mine(String path) {
        // ❌ Duplicate: opening file
        System.out.println("Opening DOC file: " + path);
        
        // ❌ Unique: extracting data
        System.out.println("Extracting data from DOC format...");
        String rawData = "DOC: Document content";
        
        // ❌ Duplicate: parsing data
        System.out.println("Parsing raw data...");
        String parsedData = rawData.toUpperCase();
        
        // ❌ Duplicate: analyzing data
        System.out.println("Analyzing data...");
        System.out.println("Found " + parsedData.length() + " characters");
        
        // ❌ Duplicate: generating report
        System.out.println("Generating report...");
        System.out.println("Report: " + parsedData);
        
        // ❌ Duplicate: closing file
        System.out.println("Closing DOC file");
    }
}

// ❌ CSV file processor - contains duplicate code
class CSVDataMiner {
    public void mine(String path) {
        // ❌ Duplicate: opening file
        System.out.println("Opening CSV file: " + path);
        
        // ❌ Unique: extracting data
        System.out.println("Extracting data from CSV format...");
        String rawData = "CSV: name,age,city";
        
        // ❌ Duplicate: parsing data
        System.out.println("Parsing raw data...");
        String parsedData = rawData.toUpperCase();
        
        // ❌ Duplicate: analyzing data
        System.out.println("Analyzing data...");
        System.out.println("Found " + parsedData.length() + " characters");
        
        // ❌ Duplicate: generating report
        System.out.println("Generating report...");
        System.out.println("Report: " + parsedData);
        
        // ❌ Duplicate: closing file
        System.out.println("Closing CSV file");
    }
}

// ❌ PDF file processor - contains duplicate code
class PDFDataMiner {
    public void mine(String path) {
        // ❌ Duplicate: opening file
        System.out.println("Opening PDF file: " + path);
        
        // ❌ Unique: extracting data
        System.out.println("Extracting data from PDF format...");
        String rawData = "PDF: Page 1 content";
        
        // ❌ Duplicate: parsing data
        System.out.println("Parsing raw data...");
        String parsedData = rawData.toUpperCase();
        
        // ❌ Duplicate: analyzing data
        System.out.println("Analyzing data...");
        System.out.println("Found " + parsedData.length() + " characters");
        
        // ❌ Duplicate: generating report
        System.out.println("Generating report...");
        System.out.println("Report: " + parsedData);
        
        // ❌ Duplicate: closing file
        System.out.println("Closing PDF file");
    }
}

// ❌ Client code with conditionals
class DataMiningApp {
    public static void main(String[] args) {
        String filePath = "document.doc";
        String fileType = getFileType(filePath);
        
        // ❌ Using conditionals to pick the right class
        if (fileType.equals("doc")) {
            DOCDataMiner miner = new DOCDataMiner();
            miner.mine(filePath);
        } else if (fileType.equals("csv")) {
            CSVDataMiner miner = new CSVDataMiner();
            miner.mine(filePath);
        } else if (fileType.equals("pdf")) {
            PDFDataMiner miner = new PDFDataMiner();
            miner.mine(filePath);
        }
        
        // ❌ Problems:
        // 1. Lots of duplicate code (opening, parsing, analyzing, reporting, closing)
        // 2. If we need to change the algorithm, we must change it in all classes
        // 3. Client code uses conditionals instead of polymorphism
        // 4. Hard to maintain and extend
    }
    
    private static String getFileType(String path) {
        return path.substring(path.lastIndexOf('.') + 1);
    }
}
