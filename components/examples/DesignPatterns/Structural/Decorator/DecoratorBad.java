// ❌ The Bad Way (Class Explosion)
// Creating a new class for every combination of features

// Base class
class Coffee {
    public String getDescription() {
        return "Coffee";
    }
    
    public double getCost() {
        return 2.0;
    }
}

// ❌ Problem: We need a class for every combination
class CoffeeWithMilk extends Coffee {
    public String getDescription() {
        return "Coffee with Milk";
    }
    
    public double getCost() {
        return super.getCost() + 0.5;
    }
}

class CoffeeWithSugar extends Coffee {
    public String getDescription() {
        return "Coffee with Sugar";
    }
    
    public double getCost() {
        return super.getCost() + 0.2;
    }
}

class CoffeeWithMilkAndSugar extends Coffee {
    // ❌ This becomes unmanageable with more combinations
    public String getDescription() {
        return "Coffee with Milk and Sugar";
    }
    
    public double getCost() {
        return super.getCost() + 0.5 + 0.2;
    }
}

// ❌ What if we want Coffee with Milk, Sugar, and Whipped Cream?
// We need another class! This leads to class explosion.

// Usage example
class App {
    public static void main(String[] args) {
        // Simple coffee
        Coffee coffee = new Coffee();
        System.out.println(coffee.getDescription() + " - $" + coffee.getCost());
        
        // Coffee with milk
        Coffee coffeeWithMilk = new CoffeeWithMilk();
        System.out.println(coffeeWithMilk.getDescription() + " - $" + coffeeWithMilk.getCost());
        
        // Coffee with milk and sugar
        Coffee coffeeWithMilkAndSugar = new CoffeeWithMilkAndSugar();
        System.out.println(coffeeWithMilkAndSugar.getDescription() + " - $" + coffeeWithMilkAndSugar.getCost());
        
        // ❌ Problem: For every new combination, we need a new class
        // ❌ Coffee with Milk, Sugar, and Whipped Cream? New class needed!
        // ❌ Coffee with just Whipped Cream? New class needed!
        // ❌ This leads to exponential class growth (2^n combinations for n features)
    }
}
