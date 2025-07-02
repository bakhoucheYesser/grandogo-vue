import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import estimateService from '@/services/estimate.service'
import type { EstimateResult, Location, Vehicle } from '@/types/estimate.types'

export const useEstimateStore = defineStore('estimate', () => {
  // State
  const pickupLocation = ref<Location | null>(null)
  const destinationLocation = ref<Location | null>(null)
  const selectedVehicle = ref<Vehicle | null>(null)
  const estimatedDuration = ref<number>(30) // default 30 minutes
  const currentEstimate = ref<EstimateResult | null>(null)
  const availableVehicles = ref<Vehicle[]>([])
  const isCalculating = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const canCalculateEstimate = computed(() => {
    return pickupLocation.value && destinationLocation.value && selectedVehicle.value
  })

  const estimateProgress = computed(() => {
    let progress = 0
    if (pickupLocation.value) progress += 25
    if (destinationLocation.value) progress += 25
    if (selectedVehicle.value) progress += 25
    if (currentEstimate.value) progress += 25
    return progress
  })

  // Actions
  const setPickupLocation = (location: Location) => {
    pickupLocation.value = location
    // Reset estimate when location changes
    if (currentEstimate.value) {
      currentEstimate.value = null
    }
  }

  const setDestinationLocation = (location: Location) => {
    destinationLocation.value = location
    // Reset estimate when location changes
    if (currentEstimate.value) {
      currentEstimate.value = null
    }
  }

  const setSelectedVehicle = (vehicle: Vehicle) => {
    selectedVehicle.value = vehicle
    // Auto-recalculate if we have all required data
    if (canCalculateEstimate.value) {
      calculateEstimate()
    }
  }

  const setEstimatedDuration = (duration: number) => {
    estimatedDuration.value = duration
    // Auto-recalculate if we have an existing estimate
    if (currentEstimate.value && canCalculateEstimate.value) {
      calculateEstimate()
    }
  }

  const loadAvailableVehicles = async () => {
    try {
      const vehicles = await estimateService.getAvailableVehicles()
      availableVehicles.value = vehicles
    } catch (err) {
      console.error('Failed to load vehicles:', err)
      error.value = 'Failed to load available vehicles'
    }
  }

  const calculateEstimate = async () => {
    if (!canCalculateEstimate.value) {
      error.value = 'Missing required information for estimate calculation'
      return
    }

    try {
      isCalculating.value = true
      error.value = null

      const estimateData = {
        pickup: {
          address: pickupLocation.value!.address || '',
          coordinates: {
            lat: pickupLocation.value!.lat,
            lng: pickupLocation.value!.lng,
          },
        },
        destination: {
          address: destinationLocation.value!.address || '',
          coordinates: {
            lat: destinationLocation.value!.lat,
            lng: destinationLocation.value!.lng,
          },
        },
        vehicleType: selectedVehicle.value!.id,
        estimatedDuration: estimatedDuration.value,
      }

      const result = await estimateService.calculateEstimate(estimateData)
      currentEstimate.value = result

      return result
    } catch (err: any) {
      console.error('Estimate calculation failed:', err)
      error.value = err.message || 'Failed to calculate estimate'
      throw err
    } finally {
      isCalculating.value = false
    }
  }

  const clearEstimate = () => {
    pickupLocation.value = null
    destinationLocation.value = null
    selectedVehicle.value = null
    currentEstimate.value = null
    estimatedDuration.value = 30
    error.value = null
  }

  const saveEstimate = async () => {
    if (!currentEstimate.value) {
      throw new Error('No estimate to save')
    }

    try {
      return await estimateService.saveEstimate(currentEstimate.value.id)
    } catch (err) {
      console.error('Failed to save estimate:', err)
      throw err
    }
  }

  return {
    // State
    pickupLocation,
    destinationLocation,
    selectedVehicle,
    estimatedDuration,
    currentEstimate,
    availableVehicles,
    isCalculating,
    error,

    // Getters
    canCalculateEstimate,
    estimateProgress,

    // Actions
    setPickupLocation,
    setDestinationLocation,
    setSelectedVehicle,
    setEstimatedDuration,
    loadAvailableVehicles,
    calculateEstimate,
    clearEstimate,
    saveEstimate,
  }
})
