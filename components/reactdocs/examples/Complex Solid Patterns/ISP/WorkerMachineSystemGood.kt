// ✅ GOOD EXAMPLE: Interface Segregation Principle Applied
// Workers only implement interfaces with methods they actually use
// Small, focused interfaces prevent unnecessary dependencies

package com.solidpatterns.complex.isp.good

// ✅ Segregated interfaces - each interface has a specific purpose

interface OfficeWorker {
    fun attendMeeting(): String
    fun writeReport(): String
    fun sendEmail(): String
}

interface FactoryWorker {
    fun operateMachine(): String
    fun assembleProduct(): String
    fun performQualityCheck(): String
}

interface DeliveryWorker {
    fun loadTruck(): String
    fun driveVehicle(): String
    fun deliverPackage(): String
}

interface MaintenanceWorker {
    fun repairEquipment(): String
    fun performMaintenance(): String
    fun inspectMachinery(): String
}

// ✅ OfficeWorker only implements what it needs
class OfficeWorkerGood(private val name: String) : OfficeWorker {
    override fun attendMeeting(): String {
        return "$name is attending a meeting"
    }
    
    override fun writeReport(): String {
        return "$name is writing a report"
    }
    
    override fun sendEmail(): String {
        return "$name is sending an email"
    }
}

// ✅ FactoryWorker only implements what it needs
class FactoryWorkerGood(private val name: String) : FactoryWorker {
    override fun operateMachine(): String {
        return "$name is operating a machine"
    }
    
    override fun assembleProduct(): String {
        return "$name is assembling a product"
    }
    
    override fun performQualityCheck(): String {
        return "$name is performing a quality check"
    }
}

// ✅ DeliveryWorker only implements what it needs
class DeliveryWorkerGood(private val name: String) : DeliveryWorker {
    override fun loadTruck(): String {
        return "$name is loading the truck"
    }
    
    override fun driveVehicle(): String {
        return "$name is driving the delivery vehicle"
    }
    
    override fun deliverPackage(): String {
        return "$name is delivering a package"
    }
}

// ✅ MaintenanceWorker only implements what it needs
class MaintenanceWorkerGood(private val name: String) : MaintenanceWorker {
    override fun repairEquipment(): String {
        return "$name is repairing equipment"
    }
    
    override fun performMaintenance(): String {
        return "$name is performing maintenance"
    }
    
    override fun inspectMachinery(): String {
        return "$name is inspecting machinery"
    }
}

// ✅ Multi-skilled worker can implement multiple interfaces
class MultiSkilledWorkerGood(
    private val name: String
) : OfficeWorker, FactoryWorker {
    // OfficeWorker implementation
    override fun attendMeeting(): String {
        return "$name (multi-skilled) is attending a meeting"
    }
    
    override fun writeReport(): String {
        return "$name (multi-skilled) is writing a report"
    }
    
    override fun sendEmail(): String {
        return "$name (multi-skilled) is sending an email"
    }
    
    // FactoryWorker implementation
    override fun operateMachine(): String {
        return "$name (multi-skilled) is operating a machine"
    }
    
    override fun assembleProduct(): String {
        return "$name (multi-skilled) is assembling a product"
    }
    
    override fun performQualityCheck(): String {
        return "$name (multi-skilled) is performing a quality check"
    }
}

// ✅ Functions accept only the interfaces they need
fun conductOfficeWork(worker: OfficeWorker) {
    // ✅ This function only needs OfficeWorker methods
    println(worker.attendMeeting())
    println(worker.writeReport())
    println(worker.sendEmail())
}

fun conductFactoryWork(worker: FactoryWorker) {
    // ✅ This function only needs FactoryWorker methods
    println(worker.operateMachine())
    println(worker.assembleProduct())
    println(worker.performQualityCheck())
}

fun conductDeliveryWork(worker: DeliveryWorker) {
    // ✅ This function only needs DeliveryWorker methods
    println(worker.loadTruck())
    println(worker.driveVehicle())
    println(worker.deliverPackage())
}

fun conductMaintenanceWork(worker: MaintenanceWorker) {
    // ✅ This function only needs MaintenanceWorker methods
    println(worker.repairEquipment())
    println(worker.performMaintenance())
    println(worker.inspectMachinery())
}

// ✅ Function that works with multi-skilled workers
fun utilizeMultiSkilledWorker(worker: OfficeWorker & FactoryWorker) {
    println("=== Office Work ===")
    conductOfficeWork(worker)
    
    println("\n=== Factory Work ===")
    conductFactoryWork(worker)
}

fun main() {
    val officeWorker = OfficeWorkerGood("Alice")
    val factoryWorker = FactoryWorkerGood("Bob")
    val deliveryWorker = DeliveryWorkerGood("Charlie")
    val maintenanceWorker = MaintenanceWorkerGood("David")
    val multiSkilledWorker = MultiSkilledWorkerGood("Eve")
    
    println("=== Office Worker ===")
    conductOfficeWork(officeWorker) // ✅ Works perfectly
    
    println("\n=== Factory Worker ===")
    conductFactoryWork(factoryWorker) // ✅ Works perfectly
    
    println("\n=== Delivery Worker ===")
    conductDeliveryWork(deliveryWorker) // ✅ Works perfectly
    
    println("\n=== Maintenance Worker ===")
    conductMaintenanceWork(maintenanceWorker) // ✅ Works perfectly
    
    println("\n=== Multi-Skilled Worker ===")
    utilizeMultiSkilledWorker(multiSkilledWorker) // ✅ Can do both office and factory work
    
    // ✅ All workers only implement what they need
    // ✅ No unnecessary methods, no exceptions thrown
    // ✅ Interface Segregation Principle is followed
}

