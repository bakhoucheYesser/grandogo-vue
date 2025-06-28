<template>
  <div class="justify between container mt-fluid-12 flex flex-col gap-6 md:mt-8 lg:flex-row">
    <!-- Left Side: Descriptive Content -->
    <div class="flex flex-col gap-y-6">
      <h1 class="  text-balance text-4xl font-bold leading-[1.1] md:text-8xl lg:mt-28 lg:text-9xl">
        Become a
        <br>
        Grando Mover
      </h1>
      <p class="text-gray-800 text-paragraph-2 md:text-paragraph-1 text-balance">
        Earn on your own schedule with your truck!<br />Get paid same day, work when you want,<br />and
        stay active!
      </p>
      <div class="flex">
        <p class="space-x-1 rounded-[10px] bg-[#9ca0b2]/30 px-4 py-3 text-paragraph-2">
          <span class="font-medium text-[#3344BE]">Don't own a truck?</span
          ><span class="font-medium text-[#3344BE]">—</span
          ><span class="text-gray-800">Apply as a helper!</span>
        </p>
      </div>
    </div>

    <!-- Right Side: Registration Form -->
    <div
      class="shrink-0 grow-0 lg:w-[660px] bg-white border-2 border-blue-600 shadow-xl rounded-xl p-16"
    >
      <div class="container mx-auto mb-4 px-4 max-w-screen-xl">
        <!-- Progress Steps -->
        <div class="flex items-center justify-between p-4 mb-4">
          <div class="flex flex-1 items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'"
            >
              1
            </div>
            <div class="flex-1 h-1 mx-2" :class="step >= 2 ? 'bg-blue-600' : 'bg-gray-200'"></div>
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'"
            >
              2
            </div>
            <div class="flex-1 h-1 mx-2" :class="step >= 3 ? 'bg-blue-600' : 'bg-gray-200'"></div>
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'"
            >
              3
            </div>
          </div>
        </div>

        <!-- Form Container -->
        <div class="p-2">
          <!-- Step 1: Personal Information -->
          <div v-if="step === 1">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p class="text-gray-600">Tell us about yourself</p>
            </div>

            <!-- Rest of the existing form content remains exactly the same -->
            <div class="space-y-4">
              <!-- Name Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1"
                    >First Name</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="formData.user.firstName"
                      type="text"
                      id="firstName"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div v-if="validationErrors.firstName" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.firstName }}
                  </div>
                </div>

                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1"
                    >Last Name</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="formData.user.lastName"
                      type="text"
                      id="lastName"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                  <div v-if="validationErrors.lastName" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.lastName }}
                  </div>
                </div>
              </div>

              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
                  >Email Address</label
                >
                <div
                  class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                >
                  <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formData.user.email"
                    type="email"
                    id="email"
                    class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                    placeholder="Your email address"
                    required
                  />
                </div>
                <div v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
                  {{ validationErrors.email }}
                </div>
              </div>

              <!-- Phone Field -->
              <div>
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1"
                  >Phone Number</label
                >
                <div
                  class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                >
                  <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formData.user.phoneNumber"
                    type="tel"
                    id="phoneNumber"
                    class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                <div v-if="validationErrors.phoneNumber" class="text-red-500 text-sm mt-1">
                  {{ validationErrors.phoneNumber }}
                </div>
              </div>

              <!-- Password Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
                    >Password</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="formData.user.password"
                      type="password"
                      id="password"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div v-if="validationErrors.password" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.password }}
                  </div>
                </div>

                <div>
                  <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 mb-1"
                    >Confirm Password</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="passwordConfirm"
                      type="password"
                      id="passwordConfirm"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  <div v-if="validationErrors.passwordConfirm" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.passwordConfirm }}
                  </div>
                </div>
              </div>

              <!-- Company Information (Optional) -->
              <div>
                <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1"
                  >Company Name (Optional)</label
                >
                <div
                  class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                >
                  <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="formData.provider.companyName"
                    type="text"
                    id="companyName"
                    class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                    placeholder="Company name (if applicable)"
                  />
                </div>
              </div>

              <!-- Do you own a truck question -->
              <div class="mt-6">
                <p class="block text-md font-medium text-gray-700 mb-2">
                  Do you own a truck and want to use it with us?
                </p>
                <div class="flex items-center gap-4">
                  <div class="flex items-center">
                    <input
                      id="truckYes"
                      v-model="hasVehicle"
                      :value="true"
                      type="radio"
                      name="hasVehicle"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label for="truckYes" class="ml-2 block text-sm font-medium text-gray-700"
                      >Yes</label
                    >
                  </div>
                  <div class="flex items-center">
                    <input
                      id="truckNo"
                      v-model="hasVehicle"
                      :value="false"
                      type="radio"
                      name="hasVehicle"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <label for="truckNo" class="ml-2 block text-sm font-medium text-gray-700"
                      >No</label
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <button
                @click="validateStep1"
                type="button"
                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-8 py-3 text-center"
              >
                Continue
              </button>
            </div>
          </div>

          <!-- Step 2: Vehicle Information -->
          <div v-if="step === 2">
            <div class="flex items-center mb-6">
              <button @click="step = 1" class="text-blue-600 hover:text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Change personal information
              </button>
            </div>

            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-900">Vehicle Information</h2>
              <p class="text-gray-600">Tell us about your vehicle</p>
            </div>

            <div class="mb-4 flex justify-between items-start">
              <div class="w-3/4 space-y-4">
                <!-- Vehicle Year -->
                <div>
                  <label for="vehicleYear" class="block text-sm font-medium text-gray-700 mb-1"
                    >Vehicle Year</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="formData.vehicle.year"
                      type="text"
                      id="vehicleYear"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="Year (e.g. 2020)"
                      required
                    />
                  </div>
                  <div v-if="validationErrors.vehicleYear" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.vehicleYear }}
                  </div>
                </div>

                <!-- Vehicle Make -->
                <div>
                  <label for="vehicleMake" class="block text-sm font-medium text-gray-700 mb-1"
                    >Vehicle Make</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="formData.vehicle.make"
                      type="text"
                      id="vehicleMake"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="Make (e.g. Ford, Toyota)"
                      required
                    />
                  </div>
                  <div v-if="validationErrors.vehicleMake" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.vehicleMake }}
                  </div>
                </div>

                <!-- Vehicle Model -->
                <div>
                  <label for="vehicleModel" class="block text-sm font-medium text-gray-700 mb-1"
                    >Vehicle Model</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="formData.vehicle.model"
                      type="text"
                      id="vehicleModel"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="Model (e.g. F-150, RAV4)"
                      required
                    />
                  </div>
                  <div v-if="validationErrors.vehicleModel" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.vehicleModel }}
                  </div>
                </div>

                <!-- Vehicle Color -->
                <div>
                  <label for="vehicleColor" class="block text-sm font-medium text-gray-700 mb-1"
                    >Vehicle Color</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="formData.vehicle.color"
                      type="text"
                      id="vehicleColor"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="Color (e.g. White, Black)"
                    />
                  </div>
                </div>

                <!-- Vehicle Type -->
                <div>
                  <label for="vehicleType" class="block text-sm font-medium text-gray-700 mb-1"
                    >Vehicle Type</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                        />
                      </svg>
                    </div>
                    <select
                      v-model="formData.vehicle.type"
                      id="vehicleType"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      required
                    >
                      <option value="" disabled selected>Select vehicle type</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                      <option value="van">Van</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                  <div v-if="validationErrors.vehicleType" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.vehicleType }}
                  </div>
                </div>

                <!-- License Plate -->
                <div>
                  <label for="licensePlate" class="block text-sm font-medium text-gray-700 mb-1"
                    >License Plate</label
                  >
                  <div
                    class="relative border rounded-xl px-3.5 py-3 flex items-center gap-x-4 flex-wrap transition text-black bg-white border-gray-400 focus-within:border-black hover:border-black"
                  >
                    <div class="pointer-events-none flex h-5 w-5 items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                        />
                      </svg>
                    </div>
                    <input
                      v-model="formData.vehicle.licensePlate"
                      type="text"
                      id="licensePlate"
                      class="block w-full leading-[1.375] focus:outline-none flex-1 bg-transparent border-none focus:ring-0 placeholder:text-gray-600 text-black caret-black"
                      placeholder="License plate number"
                      required
                    />
                  </div>
                  <div v-if="validationErrors.licensePlate" class="text-red-500 text-sm mt-1">
                    {{ validationErrors.licensePlate }}
                  </div>
                </div>

                <!-- Truck Bed Length Question -->
                <div class="mt-6">
                  <p class="block text-md font-medium text-gray-700 mb-2">
                    Is the truckbed or cargo at least 6ft long?
                  </p>
                  <div class="flex items-center gap-4">
                    <div class="flex items-center">
                      <input
                        id="longBedYes"
                        v-model="isLongBed"
                        :value="true"
                        type="radio"
                        name="isLongBed"
                        class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <label for="longBedYes" class="ml-2 block text-sm font-medium text-gray-700"
                        >Yes</label
                      >
                    </div>
                    <div class="flex items-center">
                      <input
                        id="longBedNo"
                        v-model="isLongBed"
                        :value="false"
                        type="radio"
                        name="isLongBed"
                        class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <label for="longBedNo" class="ml-2 block text-sm font-medium text-gray-700"
                        >No</label
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vehicle Info Box -->
              <div class="w-1/4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <div class="flex justify-center mb-4">
                    <img
                      src="/images/illustrations/logo%201%20.png"
                      alt="Truck icon"
                      class="w-24 h-24"
                    />
                  </div>
                  <h3 class="text-lg font-semibold text-center mb-2">Vehicle info</h3>
                  <p class="text-sm text-gray-700">
                    Drivers must own their own truck or cargo van. If you do not plan to use it with
                    GrandoGo, please say 'No' on previous form.
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <button
                @click="validateStep2"
                type="button"
                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-8 py-3 text-center"
              >
                Submit application
              </button>
            </div>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-if="step === 3" class="text-center py-8">
            <div class="flex justify-center mb-6">
              <div class="rounded-full bg-green-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 mb-4">Thank you for your application!</h2>
            <p class="text-gray-700 mb-6">We will get back to you soon.</p>

            <div class="flex justify-center mb-8">
              <img
                src="/images/illustrations/logo%201%20.png"
                alt="Truck illustration"
                class="w-64"
              />
            </div>

            <button
              @click="goToHomepage"
              type="button"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-8 py-3 text-center"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- What you'll be moving Section -->
    <section class="container mx-auto px-4 py-16">
      <h2 class="text-4xl font-bold text-center mb-12">What you'll be moving</h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Store Deliveries -->
        <div class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
          <div class="bg-teal-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-2">Store Deliveries</h3>
          <p class="text-gray-600 text-sm mb-4">You'll pick up furniture and other items from stores and deliver them to the customer's room of choice.</p>
          <div class="space-y-2 text-left">
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🏠</span> Home moving
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🏢</span> Office moving
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🛋️</span> Appliance delivery
            </div>
          </div>
        </div>

        <!-- Small Moves -->
        <div class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
          <div class="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-2">Small Moves</h3>
          <p class="text-gray-600 text-sm mb-4">Help customers move in and out of apartments, homes, dorms, offices, and storage units.</p>
          <div class="space-y-2 text-left">
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🏢</span> Apartment moving
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🛋️</span> Furniture delivery
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🗑️</span> Junk removal
            </div>
          </div>
        </div>

        <!-- Donations & Junk -->
        <div class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
          <div class="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-2">Donations & Junk</h3>
          <p class="text-gray-600 text-sm mb-4">Pick up donations and take them to places like Goodwill, or pick up items and bring them to the dump.</p>
          <div class="space-y-2 text-left">
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🎓</span> College moving
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🛒</span> FB Marketplace delivery
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">❤️</span> Donation pick up
            </div>
          </div>
        </div>

        <!-- Craigslist Purchases -->
        <div class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
          <div class="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-2">Craigslist Purchases</h3>
          <p class="text-gray-600 text-sm mb-4">Pick up and deliver items bought or sold on Craigslist, Facebook Marketplace, and similar sites.</p>
          <div class="space-y-2 text-left">
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🚚</span> Storage moving
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">🤝</span> Craigslist delivery
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <span class="mr-2">💪</span> Labor only
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Who Qualifies Section -->
    <section class="container mx-auto px-4 py-16 bg-gray-50">
      <h2 class="text-4xl font-bold text-center mb-12">Who qualifies</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Recent Smartphone -->
        <div class="bg-blue-100 rounded-xl p-6 flex items-center">
          <div class="bg-blue-200 rounded-full w-16 h-16 flex items-center justify-center mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">Recent smartphone</h3>
            <p class="text-gray-600 text-sm">Being very familiar with your iPhone or Android is key to this role.</p>
          </div>
        </div>

        <!-- At least 18 years old -->
        <div class="bg-green-100 rounded-xl p-6 flex items-center">
          <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">At least 18 years old</h3>
            <p class="text-gray-600 text-sm">You must be at least 18 years or older to be a Lugger.</p>
          </div>
        </div>

        <!-- Strong & physically able -->
        <div class="bg-yellow-100 rounded-xl p-6 flex items-center">
          <div class="bg-yellow-200 rounded-full w-16 h-16 flex items-center justify-center mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">Strong & physically able</h3>
            <p class="text-gray-600 text-sm">You must be strong and physically able to lift over 100 lbs.</p>
          </div>
        </div>

        <!-- Great communication -->
        <div class="bg-pink-100 rounded-xl p-6 flex items-center">
          <div class="bg-pink-200 rounded-full w-16 h-16 flex items-center justify-center mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-pink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg mb-2">Great communication</h3>
            <p class="text-gray-600 text-sm">You must be good with people and have strong communication skills.</p>
          </div>
        </div>
      </div>
    </section>



