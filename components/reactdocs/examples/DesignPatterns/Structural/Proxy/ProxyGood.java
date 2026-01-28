// ✅ The Good Way (Proxy Pattern)
// Proxy controls access to expensive operations

// ✅ Subject interface
interface Image {
    void display();
}

// ✅ Real subject (expensive to create)
class RealImage implements Image {
    private String filename;
    
    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk(); // Expensive operation
    }
    
    private void loadFromDisk() {
        System.out.println("Loading " + filename + " from disk (expensive operation)");
    }
    
    public void display() {
        System.out.println("Displaying " + filename);
    }
}

// ✅ Proxy (controls access to real image)
class ImageProxy implements Image {
    private String filename;
    private RealImage realImage;
    
    public ImageProxy(String filename) {
        this.filename = filename;
        // ✅ Proxy doesn't load image until needed
    }
    
    public void display() {
        // ✅ Lazy loading: only create real image when needed
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}

// Usage
class App {
    public static void main(String[] args) {
        // ✅ Image is NOT loaded until display() is called
        Image image = new ImageProxy("large-photo.jpg");
        System.out.println("Image proxy created (no loading yet)");
        
        // ... do other things ...
        
        // ✅ Now image loads (lazy loading)
        image.display();
    }
}

