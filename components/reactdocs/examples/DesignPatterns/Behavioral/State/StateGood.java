// ✅ The Good Way (State Pattern)
// State is a behavioral design pattern that lets an object alter its behavior 
// when its internal state changes. It appears as if the object changed its class.

// ✅ State interface - declares state-specific methods
interface DocumentState {
    void publish(User user);
    void render();
}

// ✅ Concrete State: Draft
// In Draft state, publish moves document to moderation
class DraftState implements DocumentState {
    private Document document;
    
    public DraftState(Document document) {
        this.document = document;
    }
    
    @Override
    public void publish(User user) {
        System.out.println("Moving document from Draft to Moderation");
        document.changeState(document.getModerationState());
    }
    
    @Override
    public void render() {
        System.out.println("Rendering document in Draft state (editable)");
    }
}

// ✅ Concrete State: Moderation
// In Moderation state, publish makes document public only if user is admin
class ModerationState implements DocumentState {
    private Document document;
    
    public ModerationState(Document document) {
        this.document = document;
    }
    
    @Override
    public void publish(User user) {
        if (user.isAdmin()) {
            System.out.println("Publishing document (admin approved)");
            document.changeState(document.getPublishedState());
        } else {
            System.out.println("Only administrators can publish from Moderation");
        }
    }
    
    @Override
    public void render() {
        System.out.println("Rendering document in Moderation state (pending review)");
    }
}

// ✅ Concrete State: Published
// In Published state, publish does nothing
class PublishedState implements DocumentState {
    private Document document;
    
    public PublishedState(Document document) {
        this.document = document;
    }
    
    @Override
    public void publish(User user) {
        // Published documents don't need republishing
        System.out.println("Document is already published");
    }
    
    @Override
    public void render() {
        System.out.println("Rendering document in Published state (read-only)");
    }
}

// ✅ Context class - stores reference to current state object
class Document {
    private DocumentState draftState;
    private DocumentState moderationState;
    private DocumentState publishedState;
    private DocumentState currentState;
    private String content;
    
    public Document(String content) {
        this.content = content;
        this.draftState = new DraftState(this);
        this.moderationState = new ModerationState(this);
        this.publishedState = new PublishedState(this);
        this.currentState = draftState; // Start in draft state
    }
    
    // Method to change state
    public void changeState(DocumentState state) {
        this.currentState = state;
    }
    
    // Getters for states
    public DocumentState getDraftState() {
        return draftState;
    }
    
    public DocumentState getModerationState() {
        return moderationState;
    }
    
    public DocumentState getPublishedState() {
        return publishedState;
    }
    
    // Delegate state-specific behavior to current state
    public void publish(User user) {
        currentState.publish(user);
    }
    
    public void render() {
        currentState.render();
    }
    
    public String getContent() {
        return content;
    }
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
    }
}
