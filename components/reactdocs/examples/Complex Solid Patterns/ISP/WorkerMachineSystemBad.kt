// ❌ BAD EXAMPLE: Interface Segregation Principle Violation
// Workers are forced to implement methods they don't use
// The interface is too large and forces unnecessary dependencies

package com.solidpatterns.complex.isp.bad

// ❌ Fat interface - forces all workers to implement everything
interface WorkerBad {
    // Office worker methods
    fun attendMeeting(): String
    fun writeReport(): String
    fun sendEmail(): String
    
    // Factory worker methods
    fun operateMachine(): String
    fun assembleProduct(): String
    fun performQualityCheck(): String
    
    // Delivery worker methods
    fun loadTruck(): String
    fun driveVehicle(): String
    fun deliverPackage(): String
    
    // Maintenance worker methods
    fun repairEquipment(): String
    fun performMaintenance(): String
    fun inspectMachinery(): String
}

// ❌ OfficeWorker is forced to implement factory, delivery, and maintenance methods
class OfficeWorkerBad(private val name: String) : WorkerBad {
    override fun attendMeeting(): String {
        return "$name is attending a meeting"
    }
    
    override fun writeReport(): String {
        return "$name is writing a report"
    }
    
    override fun sendEmail(): String {
        return "$name is sending an email"
    }
    
    // ❌ OfficeWorker doesn't need these but is forced to implement them
    override fun operateMachine(): String {
        throw UnsupportedOperationException("OfficeWorker cannot operate machines")
    }
    
    override fun assembleProduct(): String {
        throw UnsupportedOperationException("OfficeWorker cannot assemble products")
    }
    
    override fun performQualityCheck(): String {
        throw UnsupportedOperationException("OfficeWorker cannot perform quality checks")
    }
    
    override fun loadTruck(): String {
        throw UnsupportedOperationException("OfficeWorker cannot load trucks")
    }
    
    override fun driveVehicle(): String {
        throw UnsupportedOperationException("OfficeWorker cannot drive vehicles")
    }
    
    override fun deliverPackage(): String {
        throw UnsupportedOperationException("OfficeWorker cannot deliver packages")
    }
    
    override fun repairEquipment(): String {
        throw UnsupportedOperationException("OfficeWorker cannot repair equipment")
    }
    
    override fun performMaintenance(): String {
        throw UnsupportedOperationException("OfficeWorker cannot perform maintenance")
    }
    
    override fun inspectMachinery(): String {
        throw UnsupportedOperationException("OfficeWorker cannot inspect machinery")
    }
}

// ❌ FactoryWorker is forced to implement office, delivery, and maintenance methods
class FactoryWorkerBad(private val name: String) : WorkerBad {
    // ❌ FactoryWorker doesn't need these but is forced to implement them
    override fun attendMeeting(): String {
        throw UnsupportedOperationException("FactoryWorker cannot attend meetings")
    }
    
    override fun writeReport(): String {
        throw UnsupportedOperationException("FactoryWorker cannot write reports")
    }
    
    override fun sendEmail(): String {
        throw UnsupportedOperationException("FactoryWorker cannot send emails")
    }
    
    override fun operateMachine(): String {
        return "$name is operating a machine"
    }
    
    override fun assembleProduct(): String {
        return "$name is assembling a product"
    }
    
    override fun performQualityCheck(): String {
        return "$name is performing a quality check"
    }
    
    // ❌ FactoryWorker doesn't need these but is forced to implement them
    override fun loadTruck(): String {
        throw UnsupportedOperationException("FactoryWorker cannot load trucks")
    }
    
    override fun driveVehicle(): String {
        throw UnsupportedOperationException("FactoryWorker cannot drive vehicles")
    }
    
    override fun deliverPackage(): String {
        throw UnsupportedOperationException("FactoryWorker cannot deliver packages")
    }
    
    override fun repairEquipment(): String {
        throw UnsupportedOperationException("FactoryWorker cannot repair equipment")
    }
    
    override fun performMaintenance(): String {
        throw UnsupportedOperationException("FactoryWorker cannot perform maintenance")
    }
    
    override fun inspectMachinery(): String {
        throw UnsupportedOperationException("FactoryWorker cannot inspect machinery")
    }
}

// ❌ DeliveryWorker is forced to implement office, factory, and maintenance methods
class DeliveryWorkerBad(private val name: String) : WorkerBad {
    // ❌ DeliveryWorker doesn't need these but is forced to implement them
    override fun attendMeeting(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot attend meetings")
    }
    
    override fun writeReport(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot write reports")
    }
    
    override fun sendEmail(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot send emails")
    }
    
    override fun operateMachine(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot operate machines")
    }
    
    override fun assembleProduct(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot assemble products")
    }
    
    override fun performQualityCheck(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot perform quality checks")
    }
    
    override fun loadTruck(): String {
        return "$name is loading the truck"
    }
    
    override fun driveVehicle(): String {
        return "$name is driving the delivery vehicle"
    }
    
    override fun deliverPackage(): String {
        return "$name is delivering a package"
    }
    
    // ❌ DeliveryWorker doesn't need these but is forced to implement them
    override fun repairEquipment(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot repair equipment")
    }
    
    override fun performMaintenance(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot perform maintenance")
    }
    
    override fun inspectMachinery(): String {
        throw UnsupportedOperationException("DeliveryWorker cannot inspect machinery")
    }
}

// ❌ MaintenanceWorker is forced to implement office, factory, and delivery methods
class MaintenanceWorkerBad(private val name: String) : WorkerBad {
    // ❌ MaintenanceWorker doesn't need these but is forced to implement them
    override fun attendMeeting(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot attend meetings")
    }
    
    override fun writeReport(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot write reports")
    }
    
    override fun sendEmail(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot send emails")
    }
    
    override fun operateMachine(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot operate machines")
    }
    
    override fun assembleProduct(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot assemble products")
    }
    
    override fun performQualityCheck(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot perform quality checks")
    }
    
    override fun loadTruck(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot load trucks")
    }
    
    override fun driveVehicle(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot drive vehicles")
    }
    
    override fun deliverPackage(): String {
        throw UnsupportedOperationException("MaintenanceWorker cannot deliver packages")
    }
    
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

// Function that only needs office workers but receives the fat interface
fun conductOfficeWork(worker: WorkerBad) {
    // ❌ This function expects all workers to support office methods
    try {
        println(worker.attendMeeting())
        println(worker.writeReport())
        println(worker.sendEmail())
    } catch (e: UnsupportedOperationException) {
        println("Error: ${e.message}")
    }
}

fun main() {
    val officeWorker = OfficeWorkerBad("Alice")
    val factoryWorker = FactoryWorkerBad("Bob")
    val deliveryWorker = DeliveryWorkerBad("Charlie")
    val maintenanceWorker = MaintenanceWorkerBad("David")
    
    // ❌ This works but is error-prone
    println("=== Office Worker ===")
    conductOfficeWork(officeWorker) // Works
    
    println("\n=== Factory Worker ===")
    conductOfficeWork(factoryWorker) // Throws exception!
    
    // ❌ All workers have methods they don't use
    // This violates Interface Segregation Principle
}

