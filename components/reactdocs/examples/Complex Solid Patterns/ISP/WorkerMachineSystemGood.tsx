// ✅ GOOD EXAMPLE: Interface Segregation Principle Applied
// Workers only implement interfaces with methods they actually use
// Small, focused interfaces prevent unnecessary dependencies

// ✅ Segregated interfaces - each interface has a specific purpose

interface OfficeWorker {
  attendMeeting(): string;
  writeReport(): string;
  sendEmail(): string;
}

interface FactoryWorker {
  operateMachine(): string;
  assembleProduct(): string;
  performQualityCheck(): string;
}

interface DeliveryWorker {
  loadTruck(): string;
  driveVehicle(): string;
  deliverPackage(): string;
}

interface MaintenanceWorker {
  repairEquipment(): string;
  performMaintenance(): string;
  inspectMachinery(): string;
}

// ✅ OfficeWorker only implements what it needs
class OfficeWorkerGood implements OfficeWorker {
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
}

// ✅ FactoryWorker only implements what it needs
class FactoryWorkerGood implements FactoryWorker {
  constructor(private name: string) {}

  operateMachine(): string {
    return `${this.name} is operating a machine`;
  }

  assembleProduct(): string {
    return `${this.name} is assembling a product`;
  }

  performQualityCheck(): string {
    return `${this.name} is performing a quality check`;
  }
}

// ✅ DeliveryWorker only implements what it needs
class DeliveryWorkerGood implements DeliveryWorker {
  constructor(private name: string) {}

  loadTruck(): string {
    return `${this.name} is loading the truck`;
  }

  driveVehicle(): string {
    return `${this.name} is driving the delivery vehicle`;
  }

  deliverPackage(): string {
    return `${this.name} is delivering a package`;
  }
}

// ✅ MaintenanceWorker only implements what it needs
class MaintenanceWorkerGood implements MaintenanceWorker {
  constructor(private name: string) {}

  repairEquipment(): string {
    return `${this.name} is repairing equipment`;
  }

  performMaintenance(): string {
    return `${this.name} is performing maintenance`;
  }

  inspectMachinery(): string {
    return `${this.name} is inspecting machinery`;
  }
}

// ✅ Multi-skilled worker can implement multiple interfaces
class MultiSkilledWorkerGood implements OfficeWorker, FactoryWorker {
  constructor(private name: string) {}

  // OfficeWorker implementation
  attendMeeting(): string {
    return `${this.name} (multi-skilled) is attending a meeting`;
  }

  writeReport(): string {
    return `${this.name} (multi-skilled) is writing a report`;
  }

  sendEmail(): string {
    return `${this.name} (multi-skilled) is sending an email`;
  }

  // FactoryWorker implementation
  operateMachine(): string {
    return `${this.name} (multi-skilled) is operating a machine`;
  }

  assembleProduct(): string {
    return `${this.name} (multi-skilled) is assembling a product`;
  }

  performQualityCheck(): string {
    return `${this.name} (multi-skilled) is performing a quality check`;
  }
}

// ✅ Functions accept only the interfaces they need
function conductOfficeWork(worker: OfficeWorker): void {
  // ✅ This function only needs OfficeWorker methods
  console.log(worker.attendMeeting());
  console.log(worker.writeReport());
  console.log(worker.sendEmail());
}

function conductFactoryWork(worker: FactoryWorker): void {
  // ✅ This function only needs FactoryWorker methods
  console.log(worker.operateMachine());
  console.log(worker.assembleProduct());
  console.log(worker.performQualityCheck());
}

function conductDeliveryWork(worker: DeliveryWorker): void {
  // ✅ This function only needs DeliveryWorker methods
  console.log(worker.loadTruck());
  console.log(worker.driveVehicle());
  console.log(worker.deliverPackage());
}

function conductMaintenanceWork(worker: MaintenanceWorker): void {
  // ✅ This function only needs MaintenanceWorker methods
  console.log(worker.repairEquipment());
  console.log(worker.performMaintenance());
  console.log(worker.inspectMachinery());
}

// ✅ Function that works with multi-skilled workers
function utilizeMultiSkilledWorker(
  worker: OfficeWorker & FactoryWorker
): void {
  console.log("=== Office Work ===");
  conductOfficeWork(worker);

  console.log("\n=== Factory Work ===");
  conductFactoryWork(worker);
}

export function WorkerMachineSystemGood() {
  const handleOfficeWorker = () => {
    const officeWorker = new OfficeWorkerGood("Alice");
    console.log("=== Office Worker ===");
    conductOfficeWork(officeWorker); // ✅ Works perfectly
  };

  const handleFactoryWorker = () => {
    const factoryWorker = new FactoryWorkerGood("Bob");
    console.log("=== Factory Worker ===");
    conductFactoryWork(factoryWorker); // ✅ Works perfectly
  };

  const handleDeliveryWorker = () => {
    const deliveryWorker = new DeliveryWorkerGood("Charlie");
    console.log("=== Delivery Worker ===");
    conductDeliveryWork(deliveryWorker); // ✅ Works perfectly
  };

  const handleMaintenanceWorker = () => {
    const maintenanceWorker = new MaintenanceWorkerGood("David");
    console.log("=== Maintenance Worker ===");
    conductMaintenanceWork(maintenanceWorker); // ✅ Works perfectly
  };

  const handleMultiSkilledWorker = () => {
    const multiSkilledWorker = new MultiSkilledWorkerGood("Eve");
    console.log("=== Multi-Skilled Worker ===");
    utilizeMultiSkilledWorker(multiSkilledWorker); // ✅ Can do both
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Good: Following ISP</h2>
      <p className="mb-4 text-gray-600">
        Workers only implement interfaces with methods they actually use. No
        unnecessary methods, no exceptions thrown. Multi-skilled workers can
        implement multiple interfaces if needed.
      </p>
      <div className="space-x-2 space-y-2">
        <button
          onClick={handleOfficeWorker}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Office Worker (Check Console)
        </button>
        <button
          onClick={handleFactoryWorker}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Factory Worker (Check Console)
        </button>
        <button
          onClick={handleDeliveryWorker}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Delivery Worker (Check Console)
        </button>
        <button
          onClick={handleMaintenanceWorker}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Maintenance Worker (Check Console)
        </button>
        <button
          onClick={handleMultiSkilledWorker}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Multi-Skilled Worker (Check Console)
        </button>
      </div>
    </div>
  );
}

