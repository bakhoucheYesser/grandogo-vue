<template>
  <div class="mx-auto">
    <!-- Hero Section -->
    <section class="mx-auto">
      <div class="flex w-full max-w-7xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 p-4 rounded-lg">
        <div class="w-full lg:w-3/4 xl:w-2/3 mr-auto place-self-center">
          <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight md:text-5xl xl:text-6xl">
            Move <span class="text-red-600/50">anything</span>
          </h1>
          <p class="max-w-2xl mb-6 font-bold text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Fully insured. On your schedule. Arriving in as little as 30 minutes.
          </p>

          <!-- Updated Address Form -->
          <form class="w-full ">
            <div class="flex items-center bg-white border-2 border-gray-300 rounded-2xl p-2 shadow-lg hover:border-gray-400 focus-within:border-red-500 transition-all duration-200">

              <!-- Pickup Address Field -->
              <div class="flex-1 px-4 py-2">
                <!-- Label and Icon on same line -->
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke-width="2" stroke="currentColor"
                       class="w-4 h-4 text-red-600 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"></path>
                  </svg>
                  <div class="text-xs font-medium text-red-600">Pick up from</div>
                </div>
                <!-- Input field -->
                <input
                  class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder="Pickup address"
                  type="text"
                />
              </div>

              <!-- Divider -->
              <div class="w-px h-12 bg-gray-300 mx-2"></div>

              <!-- Delivery Address Field -->
              <div class="flex-1 px-4 py-2">
                <!-- Label and Icon on same line -->
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke-width="2" stroke="currentColor"
                       class="w-4 h-4 text-red-600 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"></path>
                  </svg>
                  <div class="text-xs font-medium text-red-600">Move to</div>
                </div>
                <!-- Input field -->
                <input
                  class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                  placeholder="Drop-off address"
                  type="text"
                />
              </div>

              <!-- Submit Button -->
              <div class="ml-2">
                <button
                  type="submit"
                  class="bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/40 focus:ring-4 focus:outline-none focus:ring-red-300 transition-all duration-200 whitespace-nowrap"
                >
                  See prices
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
    <!-- Vehicles Section -->
    <section class="pt-4 pl-4 pr-4">
      <div class="flex flex-col">
        <div class="flex max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 p-4 rounded-lg">
          <div class="mr-auto place-self-center col-span-6">
            <h1 class="max-w-4xl mb-4 text-3xl font-semibold tracking-tight leading-none md:text-2xl xl:text-3xl da:text-white">
              A truck and movers for any occasion
            </h1>
          </div>
          <div class="flex-1">
            <div class="flex-1">
              <img
                alt="Become A Lugger"
                :src="vehicleLineupImage"
                width="960"
                height="640"
                decoding="async"
                class="gradient-mask-become-a-lugger-alt md:gradient-mask-become-a-lugger h-full w-full object-cover md:max-w-[481px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works (Cool futuristic color palette) -->
    <section class="mb-16 px-4 bg-red-600/10 border border-black backdrop-blur-md rounded-[20px] p-10">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-red-500 font-orbitron uppercase mb-2 tracking-widest">How it works</h2>
        <p class="text-xl text-black font-light">Simple steps to get your things moved</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-6 rounded-[16px] border border-white/10 bg-white/5 backdrop-blur-sm transition-transform hover:scale-105 duration-300">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-lg font-bold uppercase text-red-800 font-orbitron mb-2">1. Get an estimate</h3>
          <p class="text-sm text-black">Enter your pickup and delivery addresses to get an instant price estimate.</p>
        </div>

        <div class="text-center p-6 rounded-[16px] border border-white/10 bg-white/5 backdrop-blur-sm transition-transform hover:scale-105 duration-300">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold uppercase text-red-800 font-orbitron mb-2">2. Schedule your move</h3>
          <p class="text-sm text-black">Pick a date and time that works for you. Same-day options available.</p>
        </div>

        <div class="text-center p-6 rounded-[16px] border border-white/10 bg-white/5 backdrop-blur-sm transition-transform hover:scale-105 duration-300">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-bold uppercase text-red-800 font-orbitron mb-2">3. Relax while we move</h3>
          <p class="text-sm text-black">Our professional movers will handle everything. Track your move in real-time.</p>
        </div>
      </div>
    </section>



    <!-- Become a Truck Owner Section -->
    <section>
      <div class="container mx-auto flex justify-center p-12">
        <div class="w-4/5 grid grid-cols-12 gap-4 p-8 bg-gradient-to-l from-red-500 to-red-700 rounded-2xl shadow-lg">
          <div class="col-span-12 md:col-span-8">
            <img alt="Become A Lugger"
                 :src="luggersloadingvan"
                 width="960" height="640" decoding="async" data-nimg="1"
                 class="gradient-mask-become-a-lugger-alt md:gradient-mask-become-a-lugger h-full w-full object-cover md:max-w-[481px]"
                 loading="lazy" style="color: transparent;">
          </div>
          <div class="flex flex-1 col-span-12 md:col-span-4 items-center justify-center p-fluid-16 md:items-start md:pl-fluid-16">
            <div class="max-w-[25rem] space-y-6">
              <div class="space-y-4">
                <h2 class="text-fluid-heading-1 font-bold text-white text-2xl">Earn money with your truck</h2>
                <p class="text-paragraph-1 text-gray-300">Be active, meet new people &amp; make up to $2,500 a week!</p>
              </div>
              <a class="transition duration-150 active:translate-y-px ease-in-out cursor-pointer border inline-flex items-center justify-center font-book font-medium text-label-2 h-12 rounded-xl px-6 space-x-2 focus:ring-4 bg-transparent border border-white hover:border-white/50 ring-white/20 text-white hover:text-white/50 w-full md:max-w-[17.5rem]"
                 href="{{ path('app_become_trucker') }}"><span>Apply now</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vehicle Types Section -->
    <section class="mb-16 px-4 bg-red-600/10 border border-black backdrop-blur-md rounded-[20px] p-10">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-red-600 font-orbitron uppercase tracking-widest mb-2">Our vehicles</h2>
        <p class="text-xl text-gray-300">Choose the right size for your needs</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Pickup -->
        <div class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 text-center shadow-md transition-transform hover:scale-105 duration-300">
          <img :src="pickup" alt="Pickup" class="w-24 h-16 mx-auto mb-4 object-contain" />
          <h3 class="font-orbitron text-white text-lg uppercase mb-1">Pickup</h3>
          <p class="text-gray-400 text-sm mb-2">Perfect for smaller items</p>
          <div class="text-2xl font-bold text-red-500 mb-2">From $40</div>
          <p class="text-gray-500 text-xs">+ $1.50/min • $2.00/km</p>
          <a href="{{ path('app_estimate') }}"
             class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center mt-4 block font-orbitron uppercase tracking-wider">
            Get estimate
          </a>
        </div>

        <!-- Van -->
        <div class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 text-center shadow-md transition-transform hover:scale-105 duration-300">
          <img :src="van" alt="Pickup" class="w-24 h-16 mx-auto mb-4 object-contain" />
          <h3 class="font-orbitron text-white text-lg uppercase mb-1">Van</h3>
          <p class="text-gray-400 text-sm mb-2">Good for medium loads</p>
          <div class="text-2xl font-bold text-red-500 mb-2">From $50</div>
          <p class="text-gray-500 text-xs">+ $1.75/min • $2.25/km</p>
          <a href="{{ path('app_estimate') }}"
             class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center mt-4 block font-orbitron uppercase tracking-wider">
            Get estimate
          </a>
        </div>

        <!-- XL -->
        <div class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 text-center shadow-md transition-transform hover:scale-105 duration-300">
          <img :src="xl" alt="Pickup" class="w-24 h-16 mx-auto mb-4 object-contain" />
          <h3 class="font-orbitron text-white text-lg uppercase mb-1">XL</h3>
          <p class="text-gray-400 text-sm mb-2">Ideal for larger items</p>
          <div class="text-2xl font-bold text-red-500 mb-2">From $65</div>
          <p class="text-gray-500 text-xs">+ $2.00/min • $2.50/km</p>
          <a href="{{ path('app_estimate') }}"
             class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-black font-bold rounded-lg text-sm px-5 py-2.5 text-center mt-4 block font-orbitron uppercase tracking-wider">
            Get estimate
          </a>
        </div>

        <!-- Box Truck -->
        <div class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 text-center shadow-md transition-transform hover:scale-105 duration-300">
          <img :src="box" alt="Pickup" class="w-24 h-16 mx-auto mb-4 object-contain" />
          <h3 class="font-orbitron text-white text-lg uppercase mb-1">Box Truck</h3>
          <p class="text-gray-400 text-sm mb-2">For full moves</p>
          <div class="text-2xl font-bold text-red-500 mb-2">From $85</div>
          <p class="text-gray-500 text-xs">+ $2.50/min • $3.00/km</p>
          <a href="{{ path('app_estimate') }}"
             class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center mt-4 block font-orbitron uppercase tracking-wider">
            Get estimate
          </a>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="mb-16 px-4 pt-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">What our customers say</h2>
        <p class="text-xl text-gray-600">Thousands of happy movers</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Testimonial 1 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="text-yellow-400 flex mr-2">
              {% for i in 1..5 %}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {% endfor %}
            </div>
            <div class="text-gray-600">5.0</div>
          </div>
          <p class="text-gray-700 mb-4">"GrandoGo made my move so easy! The movers arrived on time and were very professional. Everything was moved safely and quickly. Will definitely use again!"</p>
          <div class="font-semibold">Sarah M.</div>
          <div class="text-gray-500 text-sm">Montreal, QC</div>
        </div>

        <!-- Testimonial 2 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="text-yellow-400 flex mr-2">
              {% for i in 1..5 %}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {% endfor %}
            </div>
            <div class="text-gray-600">5.0</div>
          </div>
          <p class="text-gray-700 mb-4">"I needed to move a couch from IKEA and GrandoGo was perfect! I got the van within an hour, and the driver even helped me carry it up to my apartment. Great service!"</p>
          <div class="font-semibold">Michael T.</div>
          <div class="text-gray-500 text-sm">Toronto, ON</div>
        </div>

        <!-- Testimonial 3 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="text-yellow-400 flex mr-2">
              {% for i in 1..5 %}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {% endfor %}
            </div>
            <div class="text-gray-600">4.8</div>
          </div>
          <p class="text-gray-700 mb-4">"As a small business owner, I regularly need items delivered to clients. GrandoGo has become my go-to service. Reliable, affordable, and my customers love the tracking feature."</p>
          <div class="font-semibold">Jennifer K.</div>
          <div class="text-gray-500 text-sm">Vancouver, BC</div>
        </div>
      </div>
    </section>

    <section class="bg-gradient-to-l from-red-700 to-red-900 rounded-xl p-8 md:p-12 text-center text-white">
      <h2 class="text-3xl font-bold mb-4">Ready to move with GrandoGo?</h2>
      <p class="text-xl mb-8 max-w-3xl mx-auto">Whether you're moving a single item or an entire apartment, we've got you covered. Get started today!</p>
      <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <a href="{{ path('app_estimate') }}" class="bg-white text-red-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100">Get an estimate</a>
        <a href="{{ path('app_register') }}" class="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700">Sign up</a>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import vehicleLineupImage from '@/assets/images/illustrations/vehicle-lineup.svg';
import luggersloadingvan from '@/assets/images/illustrations/luggers-loading-van.svg';
import pickup from '@/assets/images/illustrations/pickup_truck.svg';
import van from '@/assets/images/illustrations/van_truck.svg';
import xl from '@/assets/images/illustrations/xl_truck.svg';
import box from '@/assets/images/illustrations/box_truck.svg';

</script>
