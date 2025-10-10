<template>
  <svg
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1"
    >
      <path class="moon-star" d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5" style="--delay: 0.6s" />
      <path class="moon-star" d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5" style="--delay: 1.2s" />
      <path class="moon-star" d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5" style="--delay: 0" />
    </g>
    <path
      class="moon-body"
      d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
      fill="currentColor"
      fill-opacity="0"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  </svg>
</template>

<style>
.moon-body {
  animation: moon-body 0.8s ease-in 0.6s forwards;
}

.moon-star {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  animation: moon-star 4s ease infinite;
  animation-delay: var(--delay);
}

@keyframes moon-body {
  from {
    fill-opacity: 0;
  }

  to {
    fill-opacity: 1;
  }
}

@keyframes moon-star {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  20%,
  80% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0);
  }
}
</style>
