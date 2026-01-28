"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";
import Image from "next/image";

const badExample = `// ❌ BAD EXAMPLE: Tight Coupling
// Subject directly knows about all observers
// Problem: Subject is tightly coupled to concrete observer classes

class NewsPublisher {
    private String news;
    private EmailSubscriber emailSubscriber;
    private SMSSubscriber smsSubscriber;
    
    public void setNews(String news) {
        this.news = news;
        // ❌ Have to manually notify each observer
        if (emailSubscriber != null) {
            emailSubscriber.update(news);
        }
        if (smsSubscriber != null) {
            smsSubscriber.update(news);
        }
        // ❌ What if we want to add a new subscriber type?
        // We have to modify this class!
    }
    
    public void setEmailSubscriber(EmailSubscriber subscriber) {
        this.emailSubscriber = subscriber;
    }
    
    public void setSmsSubscriber(SMSSubscriber subscriber) {
        this.smsSubscriber = subscriber;
    }
}

class EmailSubscriber {
    public void update(String news) {
        System.out.println("Email: " + news);
    }
}

class SMSSubscriber {
    public void update(String news) {
        System.out.println("SMS: " + news);
    }
}

// ❌ Problems:
// - Subject is tightly coupled to concrete observer classes
// - Can't dynamically add/remove observers
// - Violates Open/Closed Principle
// - Adding new subscriber types requires modifying the publisher`;

const goodExample = `// ✅ GOOD EXAMPLE: Observer Pattern
// Subject and observers are loosely coupled through interface
// Defines a subscription mechanism to notify multiple objects about events

import java.util.ArrayList;
import java.util.List;

// Step 1: Observer Interface
// Declares the notification interface
interface Observer {
    void update(String eventType, String data);
}

// Step 2: Subject/Publisher Interface
// Describes methods for adding/removing subscribers
interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers(String eventType, String data);
}

// Step 3: Concrete Publisher
// Contains subscription infrastructure and business logic
class Editor implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String file;
    
    // Subscription management
    public void attach(Observer observer) {
        observers.add(observer);
    }
    
    public void detach(Observer observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers(String eventType, String data) {
        for (Observer observer : observers) {
            observer.update(eventType, data);
        }
    }
    
    // Business logic methods notify subscribers
    public void openFile(String path) {
        this.file = path;
        notifyObservers("open", file);
    }
    
    public void saveFile() {
        // Save logic here
        notifyObservers("save", file);
    }
}

// Step 4: Concrete Subscribers
// React to notifications issued by the publisher

class LoggingListener implements Observer {
    private String logFile;
    private String message;
    
    public LoggingListener(String logFile, String message) {
        this.logFile = logFile;
        this.message = message;
    }
    
    public void update(String eventType, String data) {
        if ("open".equals(eventType)) {
            System.out.println("Log [" + logFile + "]: " + 
                message.replace("%s", data));
        }
    }
}

class EmailAlertsListener implements Observer {
    private String email;
    private String message;
    
    public EmailAlertsListener(String email, String message) {
        this.email = email;
        this.message = message;
    }
    
    public void update(String eventType, String data) {
        if ("save".equals(eventType)) {
            System.out.println("Email to " + email + ": " + 
                message.replace("%s", data));
        }
    }
}

// Step 5: Usage
// Client creates publisher and subscriber objects separately
// and registers subscribers for publisher updates
class Application {
    public static void main(String[] args) {
        Editor editor = new Editor();
        
        // ✅ Add subscribers dynamically
        LoggingListener logger = new LoggingListener(
            "/path/to/log.txt",
            "Someone has opened the file: %s"
        );
        editor.attach(logger);
        
        EmailAlertsListener emailAlerts = new EmailAlertsListener(
            "admin@example.com",
            "Someone has changed the file: %s"
        );
        editor.attach(emailAlerts);
        
        // ✅ Business logic triggers notifications automatically
        editor.openFile("document.txt");
        // Output: Log [/path/to/log.txt]: Someone has opened the file: document.txt
        
        editor.saveFile();
        // Output: Email to admin@example.com: Someone has changed the file: document.txt
        
        // ✅ Easy to add new subscriber types without modifying publisher
        // ✅ Can remove subscribers dynamically
        editor.detach(logger);
    }
}

// ✅ Benefits:
// - Open/Closed Principle: add new subscribers without changing publisher
// - Loose coupling: publisher doesn't know concrete subscriber classes
// - Dynamic relationships: subscribe/unsubscribe at runtime
// - Single Responsibility: each class has one job`;