</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import toast from '@/services/toast.service'

import type { ProviderRegistrationData } from '@/types/registration.types'

export default defineComponent({
  name: 'ProviderRegistration',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      step: 1,
      hasVehicle: true,
      isLongBed: null as boolean | null,
      passwordConfirm: '',
      registering: false,
      providerUuid: '',
      validationErrors: {} as Record<string, string>,
      formData: {
        user: {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          userType: 'provider'
        },
        provider: {
          companyName: '',
          businessLicense: '',
          taxId: '',
          serviceAreaRadius: 30,
        },
        vehicle: {
          make: '',
          model: '',
          year: '',
          color: '',
          type: '',
          licensePlate: '',
        },
      } as ProviderRegistrationData,
    }
  },
  methods: {
    // Validation for step 1
    validateStep1() {
      this.validationErrors = {}

      let isValid = true

      if (!this.formData.user.firstName) {
        this.validationErrors.firstName = 'First name is required'
        isValid = false
      }

      if (!this.formData.user.lastName) {
        this.validationErrors.lastName = 'Last name is required'
        isValid = false
      }

      if (!this.formData.user.email) {
        this.validationErrors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.user.email)) {
        this.validationErrors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!this.formData.user.phoneNumber) {
        this.validationErrors.phoneNumber = 'Phone number is required'
        isValid = false
      } else if (!/^[+]?[0-9]{10,15}$/.test(this.formData.user.phoneNumber)) {
        this.validationErrors.phoneNumber = 'Please enter a valid phone number'
        isValid = false
      }

      if (!this.formData.user.password) {
        this.validationErrors.password = 'Password is required'
        isValid = false
      } else if (this.formData.user.password.length < 8) {
        this.validationErrors.password = 'Password must be at least 8 characters'
        isValid = false
      }

      if (this.formData.user.password !== this.passwordConfirm) {
        this.validationErrors.passwordConfirm = 'Passwords do not match'
        isValid = false
      }

      if (!this.hasVehicle) {
        // Direct to helper registration instead
        alert('Please apply as a helper instead')
        return
      }

      if (isValid) {
        this.step = 2
        window.scrollTo(0, 0)
      }
    },

    // Validation for step 2
    validateStep2() {
      this.validationErrors = {}

      let isValid = true

      if (!this.formData.vehicle.year) {
        this.validationErrors.vehicleYear = 'Vehicle year is required'
        isValid = false
      } else if (!/^\d{4}$/.test(this.formData.vehicle.year)) {
        this.validationErrors.vehicleYear = 'Please enter a valid 4-digit year'
        isValid = false
      }

      if (!this.formData.vehicle.make) {
        this.validationErrors.vehicleMake = 'Vehicle make is required'
        isValid = false
      }

      if (!this.formData.vehicle.model) {
        this.validationErrors.vehicleModel = 'Vehicle model is required'
        isValid = false
      }

      if (!this.formData.vehicle.type) {
        this.validationErrors.vehicleType = 'Vehicle type is required'
        isValid = false
      }

      if (!this.formData.vehicle.licensePlate) {
        this.validationErrors.licensePlate = 'License plate is required'
        isValid = false
      }

      if (isValid) {
        this.submitRegistration()
      }
    },

    // Submit registration to API
    // In your ProviderRegistration component
    async submitRegistration() {
      try {
        this.registering = true
        this.formData.user.userType = 'provider';

        const response = await apiClient.post('/provider/register', {
          user: this.formData.user,
          provider: this.formData.provider,
          vehicle: this.formData.vehicle,
        })

        if (response.data && response.data.data && response.data.data.provider) {
          this.providerUuid = response.data.data.provider.id
          this.step = 3
          window.scrollTo(0, 0)

          // Use toast for success
          toast.success('Registration successful! Waiting for admin approval.')
        }
      } catch (error: any) {
        let errorMessage = 'Registration failed. Please try again later.'

        // Handle specific backend error messages
        if (error.response && error.response.data && error.response.data.message) {
          if (error.response.data.message.includes('Unique violation')) {
            errorMessage = 'This email is already registered. Please use a different email.'
          } else {
            errorMessage = error.response.data.message
          }
        }

        // Use toast for error
        toast.error(errorMessage)

        console.error('Registration error:', error)
      } finally {
        this.registering = false
      }
    },

    // Navigation helper
    goToHomepage() {
      this.$router.push({ name: 'home' })
    },
  },
})
</script>
<style scoped>
/* You can add component-specific styles here */
</style>
