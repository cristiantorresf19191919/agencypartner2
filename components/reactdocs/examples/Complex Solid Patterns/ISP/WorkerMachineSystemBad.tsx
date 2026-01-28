// ❌ BAD EXAMPLE: Interface Segregation Principle Violation
// Workers are forced to implement methods they don't use
// The interface is too large and forces unnecessary dependencies

// ❌ Fat interface - forces all workers to implement everything
interface WorkerBad {
  // Office worker methods
  attendMeeting(): string;
  writeReport(): string;
  sendEmail(): string;

  // Factory worker methods
  operateMachine(): string;
  assembleProduct(): string;
  performQualityCheck(): string;

  // Delivery worker methods
  loadTruck(): string;
  driveVehicle(): string;
  deliverPackage(): string;

  // Maintenance worker methods
  repairEquipment(): string;
  performMaintenance(): string;
  inspectMachinery(): string;
}

// ❌ OfficeWorker is forced to implement factory, delivery, and maintenance methods
class OfficeWorkerBad implements WorkerBad {
  constructor(private name: string) {}

  attendMeeting(): string {
    return `${this.name} is attending a meeting`;
  }

  writeReport(): string {
    return `${this.name} is writing a report`;
  }

  sendEmail(): string {
    return `${this.name} is sending an email`;
  }

  // ❌ OfficeWorker doesn't need these but is forced to implement them
  operateMachine(): string {
    throw new Error("OfficeWorker cannot operate machines");
  }

  assembleProduct(): string {
    throw new Error("OfficeWorker cannot assemble products");
  }

  performQualityCheck(): string {
    throw new Error("OfficeWorker cannot perform quality checks");
  }

  loadTruck(): string {
    throw new Error("OfficeWorker cannot load trucks");
  }

  driveVehicle(): string {
    throw new Error("OfficeWorker cannot drive vehicles");
  }

  deliverPackage(): string {
    throw new Error("OfficeWorker cannot deliver packages");
  }

  repairEquipment(): string {
    throw new Error("OfficeWorker cannot repair equipment");
  }

  performMaintenance(): string {
    throw new Error("OfficeWorker cannot perform maintenance");
  }

  inspectMachinery(): string {
    throw new Error("OfficeWorker cannot inspect machinery");
  }
}

// ❌ FactoryWorker is forced to implement office, delivery, and maintenance methods
class FactoryWorkerBad implements WorkerBad {
  constructor(private name: string) {}

  // ❌ FactoryWorker doesn't need these but is forced to implement them
  attendMeeting(): string {
    throw new Error("FactoryWorker cannot attend meetings");
  }

  writeReport(): string {
    throw new Error("FactoryWorker cannot write reports");
  }

  sendEmail(): string {
    throw new Error("FactoryWorker cannot send emails");
  }

  operateMachine(): string {
    return `${this.name} is operating a machine`;
  }

  assembleProduct(): string {
    return `${this.name} is assembling a product`;
  }

  performQualityCheck(): string {
    return `${this.name} is performing a quality check`;
  }

  // ❌ FactoryWorker doesn't need these but is forced to implement them
  loadTruck(): string {
    throw new Error("FactoryWorker cannot load trucks");
  }

  driveVehicle(): string {
    throw new Error("FactoryWorker cannot drive vehicles");
  }

  deliverPackage(): string {
    throw new Error("FactoryWorker cannot deliver packages");
  }

  repairEquipment(): string {
    throw new Error("FactoryWorker cannot repair equipment");
  }

  performMaintenance(): string {
    throw new Error("FactoryWorker cannot perform maintenance");
  }

  inspectMachinery(): string {
    throw new Error("FactoryWorker cannot inspect machinery");
  }
}

// ❌ DeliveryWorker is forced to implement office, factory, and maintenance methods
class DeliveryWorkerBad implements WorkerBad {
  constructor(private name: string) {}

  // ❌ DeliveryWorker doesn't need these but is forced to implement them
  attendMeeting(): string {
    throw new Error("DeliveryWorker cannot attend meetings");
  }

  writeReport(): string {
    throw new Error("DeliveryWorker cannot write reports");
  }

  sendEmail(): string {
    throw new Error("DeliveryWorker cannot send emails");
  }

  operateMachine(): string {
    throw new Error("DeliveryWorker cannot operate machines");
  }

  assembleProduct(): string {
    throw new Error("DeliveryWorker cannot assemble products");
  }

  performQualityCheck(): string {
    throw new Error("DeliveryWorker cannot perform quality checks");
  }

  loadTruck(): string {
    return `${this.name} is loading the truck`;
  }

  driveVehicle(): string {
    return `${this.name} is driving the delivery vehicle`;
  }

  deliverPackage(): string {
    return `${this.name} is delivering a package`;
  }

  // ❌ DeliveryWorker doesn't need these but is forced to implement them
  repairEquipment(): string {
    throw new Error("DeliveryWorker cannot repair equipment");
  }

  performMaintenance(): string {
    throw new Error("DeliveryWorker cannot perform maintenance");
  }

  inspectMachinery(): string {
    throw new Error("DeliveryWorker cannot inspect machinery");
  }
}

// Function that only needs office workers but receives the fat interface
function conductOfficeWork(worker: WorkerBad): void {
  // ❌ This function expects all workers to support office methods
  try {
    console.log(worker.attendMeeting());
    console.log(worker.writeReport());
    console.log(worker.sendEmail());
  } catch (e) {
    console.log(`Error: ${e instanceof Error ? e.message : "Unknown error"}`);
  }
}

export function WorkerMachineSystemBad() {
  const handleOfficeWorker = () => {
    const officeWorker = new OfficeWorkerBad("Alice");
    console.log("=== Office Worker ===");
    conductOfficeWork(officeWorker); // Works
  };

  const handleFactoryWorker = () => {
    const factoryWorker = new FactoryWorkerBad("Bob");
    console.log("=== Factory Worker ===");
    conductOfficeWork(factoryWorker); // Throws exception!
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bad: Violating ISP</h2>
      <p className="mb-4 text-gray-600">
        All workers are forced to implement methods they don't use, leading to
        many methods that throw exceptions. The WorkerBad interface is too large
        and violates the Interface Segregation Principle.
      </p>
      <div className="space-x-2">
        <button
          onClick={handleOfficeWorker}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Office Worker (Check Console)
        </button>
        <button
          onClick={handleFactoryWorker}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Factory Worker (Check Console - Will Error!)
        </button>
      </div>
    </div>
  );
}