export default function ObserverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/DESIGNPATTERNS" className="mb-4 inline-block">
              ← Back to Design Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Observer Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              <strong>Observer</strong> is a behavioral design pattern that lets you define a subscription mechanism 
              to notify multiple objects about any events that happen to the object they're observing.
            </Text>
          </div>
        </Stack>

        {/* Intent Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Intent
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-6">
                The Observer pattern suggests that you add a subscription mechanism to the publisher class so individual 
                objects can subscribe to or unsubscribe from a stream of events coming from that publisher. In reality, this 
                mechanism consists of (1) an array field for storing a list of references to subscriber objects and 
                (2) several public methods which allow adding subscribers to and removing them from that list.
              </Text>
              <div className="my-6 flex justify-center">
                <Image
                  src="https://refactoring.guru/images/patterns/content/observer/observer.png"
                  alt="Observer Design Pattern"
                  width={640}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </Stack>
          </Card>
        </section>

        {/* Problem Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Problem
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                Imagine that you have two types of objects: a <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">Customer</code> and a <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">Store</code>. 
                The customer is very interested in a particular brand of product (say, it's a new model of the iPhone) which 
                should become available in the store very soon. The customer could visit the store every day and check product 
                availability, but while the product is still en route, most of these trips would be pointless.
              </Text>
              <div className="my-6 flex justify-center">
                <Image
                  src="https://refactoring.guru/images/patterns/content/observer/observer-comic-1-en.png"
                  alt="Visiting store vs. sending spam"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                On the other hand, the store could send tons of emails (which might be considered spam) to all customers each 
                time a new product becomes available. This would save some customers from endless trips to the store. At the same 
                time, it'd upset other customers who aren't interested in new products. It looks like we've got a conflict: either 
                the customer wastes time checking product availability or the store wastes resources notifying the wrong customers.
              </Text>
            </Stack>
          </Card>
        </section>

        {/* Solution Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Solution
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                The object that has some interesting state is often called <em>subject</em>, but since it's also going to notify 
                other objects about the changes to its state, we'll call it <em>publisher</em>. All other objects that want to 
                track changes to the publisher's state are called <em>subscribers</em>.
              </Text>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                The Observer pattern suggests that you add a subscription mechanism to the publisher class so individual objects 
                can subscribe to or unsubscribe from a stream of events coming from that publisher. In reality, this mechanism 
                consists of (1) an array field for storing a list of references to subscriber objects and (2) several public 
                methods which allow adding subscribers to and removing them from that list.
              </Text>
              <div className="my-6 flex justify-center">
                <Image
                  src="https://refactoring.guru/images/patterns/diagrams/observer/solution1-en.png"
                  alt="Subscription mechanism"
                  width={470}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                Now, whenever an important event happens to the publisher, it goes over its subscribers and calls the specific 
                notification method on their objects. If your app has several different types of publishers and you want to make 
                your subscribers compatible with all of them, you can go even further and make all publishers follow the same 
                interface. This interface would only need to describe a few subscription methods.
              </Text>
              <div className="my-6 flex justify-center">
                <Image
                  src="https://refactoring.guru/images/patterns/diagrams/observer/solution2-en.png"
                  alt="Notification methods"
                  width={460}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <Text className="text-zinc-600 dark:text-zinc-400">
                The interface should declare the notification method along with a set of parameters that the publisher can use 
                to pass some contextual data along with the notification.
              </Text>
            </Stack>
          </Card>
        </section>

        {/* Real-World Analogy */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Real‑World Analogy
              </Heading>
              <div className="my-6 flex justify-center">
                <Image
                  src="https://refactoring.guru/images/patterns/content/observer/observer-comic-2-en.png"
                  alt="Magazine and newspaper subscriptions"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <Text className="text-zinc-600 dark:text-zinc-400">
                If you subscribe to a newspaper or magazine, you no longer need to go to the store to check if the next issue 
                is available. Instead, the publisher sends new issues directly to your mailbox right after publication or even 
                in advance. The publisher maintains a list of subscribers and knows which magazines they're interested in. 
                Subscribers can leave the list at any time when they wish to stop the publisher sending new magazine issues to them.
              </Text>
            </Stack>
          </Card>
        </section>

        {/* Structure Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Structure
              </Heading>
              <div className="my-6 flex justify-center">
                <Image
                  src="https://refactoring.guru/images/patterns/diagrams/observer/structure.png"
                  alt="Structure of the Observer design pattern"
                  width={610}
                  height={500}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <ol className="list-decimal list-inside space-y-3 text-zinc-600 dark:text-zinc-400 ml-4">
                <li>The <strong>Publisher</strong> issues events of interest to other objects. These events occur when the publisher changes its state or executes some behaviors. Publishers contain a subscription infrastructure that lets new subscribers join and current subscribers leave the list.</li>
                <li>When a new event happens, the publisher goes over the subscription list and calls the notification method declared in the subscriber interface on each subscriber object.</li>
                <li>The <strong>Subscriber</strong> interface declares the notification interface. In most cases, it consists of a single <code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">update</code> method. The method may have several parameters that let the publisher pass some event details along with the update.</li>
                <li><strong>Concrete Subscribers</strong> perform some actions in response to notifications issued by the publisher. All of these classes must implement the same interface so the publisher isn't coupled to concrete classes.</li>
                <li>Usually, subscribers need some contextual information to handle the update correctly. For this reason, publishers often pass some context data as arguments of the notification method. The publisher can pass itself as an argument, letting subscriber fetch any required data directly.</li>
                <li>The <strong>Client</strong> creates publisher and subscriber objects separately and then registers subscribers for publisher updates.</li>
              </ol>
            </Stack>
          </Card>
        </section>

        {/* Code Examples */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Code Example
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                In this example, the <strong>Observer</strong> pattern lets the text editor object notify other service objects 
                about changes in its state. The list of subscribers is compiled dynamically: objects can start or stop listening 
                to notifications at runtime, depending on the desired behavior of your app.
              </Text>
              <div className="my-6 flex justify-center">
                <Image
                  src="https://refactoring.guru/images/patterns/diagrams/observer/example.png"
                  alt="Structure of the Observer pattern example"
                  width={510}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <CodeComparison wrong={badExample} good={goodExample} language="java" />
            </Stack>
          </Card>
        </section>

        {/* Applicability Section */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Applicability
              </Heading>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <div>
                  <Text className="font-semibold mb-2">
                    Use the Observer pattern when changes to the state of one object may require changing other objects, 
                    and the actual set of objects is unknown beforehand or changes dynamically.
                  </Text>
                  <Text className="mb-4">
                    You can often experience this problem when working with classes of the graphical user interface. For example, 
                    you created custom button classes, and you want to let the clients hook some custom code to your buttons so 
                    that it fires whenever a user presses a button. The Observer pattern lets any object that implements the 
                    subscriber interface subscribe for event notifications in publisher objects. You can add the subscription 
                    mechanism to your buttons, letting the clients hook up their custom code via custom subscriber classes.
                  </Text>
                </div>
                <div>
                  <Text className="font-semibold mb-2">
                    Use the pattern when some objects in your app must observe others, but only for a limited time or in specific cases.
                  </Text>
                  <Text>
                    The subscription list is dynamic, so subscribers can join or leave the list whenever they need to.
                  </Text>
                </div>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Pros and Cons */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Pros and Cons
              </Heading>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Heading level={3} className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">
                    Pros
                  </Heading>
                  <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
                    <li><em>Open/Closed Principle</em>: you can introduce new subscriber classes without having to change the publisher's code (and vice versa if there's a publisher interface).</li>
                    <li>You can establish relations between objects at runtime.</li>
                    <li>Subscribers are notified in random order.</li>
                  </ul>
                </div>
                <div>
                  <Heading level={3} className="text-xl font-bold mb-3 text-red-600 dark:text-red-400">
                    Cons
                  </Heading>
                  <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-4">
                    <li>Subscribers are notified in random order, which may not always be desirable.</li>
                    <li>If not implemented carefully, can lead to memory leaks if subscribers aren't properly unsubscribed.</li>
                    <li>Can cause performance issues if there are too many subscribers or if notifications trigger expensive operations.</li>
                  </ul>
                </div>
              </div>
            </Stack>
          </Card>
        </section>

        {/* Relations with Other Patterns */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Relations with Other Patterns
              </Heading>
              <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                <strong>Chain of Responsibility</strong>, <strong>Command</strong>, <strong>Mediator</strong> and <strong>Observer</strong> 
                address various ways of connecting senders and receivers of requests:
              </Text>
              <ul className="list-disc list-inside space-y-3 text-zinc-600 dark:text-zinc-400 ml-4">
                <li><em>Chain of Responsibility</em> passes a request sequentially along a dynamic chain of potential receivers until one of them handles it.</li>
                <li><em>Command</em> establishes unidirectional connections between senders and receivers.</li>
                <li><em>Mediator</em> eliminates direct connections between senders and receivers, forcing them to communicate indirectly via a mediator object.</li>
                <li><em>Observer</em> lets receivers dynamically subscribe to and unsubscribe from receiving requests.</li>
              </ul>
              <Text className="text-zinc-600 dark:text-zinc-400 mt-4">
                The difference between <em>Mediator</em> and <em>Observer</em> is often elusive. The primary goal of Mediator is to 
                eliminate mutual dependencies among a set of system components. Instead, these components become dependent on a single 
                mediator object. The goal of Observer is to establish dynamic one‑way connections between objects, where some objects 
                act as subordinates of others.
              </Text>
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/DESIGNPATTERNS">
            ← Back to Design Patterns
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
