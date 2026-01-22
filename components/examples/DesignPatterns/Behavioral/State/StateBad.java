// ❌ The Bad Way (If/Else State Management)
// Using conditional statements to manage state behavior
// Problem: State machine based on conditionals becomes bloated and hard to maintain

class Document {
    private String state; // "draft", "moderation", "published"
    private String content;
    
    public Document(String content) {
        this.content = content;
        this.state = "draft";
    }
    
    // ❌ Problem: Lots of if/else logic scattered throughout
    public void publish(User user) {
        switch (state) {
            case "draft":
                state = "moderation";
                System.out.println("Moving document from Draft to Moderation");
                break;
            case "moderation":
                if (user.isAdmin()) {
                    state = "published";
                    System.out.println("Publishing document (admin approved)");
                } else {
                    System.out.println("Only administrators can publish from Moderation");
                }
                break;
            case "published":
                // Do nothing
                System.out.println("Document is already published");
                break;
        }
    }
    
    // ❌ More conditional logic for each method
    public void render() {
        switch (state) {
            case "draft":
                System.out.println("Rendering document in Draft state (editable)");
                break;
            case "moderation":
                System.out.println("Rendering document in Moderation state (pending review)");
                break;
            case "published":
                System.out.println("Rendering document in Published state (read-only)");
                break;
        }
    }
    
    // ❌ What if we want to add a new state (e.g., "archived")?
    // We must modify ALL methods with more if/else statements
    // ❌ State logic is scattered and hard to maintain
    // ❌ Easy to introduce bugs when modifying state transitions
    // ❌ Violates Open/Closed Principle - need to modify existing code for new states
}

// Helper class for user roles
class User {
    private String role;
    
    public User(String role) {
        this.role = role;
    }
    
    public boolean isAdmin() {
        return "admin".equals(role);
    }
}

// Usage example
class App {
    public static void main(String[] args) {
        Document doc = new Document("My Article");
        User admin = new User("admin");
        User editor = new User("editor");
        
        // Document starts in Draft state
        doc.render(); // Rendering document in Draft state (editable)
        
        // Publish from Draft moves to Moderation
        doc.publish(editor); // Moving document from Draft to Moderation
        doc.render(); // Rendering document in Moderation state (pending review)
        
        // Only admin can publish from Moderation
        doc.publish(editor); // Only administrators can publish from Moderation
        doc.publish(admin); // Publishing document (admin approved)
        doc.render(); // Rendering document in Published state (read-only)
        
        // Published documents can't be republished
        doc.publish(admin); // Document is already published
        
        // ❌ To add a new state (e.g., "archived"), we need to:
        // 1. Add "archived" to the state string
        // 2. Add cases in publish() method
        // 3. Add cases in render() method
        // 4. Add cases in any other state-dependent methods
        // 5. This violates Single Responsibility and Open/Closed Principles
    }
}
