// ❌ The Bad Way (Direct Access)
// Client directly accesses expensive operations without control

class Image {
    private String filename;
    
    public Image(String filename) {
        this.filename = filename;
        // ❌ Problem: Image loads immediately, even if we don't need it
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("Loading " + filename + " from disk (expensive operation)");
    }
    
    public void display() {
        System.out.println("Displaying " + filename);
    }
}

// ❌ Client has no control over when expensive operations happen
class App {
    public static void main(String[] args) {
        // ❌ Image loads immediately, even if we never call display()
        Image image = new Image("large-photo.jpg");
        // ... do other things ...
        image.display(); // Image was already loaded
    }
}





